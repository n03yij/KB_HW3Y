<script setup>
import { ref } from 'vue'
import checkIcon from '@/assets/check.svg'
import homeIcon from '@/assets/home.svg'

const missions = ref([{ id: 1, title: '집밥 5일 연속', isCompleted: true }])
</script>

<template>
  <div class="mission-section mt-4 px-1">
    <h3 class="text-lg font-bold text-[#1A1A1A] mb-2">이번 주 미션</h3>

    <div class="space-y-3">
      <div
        v-for="mission in missions"
        :key="mission.id"
        class="flex items-center justify-between p-4 h-[56px] bg-white rounded-[20px] shadow-sm border border-gray-50"
      >
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 flex items-center justify-center">
            <img v-if="homeIcon" :src="homeIcon" alt="mission-icon" class="w-6 h-6" />
            <span v-else class="text-xl">🏠</span>
          </div>
          <span class="font-bold text-[15px] text-gray-900">{{ mission.title }}</span>
        </div>

        <div
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="mission.isCompleted ? 'bg-[#FFBC00]' : 'bg-gray-100'"
        >
          <img :src="checkIcon" alt="check" class="w-4 h-4 scale-110" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
