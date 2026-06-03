# SaltFishGC Blog 设计约束

## 必须遵守
- 字体：Geist（Google Fonts 名称 `'Geist'`）+ LXGW WenKai 中文
- 主色：#7c6aef（科技紫），禁止 Inter、#000000 纯黑
- 悬停效果：必须有流动渐变 + 发光阴影，禁止单调 color change
- 暗色模式文字：#f5f5f7 以上亮度，禁止暗灰色不可见

## VuePress reco 主题约束
- CSS 覆盖必须用 `!important`（reco 用 Tailwind @apply 优先级高）
- `.theme-container` 是根容器，`.home` 类需通过 frontmatter `pageClass: home` 添加
- Series 侧边栏是函数式组件，状态通过命令式 DOM 操作管理，不经过 Vue 响应式
- `useSeriesItems` 的 `computed` 依赖 `route`，每次导航重新创建对象

## z-index 层级规范
- 内容层：z-index: 2（最高，必须可见）
- 光效层：z-index: 1（::before 全息效果）
- 背景层：z-index: 0（.magic-card__bg）

## 详细设计参考
- 样式设计参考 `.trae/skills/high-end-visual-design/SKILL.md`
- 动效参考 `.trae/skills/gpt-taste/SKILL.md`