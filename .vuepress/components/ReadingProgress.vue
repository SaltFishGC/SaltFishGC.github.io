<template>
  <div class="reading-progress" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const bar = document.querySelector('.reading-progress') as HTMLElement | null
  const content = document.querySelector('.theme-default-content') as HTMLElement | null
  if (!bar || !content) return

  const handleScroll = () => {
    const rect = content.getBoundingClientRect()
    const contentHeight = content.scrollHeight
    const viewportHeight = window.innerHeight
    const scrolled = -rect.top
    const total = contentHeight - viewportHeight
    const progress = Math.min(Math.max(scrolled / total, 0), 1)
    bar.style.transform = `scaleX(${progress})`
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>
