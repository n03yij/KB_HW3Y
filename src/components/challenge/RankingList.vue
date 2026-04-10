<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { iconMap } from '@/utils/icons'
import apiClient from '@/api/axios'
import { useAuthStore } from '@/stores/user'

const authStore = useAuthStore()
const rankings = ref([])
let pollingTimer = null

onMounted(async () => {
  const challengeId = authStore.currentUser?.currentChallengeId
  if (!challengeId) return

  const challengeRes = await apiClient.get(`/challenges/${challengeId}`)
  const monthlyChallengeId = challengeRes.data?.monthlyChallengeId
  if (!monthlyChallengeId) return

  const buildRankings = async () => {
    const [challengesRes, usersRes, mcRes, dummyRes] = await Promise.all([
      apiClient.get(`/challenges?monthlyChallengeId=${monthlyChallengeId}`),
      apiClient.get('/users'),
      apiClient.get(`/monthlyChallenge/${monthlyChallengeId}`),
      apiClient.get(`/challengeLeaderboard?monthlyChallengeId=${monthlyChallengeId}&_limit=100`),
    ])

    const targetAmount = mcRes.data.targetAmount
    const userMap = Object.fromEntries(usersRes.data.map((u) => [String(u.id), u.nickname]))

    // 실제 유저 랭킹 (challenges 테이블 기반, 지출 1건 이상인 유저만)
    const realEntries = challengesRes.data
      .filter((c) => c.spentAmount > 0)
      .map((c) => ({
        userId: String(c.userId),
        name: userMap[String(c.userId)] ?? '알 수 없음',
        spentAmount: c.spentAmount,
        savedAmount: Math.max(targetAmount - c.spentAmount, 0),
      }))

    // 더미 유저 (challengeLeaderboard에서 fake- 유저만)
    const dummyEntries = dummyRes.data
      .filter((r) => String(r.userId).startsWith('fake-'))
      .map((r) => ({
        userId: r.userId,
        name: r.name,
        spentAmount: r.spentAmount,
        savedAmount: r.savedAmount,
      }))

    // 합치고 savedAmount 내림차순 정렬 후 rank 부여
    const merged = [...realEntries, ...dummyEntries]
      .sort((a, b) => b.savedAmount - a.savedAmount)
      .map((entry, i) => ({ ...entry, rank: i + 1 }))

    rankings.value = merged
  }

  await buildRankings()
  pollingTimer = setInterval(buildRankings, 3000)
})

onUnmounted(() => {
  if (pollingTimer) clearInterval(pollingTimer)
})

const currentUserId = authStore.currentUser?.id
const myRanking = computed(() => rankings.value.find((r) => String(r.userId) === String(currentUserId)))
const myRank = computed(() => myRanking.value?.rank ?? 999)
const topTen = computed(() => rankings.value.filter((r) => String(r.userId) !== String(currentUserId)).slice(0, 10))
const listItems = computed(() =>
  rankings.value
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10),
)
</script>

