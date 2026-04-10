<template>
  <div class="min-h-[100dvh] bg-kb-app-bg sm:min-h-screen sm:bg-gray-100 sm:flex sm:justify-center sm:items-center">
    <div
      id="app-container"
      class="relative flex w-full min-h-[100dvh] flex-col overflow-hidden bg-kb-app-bg sm:h-[844px] sm:min-h-0 sm:w-[390px] sm:max-h-screen sm:bg-white sm:shadow-2xl"
    >
      <!-- v-if 로직을 하나로 합쳐서 관리하는 것이 깨끗합니다 -->
      <NavBar v-if="showNav" />
      <!-- 하단바/네비바가 없을 때 Splash가 꽉 차도록 flex-1 확인 -->
      <main
        class="relative flex-1 overflow-hidden"
        :class="showNav ? 'bg-kb-app-bg' : 'bg-white'"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <RouterView v-slot="{ Component, route }">
          <Transition :name="transitionName">
            <KeepAlive :max="4">
              <component :is="Component" :key="route.name" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </main>
      <BottomBar v-if="showBottomBar" />
    </div>
  </div>
</template>

<script setup>
import '@/assets/main.css'
import NavBar from '@/components/common/NavBar.vue'
import BottomBar from '@/components/common/BottomBar.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 인증이 필요한 페이지(홈, 요약, 챌린지, 프로필)에서만 NavBar / BottomBar 표시
const showNav = computed(() => !!route.meta.requiresAuth)
const showBottomBar = computed(() => !!route.meta.requiresAuth)

const TAB_ORDER = ['home', 'summary', 'challenge', 'profile']
const transitionName = ref('slide-left')

router.beforeEach((to, from) => {
  const fromIndex = TAB_ORDER.indexOf(from.name)
  const toIndex = TAB_ORDER.indexOf(to.name)

  if (fromIndex === -1 || toIndex === -1) {
    transitionName.value = 'fade'
  } else {
    transitionName.value = toIndex > fromIndex ? 'slide-left' : 'slide-right'
  }
})

// 스와이프 제스처
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e) {
  if (!route.meta.requiresAuth) return

  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY

  // 수평 스와이프인지 확인 (수직 스크롤과 구분)
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return

  const currentIndex = TAB_ORDER.indexOf(route.name)
  if (currentIndex === -1) return

  if (deltaX < 0) {
    // 왼쪽 스와이프 → 다음 탭
    const nextIndex = currentIndex + 1
    if (nextIndex < TAB_ORDER.length) router.push({ name: TAB_ORDER[nextIndex] })
  } else {
    // 오른쪽 스와이프 → 이전 탭
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) router.push({ name: TAB_ORDER[prevIndex] })
  }
}
</script>
