import { h, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

const MERMAID_THEMES = {
  light: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#7c6aef',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#6350d9',
      secondaryColor: '#f0eeff',
      tertiaryColor: '#f8f7ff',
      background: '#ffffff',
      mainBkg: '#7c6aef',
      nodeBkg: '#7c6aef',
      nodeBorder: '#6350d9',
      nodeTextColor: '#ffffff',
      lineColor: '#9d8df5',
      arrowheadColor: '#6350d9',
      defaultLinkColor: '#9d8df5',
      clusterBkg: 'rgba(124, 106, 239, 0.06)',
      clusterBorder: 'rgba(124, 106, 239, 0.20)',
      titleColor: '#18181b',
      textColor: '#18181b',
      edgeLabelBackground: '#ffffff',
      fontFamily: '"Geist", "SF Pro Text", "PingFang SC", sans-serif',
      fontSize: '14px',
      cScale0: '#7c6aef', cScale1: '#22b4c8', cScale2: '#3c64dc',
      cScale3: '#b43c8c', cScale4: '#32b464', cScale5: '#dc6432',
      cScale6: '#c8a422', cScale7: '#643cdc', cScale8: '#22c8a4',
      actorBkg: 'rgba(124, 106, 239, 0.08)',
      actorBorder: '#9d8df5',
      actorTextColor: '#18181b',
      activationBkgColor: 'rgba(124, 106, 239, 0.15)',
      activationBorderColor: '#9d8df5',
      noteBkgColor: 'rgba(34, 180, 200, 0.08)',
      noteBorderColor: '#22b4c8',
      noteTextColor: '#18181b',
      taskBkgColor: 'rgba(124, 106, 239, 0.25)',
      taskBorderColor: '#9d8df5',
      activeTaskBkgColor: '#7c6aef',
      activeTaskBorderColor: '#6350d9',
      doneTaskBkgColor: 'rgba(34, 180, 200, 0.20)',
      doneTaskBorderColor: '#22b4c8',
      gridColor: 'rgba(0, 0, 0, 0.06)',
      sectionBkgColor: 'rgba(124, 106, 239, 0.06)',
      sectionBkgColor2: 'rgba(34, 180, 200, 0.06)',
    },
    themeCSS: `
      .node rect, .node circle, .node ellipse, .node polygon {
        rx: 10; ry: 10;
        transition: filter 0.3s ease, stroke-width 0.3s ease;
      }
      .node:hover rect, .node:hover circle, .node:hover ellipse {
        filter: drop-shadow(0 4px 16px rgba(124,106,239,0.20));
        stroke-width: 2px;
      }
      .cluster rect { rx: 14; ry: 14; }
      .edgePath .path { stroke-width: 1.8px; }
      .edgeLabel { font-size: 12px; }
    `,
  },
  dark: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#7c6aef',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#9d8df5',
      secondaryColor: '#1e1e32',
      tertiaryColor: '#14142a',
      background: '#0d0d1a',
      mainBkg: '#7c6aef',
      nodeBkg: '#7c6aef',
      nodeBorder: '#9d8df5',
      nodeTextColor: '#ffffff',
      lineColor: '#8b7cf5',
      arrowheadColor: '#9d8df5',
      defaultLinkColor: '#9d8df5',
      clusterBkg: 'rgba(124, 106, 239, 0.08)',
      clusterBorder: 'rgba(157, 141, 245, 0.25)',
      titleColor: '#ffffff',
      textColor: '#e0e0e8',
      edgeLabelBackground: 'rgba(20, 20, 42, 0.95)',
      fontFamily: '"Geist", "SF Pro Text", "PingFang SC", sans-serif',
      fontSize: '14px',
      cScale0: '#7c6aef', cScale1: '#22b4c8', cScale2: '#3c64dc',
      cScale3: '#b43c8c', cScale4: '#32b464', cScale5: '#dc6432',
      cScale6: '#c8a422', cScale7: '#643cdc', cScale8: '#22c8a4',
      actorBkg: 'rgba(124, 106, 239, 0.12)',
      actorBorder: '#9d8df5',
      actorTextColor: '#e0e0e8',
      actorLineColor: '#8b7cf5',
      activationBkgColor: 'rgba(124, 106, 239, 0.25)',
      activationBorderColor: '#9d8df5',
      noteBkgColor: 'rgba(34, 180, 200, 0.12)',
      noteBorderColor: '#22b4c8',
      noteTextColor: '#e0e0e8',
      signalColor: '#9d8df5',
      signalTextColor: '#e0e0e8',
      taskBkgColor: 'rgba(124, 106, 239, 0.30)',
      taskBorderColor: '#9d8df5',
      activeTaskBkgColor: '#7c6aef',
      activeTaskBorderColor: '#9d8df5',
      doneTaskBkgColor: 'rgba(34, 180, 200, 0.25)',
      doneTaskBorderColor: '#22b4c8',
      gridColor: 'rgba(224, 224, 232, 0.08)',
      sectionBkgColor: 'rgba(124, 106, 239, 0.10)',
      sectionBkgColor2: 'rgba(34, 180, 200, 0.10)',
      stateBkg: 'rgba(124, 106, 239, 0.15)',
      transitionColor: '#9d8df5',
      compositeBackground: 'rgba(124, 106, 239, 0.08)',
      compositeTitleBackground: 'rgba(124, 106, 239, 0.18)',
      archEdgeColor: '#9d8df5',
      archEdgeArrowColor: '#9d8df5',
      archGroupBorderColor: 'rgba(157, 141, 245, 0.30)',
    },
    themeCSS: `
      .node rect, .node circle, .node ellipse, .node polygon {
        rx: 10; ry: 10;
        filter: drop-shadow(0 0 8px rgba(124,106,239,0.18));
        transition: filter 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
      }
      .node:hover rect, .node:hover circle, .node:hover ellipse {
        filter: drop-shadow(0 0 20px rgba(124,106,239,0.35));
        stroke: #b4a8ff;
        stroke-width: 2px;
      }
      .cluster rect {
        rx: 14; ry: 14;
        stroke-dasharray: 6 3;
      }
      .cluster-label text {
        font-weight: 600;
        letter-spacing: 0.02em;
      }
      .edgePath .path {
        stroke-width: 1.8px;
        filter: drop-shadow(0 0 4px rgba(124,106,239,0.12));
      }
      .edgeLabel { font-size: 12px; }
    `,
  },
}

