# SaltFishGC Blog 样式重构方案 v2

> 设计哲学: 深渊极光 x 双层玻璃 x 弹簧物理
>
> 基于 14 份前端 Skill 规则 + VuePress theme-reco 实际约束优化

***

## 0. Skill 规则合规声明

本方案严格遵循以下 Skill 的强制规则:

| Skill                      | 核心约束                                | 本方案合规点                         |
| -------------------------- | ----------------------------------- | ------------------------------ |
| high-end-visual-design     | Double-Bezel架构、自定义cubic-bezier、磁性悬停 | 卡片双层嵌套、弹簧曲线、按钮磁性效果             |
| design-taste-frontend      | Three Dials(8/6/4)、LILA规则、色彩一致性锁    | 非对称布局、单强调色、统一灰调家族              |
| gpt-taste                  | AIDA结构、无缝Bento网格、GSAP ScrollTrigger | 首页AIDA叙事、grid-flow:dense、滚动编排  |
| imagegen-frontend-web      | 每节一图、Hero极简、组合变化引擎                  | Hero 1-3行标题、节节奏变化              |
| redesign-existing-projects | 扫描-诊断-修复、修复优先级顺序                    | 按字体-色板-交互-布局-组件-状态-打磨顺序        |
| minimalist-ui              | 禁Inter/Roboto、柔和粉彩强调、便当盒网格          | Geist字体、去饱和强调色、Bento布局         |
| industrial-brutalist-ui    | 刚性网格、极端排版对比、1px分隔线                  | CSS Grid骨架、Display vs Body极端对比 |
| stitch-design-taste        | 1强调色<80%饱和、弹簧物理、交错级联                | 单强调色、cubic-bezier弹簧、stagger入场  |
| brandkit                   | 品牌隐喻、色彩纪律、极少文本                      | 深渊极光隐喻、受控色板、精简文案               |
| full-output-enforcement    | 完整输出、禁止省略号占位                        | 实施时每个文件完整输出                    |

### 全局禁止清单

- 字体: Inter / Roboto / Open Sans / 通用系统衬线
- 颜色: 纯黑 #000000 / AI紫蓝渐变(作为默认) / 过饱和强调色(>80%) / 混合冷暖灰 / 彩虹渐变
- 布局: 3等宽卡片行 / 居中Hero(高variance) / h-screen / flexbox百分比计算 / 嵌套卡片地狱
- 动效: 动画top/left/width/height / 线性缓动 / 圆形旋转加载器
- 内容: Emoji(在UI文本中) / AI文案陈词 / 通用名 / 假圆数 / Lorem Ipsum
- UI: 霓虹外发光(作为默认) / 自定义光标 / Unsplash链接 / shadcn/ui默认样式

### 全局必须清单

- 字体: Geist Sans / Satoshi / Cabinet Grotesk + Geist Mono / JetBrains Mono
- 颜色: Off-Black(Zinc-950) / 1个强调色(<80%饱和) / 一致灰调家族
- 布局: CSS Grid / min-height: 100dvh / max-width容器(1200-1440px) / 非对称Hero
- 动效: 弹簧物理(stiffness:100,damping:20) / 仅transform+opacity / 交错入场
- 交互: 完整hover/active/focus/loading/empty/error状态 / 触觉反馈(scale(0.98))
- 响应式: 移动优先单列折叠 / 44px触摸目标 / clamp()排版缩放
- 语义: 语义HTML / 无障碍焦点环 / skip-to-content链接

***

## 1. 项目现状诊断

### 1.1 技术栈

| 组件                  | 版本                         | 说明                    |
| ------------------- | -------------------------- | --------------------- |
| VuePress            | 2.0.0-rc.19                | RC版，API可能不稳定          |
| vuepress-theme-reco | 2.0.0-rc.26                | 内置Tailwind CSS 3.4.4  |
| Vue                 | ^3.5.13                    | Vue 3 Composition API |
| Vite                | via @vuepress/bundler-vite | 打包器                   |
| Mermaid             | ^11.12.2                   | 唯一自定义插件               |

### 1.2 当前问题诊断

| 问题类别 | 严重度 | 具体问题                                  |
| ---- | --- | ------------------------------------- |
| 字体   | 严重  | 使用系统默认字体，无品牌字体                        |
| 色彩   | 严重  | 零CSS变量，全部硬编码；彩虹渐变主页；混合冷暖灰             |
| 布局   | 严重  | 无CSS Grid，rely on !important覆盖；3等宽卡片  |
| 交互   | 严重  | 无hover/active/focus状态；无触觉反馈；无焦点环      |
| 动效   | 中等  | 仅有简单gradientBG动画，无滚动动画，通用ease缓动       |
| 排版   | 中等  | 无字号层级系统，正文无max-width限制                |
| 组件   | 中等  | 无自定义组件，无布局覆盖，无客户端增强(除mermaid)         |
| 性能   | 低   | body::before动画用transform(正确)，但blur值过大 |
| 可访问性 | 低   | 无焦点环，无skip-to-content                 |

