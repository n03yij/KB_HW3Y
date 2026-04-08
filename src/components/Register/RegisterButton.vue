<script setup>
// 버튼 텍스트 및 비활성화 여부를 props로 받아 재사용
defineProps({
  label: {
    type: String,
    default: '다음',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :class="[
      'w-full py-4 font-bold text-base rounded-2xl transition-colors duration-200',
      disabled
        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
        : 'bg-kb-yellow hover:bg-kb-yellow-light text-white',
    ]"
  >
    {{ label }}
  </button>
</template>

<style lang="scss" scoped></style>
