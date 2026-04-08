<template>
  <header class="w-[390px] h-[60px] bg-yellow-500 flex items-center justify-center px-4 relative">
    <div class="flex items-center justify-center">
      <img :src="logoUrl" alt="야금 로고" class="w-[130px] h-[80px] object-contain" />
    </div>
  </header>
</template>

<script setup>
import logoUrl from '@/assets/logo.png'
</script>
