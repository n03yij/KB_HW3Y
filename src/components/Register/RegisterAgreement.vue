<script setup>
import RegisterCheckBox from './RegisterCheckBox.vue'
</script>

<template>
  <!-- 타이틀 영역 -->
  <h1 class="text-2xl font-bold text-kb-dark-gray leading-snug">약관에 동의해주세요</h1>
  <p class="text-sm text-kb-gray mt-1">서비스 이용을 위해 약관 동의가 필요합니다</p>

  <!-- 약관 체크박스 -->
  <div class="mt-6">
    <RegisterCheckBox />
  </div>
</template>

<style lang="scss" scoped></style>
