<script setup>
import { ref } from 'vue'
import ramuFace from '@/assets/ramu_face.png'

const props = defineProps({
  name: {
    type: String,
    default: '홍길동',
  },
  username: {
    type: String,
    default: '@honggildong',
  },
  level: {
    type: String,
    default: 'Lv.7 절약왕',
  },
  streak: {
    type: String,
    default: '연속 32일',
  },
  challengeCount: {
    type: Number,
    default: 12,
  },
  rank: {
    type: Number,
    default: 5,
  },
})
</script>

<template>
  <div class="bg-kb-card rounded-2xl p-4 shadow-sm">
    <!-- 상단 프로필 -->
    <div class="flex items-center gap-4">
      <!-- 프로필 이미지 -->
      <div
        class="w-16 h-16 rounded-full bg-kb-yellow flex items-center justify-center text-white text-2xl font-bold"
      >
        <img :src="ramuFace" alt="프로필 이미지" class="w-16 h-16 rounded-full" />
      </div>

      <!-- 이름 & 아이디 -->
      <div class="flex-1">
        <div class="text-lg font-bold text-kb-profit">{{ name }}</div>
        <div class="text-kb-muted text-sm">{{ username }}</div>

        <!-- 뱃지 -->
        <div class="flex gap-2 mt-2">
          <span
            class="text-xs px-2 py-1 rounded-full bg-kb-card-yellow text-kb-dark-gray font-medium"
          >
            {{ level }}
          </span>
          <span class="text-xs px-2 py-1 rounded-full bg-kb-icon-green text-kb-income font-medium">
            {{ streak }}
          </span>
        </div>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="border-t border-kb-line my-4"></div>

    <!-- 하단 정보 -->
    <div class="flex justify-between text-center">
      <div class="flex-1">
        <div class="text-xl font-bold">{{ challengeCount }}</div>
        <div class="text-sm text-gray-400">완료 챌린지</div>
      </div>

      <div class="flex-1">
        <div class="text-xl font-bold">{{ rank }}위</div>
        <div class="text-sm text-gray-400">이번 달 랭킹</div>
      </div>
    </div>
  </div>
</template>
