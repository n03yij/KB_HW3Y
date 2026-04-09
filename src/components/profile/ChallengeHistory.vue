<script setup>
import { ref } from 'vue'
import ChallengeItem from './ChallengeItem.vue'

const props = defineProps({
  challenges: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: '10만원 한달살기',
        category: '식비',
        date: '2026년 4월',
        used: 67300,
        saved: 32700,
        status: 'success',
        percent: 70,
      },
      {
        id: 2,
        title: '카페 지출 줄이기',
        category: '카페',
        date: '2026년 3월',
        used: 28000,
        saved: 12000,
        status: 'success',
        percent: 65,
      },
      {
        id: 3,
        title: '쇼핑 4만원 제한',
        category: '쇼핑',
        date: '2026년 2월',
        used: 89000,
        saved: 49000,
        status: 'fail',
        percent: 100,
      },
      {
        id: 4,
        title: '쇼핑 5만원 제한',
        category: '쇼핑',
        date: '2026년 2월',
        used: 89000,
        saved: 39000,
        status: 'fail',
        percent: 100,
      },
    ],
  },
})
</script>

<template>
  <div class="mt-6">
    <h3 class="mb-2 text-lg font-bold text-kb-profit">챌린지 히스토리</h3>

    <div class="flex flex-col gap-3">
      <ChallengeItem v-for="(item, index) in challenges" :key="item.id ?? index" v-bind="item" />
    </div>
  </div>
</template>
