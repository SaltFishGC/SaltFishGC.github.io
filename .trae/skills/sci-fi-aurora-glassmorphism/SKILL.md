# SKILL: Sci-Fi Aurora Glassmorphism — 科幻极光毛玻璃设计系统

> 适用于 VuePress / Vue 3 / 任意前端框架的暗色优先科幻风格设计系统。
> 本文档可作为 AI 生成类似风格网页的完整参考规范。

***

## 1. 设计哲学

**关键词**：Aurora Borealis × Glassmorphism × CRT Scanline × Holographic Hover

- **暗色优先**：深空背景 + 极光光晕，亮色模式为降级方案
- **毛玻璃层级**：所有浮层使用 `backdrop-filter` 制造深度感
- **动态渐变悬停**：所有可交互元素悬停时触发流动渐变 + 发光阴影
- **微交互**：弹性物理曲线 + 全息光效追踪 + 星空粒子
- **信息密度**：三栏自适应布局，侧边栏按内容收缩，中间文档区填满剩余空间

***

## 2. 色彩系统

### 2.1 主色

| 变量                   | 值                           | 用途        |
| -------------------- | --------------------------- | --------- |
| `--c-accent`         | `#7c6aef`                   | 主色（科技紫）   |
| `--c-accent-light`   | `#9d8df5`                   | 悬停态、渐变中间色 |
| `--c-accent-dark`    | `#6350d9`                   | 按压态、边框    |
| `--c-accent-muted`   | `rgba(124, 106, 239, 0.15)` | 柔和背景      |
| `--c-accent-surface` | `rgba(124, 106, 239, 0.08)` | 极淡背景      |

### 2.2 亮色模式

| 变量                   | 值         | 用途      |
| -------------------- | --------- | ------- |
| `--bg-canvas`        | `#f8f8fb` | 页面底色    |
| `--bg-surface`       | `#ffffff` | 卡片/面板底色 |
| `--bg-elevated`      | `#f1f1f5` | 浮起层底色   |
| `--c-text-primary`   | `#18181b` | 标题文字    |
| `--c-text-secondary` | `#52525b` | 正文文字    |
| `--c-text-muted`     | `#a1a1aa` | 辅助文字    |

### 2.3 暗色模式

| 变量                   | 值         | 用途      |
| -------------------- | --------- | ------- |
| `--bg-canvas`        | `#08080f` | 深空底色    |
| `--bg-surface`       | `#111119` | 卡片/面板底色 |
| `--bg-elevated`      | `#1a1a24` | 浮起层底色   |
| `--c-text-primary`   | `#eaeaf0` | 标题文字    |
| `--c-text-secondary` | `#8b8b9e` | 正文文字    |
| `--c-text-muted`     | `#5c5c70` | 辅助文字    |

### 2.4 极光色

| 变量           | 值                           | 色相 |
| ------------ | --------------------------- | -- |
| `--aurora-1` | `rgba(124, 106, 239, 0.35)` | 紫  |
| `--aurora-2` | `rgba(34, 180, 200, 0.25)`  | 青  |
| `--aurora-3` | `rgba(60, 100, 220, 0.20)`  | 蓝  |
| `--aurora-4` | `rgba(180, 60, 140, 0.15)`  | 粉  |
| `--aurora-5` | `rgba(50, 180, 100, 0.10)`  | 绿  |

### 2.5 渐变公式

所有悬停渐变统一使用 5 色循环：

```css
linear-gradient(90deg, var(--c-accent), var(--c-accent-light), #22b4c8, var(--c-accent-light), var(--c-accent))
background-size: 200% 100%
animation: gradient-flow 2s ease infinite
```

***

## 3. 字体系统

| 变量               | 值                                                                      | 用途   |
| ---------------- | ---------------------------------------------------------------------- | ---- |
| `--font-display` | `'Geist', 'SF Pro Display', 'PingFang SC', sans-serif`                 | 标题   |
| `--font-body`    | `'Geist', 'SF Pro Text', 'PingFang SC', 'Microsoft YaHei', sans-serif` | 正文   |
| `--font-mono`    | `'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace`   | 代码   |
| `--font-chinese` | `'LXGW WenKai', 'PingFang SC', 'Microsoft YaHei', serif`               | 中文装饰 |

