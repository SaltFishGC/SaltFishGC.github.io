# 样式优化解决方案

> 基于当前 VuePress theme-reco 实际布局结构和组件机制
> 所有方案已实施完成 ✅

***

## 问题 1: 文档页三栏布局 — 侧边栏应自适应宽度 ✅

### 现状分析

reco 主题的三栏布局 DOM 结构:

```
.theme-main (flex row, max-width: 1280px)
  ├── .series-container (左: w-64 = 256px 固定宽度)
  └── .page-container (flex row, flex-1)
        ├── .page-content (中: flex-1)
        └── .page-catalog-container (右: w-60 = 240px 固定宽度)
```

当前问题: 左右两个侧边栏使用 Tailwind 固定宽度 (`w-64` / `w-60`)，不会根据内容自适应，中间区域无法获得最大空间。

### 实施方案

在 `layout.css` 中覆盖 reco 的固定宽度，改为 `width: auto` + `flex-shrink: 0`:

```css
.theme-container .theme-main .series-container {
  width: auto !important;
  min-width: 180px;
  max-width: 280px;
  flex-shrink: 0;
  flex-grow: 0;
}

.theme-container .theme-main .page-container {
  flex: 1 1 0%;
  min-width: 0;
}

.theme-container .theme-main .page-container .page-catalog-container {
  width: auto !important;
  min-width: 140px;
  max-width: 220px;
  flex-shrink: 0;
  flex-grow: 0;
}

.theme-container .theme-main .page-container .page-content {
  flex: 1 1 0%;
  min-width: 0;
  overflow-wrap: break-word;
}
```

**原理**:
- `width: auto` — 侧边栏宽度由内容决定，内容多则宽，内容少则窄
- `min-width` — 保证最小可读宽度
- `max-width` — 防止侧边栏过宽挤压中间内容
- `flex-shrink: 0` + `flex-grow: 0` — 防止 flex 布局压缩或拉伸侧边栏
- 中间 `.page-content` 保持 `flex-1`，自动填满剩余空间
- 移动端回退为固定 256px 宽度

**修改文件**: `.vuepress/styles/layout.css`

***

## 问题 2: 悬停效果不够炫 — 全组件酷炫悬停升级 ✅

### 实施方案

#### 2.1 卡片 — 全息光效追踪

卡片添加 `::before` 伪元素，使用 `radial-gradient` 跟随鼠标位置产生全息光效。通过 CSS 自定义属性 `--mouse-x` / `--mouse-y` 控制光点位置，JS 在 `client.ts` 中追踪鼠标移动并更新属性值。

```css
.theme-container .card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(124, 106, 239, 0.12),
    transparent 40%
  );
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out-expo);
  pointer-events: none;
  z-index: 1;
}

.theme-container .card:hover::before {
  opacity: 1;
}
```

JS 鼠标追踪 (client.ts):
```typescript
function initCardMouseTracking() {
  const container = document.querySelector('.theme-container')
  container.addEventListener('mousemove', (e) => {
    const cards = container.querySelectorAll<HTMLElement>('.card')
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    })
  })
}
```

#### 2.2 导航栏链接 — 底部光条滑入 + 文字发光

```css
.theme-container .navbar-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out-expo),
              left var(--duration-normal) var(--ease-out-expo);
}

.theme-container .navbar-links a:hover::after {
  width: 100%;
  left: 0;
}

.theme-container .navbar-links a:hover {
  text-shadow: 0 0 12px var(--c-accent-muted);
}
```

#### 2.3 侧边栏条目 — 滑入高亮 + 箭头动画

```css
.theme-container .series-container .series-heading:hover {
  color: var(--c-accent) !important;
  background-color: var(--c-accent-surface);
}

.theme-container .series-container .series-heading .arrow {
  transition: transform var(--duration-normal) var(--ease-spring);
}

.theme-container .series-container a.series-item:hover {
  color: var(--c-accent) !important;
  transform: translateX(4px);
}
```

