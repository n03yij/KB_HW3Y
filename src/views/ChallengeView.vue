<!-- 챌린지 및 랭킹 -->
<script setup>
import { ref } from 'vue'
import ChallengeCard from '@/components/challenge/ChallengeCard.vue'
import RankingList from '@/components/challenge/RankingList.vue'
import MissionCard from '@/components/challenge/MissionCard.vue'
</script>

<template>
  <div class="p-4">
    <ChallengeCard />
    <RankingList />
    <MissionCard />
  </div>
</template>

<style lang="scss" scoped></style>
