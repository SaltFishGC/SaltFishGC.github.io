import { defineClientConfig } from '@vuepress/client'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter, useRoute } from 'vuepress/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AuroraBackground from './components/AuroraBackground.vue'
import GrainOverlay from './components/GrainOverlay.vue'
import CursorGlow from './components/CursorGlow.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import { MermaidDiagram } from './plugins/mermaid.client'

gsap.registerPlugin(ScrollTrigger)

/**
 * Series 侧边栏状态管理
 *
 * 策略：
 * - 跨页导航（从非 series 页面进入）：默认全展开
 * - 页内导航（series 页面内点击链接）：保持用户的展开/收起状态
 * - 通过记录上一条路由是否属于 series 来区分两种情况
 */
const seriesCollapsedState = new Map<string, boolean>()
let wasOnSeriesPage = false
let seriesObserver: MutationObserver | null = null
let seriesClickHandler: ((e: Event) => void) | null = null
let seriesRafId: number | null = null

export default defineClientConfig({
  enhance({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    onMounted(() => {
      if (typeof window === 'undefined') return
      initScrollReveal()
      initParallax()
      initNavbarScroll()
      initCardMouseTracking()

      // 初始页面是否为 series 页面
      wasOnSeriesPage = isSeriesRoute(route.path)
      if (wasOnSeriesPage) {
        initSeriesInteraction()
      }

      router.afterEach((to) => {
        const isNowOnSeries = isSeriesRoute(to.path)

        if (isNowOnSeries && wasOnSeriesPage) {
          // 页内导航：保持状态
          scheduleApplySeriesState()
        } else if (isNowOnSeries && !wasOnSeriesPage) {
          // 跨页进入 series：清空状态，默认全展开
          seriesCollapsedState.clear()
          scheduleEnsureExpanded()
        }

        wasOnSeriesPage = isNowOnSeries

        // 重新绑定交互（SPA 导航后 DOM 可能重建）
        if (isNowOnSeries) {
          setTimeout(() => initSeriesInteraction(), 100)
        }
      })
    })

    onBeforeUnmount(() => {
      cleanupSeriesListeners()
      if (seriesRafId !== null) {
        cancelAnimationFrame(seriesRafId)
        seriesRafId = null
      }
    })
  },
  rootComponents: [
    AuroraBackground,
    GrainOverlay,
    CursorGlow,
    ReadingProgress,
  ],
})

function isSeriesRoute(path: string): boolean {
  // series 页面特征：路径匹配 /docs/ 或 /blogs/ 等，且页面有 .series-container
  // 简单判断：路径包含 /docs/ 或 /blogs/ 或 /notes/
  return /\/(docs|blogs|notes|series)\//.test(path) || path === '/docs' || path === '/blogs' || path === '/notes'
}

function initScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>('.reveal')
  elements.forEach((el, i) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    })
  })
}

function initParallax() {
  const elements = document.querySelectorAll<HTMLElement>('[data-speed]')
  elements.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.5')
    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-container')
  if (!navbar) return

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 80) {
        navbar.classList.add('scrolled')
      } else if (self.scroll() <= 80) {
        navbar.classList.remove('scrolled')
      }
    },
  })
}

function initCardMouseTracking() {
  const container = document.querySelector('.theme-container')
  if (!container) return

  container.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const cards = container.querySelectorAll<HTMLElement>('.card, .magic-card')
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      const x = mouseEvent.clientX - rect.left
      const y = mouseEvent.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    })
  })
}

// ==================== Series 侧边栏逻辑 ====================

function getSeriesItemKey(heading: Element): string {
  const textEl = heading.querySelector('.xicon-content') || heading
  const text = textEl.textContent?.trim() || ''
  return `L1:${text}`
}

/**
 * 确保所有目录展开（跨页导航时使用）
 */
function ensureAllExpanded() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  // 移除所有 .series-collapsed 类
  seriesContainer.querySelectorAll('.series-collapsed').forEach((el) => {
    el.classList.remove('series-collapsed')
  })

  // 确保 arrow 为 down，子列表 display: block
  const sections = seriesContainer.querySelectorAll('section.series-group.series-item')
  sections.forEach((section) => {
    const heading = section.querySelector(':scope > .series-heading.series-level-1')
    if (!heading) return

    const arrow = heading.querySelector('.arrow')
    if (arrow) {
      arrow.classList.remove('right')
      arrow.classList.add('down')
    }

    const childList = section.querySelector(':scope > ul')
    if (childList) {
      childList.style.display = 'block'
    }
  })
}

