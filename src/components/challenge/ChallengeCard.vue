<script setup>
import { ref, computed } from 'vue'
import ramuPushImg from '@/assets/ramu_push.png'

const props = defineProps({
  title: {
    type: String,
    default: '10만원 한달살기',
  },
  category: {
    type: String,
    default: '식비 카테고리',
  },
  period: {
    type: String,
    default: '2026년 4월 전체',
  },
  amount: {
    type: Number,
    default: 67300,
  },
  maxAmount: {
    type: Number,
    default: 100000,
  },
  saved: {
    type: Number,
    default: 32700,
  },
  weekStatus: {
    type: Number,
    default: 3,
  },
})

// 퍼센트 계산
const progressPercent = computed(() => Math.min((props.amount / props.maxAmount) * 100, 100))
</script>

<template>
  <div
    class="bg-[#FFBC00] px-4 py-3 rounded-[24px] shadow-sm relative flex flex-col justify-between"
  >
    <!-- 상단 정보 -->
    <div class="leading-tight space-y-0.5">
      <span class="bg-black/10 text-[#8A6800] text-[10px] px-2 py-0.5 rounded-full font-medium"
        >4월 진행 중</span
      >
      <h2 class="text-xl font-bold mt-0.5 text-[#5A3E00]">{{ title }}</h2>
      <p class="text-[11px] text-[#8A6800] opacity-70">{{ category }} · {{ period }}</p>
    </div>

    <!-- 사용 금액 -->
    <div class="flex justify-between items-end mb-0.5">
      <div>
        <p class="text-[11px] text-[#8A6800] opacity-70">사용 금액</p>
        <p class="text-xl font-extrabold text-[#C84040] leading-none">
          {{ amount.toLocaleString() }}<span class="text-lg ml-0.5">원</span>
        </p>
      </div>

      <div class="mb-1">
        <div
          class="bg-[#E8F5E0] text-[#1A7A50] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"
        >
          {{ saved.toLocaleString() }}원 남음
        </div>
      </div>
    </div>

    <!-- 진행바 + 캐릭터 영역 -->
    <div class="relative pt-1 mb-2">
      <!-- 라무 캐릭터 (진행률 위치) -->
      <div
        class="absolute bottom-[20%] transform -translate-x-1/2 transition-all duration-500 z-10"
        :style="{ left: progressPercent + '%' }"
      >
        <img :src="ramuPushImg" alt="character" class="w-13 h-13 object-contain" />
      </div>

      <!-- 진행바 영역 -->
      <div class="w-full">
        <div class="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-500 rounded-full"
            :style="{
              width: progressPercent + '%',
              background: 'linear-gradient(90deg, #FFD040 0%, #FF9000 100%)',
            }"
          ></div>
        </div>

        <!-- 진행바 눈금 -->
        <div
          class="flex justify-between text-[9px] mt-2 text-[#8A6800] font-medium opacity-60 px-1"
        >
          <span>0원</span>
          <span>{{ (maxAmount / 2).toLocaleString() }}원</span>
          <span>{{ maxAmount.toLocaleString() }}원</span>
        </div>
      </div>
    </div>

    <!-- 주차 상태 -->
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="i in 4"
        :key="i"
        class="text-center py-1 rounded-xl text-[11px] font-bold transition-all"
        :class="[
          i === weekStatus
            ? 'bg-[#FF9000] text-white shadow-md scale-105'
            : i < weekStatus
              ? 'bg-[#FFFFFF]/60 text-[#5A3E00]'
              : 'bg-[#FFFFFF]/28 text-[#5A3E00]',
        ]"
      >
        {{ i }}주
        <div class="text-[9px] font-normal opacity-80">
          <span v-if="i < weekStatus" class="text-[#1A7A50]">완료</span>
          <span v-else-if="i === weekStatus">진행중</span>
          <span v-else>진행 전</span>
        </div>
      </div>
    </div>
  </div>
</template>
