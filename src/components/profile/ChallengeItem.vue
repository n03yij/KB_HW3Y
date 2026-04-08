<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  category: String,
  date: String,
  used: {
    type: Number,
    default: 0,
  },
  saved: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'success',
  },
  percent: Number,
})

// 상태별 스타일
const statusStyle = {
  success: {
    badge: 'bg-[#E8F5E9] text-[#4CAF50]',
    bar: 'bg-[#4CAF50]',
    text: '성공',
  },
  fail: {
    badge: 'bg-[#FEE2E2] text-[#EF5350]',
    bar: 'bg-[#EF5350]',
    text: '실패',
  },
}
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow-sm border-[0.5px] border-[#E0E0E0]">
    <!-- 상단 -->
    <div class="flex justify-between items-center">
      <div>
        <div class="font-bold text-base">{{ title }}</div>
        <div class="text-sm text-[#808080]">{{ category }} · {{ date }}</div>
      </div>

      <!-- 상태 뱃지 -->
      <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusStyle[status].badge">
        {{ statusStyle[status].text }}
      </span>
    </div>

    <!-- 금액 -->
    <div class="flex justify-between text-sm text-[#808080] mt-4">
      <div>{{ used.toLocaleString() }}원 사용</div>

      <div :class="status === 'fail' ? 'text-[#991B1B]' : 'text-[#808080]'">
        {{ saved.toLocaleString() }}원
        {{ status === 'fail' ? '초과' : '절약' }}
      </div>
    </div>

    <!-- 게이지 바 -->
    <div class="mt-3 w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="statusStyle[status].bar"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
  </div>
</template>