/**
 * 应用持久化的折叠状态（页内导航时使用）
 */
function applySeriesCollapsedState() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  if (seriesCollapsedState.size === 0) {
    // 没有记录的状态，默认全展开
    ensureAllExpanded()
    return
  }

  const sections = seriesContainer.querySelectorAll('section.series-group.series-item')
  sections.forEach((section) => {
    const heading = section.querySelector(':scope > .series-heading.series-level-1')
    if (!heading) return

    const key = getSeriesItemKey(heading)
    const isCollapsed = seriesCollapsedState.get(key) === true

    if (isCollapsed) {
      section.classList.add('series-collapsed')
      const arrow = heading.querySelector('.arrow')
      if (arrow) {
        arrow.classList.remove('down')
        arrow.classList.add('right')
      }
      const childList = section.querySelector(':scope > ul')
      if (childList) {
        childList.style.display = 'none'
      }
    } else {
      section.classList.remove('series-collapsed')
      const arrow = heading.querySelector('.arrow')
      if (arrow) {
        arrow.classList.remove('right')
        arrow.classList.add('down')
      }
      const childList = section.querySelector(':scope > ul')
      if (childList) {
        childList.style.display = 'block'
      }
    }
  })
}

/**
 * 捕获当前折叠状态到 Map
 */
function captureSeriesToggleState() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  const sections = seriesContainer.querySelectorAll('section.series-group.series-item')
  sections.forEach((section) => {
    const heading = section.querySelector(':scope > .series-heading.series-level-1')
    if (!heading) return

    const arrow = heading.querySelector('.arrow')
    if (arrow) {
      const key = getSeriesItemKey(heading)
      const isCollapsed = arrow.classList.contains('right')
      seriesCollapsedState.set(key, isCollapsed)
    }
  })
}

function scheduleEnsureExpanded() {
  if (seriesRafId !== null) cancelAnimationFrame(seriesRafId)
  const attempt = (remaining: number) => {
    seriesRafId = requestAnimationFrame(() => {
      ensureAllExpanded()
      if (remaining > 0) attempt(remaining - 1)
    })
  }
  attempt(15)
}

function scheduleApplySeriesState() {
  if (seriesRafId !== null) cancelAnimationFrame(seriesRafId)
  const attempt = (remaining: number) => {
    seriesRafId = requestAnimationFrame(() => {
      applySeriesCollapsedState()
      if (remaining > 0) attempt(remaining - 1)
    })
  }
  attempt(15)
}

/**
 * 初始化 Series 交互：点击事件 + MutationObserver
 * 幂等操作：重复调用不会重复绑定
 */
function initSeriesInteraction() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  // 绑定点击事件（捕获用户折叠/展开操作）
  if (!seriesClickHandler) {
    seriesClickHandler = (e: Event) => {
      const target = e.target as Element
      const heading = target.closest('.series-heading')
      if (heading && heading.classList.contains('series-level-1')) {
        const section = heading.closest('section.series-group.series-item')
        if (section) {
          section.classList.remove('series-collapsed')
        }
        setTimeout(() => {
          captureSeriesToggleState()
          applySeriesCollapsedState()
        }, 80)
      }
    }
  }

  // 先移除旧的监听（防止重复绑定）
  seriesContainer.removeEventListener('click', seriesClickHandler, true)
  seriesContainer.addEventListener('click', seriesClickHandler, true)

  // MutationObserver：监听 DOM 变化后重新应用状态
  if (seriesObserver) {
    seriesObserver.disconnect()
  }

  let observerTimer: ReturnType<typeof setTimeout> | null = null
  seriesObserver = new MutationObserver(() => {
    if (observerTimer) clearTimeout(observerTimer)
    observerTimer = setTimeout(() => {
      if (seriesCollapsedState.size > 0) {
        applySeriesCollapsedState()
      } else {
        ensureAllExpanded()
      }
    }, 50)
  })
  seriesObserver.observe(seriesContainer, { childList: true, subtree: true })
}

function cleanupSeriesListeners() {
  if (seriesObserver) {
    seriesObserver.disconnect()
    seriesObserver = null
  }
  const seriesContainer = document.querySelector('.series-container')
  if (seriesContainer && seriesClickHandler) {
    seriesContainer.removeEventListener('click', seriesClickHandler, true)
  }
  seriesClickHandler = null
}
