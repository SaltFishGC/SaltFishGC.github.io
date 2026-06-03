<template>
  <div class="cursor-glow" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return

  const glow = document.querySelector('.cursor-glow') as HTMLElement | null
  if (!glow) return

  let rafId: number

  const handleMouseMove = (e: MouseEvent) => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px'
      glow.style.top = e.clientY + 'px'
    })
  }

  document.addEventListener('mousemove', handleMouseMove)

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    cancelAnimationFrame(rafId)
  })
})
</script>
