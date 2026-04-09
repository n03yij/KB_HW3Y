<!-- 프로필 화면 -->
<script setup>
import { ref } from 'vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ChallengeHistory from '@/components/profile/ChallengeHistory.vue'
import ChallengeItem from '@/components/profile/ChallengeItem.vue'
</script>

<template>
  <div class="h-full overflow-y-auto p-4 pb-30">
    <ProfileCard />
    <ChallengeHistory />
  </div>
</template>

<style lang="scss" scoped></style>
