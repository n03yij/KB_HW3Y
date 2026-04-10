<script setup>
import { ref, onMounted } from 'vue'
import ChallengeItem from './ChallengeItem.vue'
import { useAuthStore } from '@/stores/user'
import { getChallengeHistory } from '@/api/challenge'
import apiClient from '@/api/axios'

const authStore = useAuthStore()
const challenges = ref([])
const isLoading = ref(false)

function formatMonth(month) {
  const [year, m] = month.split('-')
  return `${year}년 ${parseInt(m, 10)}월`
}

function calcPercent(spentAmount, savedAmount) {
  const target = spentAmount + savedAmount
  if (!target || target <= 0) return 100
  return Math.min(100, Math.round((spentAmount / target) * 100))
}

onMounted(async () => {
  const userId = authStore.currentUser?.id
  if (!userId) {
    console.warn('[ChallengeHistory] currentUser is null — skipping fetch')
    return
  }

  isLoading.value = true
  try {
    // 과거 히스토리 + 현재 진행 중인 챌린지 병렬 조회
    const currentChallengeId = authStore.currentUser?.currentChallengeId
    const [history, currentChallenge] = await Promise.all([
      getChallengeHistory(userId),
      currentChallengeId ? apiClient.get(`/challenges/${currentChallengeId}`).then(r => r.data) : null,
    ])

    // 현재 진행 중인 챌린지 → monthlyChallenge에서 제목/월 가져오기
    let currentItem = null
    if (currentChallenge) {
      const mc = await apiClient.get(`/monthlyChallenge/${currentChallenge.monthlyChallengeId}`).then(r => r.data)
      currentItem = {
        id: `current-${currentChallenge.id}`,
        title: mc.title,
        date: formatMonth(mc.month),
        status: 'active',
        used: currentChallenge.spentAmount,
        saved: Math.max(mc.targetAmount - currentChallenge.spentAmount, 0),
        percent: calcPercent(currentChallenge.spentAmount, Math.max(mc.targetAmount - currentChallenge.spentAmount, 0)),
      }
    }

    const historyItems = history.map((item) => ({
      id: item.id,
      title: item.title,
      date: formatMonth(item.month),
      status: item.status,
      used: item.spentAmount,
      saved: Math.abs(item.savedAmount),
      percent: calcPercent(item.spentAmount, item.savedAmount),
    }))

    // 현재 챌린지를 맨 위에 표시
    challenges.value = currentItem ? [currentItem, ...historyItems] : historyItems
  } catch (err) {
    console.error('[ChallengeHistory] API error:', err)
  } finally {
    isLoading.value = false
  }

  challenges.value = history
    .slice()
    .sort((a, b) => b.month.localeCompare(a.month))
    .map((item) => ({
    id: item.id,
    title: item.title,
    date: formatMonth(item.month),
    status: item.status,
    used: item.spentAmount,
    saved: Math.abs(item.savedAmount),
    percent: calcPercent(item.spentAmount, item.savedAmount),
  }))
})
</script>

<template>
  <div class="mt-6">
    <h3 class="mb-2 text-lg font-bold text-kb-profit">챌린지 히스토리</h3>

    <div v-if="isLoading" class="flex justify-center py-6">
      <div class="w-6 h-6 border-2 border-kb-profit border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="challenges.length === 0" class="text-sm text-kb-muted text-center py-6">
      챌린지 히스토리가 없습니다.
    </div>

    <div v-else class="flex flex-col gap-3">
      <ChallengeItem v-for="item in challenges" :key="item.id" v-bind="item" />
    </div>
  </div>
</template>