### 1.3 theme-reco 约束

- 暗色模式选择器: `html[data-theme="dark"]` (非 `html.dark`)
- 内置 Tailwind CSS 3.4.4: 自定义样式需注意优先级
- 可用插槽: `layout-top/bottom`, `navbar-start/center/end`, `page-top/bottom`, `home-hero-before/after`, `home-features-before/after`
- 布局覆盖: 需创建 `.vuepress/layouts/` 目录
- 组件覆盖: 需创建 `.vuepress/components/` 目录
- 客户端增强: 需创建 `.vuepress/client.ts` 或通过插件 `clientConfigFile`
- 调色板注入: reco内置 `@vuepress/plugin-palette`，可通过 `.vuepress/styles/palette.css` 注入变量

### 1.4 修复优先级(遵循 redesign-existing-projects skill)

1. 字体替换 -- 最大视觉提升，最低风险
2. 色板清理 -- 移除冲突/过饱和色，建立变量系统
3. Hover和Active状态 -- 让界面感觉活着
4. 布局和间距 -- CSS Grid、max-width、一致padding
5. 替换通用组件 -- 非对称布局替代3等宽卡片
6. 添加加载/空/错误状态
7. 打磨排版比例和间距

***

## 2. 设计系统

### 2.1 品牌隐喻: 深渊极光

> 咸鱼沉入深海，极光从深渊升起 -- 技术博客如同深海中的发光生物，在黑暗中散发智慧的光芒

核心意象:

- 深海: 极暗背景，深邃而宁静
- 极光: 流动的色彩光带，持续而克制
- 生物发光: 微粒和光点，如深海浮游生物
- 水面折射: 玻璃拟态，如从水下仰望水面

### 2.2 Three Dials 配置

| Dial              | 值 | 说明             |
| ----------------- | - | -------------- |
| DESIGN\_VARIANCE  | 8 | 非对称/艺术感布局，每节不同 |
| MOTION\_INTENSITY | 6 | 流畅动效，弹簧物理，但不过度 |
| VISUAL\_DENSITY   | 4 | 平衡密度，大量留白，内容聚焦 |

### 2.3 色彩系统

设计原则:

- 1个主强调色，饱和度 < 80%
- 统一冷灰调家族(全部基于Zinc)
- 极光色仅用于背景装饰，不用于UI元素
- 亮色模式使用暖白基底

```css
:root {
  --c-accent: #7c6aef;
  --c-accent-light: #9d8df5;
  --c-accent-dark: #6350d9;
  --c-accent-muted: rgba(124, 106, 239, 0.15);
  --c-accent-surface: rgba(124, 106, 239, 0.08);
}

html[data-theme="dark"],
html.dark {
  --bg-canvas: #08080f;
  --bg-surface: #111119;
  --bg-elevated: #1a1a24;
  --bg-overlay: rgba(8, 8, 15, 0.85);

  --c-text-primary: #eaeaf0;
  --c-text-secondary: #8b8b9e;
  --c-text-muted: #5c5c70;
  --c-text-accent: var(--c-accent-light);

  --c-border-subtle: rgba(234, 234, 240, 0.06);
  --c-border-default: rgba(234, 234, 240, 0.10);
  --c-border-strong: rgba(234, 234, 240, 0.18);
  --c-border-accent: rgba(124, 106, 239, 0.25);

  --c-fill-subtle: rgba(234, 234, 240, 0.03);
  --c-fill-default: rgba(234, 234, 240, 0.05);
  --c-fill-strong: rgba(234, 234, 240, 0.08);

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.5);
  --shadow-accent: 0 0 24px rgba(124, 106, 239, 0.12);
}

html[data-theme="light"],
:root {
  --bg-canvas: #f8f8fb;
  --bg-surface: #ffffff;
  --bg-elevated: #f1f1f5;
  --bg-overlay: rgba(248, 248, 251, 0.85);

  --c-text-primary: #18181b;
  --c-text-secondary: #52525b;
  --c-text-muted: #a1a1aa;
  --c-text-accent: var(--c-accent-dark);

  --c-border-subtle: rgba(0, 0, 0, 0.04);
  --c-border-default: rgba(0, 0, 0, 0.08);
  --c-border-strong: rgba(0, 0, 0, 0.14);
  --c-border-accent: rgba(124, 106, 239, 0.20);

  --c-fill-subtle: rgba(0, 0, 0, 0.02);
  --c-fill-default: rgba(0, 0, 0, 0.04);
  --c-fill-strong: rgba(0, 0, 0, 0.06);

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.10);
  --shadow-accent: 0 0 24px rgba(124, 106, 239, 0.08);
}
```

