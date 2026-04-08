import { createRouter, createWebHistory } from 'vue-router'

//import LoginView from '../views/LoginView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'), // 가계부 메인
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/RegisterView.vue'),
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
      ],
    },
    {
      path: '/transactions', // 이미지 기획서대로 s 추가
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'), // 요약 리스트
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: () => import('@/views/ChallengeView.vue'),
    },
    {
      path: '/transactions/:id',
      name: 'transaction-detail',
      component: () => import('@/views/TransactionDetailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'), // 프로필/설정
    },
  ],
})

export default router
