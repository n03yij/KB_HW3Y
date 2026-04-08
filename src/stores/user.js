import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // ────────────────────────────────────────────
  // 단계 상태
  // ────────────────────────────────────────────
  const currentStep = ref(1)
  const totalSteps = ref(3)

  // ────────────────────────────────────────────
  // 약관 목록
  // ────────────────────────────────────────────
  const terms = ref([
    { id: 1, label: '[필수] 이용약관 동의', required: true, checked: false },
    { id: 2, label: '[필수] 개인정보 처리방침', required: true, checked: false },
    { id: 3, label: '[필수] 금융거래 정보 제공 동의', required: true, checked: false },
    { id: 4, label: '[선택] 마케팅 정보 수신 동의', required: false, checked: false },
  ])

  // ────────────────────────────────────────────
  // 계산된 상태
  // ────────────────────────────────────────────

  // 전체 동의 여부
  const allChecked = computed(() => terms.value.every((t) => t.checked))

  // 필수 약관 전체 동의 여부 (다음 버튼 활성화 조건)
  const requiredAllChecked = computed(() =>
    terms.value.filter((t) => t.required).every((t) => t.checked),
  )

  // ────────────────────────────────────────────
  // 액션
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

  return {
    currentStep,
    totalSteps,
    terms,
    allChecked,
    requiredAllChecked,
    toggleAll,
    toggleTerm,
    nextStep,
    prevStep,
  }
})