极光装饰色板(仅用于背景动画，不用于UI元素):

```css
:root {
  --aurora-1: rgba(124, 106, 239, 0.35);
  --aurora-2: rgba(34, 180, 200, 0.25);
  --aurora-3: rgba(60, 100, 220, 0.20);
  --aurora-4: rgba(180, 60, 140, 0.15);
  --aurora-5: rgba(50, 180, 100, 0.10);
}
```

### 2.4 排版系统

```css
:root {
  --font-display: 'Geist Sans', 'SF Pro Display', 'PingFang SC', sans-serif;
  --font-body: 'Geist Sans', 'SF Pro Text', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-chinese: 'LXGW WenKai', 'PingFang SC', 'Microsoft YaHei', serif;
}
```

字号层级:

| 层级      | 变量          | 值                            | 行高   | 字重  | 字间距      | 用途                  |
| ------- | ----------- | ---------------------------- | ---- | --- | -------- | ------------------- |
| Display | --t-display | clamp(2.25rem, 5vw, 3.75rem) | 1.05 | 800 | -0.03em  | Hero大标题             |
| H1      | --t-h1      | clamp(1.75rem, 3vw, 2.25rem) | 1.15 | 700 | -0.025em | 页面主标题               |
| H2      | --t-h2      | 1.5rem                       | 1.25 | 600 | -0.02em  | 章节标题                |
| H3      | --t-h3      | 1.25rem                      | 1.35 | 600 | -0.01em  | 子章节                 |
| H4      | --t-h4      | 1.125rem                     | 1.4  | 500 | 0        | 小标题                 |
| Body    | --t-body    | 1rem                         | 1.65 | 400 | 0        | 正文(max-width: 65ch) |
| Caption | --t-caption | 0.8125rem                    | 1.5  | 400 | 0.02em   | 标签/元数据              |
| Mono    | --t-mono    | 0.875rem                     | 1.6  | 400 | 0        | 代码/数据               |

### 2.5 间距系统

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --content-max: 72ch;
  --layout-max: 1280px;
  --layout-pad: clamp(1rem, 3vw, 2rem);
}
```

### 2.6 圆角系统

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
}
```

形状一致性锁: 所有交互元素使用 --radius-md，卡片使用 --radius-lg，大容器使用 --radius-xl。内紧外松。

### 2.7 动效系统

```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-magnetic: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 350ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  --stagger-delay: calc(var(--index, 0) * 80ms);
}
```

弹簧物理参数(GSAP): `stiffness: 100, damping: 20`

***

## 3. VuePress 集成架构

### 3.1 文件结构

```
.vuepress/
  config.ts
  client.ts                        # 新建: 客户端增强入口
  styles/
    index.css                      # 重写: 全局样式入口(@import其他文件)
    variables.css                  # 新建: CSS变量系统(2.3-2.7节)
    aurora.css                     # 新建: 极光背景效果
    glassmorphism.css              # 新建: 玻璃拟态组件
    animations.css                 # 新建: 动画关键帧
    components.css                 # 新建: 组件样式覆盖
    typography.css                 # 新建: 排版样式
    scrollbar.css                  # 新建: 滚动条样式
    layout.css                     # 新建: 布局骨架
  plugins/
    mermaid.ts                     # 保留
    mermaid.client.ts              # 保留
    gsap.client.ts                 # 新建: GSAP注册+滚动动画初始化
    cursor-glow.client.ts          # 新建: 鼠标光晕效果
    scroll-progress.client.ts      # 新建: 阅读进度条
  layouts/
    Layout.vue                     # 新建: 覆盖默认布局(添加slots)
  components/
    AuroraBackground.vue           # 新建: 极光背景组件
    ReadingProgress.vue            # 新建: 阅读进度条
    CursorGlow.vue                 # 新建: 鼠标光晕
    GrainOverlay.vue               # 新建: 噪点纹理覆盖
  public/
    (现有静态资源保留)
```

### 3.2 config.ts 修改

```typescript
import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite';
import { mermaidPlugin } from './plugins/mermaid'

export default defineUserConfig({
  title: "SaltFishGC's Blog",
  bundler: viteBundler(),
  plugins: [mermaidPlugin],
  theme: recoTheme({
    logo: "/doge.jpg",
    author: "SaltFishGC",
    authorAvatar: "/doge.jpg",
    docsRepo: "https://github.com/SaltFishGC",
    docsBranch: "main",
    lastUpdatedText: "",
    colorMode: 'dark',
    colorModeSwitch: true,
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', {
        href: 'https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&family=LXGW+WenKai&display=swap',
        rel: 'stylesheet'
      }]
    ],
    series: { /* 保持不变 */ },
    navbar: [ /* 保持不变 */ ]
  }),
});
```

