<template>
  <header class="w-full bg-kb-yellow" style="padding-top: env(safe-area-inset-top)">
    <div class="relative flex h-[64px] items-center justify-center px-4">
      <img :src="logoUrl" alt="야금 로고" class="h-[44px] w-auto object-contain" />
    </div>
  </header>
</template>

<script setup>
import logoUrl from '@/assets/logo.png'
</script>
