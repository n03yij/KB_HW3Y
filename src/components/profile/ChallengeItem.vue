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

const statusTheme = computed(() => {
  const theme = {
    success: {
      card: 'border-[#ebe3d9] bg-white',
      iconWrap: 'bg-kb-icon-green',
      badge: 'bg-kb-icon-green text-kb-income',
      bar: 'bg-kb-income',
      amount: 'text-[#8f877b]',
      text: '성공',
    },
    fail: {
      card: 'border-[#ebe3d9] bg-white',
      iconWrap: 'bg-[#fde9e6]',
      badge: 'bg-over-bg text-kb-expense',
      bar: 'bg-[#ff5a5a]',
      amount: 'text-kb-expense',
      text: '실패',
    },
    active: {
      card: 'border-kb-yellow bg-[#fff8ea]',
      iconWrap: 'bg-kb-yellow',
      badge: 'bg-kb-yellow text-white',
      bar: 'bg-kb-yellow',
      amount: 'text-[#8f877b]',
      text: '진행중',
    },
  }

  return theme[props.status] ?? theme.success
})

const progressWidth = computed(() => {
  const value = Number(props.percent ?? 0)
  return `${Math.max(0, Math.min(value, 100))}%`
})
</script>

<template>
  <div
    class="rounded-[16px] border px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-colors"
    :class="statusTheme.card"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <div
          class="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px]"
          :class="statusTheme.iconWrap"
        >
          <img :src="icon" alt="category-icon" class="h-5 w-5 object-contain" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="truncate text-[15px] font-extrabold tracking-[-0.03em] text-kb-profit">
            {{ title }}
          </div>
          <div class="mt-0.5 text-[11px] font-medium text-[#9d968c]">{{ category }} · {{ date }}</div>
        </div>
      </div>

      <span
        class="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold leading-none whitespace-nowrap"
        :class="statusTheme.badge"
      >
        {{ statusTheme.text }}
      </span>
    </div>

    <div class="mt-3 flex items-center justify-between text-[11px] font-medium text-[#8f877b]">
      <div>{{ used.toLocaleString() }}원 사용</div>
      <div :class="statusTheme.amount">
        {{ saved.toLocaleString() }}원
        {{ status === 'fail' ? '초과' : '절약' }}
      </div>
    </div>

    <div class="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#dfdfdf]">
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="statusTheme.bar"
        :style="{ width: progressWidth }"
      />
    </div>
  </div>
</template>
