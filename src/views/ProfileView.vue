<!-- 프로필 화면 -->
<script setup>
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ChallengeHistory from '@/components/profile/ChallengeHistory.vue'
</script>

<template>
  <div class="h-full bg-kb-app-bg overflow-y-auto scrollbar-hide px-4 pb-[120px] pt-4">
    <ProfileCard />
    <ChallengeHistory />
  </div>
</template>

<style lang="scss" scoped></style>
