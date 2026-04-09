import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ────────────────────────────────────────────
// 앱 초기화
// - initAuth: localStorage의 userId로 로그인 상태 복원
// - resetRegister: 회원가입 도중 앱이 종료된 경우를 대비해 상태 초기화
// router가 등록된 이후, mount 이전에 실행해야 가드가 올바르게 동작함
// ────────────────────────────────────────────
import { useAuthStore } from './stores/user'
import { useRegisterStore } from './stores/useRegisterStore'

const authStore = useAuthStore()
const registerStore = useRegisterStore()

// 회원가입 상태 초기화 (앱 재시작 시 깨끗한 상태 보장)
registerStore.resetRegister()

// 로그인 상태 복원 후 앱 마운트
authStore.initAuth().finally(() => {
  app.mount('#app')
})