### 3.3 client.ts

```typescript
import { defineClientConfig } from '@vuepress/client'
import Layout from './layouts/Layout.vue'

export default defineClientConfig({
  layouts: {
    Layout,
  },
  enhance({ app }) {
    // GSAP和粒子系统通过独立插件注册
  },
  setup() {
    // 全局初始化逻辑
  },
  rootComponents: [
    // 全局组件自动注册
  ],
})
```

### 3.4 Layout.vue

```vue
<template>
  <RecoLayout>
    <template #layout-top>
      <ReadingProgress />
      <AuroraBackground />
      <GrainOverlay />
    </template>
    <template #layout-bottom>
      <CursorGlow />
    </template>
  </RecoLayout>
</template>

<script setup lang="ts">
import RecoLayout from 'vuepress-theme-reco/lib/client/layouts/Layout.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import AuroraBackground from '../components/AuroraBackground.vue'
import GrainOverlay from '../components/GrainOverlay.vue'
import CursorGlow from '../components/CursorGlow.vue'
</script>
```

***

## 4. 核心视觉效果

### 4.1 极光背景

效果: 深色背景上，紫、青、蓝三色极光缓慢流动，模拟深海生物发光

```css
.aurora-background {
  position: fixed;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background: var(--bg-canvas);
  pointer-events: none;
}

.aurora-background::before {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 25% 60%, var(--aurora-1) 0, transparent 55%),
    radial-gradient(ellipse at 75% 40%, var(--aurora-2) 0, transparent 55%),
    radial-gradient(ellipse at 50% 80%, var(--aurora-3) 0, transparent 55%),
    radial-gradient(ellipse at 80% 70%, var(--aurora-4) 0, transparent 50%);
  animation: aurora-drift 8s var(--ease-out-expo) infinite alternate;
  filter: blur(60px);
}

.aurora-background::after {
  content: '';
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 60% 30%, var(--aurora-5) 0, transparent 50%),
    radial-gradient(ellipse at 30% 70%, var(--aurora-1) 0, transparent 55%);
  animation: aurora-drift-reverse 12s var(--ease-out-expo) infinite alternate;
  filter: blur(80px);
}

@keyframes aurora-drift {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-3%, 2%) scale(1.03); }
  66% { transform: translate(2%, -3%) scale(0.98); }
  100% { transform: translate(-5%, 5%) scale(1.05); }
}

@keyframes aurora-drift-reverse {
  0% { transform: translate(0, 0) scale(1.02); }
  50% { transform: translate(5%, -5%) scale(0.97); }
  100% { transform: translate(-3%, 3%) scale(1.04); }
}
```

SVG feTurbulence 水波扭曲(进阶):

```html
<svg style="position:absolute;width:0;height:0" aria-hidden="true">
  <defs>
    <filter id="aurora-wave">
      <feTurbulence baseFrequency="0.003 0.003" numOctaves="3" result="noise" seed="10" />
      <feDisplacementMap in2="noise" in="SourceGraphic" scale="96" />
    </filter>
  </defs>
</svg>
```

```css
.aurora-background::before {
  filter: url(#aurora-wave) blur(60px);
}
```

### 4.2 噪点纹理覆盖

遵循 skill 规则: 噪点滤镜仅用于 `fixed, pointer-events: none` 伪元素

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
}
```

### 4.3 玻璃拟态 -- Double-Bezel 架构

遵循 high-end-visual-design skill: 双层嵌套架构

外层: 1px内边框 + 内阴影(折射光)
内层: 内容区 + 微弱背景填充

```css
.glass-card {
  position: relative;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-default);
  background: var(--c-fill-subtle);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow:
    var(--shadow-sm),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition:
    transform var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo),
    box-shadow var(--duration-normal) var(--ease-out-expo);
}

.glass-card__inner {
  padding: var(--space-6);
  border-radius: calc(var(--radius-lg) - 1px);
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-border-accent);
  box-shadow:
    var(--shadow-md),
    var(--shadow-accent),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.glass-card:active {
  transform: translateY(-2px) scale(0.99);
}
```

导航栏玻璃效果:

```css
.glass-navbar {
  background: var(--bg-overlay);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  backdrop-filter: blur(20px) saturate(200%);
  border-bottom: 1px solid var(--c-border-default);
  box-shadow: var(--shadow-sm);
  transition:
    background var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo);
}

