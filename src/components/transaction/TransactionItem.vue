<script setup>

import busIcon from '@/assets/bus.svg'
import coffeeIcon from '@/assets/coffee.svg'
import cutleryIcon from '@/assets/cutlery.svg'
import etcIcon from '@/assets/Etc.svg'
import homeIcon from '@/assets/home.svg'
import investIcon from '@/assets/Invest.svg'
import leisureIcon from '@/assets/leisure.svg'
import medicalIcon from '@/assets/Medical.svg'
import salaryIcon from '@/assets/Salary.svg'
import shoppingBagIcon from '@/assets/shoppingBag.svg'
import sideJobIcon from '@/assets/SideJob.svg'
import mealIcon from '@/assets/calendar_meal.svg'

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
})

const categoryMetaMap = {
  식비: { icon: cutleryIcon, iconBg: 'bg-kb-icon-yellow' },
  카페: { icon: coffeeIcon, iconBg: 'bg-kb-icon-beige' },
  교통: { icon: busIcon, iconBg: 'bg-kb-icon-blue' },
  쇼핑: { icon: shoppingBagIcon, iconBg: 'bg-kb-icon-pink' },
  의료: { icon: medicalIcon, iconBg: 'bg-kb-icon-ivory' },
  여가: { icon: leisureIcon, iconBg: 'bg-kb-icon-beige' },
  주거: { icon: homeIcon, iconBg: 'bg-kb-icon-ivory' },
  기타: { icon: etcIcon, iconBg: 'bg-kb-icon-ivory' },
  급여: { icon: salaryIcon, iconBg: 'bg-kb-icon-blue' },
  부업: { icon: sideJobIcon, iconBg: 'bg-kb-icon-green' },
  투자: { icon: investIcon, iconBg: 'bg-kb-icon-blue' },
  생활: { icon: mealIcon, iconBg: 'bg-kb-icon-green' },
}

const categoryMeta = categoryMetaMap[props.transaction.category] ?? {
  icon: etcIcon,
  iconBg: 'bg-kb-icon-ivory',
}

const amountText = `${props.transaction.type === 'income' ? '+' : '-'}${Number(props.transaction.amount).toLocaleString()}원`
const amountClassName = props.transaction.type === 'income' ? 'text-kb-income' : 'text-kb-expense'
const subtitle = props.transaction.memo || props.transaction.merchant || ''
</script>

<template>
  <article class="flex items-center gap-4 px-4 py-4">
    <div
      class="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px]"
      :class="categoryMeta.iconBg"
    >
      <img :src="categoryMeta.icon" :alt="transaction.category" class="h-7 w-7 object-contain" />
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate text-[17px] font-extrabold tracking-[-0.03em] text-kb-profit">
        {{ transaction.category }}
      </p>
      <p class="mt-1 truncate text-[12px] font-medium text-kb-muted">
        {{ subtitle }}
      </p>
    </div>

    <p class="shrink-0 text-[16px] font-extrabold tracking-[-0.03em]" :class="amountClassName">
      {{ amountText }}
    </p>
  </article>
</template>
