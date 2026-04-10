<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from 'vue'
import ramuPushImg from '@/assets/ramu_push.png'
import ramuEndImg from '@/assets/ramu_end.png'
import apiClient from '@/api/axios'
import { useAuthStore } from '@/stores/user'

const authStore = useAuthStore()
const challenge = ref(null)
const monthlyChallenge = ref(null)
const progressBarWidth = ref(0)
const progressBarRef = ref(null)
const mounted = ref(false)

async function fetchChallenge() {
  const challengeId = authStore.currentUser?.currentChallengeId
  if (challengeId) {
    const res = await apiClient.get(`/challenges/${challengeId}`)
    challenge.value = res.data

    const mcRes = await apiClient.get(`/monthlyChallenge/${res.data.monthlyChallengeId}`)
    monthlyChallenge.value = mcRes.data
  }
}

onMounted(async () => {
  await fetchChallenge()

  // fetch 후 DOM 업데이트 기다렸다가 진행바 측정
  await nextTick()
  mounted.value = true
  const el = progressBarRef.value
  if (!el) return
  progressBarWidth.value = el.offsetWidth
  const ro = new ResizeObserver(() => {
    if (el) progressBarWidth.value = el.offsetWidth
  })
  ro.observe(el)
})

onActivated(fetchChallenge)

const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()
const periodText = computed(() => `${currentYear}년 ${currentMonth}월 전체`)

const title = computed(() => monthlyChallenge.value?.title || '')
const category = computed(() => monthlyChallenge.value?.category || '')
const amount = computed(() => challenge.value?.spentAmount || 0)
const maxAmount = computed(() => monthlyChallenge.value?.targetAmount || 100000)

const saved = computed(() => Math.max(maxAmount.value - amount.value, 0))
const progressPercent = computed(() => Math.min((amount.value / maxAmount.value) * 100, 100))
const isOver = computed(() => amount.value >= maxAmount.value)
const overAmount = computed(() => amount.value - maxAmount.value)
const currentImg = computed(() => (isOver.value ? ramuEndImg : ramuPushImg))

const characterStyle = computed(() => {
  if (!mounted.value || !progressBarWidth.value) return { opacity: 0 }
  const barWidth = progressBarWidth.value
  const imgWidth = isOver.value ? 64 : 44
  const pos = Math.min(Math.max(progressPercent.value, 0), 100)
  const px = (pos / 100) * barWidth
  let leftPx = px - imgWidth / 2
  if (leftPx < 0) leftPx = 0
  if (leftPx > barWidth - imgWidth) leftPx = barWidth - imgWidth
  return { left: `${leftPx}px`, transition: 'all 0.5s ease-out' }
})
</script>

<template>
  <div
    v-if="!challenge || !monthlyChallenge"
    class="bg-kb-yellow px-4 py-3 rounded-[24px] shadow-sm h-48 flex items-center justify-center"
  >
    <p class="text-kb-gray text-sm">챌린지를 불러오는 중...</p>
  </div>

  <div
    v-else
    class="bg-kb-yellow px-4 py-3 rounded-[24px] shadow-sm relative flex flex-col justify-between overflow-visible"
  >
    <!-- 상단 정보 -->
    <div class="leading-tight space-y-0.5">
      <span class="text-[10px] px-2 py-0.5 rounded-full font-medium bg-black/10 text-kb-gray">
        {{ currentMonth }}월 진행 중
      </span>
      <h2 class="text-xl font-bold mt-0.5 text-kb-dark-gray">{{ title }}</h2>
      <p class="text-[11px] opacity-70 text-kb-gray">{{ category }} · {{ periodText }}</p>
    </div>

    <!-- 사용 금액 -->
    <div class="flex justify-between items-end mb-0.5">
      <div>
        <p class="text-[11px] opacity-70 text-kb-gray">사용 금액</p>
        <p class="text-xl font-extrabold leading-none text-kb-expense">
          {{ amount.toLocaleString() }}<span class="text-lg ml-0.5">원</span>
        </p>
      </div>

      <!-- 남은금액/초과금액 -->
      <div class="mb-1">
        <div
          class="text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"
          :class="isOver ? 'bg-kb-icon-pink text-kb-expense' : 'bg-kb-icon-green text-kb-income'"
        >
          {{
            isOver ? `${overAmount.toLocaleString()}원 초과` : `${saved.toLocaleString()}원 남음`
          }}
        </div>
      </div>
    </div>

    <!-- 진행바 + 캐릭터 영역 -->
    <div class="relative pt-3 mb-2">
      <!-- 라무 캐릭터 -->
      <div class="absolute bottom-[25%] z-10" :style="characterStyle">
        <img
          :key="isOver ? 'end' : 'push'"
          :src="currentImg"
          alt="character"
          :class="[isOver ? 'w-16 h-11' : 'w-11 h-11']"
          class="object-contain block max-w-none"
        />
      </div>

      <!-- 진행바 영역 -->
      <div ref="progressBarRef" class="w-full">
        <div class="w-full h-2.5 rounded-full overflow-hidden bg-black/10">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: progressPercent + '%', background: 'var(--gradient-kb-yellow)' }"
          ></div>
        </div>

        <!-- 진행바 눈금 -->
        <div class="flex justify-between text-[9px] mt-2 font-medium opacity-60 px-1 text-kb-gray">
          <span>0원</span>
          <span>{{ (maxAmount / 2).toLocaleString() }}원</span>
          <span>{{ maxAmount.toLocaleString() }}원</span>
        </div>
      </div>
    </div>

    <!-- 주차 상태 -->
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="(week, i) in challenge?.weeks || []"
        :key="i"
        class="text-center py-1 rounded-xl text-[11px] font-bold transition-all text-kb-dark-gray"
        :class="
          week.status === 'current'
            ? 'bg-kb-yellow text-white shadow-sm scale-105'
            : week.status === 'done'
              ? 'bg-white/60'
              : 'bg-white/30'
        "
      >
        {{ i + 1 }}주
        <div
          class="text-[9px] font-normal opacity-80"
          :class="week.status === 'done' ? 'text-kb-income' : ''"
        >
          <span v-if="week.status === 'done'">완료</span>
          <span v-else-if="week.status === 'current'">진행중</span>
          <span v-else>진행 전</span>
        </div>
      </div>
    </div>
  </div>
</template>
