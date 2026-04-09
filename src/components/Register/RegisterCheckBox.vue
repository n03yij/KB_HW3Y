<script setup>
import { useRegisterStore } from '../../stores/useRegisterStore'

const registerStore = useRegisterStore()
</script>

<template>
  <div class="flex flex-col gap-3">

    <!-- 전체 동의하기 -->
    <button
      @click="registerStore.toggleAll"
      :class="[
        'flex items-center gap-3 w-full px-4 py-4 rounded-2xl border transition-colors duration-200',
        registerStore.allChecked
          ? 'bg-amber-50 border-kb-yellow'
          : 'bg-white border-zinc-200',
      ]"
    >
      <!-- 체크 아이콘 -->
      <span
        :class="[
          'flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0',
          registerStore.allChecked ? 'bg-kb-yellow' : 'border-2 border-zinc-300',
        ]"
      >
        <svg
          v-if="registerStore.allChecked"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span class="font-bold text-kb-dark-gray text-base">전체 동의하기</span>
    </button>

    <!-- 개별 약관 항목 -->
    <button
      v-for="term in registerStore.terms"
      :key="term.id"
      @click="registerStore.toggleTerm(term.id)"
      class="flex items-center gap-3 w-full px-4 py-4 bg-white rounded-2xl border border-zinc-200 transition-colors duration-200"
    >
      <!-- 체크 아이콘 -->
      <span
        :class="[
          'flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0',
          term.checked ? 'bg-kb-yellow' : 'border-2 border-zinc-300',
        ]"
      >
        <svg
          v-if="term.checked"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <!-- 약관명 (필수 항목은 굵게 표시) -->
      <span :class="['text-sm text-kb-gray text-left flex-1', term.required && 'font-bold']">{{ term.label }}</span>

      <!-- 상세보기 화살표 -->
      <svg
        class="w-4 h-4 text-kb-gray flex-shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

  </div>
</template>

<style lang="scss" scoped></style>
