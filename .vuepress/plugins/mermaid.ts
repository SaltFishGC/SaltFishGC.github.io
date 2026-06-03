import type { Plugin } from '@vuepress/core'

export const mermaidPlugin: Plugin = {
  name: 'mermaid-plugin',

  extendsMarkdown: (md) => {
    const defaultFence = md.renderer.rules.fence
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      if (token.info?.trim() === 'mermaid') {
        const code = encodeURIComponent(token.content)
        return `<MermaidDiagram code="${code}"></MermaidDiagram>`
      }
      return defaultFence?.(...args) || ''
    }
  },
}

export default mermaidPlugin
