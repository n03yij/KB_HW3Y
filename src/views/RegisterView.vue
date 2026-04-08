<script setup>
import RegisterButton from '../components/Register/RegisterButton.vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 단계별 라우트 매핑
const stepRoutes = ['/register/agreement', '/register/account']

// 뒤로가기: 이전 단계 라우트로 이동 또는 히스토리 백
function handlePrev() {
  if (userStore.currentStep > 1) {
    userStore.prevStep()
    router.push(stepRoutes[userStore.currentStep - 1])
  } else {
    router.back()
  }
}

// 다음: 다음 단계 라우트로 이동
function handleNext() {
  if (userStore.currentStep < userStore.totalSteps) {
    userStore.nextStep()
    router.push(stepRoutes[userStore.currentStep - 1])
  }
}
</script>

<template>
  <div class="min-h-dvh bg-stone-50 flex flex-col px-5 pt-6 pb-8">
    <!-- 뒤로 버튼 -->
    <button
      @click="handlePrev"
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

    <!-- 각 단계별 콘텐츠 영역 -->
    <div class="mt-6 flex-1 flex flex-col">
      <RouterView />
    </div>

    <!-- 다음 버튼 -->
    <RegisterButton
      class="mt-8"
      label="다음"
      :disabled="!userStore.isCurrentStepValid"
      @click="handleNext"
    />
  </div>
</template>

<style lang="scss" scoped></style>
