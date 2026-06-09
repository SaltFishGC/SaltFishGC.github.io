import { defineClientConfig } from '@vuepress/client'
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vuepress/client'
import { createPinia } from 'pinia'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AuroraBackground from './components/AuroraBackground.vue'
import GrainOverlay from './components/GrainOverlay.vue'
import CursorGlow from './components/CursorGlow.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ImageViewer from './components/ImageViewer.vue'
import CodeBlockEnhancer from './components/CodeBlockEnhancer.vue'
import { MermaidDiagram } from './plugins/mermaid.client'
import { useSeriesStore } from './stores/series'

gsap.registerPlugin(ScrollTrigger)

const pinia = createPinia()

let seriesObserver: MutationObserver | null = null
let seriesClickHandler: ((e: Event) => void) | null = null
let seriesRafId: number | null = null

export default defineClientConfig({
  enhance({ app }) {
    app.use(pinia)
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
      initDarkModeTransition()
      initTocScrollTracking()

      // 初始页面是否为 series 页面
      const store = useSeriesStore()
      const isSeries = isSeriesRoute(route.path)
      if (isSeries) {
        store.enterSeriesPage()
        initSeriesInteraction()
      }

      router.afterEach((to) => {
        // 延迟执行，避免阻塞点击事件
        requestAnimationFrame(() => {
          const isNowOnSeries = isSeriesRoute(to.path)
          const wasOnSeries = store.isOnSeriesPage

          if (isNowOnSeries && !wasOnSeries) {
            store.clearState()
            store.enterSeriesPage()
            scheduleEnsureExpanded()
          } else if (isNowOnSeries && wasOnSeries) {
            scheduleApplySeriesState()
          } else if (!isNowOnSeries) {
            store.leaveSeriesPage()
          }

          if (isNowOnSeries) {
            setTimeout(() => initSeriesInteraction(), 150)
          }
        })
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
    ImageViewer,
    CodeBlockEnhancer,
  ],
})

// ==================== 路由判断 ====================

function isSeriesRoute(path: string): boolean {
  return /\/(docs|blogs|notes|series)\//.test(path) || path === '/docs' || path === '/blogs' || path === '/notes'
}

// ==================== GSAP 动画 ====================

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
      card.style.setProperty('--x', `${x}px`)
      card.style.setProperty('--y', `${y}px`)
    })
  })
}

// ==================== 暗色模式过渡 ====================

function initDarkModeTransition() {
  // 只给关键元素加过渡，避免 * 选择器导致全页面重排卡顿
  const style = document.createElement('style')
  style.textContent = `
    html.theme-transitioning {
      transition: background-color 0.3s ease !important;
    }
    html.theme-transitioning body,
    html.theme-transitioning .theme-container,
    html.theme-transitioning .navbar-container,
    html.theme-transitioning .page-content,
    html.theme-transitioning .series-container,
    html.theme-transitioning .page-catalog-container,
    html.theme-transitioning .glass-card,
    html.theme-transitioning .card {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
  `
  document.head.appendChild(style)

  // 只监听 data-theme 变化，不监听 class（避免导航时误触发）
  let transitioning = false
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-theme') {
        if (transitioning) return
        transitioning = true
        document.documentElement.classList.add('theme-transitioning')
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning')
          transitioning = false
        }, 350)
      }
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
}

// ==================== 目录滚动跟踪 ====================

function initTocScrollTracking() {
  const content = document.querySelector('.theme-reco-md-content')
  if (!content) return

  const headings = content.querySelectorAll('h1, h2, h3, h4')
  if (headings.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          if (!id) return
          // 更新目录 active 状态
          const catalog = document.querySelector('.page-catalog-container')
          if (!catalog) return
          catalog.querySelectorAll('.active').forEach((el) => el.classList.remove('active'))
          const link = catalog.querySelector(`a[href="#${id}"]`)
          if (link) {
            const parent = link.parentElement
            if (parent) parent.classList.add('active')
          }
        }
      })
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    }
  )

  headings.forEach((heading) => observer.observe(heading))
}

// ==================== Series 侧边栏逻辑 ====================

function getSeriesItemKey(heading: Element): string {
  const textEl = heading.querySelector('.xicon-content') || heading
  const text = textEl.textContent?.trim() || ''
  return `L1:${text}`
}

function ensureAllExpanded() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  seriesContainer.querySelectorAll('.series-collapsed').forEach((el) => {
    el.classList.remove('series-collapsed')
  })

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

function applySeriesCollapsedState() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  const store = useSeriesStore()

  if (!store.hasState) {
    ensureAllExpanded()
    return
  }

  const sections = seriesContainer.querySelectorAll('section.series-group.series-item')
  sections.forEach((section) => {
    const heading = section.querySelector(':scope > .series-heading.series-level-1')
    if (!heading) return

    const key = getSeriesItemKey(heading)
    const isCollapsed = store.isCollapsed(key)

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

function captureSeriesToggleState() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  const store = useSeriesStore()
  const stateMap: Record<string, boolean> = {}

  const sections = seriesContainer.querySelectorAll('section.series-group.series-item')
  sections.forEach((section) => {
    const heading = section.querySelector(':scope > .series-heading.series-level-1')
    if (!heading) return

    const arrow = heading.querySelector('.arrow')
    if (arrow) {
      const key = getSeriesItemKey(heading)
      stateMap[key] = arrow.classList.contains('right')
    }
  })

  store.setCollapsedAll(stateMap)
}

function scheduleEnsureExpanded() {
  if (seriesRafId !== null) cancelAnimationFrame(seriesRafId)
  const attempt = (remaining: number) => {
    seriesRafId = requestAnimationFrame(() => {
      ensureAllExpanded()
      if (remaining > 0) attempt(remaining - 1)
    })
  }
  attempt(5)
}

function scheduleApplySeriesState() {
  if (seriesRafId !== null) cancelAnimationFrame(seriesRafId)
  const attempt = (remaining: number) => {
    seriesRafId = requestAnimationFrame(() => {
      applySeriesCollapsedState()
      if (remaining > 0) attempt(remaining - 1)
    })
  }
  attempt(5)
}

function initSeriesInteraction() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

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

  seriesContainer.removeEventListener('click', seriesClickHandler, true)
  seriesContainer.addEventListener('click', seriesClickHandler, true)

  if (seriesObserver) {
    seriesObserver.disconnect()
  }

  let observerTimer: ReturnType<typeof setTimeout> | null = null
  seriesObserver = new MutationObserver(() => {
    if (observerTimer) clearTimeout(observerTimer)
    observerTimer = setTimeout(() => {
      const store = useSeriesStore()
      if (store.hasState) {
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