### 字号

| 变量            | 值                              | 用途    |
| ------------- | ------------------------------ | ----- |
| `--t-display` | `clamp(2.25rem, 5vw, 3.75rem)` | 首屏大标题 |
| `--t-h1`      | `clamp(1.75rem, 3vw, 2.25rem)` | 一级标题  |
| `--t-h2`      | `1.5rem`                       | 二级标题  |
| `--t-h3`      | `1.25rem`                      | 三级标题  |
| `--t-body`    | `1rem`                         | 正文    |
| `--t-caption` | `0.8125rem`                    | 辅助文字  |
| `--t-mono`    | `0.875rem`                     | 代码    |

> **Google Fonts 引用**：Geist 字体在 Google Fonts 中的名称是 `'Geist'`（不是 `'Geist Sans'`）。

***

## 4. 间距与圆角

### 间距

```css
--space-1: 0.25rem;   --space-2: 0.5rem;   --space-3: 0.75rem;
--space-4: 1rem;      --space-5: 1.25rem;  --space-6: 1.5rem;
--space-8: 2rem;      --space-10: 2.5rem;  --space-12: 3rem;
--space-16: 4rem;     --space-20: 5rem;    --space-24: 6rem;
```

### 圆角

```css
--radius-sm: 6px;     --radius-md: 10px;   --radius-lg: 16px;
--radius-xl: 24px;    --radius-2xl: 32px;  --radius-full: 9999px;
```

***

## 5. 动效系统

### 缓动曲线

| 变量                | 值                                      | 用途   |
| ----------------- | -------------------------------------- | ---- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)`        | 通用出场 |
| `--ease-spring`   | `cubic-bezier(0.34, 1.56, 0.64, 1)`    | 弹性回弹 |
| `--ease-magnetic` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 磁性吸附 |

### 时长

| 变量                   | 值       | 用途   |
| -------------------- | ------- | ---- |
| `--duration-instant` | `100ms` | 即时反馈 |
| `--duration-fast`    | `200ms` | 悬停变色 |
| `--duration-normal`  | `350ms` | 通用过渡 |
| `--duration-slow`    | `500ms` | 页面入场 |
| `--duration-slower`  | `800ms` | 大动画  |

### 关键帧

```css
/* 渐变流动 — 所有悬停效果的核心 */
@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 极光漂移 — 背景光晕 */
@keyframes aurora-drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(-3%, 2%) scale(1.03); }
  66%  { transform: translate(2%, -3%) scale(0.98); }
  100% { transform: translate(-5%, 5%) scale(1.05); }
}

/* 星空闪烁 */
@keyframes twinkle {
  0%   { opacity: 1; }
  100% { opacity: 0.4; }
}

/* 页面入场 */
@keyframes page-in {
  from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* 故障文字 */
@keyframes glitch-1 {
  0%, 92% { transform: translate(0); }
  93% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  95% { transform: translate(-1px, 2px); }
  96%, 100% { transform: translate(0); }
}
```

***

## 6. 核心视觉层

### 6.1 极光背景（Aurora Background）

```css
.aurora-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background: var(--bg-canvas);
  pointer-events: none;
}

/* 主光晕层 */
.aurora-background::before {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 25% 60%, var(--aurora-1) 0, transparent 55%),
    radial-gradient(ellipse at 75% 40%, var(--aurora-2) 0, transparent 55%),
    radial-gradient(ellipse at 50% 80%, var(--aurora-3) 0, transparent 55%),
    radial-gradient(ellipse at 80% 70%, var(--aurora-4) 0, transparent 50%);
  animation: aurora-drift 8s ease infinite alternate;
  filter: blur(60px);
}