.glass-navbar.scrolled {
  background: var(--bg-overlay);
  border-bottom-color: var(--c-border-accent);
}
```

### 4.4 粒子系统

方案选择: 纯CSS星尘(零依赖) + 可选tsParticles(交互粒子)

纯CSS星尘(默认):

```css
.starfield {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.starfield::before,
.starfield::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 20%, rgba(234,234,240,0.6) 0, transparent 100%),
    radial-gradient(1px 1px at 30% 65%, rgba(124,106,239,0.5) 0, transparent 100%),
    radial-gradient(1.5px 1.5px at 50% 10%, rgba(234,234,240,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 70% 40%, rgba(34,180,200,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 90% 80%, rgba(234,234,240,0.3) 0, transparent 100%);
  animation: twinkle 4s ease-in-out infinite alternate;
}

.starfield::after {
  background-image:
    radial-gradient(1px 1px at 15% 85%, rgba(180,60,140,0.4) 0, transparent 100%),
    radial-gradient(1.5px 1.5px at 45% 35%, rgba(234,234,240,0.5) 0, transparent 100%),
    radial-gradient(1px 1px at 65% 75%, rgba(124,106,239,0.3) 0, transparent 100%),
    radial-gradient(1px 1px at 85% 15%, rgba(234,234,240,0.3) 0, transparent 100%);
  animation-delay: 2s;
}

@keyframes twinkle {
  0% { opacity: 1; }
  100% { opacity: 0.4; }
}
```

tsParticles(可选，仅首页):

```bash
npm install @tsparticles/vue3 @tsparticles/slim
```

```typescript
// .vuepress/plugins/particles.client.ts
import { defineClientConfig } from '@vuepress/client'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

export default defineClientConfig({
  enhance({ app }) {
    if (typeof window !== 'undefined') {
      app.use(Particles, {
        init: async (engine) => {
          await loadSlim(engine)
        }
      })
    }
  }
})
```

粒子配置: 40粒子(移动端20)，颜色限制在 --c-accent 和 --c-text-secondary 范围，连线透明度0.08。

### 4.5 鼠标光晕

遵循 skill 规则: 仅桌面端，移动端禁用

```typescript
// .vuepress/plugins/cursor-glow.client.ts
import { defineClientConfig } from '@vuepress/client'
import { onMounted } from 'vue'

export default defineClientConfig({
  setup() {
    onMounted(() => {
      if (window.matchMedia('(pointer: fine)').matches) {
        const glow = document.createElement('div')
        glow.className = 'cursor-glow'
        glow.setAttribute('aria-hidden', 'true')
        document.body.appendChild(glow)

        let rafId: number
        document.addEventListener('mousemove', (e) => {
          cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(() => {
            glow.style.left = e.clientX + 'px'
            glow.style.top = e.clientY + 'px'
          })
        })
      }
    })
  }
})
```

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

@media (pointer: coarse) {
  .cursor-glow { display: none; }
}
```

### 4.6 故障效果(Glitch)

仅用于首页Hero标题，不滥用:

```css
.glitch-text {
  position: relative;
  font-size: var(--t-display);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--c-text-primary);
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glitch-text::before {
  color: var(--aurora-2);
  animation: glitch-1 4s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
}

.glitch-text::after {
  color: var(--aurora-4);
  animation: glitch-2 4s infinite linear alternate-reverse;
  clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0%, 92% { transform: translate(0); }
  93% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  95% { transform: translate(-1px, 2px); }
  96%, 100% { transform: translate(0); }
}

@keyframes glitch-2 {
  0%, 92% { transform: translate(0); }
  93% { transform: translate(2px, -1px); }
  94% { transform: translate(-2px, 1px); }
  95% { transform: translate(1px, -2px); }
  96%, 100% { transform: translate(0); }
}
```

***

## 5. 交互与动画系统

### 5.1 GSAP 滚动动画

```bash
npm install gsap
```

```typescript
// .vuepress/plugins/gsap.client.ts
import { defineClientConfig } from '@vuepress/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default defineClientConfig({
  setup() {
    onMounted(() => {
      initScrollReveal()
      initParallax()
    })
  }
})

function initScrollReveal() {
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      }
    })
  })
}

function initParallax() {
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.5')
    gsap.to(el, {
      yPercent: -30 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })
}
```

### 5.2 阅读进度条

```typescript
// .vuepress/plugins/scroll-progress.client.ts
import { defineClientConfig } from '@vuepress/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default defineClientConfig({
  setup() {
    onMounted(() => {
      const bar = document.querySelector('.reading-progress')
      const content = document.querySelector('.theme-default-content')
      if (bar && content) {
        gsap.to(bar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: content,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
          }
        })
      }
    })
  }
})
```

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

### 5.3 微交互

链接悬停 -- 渐变下划线展开:

```css
a {
  position: relative;
  text-decoration: none;
  color: var(--c-text-accent);
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-light)) no-repeat right bottom;
  background-size: 0 2px;
  transition:
    background-size var(--duration-normal) var(--ease-out-expo),
    color var(--duration-fast) var(--ease-out-expo);
  padding-bottom: 1px;
}

a:hover {
  background-size: 100% 2px;
  background-position: left bottom;
}

a:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

a:active {
  transform: scale(0.98);
}
```

按钮 -- 磁性悬停物理:

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-accent);
  background: var(--c-accent);
  color: #ffffff;
  font-weight: 600;
  font-size: var(--t-body);
  cursor: pointer;
  transition:
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) var(--ease-out-expo),
    background var(--duration-fast) var(--ease-out-expo);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-accent);
  background: var(--c-accent-light);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
  background: var(--c-accent-dark);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-default);
  background: transparent;
  color: var(--c-text-primary);
  font-weight: 500;
  font-size: var(--t-body);
  cursor: pointer;
  transition:
    transform var(--duration-normal) var(--ease-spring),
    border-color var(--duration-normal) var(--ease-out-expo),
    background var(--duration-fast) var(--ease-out-expo);
}

