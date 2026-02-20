// 准备了一个插件用于拦截接收代码块fence
// 然后将代码块内容进行过滤等处理得到一个mermaid代码字符串
// 然后准备一个组件MermaidDiagram接收这个字符串并进行渲染(mermaid.client.ts)
// 组件MermaidDiagram挂载在vue的dom中作为全局组件
// MermaidDiagram获取到字符串后会使用mermaid库进行渲染
// 最终返回一个自定义样式等属性的svg图

// vuepress插件api说明:https://v2.vuepress.vuejs.org/zh/reference/plugin-api.html
// .vuepress/plugins/mermaid.ts - Mermaid 图表渲染插件主文件
import type { Plugin } from '@vuepress/core'								// 导入 VuePress 插件类型定义，用于类型检查和代码提示	
import { path } from '@vuepress/utils'			                // 导入 path 工具函数，用于处理文件路径

// 定义名为 mermaidPlugin 的插件对象
export const mermaidPlugin: Plugin = {
  name: 'mermaid-plugin',																		// 插件名称，用于标识此插件

  // 扩展 Markdown 渲染规则的函数	接口说明:https://v2.vuepress.vuejs.org/zh/reference/plugin-api.html#extendsmarkdown
  extendsMarkdown: (md) => {
    const defaultFence = md.renderer.rules.fence			      // 保存原始的代码块（fence）渲染规则
    // 重写代码块渲染规则
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args														// 解析参数，获取 tokens（标记数组）和当前索引
      const token = tokens[idx]															// 获取当前处理的 token
      // 检查代码块的语言标识是否为 'mermaid'
      if (token.info?.trim() === 'mermaid') {
        const code = encodeURIComponent(token.content)			// 对 mermaid 代码内容进行 URL 编码，防止特殊字符影响 HTML 属性
        return `<MermaidDiagram code="${code}" />`					// 返回自定义的 Vue 组件标签，将编码后的代码作为属性传递
      }
      return defaultFence?.(...args) || ''									// 如果不是 mermaid 代码块，则使用默认的渲染规则
    }
  },

  // 指定客户端配置文件的路径，用于注册全局组件
  clientConfigFile: path.resolve(__dirname, './mermaid.client.ts'),
}

// 导出插件对象，使其可以在配置文件中导入使用
export default mermaidPlugin