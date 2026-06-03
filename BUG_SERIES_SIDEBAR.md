# Series 侧边栏异常问题总结

## 问题描述

在 VuePress reco 主题的 Series（笔记目录）侧边栏中，出现了以下异常行为：

1. **目录"封印"bug**：用户手动收起某个目录后，切换页面再切回来，该目录无法再展开
2. **下拉菜单跳转失效**：通过导航栏"笔记"下拉菜单跳转到 series 页面时，侧边栏状态管理不生效；刷新页面后又正常
3. **导航时目录重置**：每次点击侧边栏链接切换页面，所有目录的展开/收起状态会被重置为全展开

---

## 根因分析

### reco 主题的 Series 实现机制

reco 主题的 Series 侧边栏基于以下组件和逻辑：

| 文件 | 作用 |
|---|---|
| `SeriesItem.js` | 函数式组件，使用命令式 DOM 操作管理展开/收起 |
| `useSeriesItems.js` | `computed` 依赖 `route`，每次导航重新创建所有 item 对象 |
| `useSeries.js` | `router.afterEach` 中关闭 series 面板 |

**关键问题**：

1. **`useSeriesItems` 的 `computed` 依赖 `route`**：每次路由变化，所有 series item 对象通过 `{ ...item }` 浅拷贝重新创建，`collapsible` 属性丢失（变为 `undefined`）

2. **`SeriesItem` 是函数式组件**：使用命令式 DOM 操作（`classList.add/remove`、`style.display`），不经过 Vue 响应式系统

3. **`togglecollapsible()` 的实现**：
   ```js
   // 点击时切换 arrow 类名和子列表 display
   item.collapsible = !item.collapsible  // 但这个属性在导航后丢失
   arrow.classList.toggle('right', 'down')
   childList.style.display = item.collapsible ? 'none' : 'block'
   ```

4. **导航后默认展开**：由于 `collapsible` 丢失为 `undefined`，`!!undefined` 为 `false`，所以 `display: block`（展开）

### 我们的修复方案及其问题

#### 方案一：CSS 类名覆盖（已废弃）

**思路**：用 `.series-collapsed` CSS 类 + `!important` 覆盖 reco 的内联 `display: block`

**问题**：
- CSS `display: none !important` 覆盖了 reco 的内联 `display: block`
- 用户点击展开时，reco 把 `display` 改为 `block`，但 CSS `!important` 仍然覆盖
- 导致目录被"封印"——永远无法展开

#### 方案二：状态持久化 Map（已废弃）

**思路**：用模块级 `Map<string, boolean>` 记录每个目录的折叠状态，导航后重新应用

**问题**：
- `initSeriesPersist()` 只在 `onMounted` 执行一次
- SPA 导航时，旧的 `.series-container` 被销毁重建，MutationObserver 监听的是旧容器
- 通过导航栏下拉菜单跳转时，series container 尚未渲染，`initSeriesPersist()` 找不到容器
- 页面刷新时 `onMounted` 重新执行，能找到新容器，所以刷新后正常

### 最终方案：默认全展开

**思路**：放弃持久化折叠状态，每次导航确保所有目录展开

**优点**：
- 与 reco 的默认行为一致，不会产生冲突
- 不存在"封印"bug
- SPA 导航和刷新行为一致

**实现**：
- `ensureAllExpanded()`：移除所有 `.series-collapsed` 类，确保 arrow 为 `down`，子列表 `display: block`
- `scheduleSeriesExpand()`：`router.afterEach` 后连续 15 帧 `requestAnimationFrame` 重试，确保在 Vue 渲染完成后执行
- `MutationObserver`：监听 series container DOM 变化，50ms 防抖后重新确保展开

---

## 测试方法

### 测试场景 1：基本展开/收起

1. 进入任意笔记页面
2. 点击一级目录标题，观察目录是否收起
3. 再次点击，观察目录是否展开
4. **预期**：收起/展开正常工作

### 测试场景 2：导航后状态

1. 进入笔记页面，收起某个目录
2. 点击侧边栏中的另一个页面链接
3. 观察所有目录是否恢复为展开状态
4. **预期**：所有目录展开（默认全展开策略）

### 测试场景 3：下拉菜单跳转

1. 在主页或其他非笔记页面
2. 点击导航栏"笔记"下拉菜单，选择一个笔记页面
3. 观察侧边栏是否正常显示，所有目录是否展开
4. **预期**：侧边栏正常，所有目录展开

### 测试场景 4：快速连续导航

1. 在笔记页面，快速点击多个不同的侧边栏链接
2. 观察侧边栏是否稳定，不会出现闪烁或"封印"
3. **预期**：侧边栏稳定，所有目录展开

### 测试场景 5：刷新页面

1. 在笔记页面，刷新浏览器
2. 观察侧边栏是否正常显示
3. **预期**：侧边栏正常，所有目录展开

---

## 涉及文件

| 文件 | 改动 |
|---|---|
| `.vuepress/client.ts` | 重构 Series 逻辑：移除状态持久化，改为默认全展开 |
| `.vuepress/styles/components.css` | 保留 `.series-collapsed` CSS 规则（防御性），新增 magic-card 悬停效果修复 |

---

## 时间线

| 阶段 | 方案 | 结果 |
|---|---|---|
| 初始 | 无处理 | reco 默认全展开，用户反馈每次导航目录重置 |
| 方案一 | CSS `.series-collapsed` + `!important` | 产生"封印"bug，收起后无法展开 |
| 方案二 | `Map` 状态持久化 + `MutationObserver` | 下拉菜单跳转失效，SPA 导航后 Observer 失效 |
| 最终 | 默认全展开 + `requestAnimationFrame` 重试 | 稳定可靠，与 reco 默认行为一致 |
