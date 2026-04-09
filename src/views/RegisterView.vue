<script setup>
import { computed } from 'vue'
import RegisterButton from '../components/Register/RegisterButton.vue'
import { useRegisterStore } from '../stores/useRegisterStore'
import { useRouter } from 'vue-router'

const registerStore = useRegisterStore()
const router = useRouter()

// 단계별 라우트 매핑 (1단계: agreement, 2단계: account, 3단계: profile)
const stepRoutes = ['/register/agreement', '/register/account', '/register/profile']

// 현재 단계가 마지막 단계인지 여부 (버튼 레이블 전환용)
const isLastStep = computed(() => registerStore.currentStep === registerStore.totalSteps)

// 뒤로가기: 이전 단계 라우트로 이동 또는 히스토리 백
function handlePrev() {
  if (registerStore.currentStep > 1) {
    registerStore.prevStep()
    router.push(stepRoutes[registerStore.currentStep - 1])
  } else {
    router.back()
  }
}

// 다음 / 가입 완료 버튼 핸들러
async function handleNext() {
  // 마지막 단계(3단계)일 때: 회원가입 API 호출
  if (isLastStep.value) {
    try {
      await registerStore.register()
      // 네비게이션 완료 후 상태 초기화 (순서 중요: push 먼저 await)
      await router.push({ name: 'login' })
      registerStore.resetRegister()
    } catch (error) {
      console.error('회원가입 실패:', error)
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
    return
  }

  // 중간 단계일 때: 다음 단계로 이동
  if (registerStore.currentStep < registerStore.totalSteps) {
    registerStore.nextStep()
    router.push(stepRoutes[registerStore.currentStep - 1])
  }
}
</script>

<template>
  <div class="h-dvh bg-stone-50 flex flex-col px-5 pt-6 pb-8 overflow-hidden">
    <!-- 뒤로 버튼 -->
    <button
      type="button"
      @click="handlePrev"
      class="flex items-center gap-1 text-sm text-kb-gray hover:text-kb-dark-gray transition-colors duration-200 w-fit"
    >
      <span class="text-base leading-none">&lt;</span>
      <span>뒤로</span>
    </button>

    <!-- 진행 단계 표시 -->
    <div class="flex items-center gap-2 mt-5">
      <div
        v-for="step in registerStore.totalSteps"
        :key="step"
        :class="[
          'h-2 rounded-full transition-all duration-300',
          step === registerStore.currentStep ? 'w-7 bg-kb-yellow' : 'w-2 bg-zinc-300',
        ]"
      />
      <span class="text-xs text-kb-gray ml-1">
        {{ registerStore.currentStep }} / {{ registerStore.totalSteps }}단계
      </span>
    </div>

    <!-- 각 단계별 콘텐츠 영역 (내용이 길면 이 영역만 스크롤) -->
    <div class="mt-6 flex-1 flex flex-col overflow-y-auto">
      <RouterView />
    </div>

    <!-- 다음 / 가입 완료 버튼 -->
    <RegisterButton
      class="bottom-0"
      :label="isLastStep ? '가입 완료' : '다음'"
      :disabled="!registerStore.isCurrentStepValid"
      @click="handleNext"
    />
  </div>
</template>
