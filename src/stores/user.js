import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api/axios'

export const useUserStore = defineStore('user', () => {
  // ────────────────────────────────────────────
  // 로그인 상태
  // ────────────────────────────────────────────
  const currentUser = ref(null)

  // 로그인 여부
  const isLoggedIn = computed(() => currentUser.value !== null)

  // ────────────────────────────────────────────
  // 단계 상태 (회원가입)
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
  // 계정 정보 유효성 (2단계)
  // ────────────────────────────────────────────
  const isAccountStepValid = ref(false)

  // ────────────────────────────────────────────
  // 프로필 단계 유효성 (3단계)
  // ────────────────────────────────────────────
  const isProfileStepValid = ref(false)

  // ────────────────────────────────────────────
  // 회원가입 폼 데이터 (단계 간 유지)
  // ────────────────────────────────────────────
  const registerForm = ref({
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
    monthlyBudget: null,
  })

  // ────────────────────────────────────────────
  // 계산된 상태
  // ────────────────────────────────────────────

  // 전체 동의 여부
  const allChecked = computed(() => terms.value.every((t) => t.checked))

  // 필수 약관 전체 동의 여부
  const requiredAllChecked = computed(() =>
    terms.value.filter((t) => t.required).every((t) => t.checked),
  )

  // 현재 단계의 다음 버튼 활성화 여부
  const isCurrentStepValid = computed(() => {
    if (currentStep.value === 1) return requiredAllChecked.value
    if (currentStep.value === 2) return isAccountStepValid.value
    if (currentStep.value === 3) return isProfileStepValid.value
    return true
  })

  // ────────────────────────────────────────────
  // 로그인 / 로그아웃 액션
  // ────────────────────────────────────────────

  // 로그인 - GET /users?email=&password= 로 유저 조회
  async function login(email, password) {
    const response = await apiClient.get('/users', {
      params: { email, password },
    })
    const users = response.data

    if (!users || users.length === 0) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    currentUser.value = users[0]
    // 새로고침 후에도 로그인 유지: localStorage에 userId 저장
    localStorage.setItem('userId', users[0].id)
  }

  // 로그아웃
  function logout() {
    currentUser.value = null
    localStorage.removeItem('userId')
  }

  // 앱 초기화 시 localStorage에서 로그인 상태 복원
  async function initAuth() {
    const savedId = localStorage.getItem('userId')
    if (!savedId) return

    try {
      const response = await apiClient.get(`/users/${savedId}`)
      currentUser.value = response.data
    } catch {
      // 저장된 userId로 유저를 찾지 못하면 로그아웃 처리
      localStorage.removeItem('userId')
    }
  }

  // ────────────────────────────────────────────
  // 회원가입 액션
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

  // 계정 정보 유효성 동기화 (RegisterAccount에서 호출)
  function setAccountStepValid(val) {
    isAccountStepValid.value = val
  }

  // 이메일 저장
  function setRegisterEmail(email) {
    registerForm.value.email = email
  }

  // 비밀번호 저장
  function setRegisterPassword(password) {
    registerForm.value.password = password
  }

  // 프로필 단계 유효성 동기화 (RegisterProfile에서 호출)
  function setProfileStepValid(val) {
    isProfileStepValid.value = val
  }

  // 닉네임 저장
  function setNickname(nickname) {
    registerForm.value.nickname = nickname
  }

  // 프로필 이미지 저장
  function setProfileImage(image) {
    registerForm.value.profileImage = image
  }

  // 월 목표 예산 저장
  function setMonthlyBudget(budget) {
    registerForm.value.monthlyBudget = budget
  }

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

  // 가입 완료 후 상태 초기화
  function resetRegister() {
    currentStep.value = 1
    terms.value.forEach((t) => (t.checked = false))
    isAccountStepValid.value = false
    isProfileStepValid.value = false
    registerForm.value = {
      email: '',
      password: '',
      nickname: '',
      profileImage: null,
      monthlyBudget: null,
    }
  }

  return {
    currentUser,
    isLoggedIn,
    currentStep,
    totalSteps,
    terms,
    allChecked,
    requiredAllChecked,
    isCurrentStepValid,
    registerForm,
    login,
    logout,
    initAuth,
    toggleAll,
    toggleTerm,
    nextStep,
    prevStep,
    setAccountStepValid,
    setRegisterEmail,
    setRegisterPassword,
    setProfileStepValid,
    setNickname,
    setProfileImage,
    setMonthlyBudget,
    register,
    resetRegister,
  }
})