.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--c-border-accent);
  background: var(--c-fill-subtle);
}

.btn-ghost:active {
  transform: translateY(0) scale(0.98);
}

.btn-ghost:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
}
```

### 5.4 页面过渡

```css
.page-enter-active {
  animation: page-in var(--duration-slow) var(--ease-out-expo);
}

.page-leave-active {
  animation: page-out var(--duration-normal) var(--ease-out-expo);
}

@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes page-out {
  from {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
    filter: blur(2px);
  }
}
```

### 5.5 交错入场

```css
.stagger-reveal > * {
  opacity: 0;
  transform: translateY(12px);
  animation: stagger-in var(--duration-slow) var(--ease-out-expo) forwards;
  animation-delay: var(--stagger-delay);
}

@keyframes stagger-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

***

## 6. 页面设计

### 6.1 首页 Hero 区域

遵循 skill 规则: 非对称布局、Hero极简(1-3行标题)、大量留白

```
+-------------------------------------------------------------+
|  [极光流动背景 + 星尘粒子 + 鼠标光晕]                      |
|                                                             |
|                                                             |
|  SaltFishGC                                                 |
|  ─────────────                                              |
|  (Glitch 故障文字效果)                                      |
|                                                             |
|  代码 / 思考 / 创造 / 分享                                  |
|  (打字机效果逐字显示)                                       |
|                                                             |
|  [ 开始探索 ]    [ GitHub -> ]                               |
|  (主按钮)        (幽灵按钮)                                  |
|                                                             |
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|  最新文章                                查看全部 ->        |
|  ──────────                                                 |
|                                                             |
|  +---------------------------+  +-------+  +-------+       |
|  |                           |  |       |  |       |       |
|  |  文章标题(大卡)           |  | 卡片2 |  | 卡片3 |       |
|  |  摘要...                  |  |       |  |       |       |
|  |  2024-01-01 / Redis       |  |       |  |       |       |
|  |                           |  |       |  |       |       |
|  +---------------------------+  +-------+  +-------+       |
|  (Bento非对称网格: 2:1:1)                                   |
|  (交错淡入动画)                                             |
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|  技术笔记                                                    |
|  ──────────                                                 |
|                                                             |
|  +-------+  +-------+  +---------------------------+       |
|  | Redis |  | Spring|  |                           |       |
|  | 专项  |  | Cloud |  |  Langchain4j (大卡)       |       |
|  +-------+  +-------+  |                           |       |
|  +-------+  +-------+  |                           |       |
|  |  测试  |  | 若智  |  +---------------------------+       |
|  |       |  | idea  |  (Bento 1:1:2)                       |
|  +-------+  +-------+                                       |
|  (节节奏变化: 反转非对称)                                   |
|                                                             |
+-------------------------------------------------------------+
```

关键设计规则:

- Hero标题左对齐，1-3行，大量留白
- Bento网格使用 `grid-flow: dense`，非对称比例(2:1:1 / 1:1:2)
- 相邻节反转非对称方向，避免重复
- 卡片使用Double-Bezel玻璃拟态
- 交错入场: `animation-delay: calc(var(--index) * 80ms)`

### 6.2 文章详情页

````
+-------------------------------------------------------------+
|  Navbar [Logo] [主页] [Blog] [笔记 v] [主题切换]            |
+-------------------------------------------------------------+
|  [================ 阅读进度条 ============>]                |
+----------+------------------------------+------------------+
|          |                              |                  |
| 侧边栏   |  文章标题                    |  目录导航        |
| (可折叠)  |  作者 / 2024-01-01 / Redis   |  (跟随滚动)      |
|          |  ──────────────────          |                  |
| / 导航   |                              |  / H2 标题       |
| / 标签   |  正文内容...                 |    / H3 标题     |
| / 归档   |  (max-width: 65ch)          |  / H2 标题       |
| / 社交   |                              |                  |
|          |  > 引用块(左侧强调色边框)    |  [当前高亮]      |
|          |                              |                  |
|          |  ```代码块(暗色+复制按钮)    |                  |
|          |  ```                         |                  |
|          |                              |                  |
|          |  ![](图片)(点击放大)         |                  |
|          |                              |                  |
|          |  ──────────────────          |                  |
|          |  上一篇 / 下一篇             |                  |
|          |                              |                  |
|          |  评论区 (Giscus)             |                  |
|          |                              |                  |
+----------+------------------------------+------------------+
````

