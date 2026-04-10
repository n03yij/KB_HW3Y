<!-- 프로필 화면 -->
<script setup>
import { computed } from 'vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ChallengeHistory from '@/components/profile/ChallengeHistory.vue'
import { useAuthStore } from '@/stores/user'

const authStore = useAuthStore()
const user = computed(() => authStore.currentUser)

const level = computed(() => `Lv.${user.value?.level ?? 1} 절약왕`)
const streak = computed(() => `연속 ${user.value?.streakDays ?? 0}일`)
</script>

<template>
  <div class="h-full bg-kb-app-bg overflow-y-auto scrollbar-hide p-4 pb-30">
    <ProfileCard />
    <ChallengeHistory />
  </div>
</template>

<style lang="scss" scoped></style>
