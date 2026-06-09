import { defineStore } from 'pinia'

/**
 * Series 侧边栏状态管理
 *
 * 用 Pinia 替代之前的 module-level Map + 命令式 DOM 操作
 * 优势：
 * - Vue DevTools 可视化调试
 * - 响应式状态，组件可直接绑定
 * - 持久化扩展方便（pinia-plugin-persistedstate）
 */
export const useSeriesStore = defineStore('series', {
  state: () => ({
    /** 每个目录项的折叠状态，key = "L1:目录名" */
    collapsed: {} as Record<string, boolean>,
    /** 是否从其他页面进入 series（跨页导航标记） */
    isCrossPageNavigation: false,
    /** 当前是否在 series 页面 */
    isOnSeriesPage: false,
  }),

  getters: {
    /** 获取某个目录项是否折叠 */
    isCollapsed: (state) => (key: string) => state.collapsed[key] === true,

    /** 是否有记录的状态（区分首次进入和已有操作） */
    hasState: (state) => Object.keys(state.collapsed).length > 0,
  },

  actions: {
    /** 设置某个目录项的折叠状态 */
    setCollapsed(key: string, value: boolean) {
      this.collapsed[key] = value
    },

    /** 批量设置折叠状态 */
    setCollapsedAll(stateMap: Record<string, boolean>) {
      this.collapsed = { ...stateMap }
    },

    /** 清空所有状态（跨页导航时调用） */
    clearState() {
      this.collapsed = {}
      this.isCrossPageNavigation = true
    },

    /** 标记进入 series 页面 */
    enterSeriesPage() {
      this.isOnSeriesPage = true
    },

    /** 标记离开 series 页面 */
    leaveSeriesPage() {
      this.isOnSeriesPage = false
      this.isCrossPageNavigation = false
    },

    /** 标记跨页导航完成 */
    clearCrossPageFlag() {
      this.isCrossPageNavigation = false
    },
  },
})