### 6.3 文章列表页

```
+-------------------------------------------------------------+
|  Navbar                                                     |
+-------------------------------------------------------------+
|                                                             |
|  全部文章                                                    |
|  ──────────                                                 |
|  [标签筛选]  [分类筛选]  [搜索]                              |
|                                                             |
|  +-----------------------------------------------------+   |
|  |  文章标题                                            |   |
|  |  摘要预览文字...                                     |   |
|  |  2024-01-01  /  Redis  /  8 min                      |   |
|  +-----------------------------------------------------+   |
|                                                             |
|  +-----------------------------------------------------+   |
|  |  文章标题                                            |   |
|  |  摘要预览文字...                                     |   |
|  |  2024-01-01  /  SpringCloud  /  12 min               |   |
|  +-----------------------------------------------------+   |
|                                                             |
|  (卡片交错淡入 + 悬停边框发光)                              |
|                                                             |
|  [ 1 ]  [ 2 ]  [ 3 ]  ->                                   |
|                                                             |
+-------------------------------------------------------------+
```

***

## 7. 实施阶段

### P0: 基础设施 (必须)

| 任务           | 文件                    | 说明                                    |
| ------------ | --------------------- | ------------------------------------- |
| 创建CSS变量系统    | styles/variables.css  | 2.3-2.7节全部变量                          |
| 创建排版样式       | styles/typography.css | 字体声明、字号层级、行高                          |
| 重写全局样式入口     | styles/index.css      | @import所有子文件                          |
| 字体引入         | config.ts head        | Geist Sans + Geist Mono + LXGW WenKai |
| 删除旧index.css | styles/index.css      | 清除所有硬编码颜色和!important                  |

验收标准: 页面使用新字体、新色板、新排版层级，无视觉回归

### P1: 核心视觉效果 (必须)

| 任务    | 文件                                                  | 说明                |
| ----- | --------------------------------------------------- | ----------------- |
| 极光背景  | styles/aurora.css + components/AuroraBackground.vue | 4.1节              |
| 噪点纹理  | components/GrainOverlay.vue                         | 4.2节              |
| 玻璃拟态  | styles/glassmorphism.css                            | 4.3节 Double-Bezel |
| 星尘粒子  | styles/aurora.css(内含)                               | 4.4节纯CSS方案        |
| 导航栏玻璃 | styles/components.css                               | 覆盖reco导航栏样式       |
| 滚动条   | styles/scrollbar.css                                | 自定义滚动条            |

验收标准: 极光流动、玻璃卡片、噪点纹理、星尘闪烁全部可见

### P2: 交互与动画 (重要)

| 任务     | 文件                                                                 | 说明                         |
| ------ | ------------------------------------------------------------------ | -------------------------- |
| GSAP注册 | plugins/gsap.client.ts                                             | 5.1节                       |
| 滚动揭示   | plugins/gsap.client.ts                                             | .reveal元素入场                |
| 阅读进度条  | components/ReadingProgress.vue + plugins/scroll-progress.client.ts | 5.2节                       |
| 鼠标光晕   | components/CursorGlow\.vue + plugins/cursor-glow\.client.ts        | 4.5节                       |
| 微交互    | styles/components.css                                              | 链接/按钮/卡片hover+active+focus |
| 交错入场   | styles/animations.css                                              | .stagger-reveal            |
| 页面过渡   | styles/animations.css                                              | 5.4节                       |

验收标准: 滚动有动画、进度条跟随、鼠标有光晕、所有交互有反馈

### P3: 布局与组件 (重要)

| 任务      | 文件                    | 说明                 |
| ------- | --------------------- | ------------------ |
| 布局覆盖    | layouts/Layout.vue    | 注入全局组件             |
| 客户端增强   | client.ts             | 注册布局和插件            |
| 首页Hero  | styles/components.css | 非对称Hero + Glitch标题 |
| Bento网格 | styles/components.css | 首页卡片网格             |
| 文章卡片    | styles/components.css | Double-Bezel卡片     |
| 故障效果    | styles/animations.css | 4.6节(仅Hero标题)      |

验收标准: 首页非对称布局、Bento网格、Glitch标题

### P4: 细节打磨 (增强)

