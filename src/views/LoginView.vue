<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import RegisterButton from '../components/Register/RegisterButton.vue'

const router = useRouter()
const userStore = useUserStore()

// 입력값
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// 에러 메시지
const errorMessage = ref('')

// 로그인 버튼 활성화 여부
const isFormValid = ref(false)

// 입력 변경 시 유효성 체크 및 에러 초기화
function handleInput() {
  errorMessage.value = ''
  isFormValid.value = email.value !== '' && password.value !== ''
}

// 로그인 처리
async function handleLogin() {
  if (!isFormValid.value) return

  try {
    await userStore.login(email.value, password.value)
    router.push({ name: 'home' })
  } catch (error) {
    errorMessage.value = error.message
  }
}

// 회원가입 페이지 이동
function goToRegister() {
  router.push({ name: 'register' })
}
</script>

<template>
  <div class="h-dvh bg-stone-50 flex flex-col px-5 pt-12 pb-8">

    <!-- 앱 로고 / 타이틀 -->
    <div class="flex flex-col items-center mb-10">
      <img src="../assets/logo.png" alt="야금 로고" class="w-36 object-contain mb-2" />
      <p class="text-sm text-kb-gray">소비를 야금야금 줄여봐요</p>
    </div>

    <!-- 입력 폼 -->
    <div class="flex flex-col gap-4">

      <!-- 이메일 -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-kb-dark-gray">이메일</label>
        <input
          v-model="email"
          type="email"
          placeholder="example@email.com"
          @input="handleInput"
          class="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-kb-dark-gray">비밀번호</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="비밀번호를 입력해주세요"
            @input="handleInput"
            class="w-full px-4 py-3.5 pr-16 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-kb-gray"
          >
            {{ showPassword ? '숨기기' : '보기' }}
          </button>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <p v-if="errorMessage" class="text-xs text-red-500 text-center -mt-1">
        {{ errorMessage }}
      </p>
    </div>

    <!-- 로그인 버튼 -->
    <div class="mt-6">
      <RegisterButton
        label="로그인"
        :disabled="!isFormValid"
        @click="handleLogin"
      />
    </div>

    <!-- 회원가입 링크 -->
    <div class="flex items-center justify-center gap-1 mt-5">
      <span class="text-sm text-kb-gray">아직 계정이 없으신가요?</span>
      <button
        type="button"
        @click="goToRegister"
        class="text-sm font-semibold text-kb-yellow underline underline-offset-2"
      >
        회원가입
      </button>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>
