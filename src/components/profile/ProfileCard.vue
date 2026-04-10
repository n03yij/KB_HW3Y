<script setup>
import { ref } from 'vue'
import ramuFace from '@/assets/ramu_face.png'
import logoutIcon from '@/assets/logout.svg'
import logoutImage from '@/assets/logout_image_no_bg.png'
import { useAuthStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import ProfileEditModal from '@/components/profile/ProfileEditModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const isEditModalOpen = ref(false)

const showLogoutModal = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function confirmLogout() {
  showLogoutModal.value = false
  handleLogout()
}
</script>

<template>
  <div class="bg-kb-card rounded-2xl p-4 shadow-sm relative">
    <!-- 로그아웃 버튼 -->
    <button
      @click="showLogoutModal = true"
      class="absolute top-4 right-4 p-1 rounded-full hover:bg-kb-line transition-colors"
      aria-label="로그아웃"
    >
      <img :src="logoutIcon" alt="로그아웃" class="w-6 h-6" />
    </button>

    <!-- 로그아웃 확인 모달 -->
    <Teleport to="body">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="showLogoutModal = false"
      >
        <div class="bg-white rounded-2xl shadow-xl w-72 overflow-hidden">
          <div class="flex flex-col items-center px-6 pt-8 pb-6 gap-4">
            <img :src="logoutImage" alt="로그아웃" class="w-60 h-60 object-contain" />
            <div class="text-center">
              <p class="text-lg font-bold text-kb-dark-gray">로그아웃</p>
              <p class="text-sm text-kb-muted mt-1">정말 로그아웃 하시겠어요?</p>
            </div>
            <div class="flex gap-3 w-full mt-2">
              <button
                @click="showLogoutModal = false"
                class="flex-1 py-2.5 rounded-xl border border-kb-line text-kb-muted text-sm font-medium hover:bg-kb-line transition-colors"
              >
                취소
              </button>
              <button
                @click="confirmLogout"
                class="flex-1 py-2.5 rounded-xl bg-kb-yellow text-black text-sm font-bold hover:opacity-90 transition-opacity"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 상단 프로필 -->
    <div class="flex items-center gap-4">
      <!-- 프로필 이미지 -->
      <div
        class="w-16 h-16 rounded-full bg-kb-yellow flex items-center justify-center text-white text-2xl font-bold"
      >
        <img
          :src="authStore.currentUser?.profileImage || ramuFace"
          alt="프로필 이미지"
          class="w-16 h-16 rounded-full"
        />
      </div>

      <!-- 이름 & 아이디 & 뱃지 -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <div class="text-lg font-bold text-kb-profit">{{ authStore.currentUser?.nickname }}</div>
          <span
            class="text-xs px-2 py-1 rounded-full bg-kb-card-yellow text-kb-dark-gray font-medium"
          >
            Lv.{{ authStore.currentUser?.level ?? 1 }}
          </span>
        </div>
        <div class="text-kb-muted text-sm">{{ authStore.currentUser?.email }}</div>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="border-t border-kb-line my-4"></div>

    <!-- 하단 정보 -->
    <div class="flex justify-between text-center">
      <div class="flex-1">
        <div class="text-xl font-bold">{{ authStore.currentUser?.challengeCount ?? 0 }}</div>
        <div class="text-sm text-kb-muted">완료 챌린지</div>
      </div>

      <div class="flex-1">
        <div class="text-xl font-bold">{{ authStore.currentUser?.thisMonthRank ?? 0 }}위</div>
        <div class="text-sm text-kb-muted">이번 달 랭킹</div>
      </div>
    </div>

    <!-- 프로필 수정 버튼 -->
    <button
      @click="isEditModalOpen = true"
      class="w-full mt-3 py-2 rounded-xl border border-kb-line bg-kb-bg text-sm text-kb-muted hover:bg-kb-line transition-colors"
    >
      프로필 수정
    </button>
  </div>
  <ProfileEditModal v-if="isEditModalOpen" @close="isEditModalOpen = false" />
</template>
