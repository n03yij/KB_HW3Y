<script setup>
import { ref, onMounted, onActivated } from 'vue'
import ChallengeItem from './ChallengeItem.vue'
import { useAuthStore } from '@/stores/user'
import { getChallengeHistory } from '@/api/challenge'
import apiClient from '@/api/axios'

const authStore = useAuthStore()
const challenges = ref([])
const isLoading = ref(false)
const isFirstLoad = ref(true)

function formatMonth(month) {
  const [year, m] = month.split('-')
  return `${year}년 ${parseInt(m, 10)}월`
}

function calcPercent(spentAmount, savedAmount) {
  const target = spentAmount + savedAmount
  if (!target || target <= 0) return 100
  return Math.min(100, Math.round((spentAmount / target) * 100))
}

async function fetchHistory(showSpinner = true) {
  const userId = authStore.currentUser?.id
  if (!userId) {
    console.warn('[ChallengeHistory] currentUser is null — skipping fetch')
    return
  }

  if (showSpinner) isLoading.value = true
  try {
    const currentChallengeId = authStore.currentUser?.currentChallengeId
    const [history, currentChallenge] = await Promise.all([
      getChallengeHistory(userId),
      currentChallengeId
        ? apiClient.get(`/challenges/${currentChallengeId}`).then((r) => r.data)
        : null,
    ])

    let currentItem = null
    if (currentChallenge) {
      const mc = await apiClient
        .get(`/monthlyChallenge/${currentChallenge.monthlyChallengeId}`)
        .then((r) => r.data)
      currentItem = {
        id: `current-${currentChallenge.id}`,
        title: mc.title,
        category: mc.category,
        date: formatMonth(mc.month),
        status: 'active',
        used: currentChallenge.spentAmount,
        saved: Math.max(mc.targetAmount - currentChallenge.spentAmount, 0),
        percent: calcPercent(
          currentChallenge.spentAmount,
          Math.max(mc.targetAmount - currentChallenge.spentAmount, 0),
        ),
      }
    }

    const historyItems = history
      .slice()
      .sort((a, b) => b.month.localeCompare(a.month))
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        date: formatMonth(item.month),
        status: item.status,
        used: item.spentAmount,
        saved: Math.abs(item.savedAmount),
        percent: calcPercent(item.spentAmount, item.savedAmount),
      }))

    challenges.value = currentItem ? [currentItem, ...historyItems] : historyItems
    const successCount = history.filter((item) => item.status === 'success').length
    await authStore.updateProfile({ challengeCount: successCount, level: successCount + 1 })
  } catch (err) {
    console.error('[ChallengeHistory] API error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchHistory(true)
  isFirstLoad.value = false
})
onActivated(() => fetchHistory(false))
</script>

<template>
  <div class="mt-7">
    <h3 class="mb-4 text-[18px] font-extrabold tracking-[-0.03em] text-kb-profit">
      챌린지 히스토리
    </h3>

    <div v-if="isLoading" class="flex justify-center py-6">
      <div
        class="w-6 h-6 border-2 border-kb-profit border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div v-else-if="challenges.length === 0" class="text-sm text-kb-muted text-center py-6">
      챌린지 히스토리가 없습니다.
    </div>

    <div v-else class="flex flex-col gap-4">
      <ChallengeItem v-for="item in challenges" :key="item.id" v-bind="item" />
    </div>
  </div>
</template>
