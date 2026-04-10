<!-- 챌린지 및 랭킹 -->
<script setup>
import { ref } from 'vue'
import ChallengeCard from '@/components/challenge/ChallengeCard.vue'
import RankingList from '@/components/challenge/RankingList.vue'
</script>

<template>
  <div class="h-full bg-kb-app-bg overflow-y-auto scrollbar-hide">
    <div class="p-4 pb-[120px] overflow-visible">
      <ChallengeCard />
      <RankingList />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
