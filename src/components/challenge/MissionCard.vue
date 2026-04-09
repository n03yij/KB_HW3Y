<script setup>
import { ref } from 'vue'
import { iconMap } from '@/utils/icons'

const missions = ref([
  { id: 1, title: '집밥 5일 연속', isCompleted: true, icon: iconMap.home },
  { id: 2, title: '카페 대신 물 마시기', isCompleted: false, icon: iconMap.coffee },
  { id: 3, title: '하루 1만원 이하 소비', isCompleted: false, icon: iconMap.check },
  { id: 4, title: '배달 음식 금지', isCompleted: true, icon: iconMap.cutlery },
  { id: 5, title: '가계부 매일 작성', isCompleted: false, icon: iconMap.calendar },
])
</script>

<template>
  <div class="mission-section mt-4 px-1">
    <h3 class="text-lg font-bold text-kb-profit mb-2">이번 주 미션</h3>

    <div class="space-y-3">
      <div
        v-for="mission in missions"
        :key="mission.id"
        class="flex items-center justify-between p-4 h-[56px] bg-white rounded-[20px] shadow-sm border border-kb-divider"
      >
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 flex items-center justify-center">
            <img :src="mission.icon" alt="mission-icon" class="w-6 h-6" />
          </div>
          <span class="font-bold text-[15px] text-kb-profit">{{ mission.title }}</span>
        </div>

        <div
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="mission.isCompleted ? 'bg-kb-yellow' : 'bg-kb-divider'"
        >
          <img :src="iconMap.check" alt="check" class="w-4 h-4 scale-110" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
