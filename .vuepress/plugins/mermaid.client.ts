// .vuepress/plugins/mermaid.client.ts - Mermaid 图表渲染插件客户端部分
// mermaid说明文档: https://mermaid.nodejs.cn/config/usage.html
import { defineClientConfig } from '@vuepress/client'						// 导入 VuePress 客户端配置函数，用于定义客户端增强
import { h, defineComponent } from 'vue'												// 导入 Vue 的 h 函数（用于创建虚拟 DOM 节点）和 defineComponent 函数（用于定义组件）
import mermaid from 'mermaid'                   						  	// 导入 mermaid 库，用于渲染流程图、序列图等图表

// 初始化 mermaid 库配置，这些配置将在客户端执行
mermaid.initialize({
  startOnLoad: false,  			// 页面加载时不自动渲染，由我们手动控制渲染时机
  theme: 'default',    			// 使用默认主题样式
  securityLevel: 'loose' 		// 设置安全级别为宽松，允许更多功能（注意安全风险）
})

// 定义名为 MermaidDiagram 的 Vue 组件
const MermaidDiagram = defineComponent({
  props: ['code'],																							// 定义接收的 prop 属性，用于接收从父组件传递过来的 mermaid 代码
  
	// 组件挂载到 DOM 后执行的异步函数
  async mounted() {
    try {
      const decoded = decodeURIComponent(this.code)							// 解码从 prop 传递过来的编码后的 mermaid 代码
      const id = `mermaid-${Date.now()}`                				// 创建唯一的 ID，避免多个图表之间的冲突
      const { svg } = await mermaid.render(id, decoded)					// 使用 mermaid 库渲染图表，返回 SVG 字符串
      this.$el.innerHTML = svg																	// 将渲染好的 SVG 内容插入到当前组件的 DOM 元素中
    } catch (err) {
      console.error('Mermaid render error:', err)								// 如果渲染过程中出现错误，显示错误信息
      this.$el.innerHTML = '<pre style="color:red">Mermaid 图表渲染失败</pre>'	// 在页面上显示渲染失败的提示信息
    }
  },

  // 定义组件的渲染函数，返回虚拟 DOM 结构
  render() {
    return h('div', { 																					// 返回一个 div 元素作为组件的根元素
      class: 'mermaid-diagram',																	// 添加类名，用于样式化图表		
      style: { textAlign: 'center' }   													// 添加样式使图表居中显示
    })
  },
})

// 导出客户端配置，定义如何增强 VuePress 客户端应用
export default defineClientConfig({
  enhance({ app }) {																						// enhance 函数在 Vue 应用启动时执行，用于注册组件、指令等
    app.component('MermaidDiagram', MermaidDiagram)							// 将 MermaidDiagram 组件注册为全局组件，使其可以在任意 Markdown 文件中使用
  }
})