| 任务    | 文件                     | 说明           |
| ----- | ---------------------- | ------------ |
| 代码块美化 | styles/components.css  | 暗色代码块+复制按钮样式 |
| 表格样式  | styles/components.css  | 替代旧版硬编码边框    |
| 引用块   | styles/components.css  | 左侧强调色边框      |
| 目录跟随  | plugins/gsap.client.ts | TOC高亮当前章节    |
| 图片灯箱  | 利用reco内置medium-zoom    | 样式微调         |
| 搜索框   | styles/components.css  | 玻璃拟态搜索框      |
| 404页面 | styles/components.css  | 创意404        |

验收标准: 所有内容元素有统一风格

### P5: 高级效果 (锦上添花)

| 任务          | 文件                          | 说明                      |
| ----------- | --------------------------- | ----------------------- |
| tsParticles | plugins/particles.client.ts | 交互式粒子(仅首页)              |
| 视差效果        | plugins/gsap.client.ts      | data-speed属性元素          |
| 打字机效果       | components/TypeWriter.vue   | Hero副标题                 |
| 评论系统        | config.ts                   | 启用Giscus                |
| 流体模拟        | 可选                          | Three.js(仅首页Hero，性能允许时) |

验收标准: 首页交互粒子、打字机效果

***

## 8. 性能与可访问性

### 8.1 性能守卫

```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
}

@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: var(--bg-elevated);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
```

- 仅动画 `transform` 和 `opacity`，绝不动画 `top/left/width/height`
- blur值约束: 极光背景 blur(60-80px)，组件 blur(16-20px)，不超过80px
- 粒子系统: 仅首页加载，离开时销毁
- 鼠标光晕: 使用 `requestAnimationFrame` 节流，移动端禁用
- 图片: `loading="lazy"` + 淡入动画
- 字体: `font-display: swap`

### 8.2 减弱动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 8.3 移动端优化

- 粒子数量减半(纯CSS方案自动适配)
- 模糊值降低: 极光 blur(40px)，组件 blur(12px)
- 禁用鼠标光晕: `@media (pointer: coarse) { .cursor-glow { display: none; } }`
- 触摸设备禁用视差效果
- 所有交互元素最小 44px 触摸目标
- 多列布局 < 768px 折叠为单列

### 8.4 可访问性

- 所有交互元素有 `:focus-visible` 焦点环
- `skip-to-content` 链接(Tab键可见)
- 语义HTML标签
- 颜色对比度: 正文至少 4.5:1，大文本至少 3:1
- `aria-hidden="true"` 用于装饰性元素(极光、粒子、噪点)
- `min-height: 100dvh` 代替 `100vh`(防止iOS Safari跳动)

***

## 9. 依赖清单

| 库                                     | 用途           | 大小           | 阶段 |
| ------------------------------------- | ------------ | ------------ | -- |
| gsap                                  | 滚动动画、视差、进度条  | \~25KB gzip  | P2 |
| @tsparticles/vue3 + @tsparticles/slim | 交互粒子(可选)     | \~30KB gzip  | P5 |
| three                                 | 流体模拟(可选，仅首页) | \~150KB gzip | P5 |

字体依赖(Google Fonts CDN):

- Geist Sans: 400/500/600/700/800
- Geist Mono: 400/500/600
- LXGW WenKai: 400

***

## 10. 参考资源

| 类别        | 资源                 | 链接                                                        |
| --------- | ------------------ | --------------------------------------------------------- |
| 设计灵感      | Obys Agency        | <https://obys.agency>                                     |
| 设计灵感      | Superlist          | <https://superlist.com>                                   |
| 设计灵感      | Refraction         | <https://refraction.dev>                                  |
| 设计灵感      | chriskalafatis.com | <https://chriskalafatis.com>                              |
| CSS效果     | CSS极光实现            | <https://www.cnblogs.com/coco1s/p/15722286.html>          |
| CSS效果     | CSS渐变趋势2025        | <https://csstoolbox.net/blog-gradient-design-trends-2025> |
| CSS效果     | 玻璃拟态教程             | <https://natebal.com/glassmorphism-web-design/>           |
| 粒子系统      | tsParticles        | <https://github.com/matteobruni/tsparticles>              |
| 3D/Shader | Three.js流体模拟       | <https://ics.media/entry/250916/>                         |
| 动画库       | GSAP ScrollTrigger | <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>         |
| 博客主题      | Cyberpunk2077      | <https://github.com/ceeyu/hexo-theme-cyberpunk2077>       |
| 博客主题      | VuePress Plume     | <https://theme-plume.vuejs.press>                         |
| 博客主题      | VuePress Reco      | <https://vuepress-theme-reco.recoluan.com>                |
| 字体        | Geist Sans         | <https://vercel.com/font>                                 |
| 字体        | LXGW WenKai        | <https://github.com/lxgw/LxgwWenKai>                      |

***

> 最终目标: 让每一个访问 SaltFishGC Blog 的人都发出惊叹，同时保持工程品质和可访问性标准

