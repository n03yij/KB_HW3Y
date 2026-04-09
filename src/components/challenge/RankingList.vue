<script setup>
import { ref, computed } from 'vue'
import { iconMap } from '@/utils/icons'

const rankings = ref([
  { rank: 1, name: '박민준', category: '식비 챌린지', spent: 38420, saved: 61580, initial: '박' },
  { rank: 2, name: '이서연', category: '식비 챌린지', spent: 52100, saved: 47900, initial: '이' },
  { rank: 3, name: '김지훈', category: '식비 챌린지', spent: 61800, saved: 38200, initial: '김' },
  { rank: 4, name: '최수진', category: '식비 챌린지', spent: 65500, saved: 34500, initial: '최' },
  {
    rank: 5,
    name: '나 (홍길동)',
    category: '식비 · 진행중',
    spent: 67300,
    saved: 32700,
    initial: '나',
    isMe: true,
  },
])

// 상위 4명 추출
const topFour = computed(() => {
  return [...rankings.value].sort((a, b) => a.rank - b.rank).slice(0, 4)
})

// 내 데이터 추출
const myRanking = computed(() => {
  return rankings.value.find((item) => item.isMe)
})
</script>

<template>
  <div class="ranking-section mt-4 px-1">
    <!-- 제목 -->
    <div class="flex items-center gap-1 mb-2">
      <img :src="iconMap.trophy" alt="trophy" class="w-5 h-5" />
      <h3 class="text-lg font-bold text-kb-profit">절약 랭킹</h3>
    </div>

    <!-- 랭킹 리스트 -->
    <div class="flex flex-col gap-3">
      <div class="bg-kb-card rounded-[20px] overflow-hidden border border-kb-divider shadow-sm">
        <div
          v-for="(item, index) in topFour"
          :key="item.rank"
          class="flex items-center justify-between px-3 py-2"
          :class="{ 'border-b border-kb-divider': index !== 3 }"
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
            >
              {{ item.rank }}
            </span>
            <div
              class="w-10 h-10 rounded-full bg-kb-icon-yellow flex items-center justify-center text-kb-dark-gray font-bold"
            >
              {{ item.initial }}
            </div>
            <div>
              <p class="font-bold text-[14px] text-kb-profit leading-tight">{{ item.name }}</p>
              <p class="text-[11px] text-kb-muted font-medium">{{ item.category }}</p>
            </div>
          </div>

          <div class="text-right">
            <p class="font-bold text-[14px] text-kb-profit leading-tight">
              {{ item.spent.toLocaleString() }}원
            </p>
            <p class="text-[11px] text-kb-income font-semibold opacity-80">
              {{ item.saved.toLocaleString() }}원 절약
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
            myRanking?.rank
          }}</span>
          <div
            class="w-10 h-10 rounded-full bg-kb-yellow flex items-center justify-center text-kb-dark-gray font-bold"
          >
            {{ myRanking?.initial }}
          </div>
          <div>
            <p class="font-bold text-[14px] text-kb-profit leading-tight">{{ myRanking?.name }}</p>
            <p class="text-[11px] text-kb-dark-gray opacity-60 font-medium">
              {{ myRanking?.category }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <p class="font-bold text-[14px] text-kb-profit leading-tight">
            {{ myRanking?.spent?.toLocaleString() }}원
          </p>
          <p class="text-[11px] text-kb-income font-semibold">
            {{ myRanking?.saved?.toLocaleString() }}원 절약중
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
