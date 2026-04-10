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
  <div
    class="relative rounded-[28px] border border-[#e8e1d7] bg-kb-card px-6 py-6 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
  >
    <!-- 로그아웃 버튼 -->
    <button
      @click="showLogoutModal = true"
      class="absolute right-6 top-6 rounded-full p-1.5 transition-colors hover:bg-[#f3efe8]"
      aria-label="로그아웃"
    >
      <img :src="logoutIcon" alt="로그아웃" class="h-6 w-6" />
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
    <div class="flex items-center gap-4 pr-10">
      <!-- 프로필 이미지 -->
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-kb-yellow"
      >
        <img
          :src="authStore.currentUser?.profileImage || ramuFace"
          alt="프로필 이미지"
          class="h-16 w-16 rounded-full object-cover"
        />
      </div>

      <!-- 이름 & 아이디 & 뱃지 -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <div class="truncate text-[18px] font-extrabold tracking-[-0.03em] text-kb-profit">
            {{ authStore.currentUser?.nickname }}
          </div>
          <span
            class="shrink-0 rounded-full bg-kb-card-yellow px-3 py-1 text-[12px] font-bold text-kb-dark-gray"
          >
            Lv.{{ authStore.currentUser?.level ?? 1 }}
          </span>
        </div>
        <div class="mt-1 truncate text-[14px] font-medium text-[#a39c92]">
          {{ authStore.currentUser?.email }}
        </div>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="my-5 border-t border-[#e5ddd3]"></div>

    <!-- 하단 정보 -->
    <div class="flex justify-between text-center">
      <div class="flex-1">
        <div class="text-[18px] font-extrabold tracking-[-0.03em] text-kb-profit">
          {{ authStore.currentUser?.challengeCount ?? 0 }}
        </div>
        <div class="mt-1 text-[14px] font-medium text-[#a39c92]">완료 챌린지</div>
      </div>

      <div class="flex-1">
        <div class="text-[18px] font-extrabold tracking-[-0.03em] text-kb-profit">
          {{ authStore.currentUser?.thisMonthRank ?? 0 }}위
        </div>
        <div class="mt-1 text-[14px] font-medium text-[#a39c92]">이번 달 랭킹</div>
      </div>
    </div>

    <!-- 프로필 수정 버튼 -->
    <button
      @click="isEditModalOpen = true"
      class="mt-5 h-[56px] w-full rounded-[18px] border border-[#ddd6ca] bg-white text-[15px] font-semibold text-[#9b948b] transition-colors hover:bg-[#f8f4ee]"
    >
      프로필 수정
    </button>
  </div>
  <ProfileEditModal v-if="isEditModalOpen" @close="isEditModalOpen = false" />
</template>
