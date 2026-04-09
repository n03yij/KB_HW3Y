import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api/axios'

// 인증(로그인/로그아웃) 관련 상태만 담당
export const useAuthStore = defineStore('auth', () => {
  // 현재 로그인된 유저 정보
  const currentUser = ref(null)

  // 로그인 여부
  const isLoggedIn = computed(() => currentUser.value !== null)

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

  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
    initAuth,
  }
})
