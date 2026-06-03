# 动态笔记服务架构调查报告

> 从静态 VuePress 到动态笔记服务的迁移路径分析

---

## 1. 核心问题

**VuePress 能否通过 API 动态获取 md 文件并渲染?**

**答案: 不能。** VuePress 是纯静态站点生成器 (SSG)，所有内容在构建时编译，没有运行时动态渲染机制。

VuePress 2 的工作流程:
1. 构建时读取文件系统中的 `.md` 文件
2. 通过 `markdown-it` 编译为 Vue 组件
3. 预渲染为静态 HTML
4. 输出到 `dist/` 目录

没有任何内置机制支持运行时从 API 获取并渲染 markdown。页面路由、侧边栏、导航全部在构建时生成。

### 可能的 Hack 方案 (不推荐)

| 方案 | 做法 | 致命缺陷 |
|------|------|---------|
| 自定义 Vue 组件 + `markdown-it` | 运行时 fetch md 文本，用 `markdown-it` 解析后 `v-html` 渲染 | 无 Vue 组件编译、XSS 风险、无 frontmatter、无侧边栏集成、无 SEO |
| `vuepress-plugin-dynamic-pages` | 构建时从数据源生成页面 | 仍是构建时，需重新构建 |
| `clientAppEnhance` 注入渲染器 | 在客户端注入 markdown 渲染逻辑 | 丢失 VuePress 所有 md 特性，纯客户端渲染 |

**结论: 如果需要动态内容，应更换框架，而非 Hack VuePress。**

---

## 2. 替代方案对比

### 2.1 Nuxt 3 + @nuxt/content

**工作原理**:
- Nuxt Content v2 从 `content/` 目录读取 `.md` 文件
- 提供 `queryContent()` API，支持构建时和运行时查询
- `<ContentDoc>` / `<ContentRenderer>` 组件渲染内容
- 可通过 `useFetch()` + `parseMarkdown()` 渲染远程 API 内容

```vue
<script setup>
const { data: content } = await useFetch('/api/notes/123', {
  transform: (raw) => parseMarkdown(raw.body)
})
</script>
<template>
  <ContentRenderer v-if="content" :value="content" />
</template>
```

| 优势 | 劣势 |
|------|------|
| Vue 3 + Nuxt 3 完整生态 | Nuxt Content 主要面向文件系统，远程 API 是变通方案 |
| SSR / ISR / 混合渲染 | 需要 Nuxt 3 (非 VuePress) |
| `parseMarkdown()` 可运行时解析 | Content v3 尚在开发中 |
| 自动导入、文件路由 | 从 VuePress 迁移工作量大 |

### 2.2 VitePress 动态路由

**工作原理**:
- 通过 `*.paths.ts` 文件定义动态路由
- `paths()` 函数在构建时调用，可从 API 获取数据
- 生成每个路径的静态页面

```ts
export default {
  async paths() {
    const notes = await fetch('https://api.example.com/notes').then(r => r.json())
    return notes.map(note => ({ params: { id: note.id }, content: note.body }))
  }
}
```

| 优势 | 劣势 |
|------|------|
| Vite 驱动，构建极快 | 动态路由仍是构建时，非运行时 |
| Vue 3 生态，VuePress 用户熟悉 | 无运行时内容获取 |
| 比 VuePress 更轻量 | 内容变更需重新构建 |

### 2.3 Next.js + next-mdx-remote

**工作原理**:
- ISR (增量静态再生) 支持 `revalidate`
- `next-mdx-remote` 可运行时编译 MDX
- App Router + React Server Components

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function NotePage({ params }) {
  const note = await fetch(`https://api.example.com/notes/${params.id}`).then(r => r.json())
  return <MDXRemote source={note.content} />
}
```

| 优势 | 劣势 |
|------|------|
| 真正的运行时 MDX 渲染 | React 生态 (非 Vue) |
| ISR 兼顾静态和动态 | 运行时 MDX 编译有性能开销 |
| App Router + RSC | Vue 用户有学习曲线 |
| SEO 极佳 | |

### 2.4 Vue 3 SPA + 自定义 API

**工作原理**:
- Vue 3 + Vite 构建 SPA
- 从 API 获取 markdown 文本
- 用 `markdown-it` 或 `marked` 运行时渲染

```vue
<script setup>
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const route = useRoute()
const { data } = await useFetch(`/api/notes/${route.params.id}`)
const rendered = computed(() => md.render(data.value?.content || ''))
</script>
<template>
  <div v-html="rendered" />