#### 2.4 目录条目 — 悬停位移

```css
.theme-container .page-catalog-container .page-catalog-menu-depth_2:hover,
.theme-container .page-catalog-container .page-catalog-menu-depth_3:hover {
  transform: translateX(2px);
}
```

#### 2.5 按钮 — 发光阴影

```css
.btn-primary:hover {
  box-shadow: 0 0 20px rgba(124, 106, 239, 0.3), 0 0 40px rgba(124, 106, 239, 0.1);
}

.btn-ghost:hover {
  box-shadow: 0 0 16px rgba(124, 106, 239, 0.08);
}
```

#### 2.6 代码块 — 边框发光

```css
.theme-container .theme-reco-md-content div[class*="language-"]:hover {
  border-color: var(--c-border-accent);
  box-shadow: 0 0 16px rgba(124, 106, 239, 0.06);
}
```

#### 2.7 引用块 — 左侧光条变亮

```css
.theme-container .theme-reco-md-content blockquote:hover {
  border-left-color: var(--c-accent-light) !important;
  box-shadow: -3px 0 12px rgba(124, 106, 239, 0.1);
}
```

#### 2.8 表格行 — 悬停高亮

```css
.theme-container .theme-reco-md-content table tbody tr:hover {
  background-color: var(--c-accent-surface) !important;
}
```

**修改文件**: `.vuepress/styles/components.css` + `.vuepress/client.ts`

***

## 问题 3: 滚动条不够明显 ✅

### 实施方案

提升滚动条对比度，同时添加 Firefox `scrollbar-width` / `scrollbar-color` 支持:

```css
/* 亮色模式 */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.18);      /* 原 0.06 → 0.18 */
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.32);      /* 原 0.14 → 0.32 */
}

/* 暗色模式 */
html[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: rgba(234, 234, 240, 0.25); /* 原 0.12 → 0.25 */
}

html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 234, 240, 0.42); /* 原 0.22 → 0.42 */
}

/* Firefox 支持 */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.18) transparent;
}
```

**修改文件**: `.vuepress/styles/scrollbar.css`

***

## 问题 4: Mermaid 渲染不够炫酷 ✅

### 实施方案

#### 4.1 Mermaid 主题跟随暗色模式

重写 `mermaid.client.ts`，使用 `theme: 'base'` + 自定义 `themeVariables`，根据 `html[data-theme]` 属性动态切换亮/暗主题。主题变量与项目色彩系统统一（`#7c6aef` 主色、`#111119` 暗色背景等）。

关键改动:
- `theme: 'base'` — 使用基础主题，完全自定义颜色
- 亮色主题: 白色背景、深色文字、紫色节点
- 暗色主题: 深色背景、浅色文字、紫色节点 + 半透明集群

#### 4.2 Mermaid 容器样式 — 玻璃拟态卡片

```css
.glass-mermaid {
  margin: var(--space-6) 0;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-default);
  background: var(--c-fill-subtle);
  backdrop-filter: blur(12px) saturate(160%);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow-x: auto;
  text-align: center;
}

.glass-mermaid:hover {
  border-color: var(--c-border-accent);
  box-shadow: var(--shadow-md), var(--shadow-accent);
}
```

**修改文件**: `.vuepress/plugins/mermaid.client.ts` + `.vuepress/styles/components.css`

***

## 问题 5: Series 侧边栏展开/收起状态每次导航都重置 ✅

### 根因分析

reco 主题的 SeriesItem 组件 (函数式组件) 存在根本缺陷:

1. **`useSeriesItems()` 的 `computed` 依赖 `route`** — 每次路由变化时，`resolveArraySeriesItems()` 通过 `{ ...item }` 创建全新对象，`collapsible` 属性丢失
2. **`togglecollapsible()` 使用命令式 DOM 操作** — 直接操作 `classList` 和 `style.display`，绕过 Vue 响应式
3. **默认展开** — `collapsible` 属性缺失时，`renderChildren` 默认 `display: block`