/* 副光晕层（反向运动） */
.aurora-background::after {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 60% 30%, var(--aurora-5) 0, transparent 50%),
    radial-gradient(ellipse at 30% 70%, var(--aurora-1) 0, transparent 55%);
  animation: aurora-drift-reverse 12s ease infinite alternate;
  filter: blur(80px);
}
```

### 6.2 星空粒子（Starfield）

```css
.starfield::before,
.starfield::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(234,234,240,0.6) 0, transparent 100%),
    radial-gradient(1px 1px at 30% 65%, rgba(124,106,239,0.5) 0, transparent 100%),
    radial-gradient(1.5px 1.5px at 50% 10%, rgba(234,234,240,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 70% 40%, rgba(34,180,200,0.4) 0, transparent 100%);
  animation: twinkle 4s ease-in-out infinite alternate;
}
```

### 6.3 噪点纹理（Grain Overlay）

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,...feTurbulence...");
}
```

### 6.4 鼠标光晕（Cursor Glow）

```css
.cursor-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(124, 106, 239, 0.08) 0%,
    rgba(34, 180, 200, 0.04) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
  transform: translate(-50%, -50%);
  filter: blur(30px);
  will-change: left, top;
}

/* 触屏设备隐藏 */
@media (pointer: coarse) {
  .cursor-glow { display: none; }
}
```

***

## 7. 毛玻璃组件

### 7.1 导航栏

```css
.navbar-container {
  background: var(--bg-overlay) !important;
  backdrop-filter: blur(20px) saturate(200%);
  border-bottom: 1px solid var(--c-border-default);
  box-shadow: var(--shadow-sm);
}

/* 滚动后边框变为强调色 */
.navbar-container.scrolled {
  border-bottom-color: var(--c-border-accent);
}
```

### 7.2 文档内容区

```css
.page-content {
  background: rgba(248, 248, 251, 0.7);      /* 亮色：70% 不透明白 */
  backdrop-filter: blur(16px) saturate(150%);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5);
}

/* 暗色模式 */
html[data-theme="dark"] .page-content {
  background: rgba(17, 17, 25, 0.6);          /* 暗色：60% 不透明深色 */
  border-color: rgba(124, 106, 239, 0.08);
  box-shadow: 0 2px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
}
```

### 7.3 Mermaid 图表容器

```css
.glass-mermaid {
  margin: var(--space-8) 0;
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--c-border-default);
  background: var(--c-fill-subtle);
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.04);
}

.glass-mermaid:hover {
  border-color: var(--c-border-accent);
  box-shadow: var(--shadow-md), var(--shadow-accent);
}
```

***

## 8. 悬停效果规范

### 8.1 流动渐变文字（通用悬停）

所有可交互文字悬停时统一使用：

```css
:hover {
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-light), #22b4c8, var(--c-accent-light), var(--c-accent));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 2s ease infinite;
  filter: drop-shadow(0 0 8px rgba(124, 106, 239, 0.25));
}
```

**适用组件**：文档链接、导航链接、侧边栏链接、目录条目、卡片标题、标签链接

### 8.2 选中/激活态（静态强调）

选中状态使用静态强调色 + 结构性装饰，**不做动画**：

| 组件    | 选中样式                                                                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| 文档链接  | `color: var(--c-accent)` + `border-bottom: 1px solid var(--c-accent)`                                                            |
| 导航链接  | `color: var(--c-accent)` + `border-bottom: 2px solid var(--c-accent)`                                                            |
| 侧边栏链接 | `color: var(--c-accent)` + `font-weight: 600` + `border-left: 2px solid var(--c-accent)` + `background: var(--c-accent-surface)` |
| 目录条目  | `color: var(--c-accent)` + `font-weight: 600` + 圆点指示器变色                                                                          |

### 8.3 卡片全息光效

```css
/* 光效层 */
.magic-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    300px circle at var(--x) var(--y),
    rgba(124, 106, 239, 0.40) 0%,
    rgba(34, 180, 200, 0.18) 35%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.magic-card:hover::before { opacity: 1; }

/* 悬停变换 */
.magic-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 16px 48px rgba(124,106,239,0.15), 0 0 0 1px rgba(124,106,239,0.12);
}
```

**JS 鼠标追踪**（设置 `--x` / `--y` CSS 变量）：

```js
container.addEventListener('mousemove', (e) => {
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--y', `${e.clientY - rect.top}px`)
  })
})
```

**z-index 层级**（防止内容被遮盖）：

```
z-index: 2  →  内容子元素
z-index: 1  →  ::before（全息光效）
z-index: 0  →  .magic-card__bg（背景层）
```

