<template>
  <div class="min-h-screen bg-gray-100 flex justify-center items-center">
    <div id="app-container" class="relative w-[390px] h-[844px] bg-white shadow-2xl overflow-hidden flex flex-col">
      <!-- v-if 로직을 하나로 합쳐서 관리하는 것이 깨끗합니다 -->
      <NavBar v-if="showNav" />
      <!-- 하단바/네비바가 없을 때 Splash가 꽉 차도록 flex-1 확인 -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
      <BottomBar v-if="showBottomBar" />
    </div>
  </div>
</template>

<script setup>
import '@/assets/main.css'
import NavBar from '@/components/common/NavBar.vue'
import BottomBar from '@/components/common/BottomBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 인증이 필요한 페이지(홈, 요약, 챌린지, 프로필)에서만 NavBar / BottomBar 표시
const showNav = computed(() => !!route.meta.requiresAuth)
const showBottomBar = computed(() => !!route.meta.requiresAuth)
</script>