结果: 每次导航后所有目录恢复为展开状态，已折叠的目录被强制展开，滚动条跳到顶部。

### 实施方案: 模块级 Map + MutationObserver + 事件委托

在 `client.ts` 中实现状态持久化:

1. **模块级 `Map<string, boolean>`** — 以 `L1:目录文字` 为 key 存储折叠状态，跨导航持久化
2. **事件委托捕获点击** — 在 `.series-container` 上用捕获阶段监听点击，点击 `.series-heading.series-level-1` 时记录当前折叠状态到 Map
3. **`router.afterEach` + `setTimeout`** — 导航完成后延迟 100ms 重新应用折叠状态
4. **`MutationObserver`** — 监听 `.series-container` 的 DOM 变化，自动重新应用折叠状态

```typescript
const seriesCollapsedState = new Map<string, boolean>()

function applySeriesCollapsedState() {
  const seriesContainer = document.querySelector('.series-container')
  if (!seriesContainer) return

  const headings = seriesContainer.querySelectorAll('.series-heading.series-level-1')
  headings.forEach((heading) => {
    const key = getSeriesItemKey(heading)
    if (seriesCollapsedState.get(key) === true) {
      const arrow = heading.querySelector('.arrow')
      const childrenList = heading.nextElementSibling
      if (arrow && childrenList) {
        arrow.classList.remove('down')
        arrow.classList.add('right')
        ;(childrenList as HTMLElement).style.display = 'none'
      }
    }
  })
}

function captureSeriesToggleState() {
  // 遍历所有 series-heading，读取当前 arrow 状态写入 Map
}
```

**修改文件**: `.vuepress/client.ts`

***

## 问题 6: config.ts 中 series 配置过于冗长 — 自动从文件目录生成 ✅

### 实施方案: 构建时脚本

创建 `scripts/generate-series.mjs`，在每次 dev/build 前自动读取 `docs/` 目录结构生成 JSON:

**特性**:
- 递归扫描 `docs/` 目录，目录 → 子分组，`.md` 文件 → 叶子节点
- 自然排序: 数字前缀按数值排序（`1.xxx` < `2.xxx` < `10.xxx`），中文按拼音排序
- 支持 `_series.json` 自定义: 每个目录可放置 `_series.json` 文件，包含 `names`（显示名映射）和 `order`（排序覆盖）
- 输出 `.vuepress/auto-series.json`，config.ts 直接导入

**`_series.json` 格式** (可选):
```json
{
  "names": {
    "wx": "仿wx",
    "常用命令": "常用命令速查"
  },
  "order": ["wx", "Redis专项", "SpingCloud", "langchain4j", "测试", "若智idea"]
}
```

**package.json 脚本**:
```json
{
  "scripts": {
    "gen:series": "node scripts/generate-series.mjs",
    "dev": "npm run gen:series && vuepress dev .",
    "start": "npm run gen:series && vuepress dev .",
    "build": "npm run gen:series && vuepress build ."
  }
}
```

**config.ts 变更**:
```typescript
import autoSeries from './auto-series.json'
// ...
series: autoSeries,  // 替换 200+ 行手动配置
```

**修改文件**: `scripts/generate-series.mjs` (新建) + `.vuepress/auto-series.json` (生成) + `.vuepress/config.ts` + `package.json`

***

## 实施总览

| 问题 | 状态 | 修改文件 | 复杂度 |
| --- | --- | --- | --- |
| 三栏布局自适应 | ✅ | layout.css | 低 |
| 滚动条可见度 | ✅ | scrollbar.css | 低 |
| 自动生成 series | ✅ | scripts/generate-series.mjs + config.ts + package.json + auto-series.json | 中 |
| Mermaid 主题+容器 | ✅ | mermaid.client.ts + components.css | 中 |
| 全组件酷炫悬停 | ✅ | components.css + client.ts | 中 |
| Series 状态持久化 | ✅ | client.ts | 高 |
