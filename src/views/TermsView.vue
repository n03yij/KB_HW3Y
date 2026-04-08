<script setup>
import TermsCheckBox from '../components/Terms/TermsCheckBox.vue'
import TermsButton from '../components/Terms/TermsButton.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="min-h-dvh bg-stone-50 flex flex-col px-5 pt-6 pb-8">

    <!-- 뒤로 버튼 -->
    <button
      @click="userStore.prevStep"
      class="flex items-center gap-1 text-sm text-kb-gray hover:text-kb-dark-gray transition-colors duration-200 w-fit"
    >
      <span class="text-base leading-none">&lt;</span>
      <span>뒤로</span>
    </button>

    <!-- 진행 단계 표시 -->
    <div class="flex items-center gap-2 mt-5">
      <div
        v-for="step in userStore.totalSteps"
        :key="step"
        :class="[
          'h-2 rounded-full transition-all duration-300',
          step === userStore.currentStep ? 'w-7 bg-kb-yellow' : 'w-2 bg-zinc-300',
        ]"
      />
      <span class="text-xs text-kb-gray ml-1">
        {{ userStore.currentStep }} / {{ userStore.totalSteps }}단계
      </span>
    </div>

    <!-- 타이틀 영역 -->
    <h1 class="text-2xl font-bold text-kb-dark-gray mt-6 leading-snug">약관에 동의해주세요</h1>
    <p class="text-sm text-kb-gray mt-1">서비스 이용을 위해 약관 동의가 필요합니다</p>

    <!-- 약관 체크박스 -->
    <div class="mt-6 flex-1">
      <TermsCheckBox />
    </div>

    <!-- 다음 버튼 (필수 약관 전체 동의 시 활성화) -->
    <TermsButton
      class="mt-8"
      label="다음"
      :disabled="!userStore.requiredAllChecked"
      @click="userStore.nextStep"
    />

  </div>
</template>

<style lang="scss" scoped></style>
