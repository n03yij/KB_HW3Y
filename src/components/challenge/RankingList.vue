<script setup>
import { ref, computed } from 'vue'
import trophyIcon from '@/assets/trophy.svg'

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
      <img :src="trophyIcon" alt="trophy" class="w-5 h-5" />
      <h3 class="text-lg font-bold text-[#1A1A1A]">절약 랭킹</h3>
    </div>

    <!-- 랭킹 리스트 -->
    <div class="flex flex-col gap-3">
      <div class="bg-white rounded-[20px] overflow-hidden border border-gray-50 shadow-sm">
        <div
          v-for="(item, index) in topFour"
          :key="item.rank"
          class="flex items-center justify-between px-3 py-2"
          :class="{ 'border-b border-gray-100': index !== 3 }"
        >
          <div class="flex items-center gap-4">
            <span
              class="text-base font-bold w-4 text-center"
              :class="
                item.rank === 1
                  ? 'text-[#FFBC00]'
                  : item.rank === 2
                    ? 'text-gray-500'
                    : item.rank === 3
                      ? 'text-[#A05030]'
                      : 'text-gray-300'
              "
            >
              {{ item.rank }}
            </span>
            <div
              class="w-10 h-10 rounded-full bg-[#FFF9E5] flex items-center justify-center text-[#8A6800] font-bold"
            >
              {{ item.initial }}
            </div>
            <div>
              <p class="font-bold text-[14px] text-gray-900 leading-tight">{{ item.name }}</p>
              <p class="text-[11px] text-gray-400 font-medium">{{ item.category }}</p>
            </div>
          </div>

          <div class="text-right">
            <p class="font-bold text-[14px] text-gray-900 leading-tight">
              {{ item.spent.toLocaleString() }}원
            </p>
            <p class="text-[11px] text-[#00A361] font-semibold opacity-80">
              {{ item.saved.toLocaleString() }}원 절약
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="myRanking"
        class="flex items-center justify-between p-4 h-[56px] rounded-[20px] bg-[#FFF9D6] border-2 border-[#FFBC00] shadow-sm"
      >
        <div class="flex items-center gap-4">
          <span class="text-base font-bold w-4 text-center text-[#8A6800]">{{
            myRanking?.rank
          }}</span>
          <div
            class="w-10 h-10 rounded-full bg-[#FFBC00] flex items-center justify-center text-[#8A6800] font-bold"
          >
            {{ myRanking?.initial }}
          </div>
          <div>
            <p class="font-bold text-[14px] text-gray-900 leading-tight">{{ myRanking?.name }}</p>
            <p class="text-[11px] text-[#8A6800] opacity-60 font-medium">
              {{ myRanking?.category }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <p class="font-bold text-[14px] text-gray-900 leading-tight">
            {{ myRanking?.spent?.toLocaleString() }}원
          </p>
          <p class="text-[11px] text-[#00A361] font-semibold">
            {{ myRanking?.saved?.toLocaleString() }}원 절약중
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
