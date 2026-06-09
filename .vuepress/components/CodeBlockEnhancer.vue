<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  name: 'CodeBlockEnhancer',
  setup() {
    let observer: MutationObserver | null = null
    let timer: number | null = null

    function enhanceCodeBlocks() {
      const codeBlocks = document.querySelectorAll('.theme-reco-md-content div[class*="language-"]')
      codeBlocks.forEach((block) => {
        if (block.querySelector('.code-block-header')) return

        const classList = Array.from(block.classList)
        const langClass = classList.find((c) => c.startsWith('language-'))
        const lang = langClass ? langClass.replace('language-', '') : ''

        const header = document.createElement('div')
        header.className = 'code-block-header'

        if (lang) {
          const langTag = document.createElement('span')
          langTag.className = 'code-block-lang'
          langTag.textContent = lang.toUpperCase()
          header.appendChild(langTag)
        }

        const copyBtn = document.createElement('button')
        copyBtn.className = 'code-block-copy'
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        copyBtn.addEventListener('click', () => copyCode(block, copyBtn))
        header.appendChild(copyBtn)

        block.insertBefore(header, block.firstChild)
      })
    }

    async function copyCode(block: Element, btn: HTMLElement) {
      const code = block.querySelector('code')
      if (!code) return

      try {
        await navigator.clipboard.writeText(code.textContent || '')
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
          btn.classList.remove('copied')
        }, 2000)
      } catch {
        const range = document.createRange()
        range.selectNodeContents(code)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        document.execCommand('copy')
        selection?.removeAllRanges()
      }
    }

    onMounted(() => {
      enhanceCodeBlocks()

      const content = document.querySelector('.theme-reco-md-content')
      if (content) {
        observer = new MutationObserver(() => {
          if (timer !== null) clearTimeout(timer)
          timer = window.setTimeout(enhanceCodeBlocks, 200)
        })
        observer.observe(content, { childList: true, subtree: true })
      }
    })

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
    })

    return () => null
  },
})
</script>
