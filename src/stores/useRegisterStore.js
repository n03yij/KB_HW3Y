import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api/axios'

// 비밀번호 유효성 정규식 (8자 이상, 영문 + 숫자 + 특수문자 조합)
const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

// 회원가입 흐름(단계, 약관, 폼 데이터) 관련 상태만 담당
export const useRegisterStore = defineStore('register', () => {
  // ────────────────────────────────────────────
  // 단계 상태 (회원가입 스텝 관리)
  // ────────────────────────────────────────────
  const currentStep = ref(1)
  const totalSteps = ref(3)

  // ────────────────────────────────────────────
  // 약관 목록 (1단계)
  // ────────────────────────────────────────────
  const terms = ref([
    { id: 1, label: '[필수] 이용약관 동의', required: true, checked: false },
    { id: 2, label: '[필수] 개인정보 처리방침', required: true, checked: false },
    { id: 3, label: '[필수] 금융거래 정보 제공 동의', required: true, checked: false },
    { id: 4, label: '[선택] 마케팅 정보 수신 동의', required: false, checked: false },
  ])

  // ────────────────────────────────────────────
  // 회원가입 폼 데이터 (단계 간 유지)
  // passwordConfirm은 UI 유효성 검사용으로 스토어에서 관리
  // ────────────────────────────────────────────
  const registerForm = ref({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    profileImage: null,
    monthlyBudget: null,
  })

  // ────────────────────────────────────────────
  // 계산된 상태
  // ────────────────────────────────────────────

  // 전체 약관 동의 여부
  const allChecked = computed(() => terms.value.every((t) => t.checked))

  // 필수 약관 전체 동의 여부
  const requiredAllChecked = computed(() =>
    terms.value.filter((t) => t.required).every((t) => t.checked),
  )

  // 2단계: 이메일, 비밀번호, 비밀번호 확인 모두 유효해야 통과
  const isAccountStepValid = computed(() => {
    const { email, password, passwordConfirm } = registerForm.value
    return (
      email !== '' &&
      PASSWORD_REGEX.test(password) &&
      password === passwordConfirm
    )
  })

  // 3단계: 닉네임 2~8자, 한글/영문/숫자만 허용
  const isProfileStepValid = computed(() =>
    /^[가-힣a-zA-Z0-9]{2,8}$/.test(registerForm.value.nickname),
  )

  // 현재 단계의 다음 버튼 활성화 여부
  const isCurrentStepValid = computed(() => {
    if (currentStep.value === 1) return requiredAllChecked.value
    if (currentStep.value === 2) return isAccountStepValid.value
    if (currentStep.value === 3) return isProfileStepValid.value
    return true
  })

  // ────────────────────────────────────────────
  // 약관 액션
  // ────────────────────────────────────────────

  // 전체 약관 토글
  function toggleAll() {
    const next = !allChecked.value
    terms.value.forEach((t) => (t.checked = next))
  }

  // 개별 약관 토글
  function toggleTerm(id) {
    const term = terms.value.find((t) => t.id === id)
    if (term) term.checked = !term.checked
  }

  // ────────────────────────────────────────────
  // 단계 이동 액션
  // ────────────────────────────────────────────

  // 다음 단계로 이동
  function nextStep() {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
    }
  }

  // 이전 단계로 이동
  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // ────────────────────────────────────────────
  // 회원가입 API 액션
  // ────────────────────────────────────────────

  // 회원가입 API 호출 - POST /users
  async function register() {
    const today = new Date().toISOString().split('T')[0]
    const newUser = {
      email: registerForm.value.email,
      password: registerForm.value.password,
      nickname: registerForm.value.nickname,
      profileImage: registerForm.value.profileImage,
      monthlyBudget: registerForm.value.monthlyBudget ?? 0,
      level: 1,
      challengeCount: 0,
      thisMonthRank: 0,
      streakDays: 0,
      joinedAt: today,
      currentChallengeId: null,
    }
    const response = await apiClient.post('/users', newUser)
    return response.data
  }

  // 회원가입 상태 전체 초기화 (가입 완료 후 또는 앱 초기화 시 호출)
  function resetRegister() {
    currentStep.value = 1
    terms.value.forEach((t) => (t.checked = false))
    registerForm.value = {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      profileImage: null,
      monthlyBudget: null,
    }
  }

  return {
    currentStep,
    totalSteps,
    terms,
    registerForm,
    allChecked,
    requiredAllChecked,
    isAccountStepValid,
    isProfileStepValid,
    isCurrentStepValid,
    toggleAll,
    toggleTerm,
    nextStep,
    prevStep,
    register,
    resetRegister,
  }
})
