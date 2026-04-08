<template>
  <div class="min-h-screen bg-gray-100 flex justify-center items-center">
    <div class="relative w-[390px] h-[844px] bg-white shadow-2xl overflow-hidden flex flex-col">
      <NavBar />
      <RouterView />
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

// 회원가입 플로우에서는 하단 BottomBar 숨김
const showBottomBar = computed(() => !route.path.startsWith('/register'))
</script>