</template>
```

| 优势 | 劣势 |
|------|------|
| 完全控制架构 | 需要从零构建 |
| Vue 3 生态 (你的技术栈) | 无内置 SSR/SSG |
| 轻量 | 无 SEO |
| 易于集成任何后端 | 需自行实现搜索、导航等 |

### 2.5 Outline (getoutline.com)

**是什么**: 开源知识库/Wiki，类似 Notion，React + Node.js + PostgreSQL。

| 优势 | 劣势 |
|------|------|
| 生产就绪，UI 精美 | React 技术栈 |
| 实时协作 (CRDT) | 需要 PostgreSQL + Redis + MinIO/S3 |
| Markdown + 富文本编辑器 | 自托管基础设施较重 |
| 完整 API (REST + GraphQL) | 不是博客/Wiki 混合体 |
| SSO、权限、分享 | |
| 活跃开发，商业支持 | |

**自托管**: Docker Compose 一键部署，需 PostgreSQL 12+、Redis 6+、对象存储。

### 2.6 AFFiNE

**是什么**: 开源 "Notion + Miro" 替代品，块编辑器 + 画布模式，React + Rust 后端。

| 优势 | 劣势 |
|------|------|
| 创新的画布 + 文档混合 | 仍在成熟中，部分功能不完善 |
| Local-first 架构 (离线可用) | React 技术栈 |
| 块编辑器 (类 Notion) | 非原生 Markdown (内部用块格式) |
| 可导出 Markdown | API 不如 Outline 成熟 |

### 2.7 HedgeDoc / CodiMD

**是什么**: 开源协作 Markdown 编辑器，实时共同编辑。

| 优势 | 劣势 |
|------|------|
| 纯 Markdown 编辑 | UI 较旧 |
| 实时协作 (OT) | API 有限 |
| 自托管，轻量 | 更像共享记事本，非知识库 |
| Docker 单容器部署 | 近期开发不太活跃 |

### 2.8 其他值得关注的方案

| 项目 | 技术栈 | 核心特点 | 许可证 |
|------|--------|---------|--------|
| **BookStack** | PHP/Laravel | Wiki 风格，WYSIWYG + Markdown，LDAP/SSO | MIT |
| **Wiki.js** | Node.js + Vue 2 | Git 同步，多存储后端 | AGPL-3 |
| **Memos** | Go + React | 快速笔记，类似私密 Twitter | MIT |
| **SilverBullet** | Deno + TypeScript | Local-first Markdown Wiki，插件系统 | MIT |
| **Docmost** | Node.js + React | Confluence 替代，实时协作 | AGPL-3 |
| **PocketBase** | Go (单二进制) | 内置 Auth + Admin UI + SQLite，可作后端 | MIT |

---

## 3. 架构模式

### 模式 A: SPA + API 服务器 (最简单)

```
[Vue 3 SPA]  <--fetch/md-->  [API Server (Spring Boot)]
     |                              |
  Vue Router                   Database (PostgreSQL)
  markdown-it                  File Storage (MinIO/Local)
  Milkdown/Vditor              Auth (JWT)
```

**组件**:
- **前端**: Vue 3 + Vue Router + Pinia
  - 编辑器: Milkdown (ProseMirror 插件化) / Vditor (WYSIWYG + 中文社区)
  - 渲染器: `markdown-it` + 插件 / `marked`
  - UI: Naive UI / Element Plus
- **后端**: Spring Boot (你的 Java 技术栈)
  - REST API: 笔记 CRUD
  - 认证: JWT / Session
  - 存储: 数据库存元数据 + MinIO/本地存 Markdown 内容

| 优势 | 劣势 |
|------|------|
| 完全控制 | 无 SEO |
| 架构简单 | 无实时协作 (需额外工作) |
| 匹配你的 Java/Vue 技能 | 需从头构建搜索 |
| 易部署 | 无 SSR |

### 模式 B: Nuxt 3 + API 服务器 (SEO + 动态最佳)

```
[Nuxt 3 Frontend]  <--SSR/ISR-->  [API Server]
       |                                |
  服务端渲染                        Database
  @nuxt/content (可选)            File Storage
  useFetch() 调用 API               Auth
```

| 优势 | 劣势 |
|------|------|
| SEO 友好 (SSR) | 比 SPA 复杂 |
| ISR = 快速 + 新鲜 | Nuxt 3 学习曲线 |
| 可混合静态 + 动态内容 | 部署需 Node.js 服务器 |

### 模式 C: 实时协作编辑器

```
[Vue 3 SPA]  <-->  [WebSocket Server]  <-->  [API Server]
  (Yjs/ProseMirror)    (协作层)              (持久化)
```

**关键库**:
- **Yjs**: CRDT 框架，无冲突实时协作
- **ProseMirror**: 高级编辑器框架 (Milkdown/TipTap 基于)
- **Hocuspocus**: Yjs 协作服务器
- **TipTap**: ProseMirror 编辑器，支持协作

| 优势 | 劣势 |
|------|------|
| 实时协作 | 架构复杂 |
| CRDT 无冲突合并 | WebSocket 服务器增加运维复杂度 |
| 离线支持 (Yjs) | 基础设施成本高 |

### 模式 D: 静态站点 + Headless CMS

```
[VuePress/VitePress]  <--构建时-->  [Headless CMS API]
        |                                   |
   静态 HTML                          Database
   (GitHub Pages)                      Admin UI
