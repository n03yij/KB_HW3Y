<script setup>
import { useRouter } from 'vue-router'

import busIcon from '@/assets/bus.svg'
import coffeeIcon from '@/assets/coffee.svg'
import cutleryIcon from '@/assets/cutlery.svg'
import homeIcon from '@/assets/home.svg'
import shoppingBagIcon from '@/assets/shoppingBag.svg'
import trophyIcon from '@/assets/trophy.svg'
import workIcon from '@/assets/suitcase.svg'
import mealIcon from '@/assets/calendar_meal.svg'

const router = useRouter()

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
})

const categoryMetaMap = {
  급여: { icon: workIcon, iconBg: 'bg-kb-icon-blue' },
  부업: { icon: trophyIcon, iconBg: 'bg-kb-icon-green' },
  식비: { icon: cutleryIcon, iconBg: 'bg-kb-icon-yellow' },
  카페: { icon: coffeeIcon, iconBg: 'bg-kb-icon-beige' },
  생활: { icon: mealIcon, iconBg: 'bg-kb-icon-green' },
  쇼핑: { icon: shoppingBagIcon, iconBg: 'bg-kb-icon-pink' },
  교통: { icon: busIcon, iconBg: 'bg-kb-icon-blue' },
  주거: { icon: homeIcon, iconBg: 'bg-kb-icon-ivory' },
}

const categoryMeta = categoryMetaMap[props.transaction.category] ?? {
  icon: props.transaction.type === 'income' ? trophyIcon : mealIcon,
  iconBg: props.transaction.type === 'income' ? 'bg-kb-icon-green' : 'bg-kb-icon-ivory',
}

const amountText = `${props.transaction.type === 'income' ? '+' : '-'}${Number(props.transaction.amount).toLocaleString()}원`
const amountClassName = props.transaction.type === 'income' ? 'text-kb-income' : 'text-kb-expense'
const subtitle = props.transaction.memo || props.transaction.merchant || ''
</script>

<template>
  <article
    class="flex cursor-pointer items-center gap-4 px-4 py-4 active:bg-kb-divider"
    @click="router.push({ name: 'transaction-detail', params: { id: transaction.id } })"
  >
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