function getIsDark() {
  if (typeof document === 'undefined') return false
  const html = document.documentElement
  return html.getAttribute('data-theme') === 'dark' || html.classList.contains('dark')
}

let mermaidIdCounter = 0

export const MermaidDiagram = defineComponent({
  name: 'MermaidDiagram',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null)
    let themeObserver: MutationObserver | null = null

    async function renderDiagram() {
      if (!containerRef.value || !props.code || !props.code.trim()) return
      try {
        const mermaid = (await import('mermaid')).default
        const isDark = getIsDark()
        const themeConfig = isDark ? MERMAID_THEMES.dark : MERMAID_THEMES.light
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          ...themeConfig,
        })
        // 自动预处理：给 edge label 中的特殊字符加引号
        let decoded = decodeURIComponent(props.code)
        if (!decoded || !decoded.trim()) return
        decoded = preprocessMermaidCode(decoded)
        const id = `mermaid-${++mermaidIdCounter}-${Date.now()}`
        const { svg } = await mermaid.render(id, decoded)
        containerRef.value.innerHTML = svg
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (containerRef.value) {
          // 显示友好的错误提示
          const errorMsg = err instanceof Error ? err.message : String(err)
          const shortError = errorMsg.split('\n')[0] // 只取第一行
          containerRef.value.innerHTML = `
            <div class="mermaid-error-container">
              <div class="mermaid-error-icon">⚠️</div>
              <div class="mermaid-error-title">图表渲染失败</div>
              <div class="mermaid-error-hint">请检查 Mermaid 语法，特殊字符需用引号包裹</div>
              <details class="mermaid-error-details">
                <summary>查看详细错误</summary>
                <pre>${shortError}</pre>
              </details>
            </div>
          `
        }
      }
    }

    onMounted(() => {
      renderDiagram()
      themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class') {
            renderDiagram()
            return
          }
        }
      })
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
      })
    })

    onBeforeUnmount(() => {
      if (themeObserver) {
        themeObserver.disconnect()
        themeObserver = null
      }
      if (containerRef.value) {
        containerRef.value.innerHTML = ''
      }
    })

    return () => {
      if (!props.code || !props.code.trim()) return null
      return h('div', {
        ref: containerRef,
        class: 'mermaid-diagram glass-mermaid',
      })
    }
  },
})

/**
 * 自动预处理 Mermaid 代码
 * 给 edge label 中包含特殊字符的文本加双引号
 * 匹配模式：-->|text| 或 -.->|text| 或 ==>|text| 等
 * 特殊字符：@ # $ + = > < : ; / \
 */
function preprocessMermaidCode(code: string): string {
  // 匹配 edge label: -->|...|, ---|...|, -.->|...|, ==>|...|
  // 但不匹配已经用引号包裹的 -->|"..."|
  const edgeLabelRegex = /(-+>?-+|==+>)\|([^"'][^|]*?)\|/g
  const specialChars = /[@#$+=><:;\\/]/

  return code.replace(edgeLabelRegex, (match, arrow, label) => {
    if (specialChars.test(label)) {
      return `${arrow}|"${label}"|`
    }
    return match
  })
}