```

**Headless CMS 选项**:
- **PocketBase** (Go，单二进制，内置 Auth + Admin UI) — 最轻量
- **Strapi** (Node.js，自托管，REST/GraphQL)
- **Directus** (Node.js，自托管，包装任何 SQL 数据库)

| 优势 | 劣势 |
|------|------|
| 保留 VuePress 渲染 | 仍需重新构建 |
| Admin UI 管理内容 | 非真正动态 |
| Webhook 触发重建 | 构建时间随内容增长 |

---

## 4. Markdown 编辑器选型

| 编辑器 | Vue 支持 | 核心特点 | 适合场景 |
|--------|---------|---------|---------|
| **Milkdown** | Vue 插件 | ProseMirror 插件化，可协作 | 需要高度定制的编辑器 |
| **TipTap** | Vue 3 组件 | ProseMirror 封装，协作支持 | 需要富文本 + Markdown |
| **Vditor** | 可封装 | WYSIWYG + Markdown + 分屏，中文社区 | 中文用户，WYSIWYG 需求 |
| **ByteMD** | Vue 3 | 字节跳动出品，插件系统 | 轻量 Markdown 编辑 |
| **Cherry Markdown** | 可封装 | 腾讯开源，功能丰富 | 企业级需求 |

**推荐**: Milkdown (现代可扩展) 或 Vditor (中文 WYSIWYG)

---

## 5. 搜索方案

| 方案 | 类型 | 适合场景 |
|------|------|---------|
| **MeiliSearch** | 自托管搜索引擎 | 全文搜索 + 容错，Rust 驱动，快速 |
| **Typesense** | 自托管搜索引擎 | 类似 MeiliSearch，更简单 |
| **FlexSearch** | 客户端 JS | 小型站点，无需服务器 |
| **PostgreSQL FTS** | 数据库内置 | 已用 Postgres 时，`tsvector` + `tsquery` |
| **Elasticsearch** | 自托管 | 大规模，个人笔记杀鸡用牛刀 |

---

## 6. 推荐路径

根据你的技术栈 (Vue + Java Spring Boot) 和需求 (动态笔记服务)，排名推荐:

### 推荐 1: Vue 3 SPA + Spring Boot API (最快落地)

- **迁移成本**: 中
- **理由**: 匹配你的 Vue + Java 技术栈，架构最简单
- **技术栈**: Vue 3 + Vite + Milkdown/Vditor + Spring Boot + PostgreSQL
- **取舍**: 无 SEO (对个人笔记可接受)

### 推荐 2: Nuxt 3 + 自定义 API (SEO + 动态最佳平衡)

- **迁移成本**: 中高
- **理由**: Vue 生态 + 动态内容 + SEO 的最佳平衡
- **技术栈**: Nuxt 3 + `@nuxt/content` (本地文档) + `useFetch()` (API 笔记) + Spring Boot API
- **部署**: Vercel/Netlify (前端) + 自有服务器 (API)

### 推荐 3: 保留 VuePress + PocketBase 作为 Headless CMS (最小改动)

- **迁移成本**: 低
- **理由**: 现有站点改动最小
- **技术栈**: VuePress (不变) + PocketBase (内容 API + Admin) + GitHub Actions Webhook 触发重建
- **取舍**: 仍需重新构建，非真正动态

### 推荐 4: 直接采用 Outline (开箱即用)

- **迁移成本**: 低 (但技术栈不同)
- **理由**: 生产就绪，实时协作，完整 API
- **技术栈**: Outline Docker + PostgreSQL + Redis + MinIO
- **取舍**: React 技术栈，失去 Vue 生态，基础设施较重

---

## 7. 总结对比矩阵

| 维度 | VuePress (现状) | Nuxt 3 + API | Vue 3 SPA + API | Next.js + MDX | Outline |
|------|----------------|--------------|-----------------|---------------|---------|
| 动态内容 | 否 | 是 | 是 | 是 | 是 |
| 实时协作 | 否 | 加 Yjs | 加 Yjs | 加 Yjs | 内置 |
| SEO | 极佳 | 极佳 | 无 | 极佳 | 良好 |
| Vue 生态 | 是 | 是 | 是 | 否 (React) | 否 (React) |
| 可自托管 | N/A | 是 | 是 | 是 | 是 |
| 搜索 | 仅客户端 | MeiliSearch/PG | MeiliSearch/PG | MeiliSearch | 内置 |
| 迁移成本 | - | 中高 | 中 | 高 | 低 (新系统) |
| 基础设施 | GitHub Pages | Node + API | API 服务器 | Node 服务器 | Docker 全套 |
| Markdown API | 无 | 自定义 | 自定义 | 自定义 | REST+GraphQL |

**核心决策**: 自建 (推荐 1-2) 还是采用现有平台 (推荐 4)? 自建给你完全控制 + Vue 对齐; 采用现有平台给你即时功能 (协作、搜索、Admin UI) 但技术栈锁定。
