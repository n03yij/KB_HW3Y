<script setup>
import { ref, computed } from 'vue'
import { useRegisterStore } from '../../stores/useRegisterStore'

const registerStore = useRegisterStore()

// UI 전용 상태: 비밀번호 표시/숨김 토글
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// 비밀번호 유효성 (안내 문구 표시용)
const isPasswordValid = computed(() =>
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
    registerStore.registerForm.password,
  ),
)
</script>

<template>
  <!-- 타이틀 영역 -->
  <h1 class="text-2xl font-bold text-kb-dark-gray leading-snug">계정 정보 입력</h1>
  <p class="text-sm text-kb-gray mt-1">로그인에 사용할 정보를 입력해주세요</p>

  <!-- 입력 폼 -->
  <div class="mt-6 flex flex-col gap-5">

    <!-- 이메일 -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-kb-dark-gray">이메일</label>
      <input
        v-model="registerStore.registerForm.email"
        type="email"
        placeholder="example@email.com"
        class="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
      />
    </div>

    <!-- 비밀번호 -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-kb-dark-gray">비밀번호</label>
        <span
          v-if="registerStore.registerForm.password && !isPasswordValid"
          class="text-xs text-red-500"
        >
          8자 이상, 영문/숫자/특수문자 조합
        </span>
      </div>
      <div class="relative">
        <input
          v-model="registerStore.registerForm.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="8자 이상, 영문+숫자+특수문자"
          class="w-full px-4 py-3.5 pr-16 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
        />
        <button
          @click="showPassword = !showPassword"
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-kb-gray"
        >
          {{ showPassword ? '숨기기' : '보기' }}
        </button>
      </div>
    </div>

    <!-- 비밀번호 확인 -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-kb-dark-gray">비밀번호 확인</label>
      <div class="relative">
        <input
          v-model="registerStore.registerForm.passwordConfirm"
          :type="showPasswordConfirm ? 'text' : 'password'"
          placeholder="비밀번호를 한 번 더 입력하세요"
          class="w-full px-4 py-3.5 pr-16 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
        />
        <button
          @click="showPasswordConfirm = !showPasswordConfirm"
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-kb-gray"
        >
          {{ showPasswordConfirm ? '숨기기' : '보기' }}
        </button>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>