### 8.4 其他悬停效果

| 组件    | 效果                                                                                           |
| ----- | -------------------------------------------------------------------------------------------- |
| 代码块   | `border-color: var(--c-border-accent)` + `box-shadow: 0 0 16px rgba(124,106,239,0.06)`       |
| 引用块   | `border-left-color: var(--c-accent-light)` + `box-shadow: -3px 0 12px rgba(124,106,239,0.1)` |
| 表格行   | `background-color: var(--c-accent-surface)`                                                  |
| 按钮    | `translateY(-2px)` + `box-shadow: 0 0 20px rgba(124,106,239,0.3)`                            |
| 侧边栏箭头 | `transform` 弹性动画                                                                             |
| 社交图标  | `filter: drop-shadow(0 0 8px rgba(124,106,239,0.30))`                                        |

***

## 9. 布局系统

### 9.1 三栏自适应布局

```
┌──────────────────────────────────────────────────────────┐
│  .navbar-container (全宽, backdrop-filter)               │
├──────────┬───────────────────────────────────┬───────────┤
│  series  │         .page-container            │  catalog  │
│ (sticky, │  ┌─────────────────────────────┐  │ (sticky,  │
│  auto,   │  │     .page-content            │  │  auto,    │
│  ≤280px) │  │  (flex: 1, 毛玻璃背景)       │  │  ≤240px)  │
│          │  │                               │  │           │
│          │  └─────────────────────────────┘  │           │
├──────────┴───────────────────────────────────┴───────────┤
│  .aurora-background (fixed, z-index: -2)                  │
│  .starfield (fixed, z-index: -1)                          │
│  .grain-overlay (fixed, z-index: 9999)                    │
└──────────────────────────────────────────────────────────┘
```

### 9.2 关键布局规则

```css
/* 移除框架默认的 max-width 限制 */
.theme-main {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
}

/* 侧边栏自适应宽度 */
.series-container {
  width: auto !important;
  min-width: 0 !important;
  max-width: 280px !important;
  position: sticky !important;
  top: 4rem !important;  /* navbar 高度 */
  height: calc(100vh - 4rem - var(--space-8)) !important;
}

/* 文档区填满剩余空间 */
.page-content {
  flex: 1 1 0% !important;
  min-width: 400px !important;
  max-width: none !important;
}

/* 内容区全宽填充 */
.theme-reco-md-content {
  max-width: 100% !important;
  width: 100% !important;
  margin: 0 !important;
}
```

### 9.3 响应式断点

| 断点        | 调整                                                                                |
| --------- | --------------------------------------------------------------------------------- |
| `≤1280px` | `.page-content` min-width 降至 320px，margin/padding 缩小                              |
| `≤768px`  | `.series-container` 变为 fixed 抽屉（`translateX(-100%)`），`.page-content` min-width 归零 |

***

## 10. 滚动条

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.18);           /* 亮色 */
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.32); }

/* 暗色模式 */
html[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: rgba(234, 234, 240, 0.25);
}
html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(234, 234, 240, 0.42);
}

