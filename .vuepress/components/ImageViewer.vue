<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, h } from 'vue'

export default defineComponent({
  name: 'ImageViewer',
  setup() {
    const visible = ref(false)
    const imgSrc = ref('')
    const scale = ref(1)
    const translateX = ref(0)
    const translateY = ref(0)
    let isDragging = false
    let startX = 0
    let startY = 0

    function open(src: string) {
      imgSrc.value = src
      scale.value = 1
      translateX.value = 0
      translateY.value = 0
      visible.value = true
      document.body.style.overflow = 'hidden'
    }

    function close() {
      visible.value = false
      document.body.style.overflow = ''
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && visible.value) close()
    }

    function onWheel(e: WheelEvent) {
      if (!visible.value) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      scale.value = Math.max(0.2, Math.min(5, scale.value * delta))
    }

    function onMouseDown(e: MouseEvent) {
      if (!visible.value) return
      isDragging = true
      startX = e.clientX - translateX.value
      startY = e.clientY - translateY.value
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return
      translateX.value = e.clientX - startX
      translateY.value = e.clientY - startY
    }

    function onMouseUp() {
      isDragging = false
    }

    function handleClick(e: Event) {
      const target = e.target as HTMLElement
      const img = target.closest('img')
      if (!img) return
      if (img.closest('.mermaid-diagram, .glass-mermaid')) return
      if (img.closest('.navbar-container, .personal-info-wrapper')) return
      const src = img.src || (img as HTMLImageElement).dataset.src
      if (src) open(src)
    }

    onMounted(() => {
      document.addEventListener('click', handleClick, true)
      document.addEventListener('keydown', onKeydown)
      document.addEventListener('wheel', onWheel, { passive: false } as any)
      document.addEventListener('mousedown', onMouseDown)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })

    return () => {
      if (!visible.value) return null

      return h('div', {
        class: 'image-viewer-overlay',
        onClick: (e: Event) => {
          if ((e.target as HTMLElement).classList.contains('image-viewer-overlay')) close()
        },
      }, [
        h('div', { class: 'image-viewer-toolbar' }, [
          h('span', { class: 'image-viewer-hint' }, '滚轮缩放 · 拖拽移动 · ESC 关闭'),
          h('button', {
            class: 'image-viewer-close',
            onClick: close,
          }, '✕'),
        ]),
        h('img', {
          class: 'image-viewer-img',
          src: imgSrc.value,
          style: {
            transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
            cursor: isDragging ? 'grabbing' : 'grab',
          },
          draggable: false,
        }),
      ])
    }
  },
})
</script>
