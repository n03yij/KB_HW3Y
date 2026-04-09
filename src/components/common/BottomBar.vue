<template>
  <nav
    class="absolute bottom-0 left-0 w-full h-[80px] bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-5 z-10"
  >
    <!-- 가계부 (Home) -->
    <router-link to="/home" class="flex flex-col items-center gap-1 group">
      <img
        :src="budgetIcon"
        alt="가계부"
        class="w-6 h-6 object-contain opacity-60 group-[.router-link-active]:opacity-100"
      />
      <span class="text-[11px] text-gray-400 group-[.router-link-active]:text-[#5D5037] font-medium"
        >가계부</span
      >
    </router-link>

    <!-- 요약 (Summary) -->
    <router-link to="/transactions" class="flex flex-col items-center gap-1 group">
      <img
        :src="summaryIcon"
        alt="요약"
        class="w-6 h-6 object-contain opacity-60 group-[.router-link-active]:opacity-100"
      />
      <span class="text-[11px] text-gray-400 group-[.router-link-active]:text-[#5D5037] font-medium"
        >요약</span
      >
    </router-link>

    <!-- 챌린지 (Challenge) -->
    <router-link to="/challenge" class="flex flex-col items-center gap-1 group">
      <img
        :src="challengeIcon"
        alt="챌린지"
        class="w-6 h-6 object-contain opacity-60 group-[.router-link-active]:opacity-100"
      />
      <span class="text-[11px] text-gray-400 group-[.router-link-active]:text-[#5D5037] font-medium"
        >챌린지</span
      >
    </router-link>

    <!-- 프로필 (Profile) -->
    <router-link to="/profile" class="flex flex-col items-center gap-1 group">
      <img
        :src="profileIcon"
        alt="프로필"
        class="w-6 h-6 object-contain opacity-60 group-[.router-link-active]:opacity-100"
      />
      <span class="text-[11px] text-gray-400 group-[.router-link-active]:text-[#5D5037] font-medium"
        >프로필</span
      >
    </router-link>
  </nav>
</template>

<script setup>
import budgetIcon from '../../assets/budget.png'
import summaryIcon from '../../assets/summary.png'
import challengeIcon from '../../assets/challenge.png'
import profileIcon from '../../assets/profile.png'
</script>

<style scoped>
/* 활성화된 링크의 텍스트와 아이콘 진하게 표시 */
.router-link-active {
  color: #5d5037;
}
</style>