/* Firefox */
* { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.18) transparent; }
```

***

## 11. Mermaid 图表主题

### 11.1 亮色模式

```js
{
  theme: 'base',
  themeVariables: {
    primaryColor: '#7c6aef',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#6350d9',
    nodeBkg: '#7c6aef',
    nodeBorder: '#6350d9',
    nodeTextColor: '#ffffff',
    lineColor: '#9d8df5',
    arrowheadColor: '#6350d9',
    clusterBkg: 'rgba(124, 106, 239, 0.06)',
    clusterBorder: 'rgba(124, 106, 239, 0.20)',
    titleColor: '#18181b',
    textColor: '#18181b',
    fontFamily: '"Geist", "SF Pro Text", "PingFang SC", sans-serif',
    fontSize: '14px',
    cScale0: '#7c6aef', cScale1: '#22b4c8', cScale2: '#3c64dc',
    cScale3: '#b43c8c', cScale4: '#32b464', cScale5: '#dc6432',
  },
  themeCSS: `
    .node rect, .node circle { rx: 10; ry: 10; transition: filter 0.3s ease; }
    .node:hover rect { filter: drop-shadow(0 4px 16px rgba(124,106,239,0.20)); stroke-width: 2px; }
    .cluster rect { rx: 14; ry: 14; }
    .edgePath .path { stroke-width: 1.8px; }
  `,
}
```

### 11.2 暗色模式

```js
{
  themeVariables: {
    nodeBkg: '#7c6aef',           // 实色填充（半透明在暗色背景上文字不可见）
    nodeTextColor: '#ffffff',     // 纯白
    titleColor: '#ffffff',
    textColor: '#e0e0e8',
    clusterBkg: 'rgba(124, 106, 239, 0.08)',
    clusterBorder: 'rgba(157, 141, 245, 0.25)',
  },
  themeCSS: `
    .node rect { filter: drop-shadow(0 0 8px rgba(124,106,239,0.18)); }
    .node:hover rect { filter: drop-shadow(0 0 20px rgba(124,106,239,0.35)); stroke: #b4a8ff; }
    .cluster rect { stroke-dasharray: 6 3; }
    .edgePath .path { filter: drop-shadow(0 0 4px rgba(124,106,239,0.12)); }
  `,
}
```

### 11.3 Mermaid 语法注意

特殊字符必须用双引号包裹：

```mermaid
A -->|"@AiService 代理"| B     ✅
A -->|@AiService 代理| B       ❌  (@ 是特殊字符)
A -->|"IP:8080"| B              ✅
A -->|IP:8080| B                ❌  (: 是特殊字符)
```

***

## 12. 主页特效

### 12.1 极光光晕

```css
.banner-brand__wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 20% 50%, rgba(124,106,239,0.15) 0%, transparent 100%),
    radial-gradient(ellipse 500px 350px at 80% 30%, rgba(34,180,200,0.12) 0%, transparent 100%),
    radial-gradient(ellipse 400px 300px at 50% 80%, rgba(180,60,140,0.08) 0%, transparent 100%);
  animation: home-aurora 10s ease-in-out infinite alternate;
}
```

### 12.2 CRT 扫描线

```css
.banner-brand__wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(124, 106, 239, 0.03) 2px,
    rgba(124, 106, 239, 0.03) 4px
  );
}
```

### 12.3 标题流动渐变

```css
.banner-brand__content .title {
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-light), #22b4c8, var(--c-accent-light), var(--c-accent));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-flow 4s ease infinite;
  filter: drop-shadow(0 0 20px rgba(124,106,239,0.20));
}
```

***

## 13. 阅读进度条

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-light));
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
  pointer-events: none;
}
```

JS 实现：监听 `scroll` 事件，更新 `scaleX(0~1)`。

***

## 14. 技术栈参考

| 技术                        | 版本             | 用途     |
| ------------------------- | -------------- | ------ |
| VuePress                  | 2.0.0-rc.19    | 静态站点生成 |
| vuepress-theme-reco       | 2.0.0-rc.26    | 博客主题   |
| Vue                       | ^3.4.21        | 前端框架   |
| Vite                      | 最新             | 构建工具   |
| GSAP + ScrollTrigger      | 最新             | 滚动动画   |
| Mermaid                   | ^11            | 图表渲染   |
| Tailwind CSS              | 3.4.4（reco 内置） | 工具类样式  |
| Google Fonts: Geist       | —              | 英文字体   |
| Google Fonts: Geist Mono  | —              | 等宽字体   |
| Google Fonts: LXGW WenKai | —              | 中文字体   |

***

## 15. 文件结构

```
.vuepress/
├── styles/
│   ├── index.css           # 入口：@import 所有子文件
│   ├── variables.css       # CSS 变量：色彩、字体、间距、圆角、动效
│   ├── typography.css      # 排版：标题、正文、代码、引用
│   ├── layout.css          # 布局：三栏自适应、navbar、侧边栏
│   ├── aurora.css          # 极光背景、星空粒子、噪点纹理
│   ├── glassmorphism.css   # 毛玻璃组件：.glass-card, .glass-navbar
│   ├── animations.css      # 关键帧、滚动揭示、故障文字、进度条
│   ├── components.css      # 组件覆盖：导航、卡片、链接、侧边栏、Mermaid
│   └── scrollbar.css       # 自定义滚动条
├── components/
│   ├── AuroraBackground.vue
│   ├── GrainOverlay.vue
│   ├── CursorGlow.vue
│   └── ReadingProgress.vue
├── plugins/
│   ├── mermaid.ts          # Mermaid 插件注册
│   └── mermaid.client.ts   # Mermaid 组件（双主题 + 错误提示）
├── client.ts               # 客户端增强（GSAP、Series 状态、鼠标追踪）
└── config.ts               # VuePress 配置
scripts/
└── generate-series.mjs     # 自动生成 series 配置
```

