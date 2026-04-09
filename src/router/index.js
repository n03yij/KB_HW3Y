import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'splash',
      component: () => import('@/views/SplashView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }, // 로그인 필요
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true }, // 비로그인 전용 (로그인 상태에서 접근 시 홈으로)
    },
    {
      path: '/register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true }, // 비로그인 전용
      children: [
        { path: '', name: 'register', redirect: '/register/agreement' },
        {
          path: 'agreement',
          name: 'registerAgreement',
          component: () => import('@/components/Register/RegisterAgreement.vue'),
        },
        {
          path: 'account',
          name: 'registerAccount',
          component: () => import('@/components/Register/RegisterAccount.vue'),
        },
        {
          path: 'profile',
          name: 'registerProfile',
          component: () => import('@/components/Register/RegisterProfile.vue'),
        },
      ],
    },
    {
      path: '/transactions',
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: () => import('@/views/ChallengeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// ────────────────────────────────────────────
// 네비게이션 가드
// ────────────────────────────────────────────
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 로그인이 필요한 페이지인데 비로그인 상태 → 로그인 페이지로
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }

  // 비로그인 전용 페이지인데 로그인 상태 → 홈으로
  if (to.meta.guest && authStore.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