<template>
  <div class="ranking-section mt-4 px-1">
    <!-- 제목 -->
    <div class="flex items-center gap-1 mb-2">
      <img :src="iconMap.trophy" alt="trophy" class="w-5 h-5" />
      <h3 class="text-lg font-bold text-kb-profit">절약 랭킹</h3>
    </div>

    <div
      v-if="rankings.length === 0"
      class="bg-kb-card rounded-[20px] p-6 text-center text-sm text-kb-muted"
    >
      랭킹 정보가 없습니다
    </div>

    <!-- 랭킹 리스트 -->
    <div v-else class="flex flex-col gap-3">
      <!-- 10위 안에 있을 때: 3개 박스로 분리 -->
      <template v-if="myRanking && myRank <= 10">
        <!-- 내 순위 위 -->
        <div
          v-if="myRank > 1"
          class="bg-kb-card rounded-[20px] overflow-hidden border border-kb-divider shadow-sm"
        >
          <div
            v-for="(item, index) in listItems.filter((r) => r.rank < myRank)"
            :key="item.rank"
            class="flex items-center justify-between px-3 py-2"
            :class="{
              'border-b border-kb-divider':
                index !== listItems.filter((r) => r.rank < myRank).length - 1,
            }"
          >
            <div class="flex items-center gap-4">
              <span
                class="text-base font-bold w-4 text-center"
                :class="
                  item.rank === 1
                    ? 'text-kb-yellow'
                    : item.rank === 2
                      ? 'text-kb-muted'
                      : item.rank === 3
                        ? 'text-kb-empty'
                        : 'text-kb-line'
                "
                >{{ item.rank }}</span
              >
              <div
                class="w-10 h-10 rounded-full bg-kb-icon-yellow flex items-center justify-center text-kb-dark-gray font-bold"
              >
                {{ item.name.charAt(0) }}
              </div>
              <p class="font-bold text-[14px] text-kb-profit">{{ item.name }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-[14px] text-kb-profit">
                {{ item.spentAmount.toLocaleString() }}원
              </p>
              <p class="text-[11px] text-kb-income font-semibold opacity-80">
                {{ item.savedAmount.toLocaleString() }}원 절약
              </p>
            </div>
          </div>
        </div>

        <!-- 내 순위 박스 -->
        <div
          class="flex items-center justify-between p-4 h-[56px] rounded-[20px] bg-kb-card-yellow border-2 border-kb-yellow shadow-sm"
        >
          <div class="flex items-center gap-4">
            <span class="text-base font-bold w-4 text-center text-kb-dark-gray">{{
              myRanking.rank
            }}</span>
            <div
              class="w-10 h-10 rounded-full bg-kb-yellow flex items-center justify-center text-kb-dark-gray font-bold"
            >
              {{ myRanking.name.charAt(0) }}
            </div>
            <p class="font-bold text-[14px] text-kb-profit">{{ myRanking.name }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-[14px] text-kb-profit">
              {{ myRanking.spentAmount.toLocaleString() }}원
            </p>
            <p class="text-[11px] text-kb-income font-semibold">
              {{ myRanking.savedAmount.toLocaleString() }}원 절약
            </p>
          </div>
        </div>

        <!-- 내 순위 아래 -->
        <div
          v-if="myRank < 10"
          class="bg-kb-card rounded-[20px] overflow-hidden border border-kb-divider shadow-sm"
        >
          <div
            v-for="(item, index) in listItems.filter((r) => r.rank > myRank)"
            :key="item.rank"
            class="flex items-center justify-between px-3 py-2"
            :class="{
              'border-b border-kb-divider':
                index !== listItems.filter((r) => r.rank > myRank).length - 1,
            }"
          >
            <div class="flex items-center gap-4">
              <span class="text-base font-bold w-4 text-center text-kb-line">{{ item.rank }}</span>
              <div
                class="w-10 h-10 rounded-full bg-kb-icon-yellow flex items-center justify-center text-kb-dark-gray font-bold"
              >
                {{ item.name.charAt(0) }}
              </div>
              <p class="font-bold text-[14px] text-kb-profit">{{ item.name }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-[14px] text-kb-profit">
                {{ item.spentAmount.toLocaleString() }}원
              </p>
              <p class="text-[11px] text-kb-income font-semibold opacity-80">
                {{ item.savedAmount.toLocaleString() }}원 절약
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- 10위 밖일 때: 기존 디자인 -->
      <template v-else>
        <div class="bg-kb-card rounded-[20px] overflow-hidden border border-kb-divider shadow-sm">
          <div
            v-for="(item, index) in topTen"
            :key="item.rank"
            class="flex items-center justify-between px-3 py-2"
            :class="{ 'border-b border-kb-divider': index !== topTen.length - 1 }"
          >
            <div class="flex items-center gap-4">
              <span
                class="text-base font-bold w-4 text-center"
                :class="
                  item.rank === 1
                    ? 'text-kb-yellow'
                    : item.rank === 2
                      ? 'text-kb-muted'
                      : item.rank === 3
                        ? 'text-kb-empty'
                        : 'text-kb-line'
                "
                >{{ item.rank }}</span
              >
              <div
                class="w-10 h-10 rounded-full bg-kb-icon-yellow flex items-center justify-center text-kb-dark-gray font-bold"
              >
                {{ item.name.charAt(0) }}
              </div>
              <p class="font-bold text-[14px] text-kb-profit">{{ item.name }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-[14px] text-kb-profit">
                {{ item.spentAmount.toLocaleString() }}원
              </p>
              <p class="text-[11px] text-kb-income font-semibold opacity-80">
                {{ item.savedAmount.toLocaleString() }}원 절약
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="myRanking"
          class="flex items-center justify-between p-4 h-[56px] rounded-[20px] bg-kb-card-yellow border-2 border-kb-yellow shadow-sm"
        >
          <div class="flex items-center gap-4">
            <span class="text-base font-bold w-4 text-center text-kb-dark-gray">{{
              myRanking.rank
            }}</span>
            <div
              class="w-10 h-10 rounded-full bg-kb-yellow flex items-center justify-center text-kb-dark-gray font-bold"
            >
              {{ myRanking.name.charAt(0) }}
            </div>
            <p class="font-bold text-[14px] text-kb-profit">{{ myRanking.name }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-[14px] text-kb-profit">
              {{ myRanking.spentAmount.toLocaleString() }}원
            </p>
            <p class="text-[11px] text-kb-income font-semibold">
              {{ myRanking.savedAmount.toLocaleString() }}원 절약
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
