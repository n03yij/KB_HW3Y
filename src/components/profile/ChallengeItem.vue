<script setup>
import { computed } from 'vue'
import { iconMap } from '@/utils/icons'

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

const categoryIconMap = {
  식비: iconMap.cutlery,
  카페: iconMap.coffee,
  쇼핑: iconMap.shopping,
  교통: iconMap.bus,
  여가: iconMap.leisure,
  의료: iconMap.medical,
  여행: iconMap.suitcase,
  투자: iconMap.invest,
  급여: iconMap.salary,
  부업: iconMap.sidejob,
  기타: iconMap.etc,
}

const icon = computed(() => categoryIconMap[props.category] ?? iconMap.etc)

// 상태별 스타일
const statusStyle = {
  success: {
    badge: 'bg-kb-icon-green text-kb-income',
    bar: 'bg-kb-income',
    text: '성공',
  },
  fail: {
    badge: 'bg-over-bg text-kb-expense',
    bar: 'bg-kb-expense',
    text: '실패',
  },
}
</script>

<template>
  <div class="bg-kb-card p-4 rounded-2xl shadow-sm border-[0.5px] border-kb-line">
    <!-- 상단 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <!-- 아이콘 -->
        <div class="w-10 h-10 rounded-full bg-kb-app-bg flex items-center justify-center">
          <img :src="icon" alt="category-icon" class="w-6 h-6" />
        </div>
        <div class="font-bold text-base text-kb-profit">{{ title }}</div>
        <div class="text-sm text-kb-muted">{{ category }} · {{ date }}</div>
      </div>

      <!-- 상태 뱃지 -->
      <span class="text-xs px-3 py-1 rounded-full font-medium" :class="statusStyle[status].badge">
        {{ statusStyle[status].text }}
      </span>
    </div>

    <!-- 금액 -->
    <div class="flex justify-between text-sm text-kb-muted mt-4">
      <div>{{ used.toLocaleString() }}원 사용</div>

      <div :class="status === 'fail' ? 'text-kb-expense' : 'text-kb-muted'">
        {{ saved.toLocaleString() }}원
        {{ status === 'fail' ? '초과' : '절약' }}
      </div>
    </div>

    <!-- 게이지 바 -->
    <div class="mt-3 w-full h-2 bg-kb-line rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="statusStyle[status].bar"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
  </div>
</template>