***

## 16. 可提升空间

### P0 — 体验关键

1. **Series 侧边栏状态持久化**：当前使用命令式 DOM 操作 + `requestAnimationFrame` 重试，存在时序竞争。理想方案是 fork reco 的 `SeriesItem` 组件，改用 Vue 响应式管理折叠状态。
2. **构建兼容性**：当前 Node 18 与 `marked@16`（gsap 的依赖）存在兼容问题。建议升级到 Node 20+ 或锁定 `marked` 版本。
3. **Mermaid 错误恢复**：当前语法错误的 mermaid 块只显示错误提示，无法自动修复。可以添加预处理步骤，自动给 edge label 中的特殊字符加引号。

### P1 — 视觉增强

1. **页面切换动画**：当前只有 `page-in`/`page-out` 关键帧，没有实际使用。可以用 Vue `<Transition>` 实现页面切换时的模糊淡入淡出。
2. **暗色模式过渡**：切换暗色/亮色模式时没有过渡动画，瞬间切换。可以给 `html` 添加 `transition: background-color 0.3s, color 0.3s`。
3. **代码块增强**：添加行号、语言标签、一键复制按钮。当前代码块只有基础样式。
4. **图片查看器**：点击图片弹出全屏查看，带缩放和拖拽。当前点击图片无反应。
5. **搜索框样式**：reco 自带的搜索框没有适配毛玻璃风格，视觉上与整体不协调。

### P2 — 交互优化

1. **Series 侧边栏搜索**：当目录层级很深时，添加搜索/过滤功能。
2. **目录高亮跟随滚动**：右侧目录的 active 状态跟随滚动位置自动更新（当前只在点击时更新）。
3. **键盘导航**：添加 `skip-to-content` 快捷键、侧边栏键盘展开/收起。
4. **移动端手势**：侧边栏抽屉添加滑动手势关闭。

### P3 — 工程化

1. **CSS 变量类型安全**：使用 PostCSS 插件或 Stylelint 检查 CSS 变量引用是否存在。
2. **构建时 Mermaid 语法检查**：在 `generate-series.mjs` 之外，添加 CI 步骤检查所有 mermaid 代码块的语法正确性。
3. **性能监控**：`backdrop-filter` 在低端设备上性能差，可以添加 `@supports` 降级 + `prefers-reduced-motion` 检测。
4. **自动 series 配置的** **`_series.json`**：当前支持自定义显示名和排序，但文档缺失。需要补充使用说明。

***

## 17. 禁止清单

以下是从踩坑中总结的禁止事项：

| 禁止                         | 原因                                                            |
| -------------------------- | ------------------------------------------------------------- |
| 禁止 `#000000` 纯黑            | 暗色模式下与背景无层次感                                                  |
| 禁止 `Inter` 字体              | 过于通用，缺乏辨识度                                                    |
| 禁止 `max-width: 72ch` 在容器级  | 会阻止内容动态伸缩                                                     |
| 禁止 `z-index: 1` 在内容层       | 会被 `::before` 光效层遮盖                                           |
| 禁止 Mermaid edge label 不加引号 | `@` `:` `+` `=` `>` 等特殊字符会导致解析失败                              |
| 禁止多个 `defineClientConfig`  | VuePress 只允许一个客户端配置                                           |
| 禁止 reco 的 `.home` 类作为样式依赖  | `home: true` 不会自动添加 `.home` 类，需用 `pageClass: home` 或 `:has()` |
| 禁止 `p { max-width: 72ch }` | 会把段落锁死在固定宽度，阻止动态伸缩                                            |

