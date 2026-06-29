# Design

> 沉静的参考书。靛青墨色 + 米白纸面 + 一抹朱砂红做语义强调。OKLCH 全程。

## Theme

明暗两套，明色为默认，暗色跟随系统。明色不是"温暖的米色"，是真正的米白纸面（chroma 趋零、不靠暖色撑场），所有温度由品牌色承担。

## Color Palette (OKLCH)

### Light (default)

| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(0.985 0.003 268.5)` | 页面底色，几乎纯白，仅极淡靛青偏色 |
| `--surface` | `oklch(0.965 0.005 268.5)` | 卡片、面板、详情区 |
| `--surface-2` | `oklch(0.945 0.007 268.5)` | 次级面板、筛选条悬浮态 |
| `--ink` | `oklch(0.21 0.02 268.5)` | 正文，对 bg ≥ 7:1 |
| `--ink-strong` | `oklch(0.13 0.02 268.5)` | 标题 |
| `--muted` | `oklch(0.48 0.015 268.5)` | 次要文字，对 bg ≥ 4.5:1 |
| `--muted-2` | `oklch(0.62 0.01 268.5)` | 占位符、辅助元信息 |
| `--primary` | `oklch(0.476 0.158 268.5)` | 主品牌色——靛青墨，用于主按钮、选中态、链接 |
| `--primary-press` | `oklch(0.42 0.16 268.5)` | 主按钮按下态 |
| `--primary-tint` | `oklch(0.93 0.03 268.5)` | 选中态背景、chip 选中 |
| `--accent` | `oklch(0.58 0.18 28)` | 朱砂红，仅用于"危险/删除/未保存"等语义强调，绝不装饰 |
| `--accent-tint` | `oklch(0.95 0.03 28)` | 删除按钮 hover 背景 |
| `--success` | `oklch(0.55 0.12 145)` | "有空调""有地铁"等正向状态 |
| `--warning` | `oklch(0.7 0.14 75)` | "部分有""较贵"等中间态 |
| `--danger` | `oklch(0.55 0.18 25)` | "无""断电"等负向状态 |
| `--line` | `oklch(0.9 0.005 268.5)` | 1px 分隔线 |
| `--line-strong` | `oklch(0.82 0.008 268.5)` | 强分隔线、表格行线 |

### Dark (跟随系统)

| Token | Value |
|---|---|
| `--bg` | `oklch(0.14 0.008 268.5)` |
| `--surface` | `oklch(0.18 0.01 268.5)` |
| `--surface-2` | `oklch(0.22 0.012 268.5)` |
| `--ink` | `oklch(0.92 0.005 268.5)` |
| `--ink-strong` | `oklch(0.97 0.003 268.5)` |
| `--muted` | `oklch(0.68 0.008 268.5)` |
| `--muted-2` | `oklch(0.52 0.01 268.5)` |
| `--primary` | `oklch(0.7 0.13 268.5)` |
| `--primary-press` | `oklch(0.62 0.15 268.5)` |
| `--primary-tint` | `oklch(0.28 0.05 268.5)` |
| `--accent` | `oklch(0.68 0.16 28)` |
| `--accent-tint` | `oklch(0.3 0.06 28)` |
| `--success` | `oklch(0.7 0.1 145)` |
| `--warning` | `oklch(0.78 0.12 75)` |
| `--danger` | `oklch(0.68 0.16 25)` |
| `--line` | `oklch(0.26 0.008 268.5)` |
| `--line-strong` | `oklch(0.34 0.01 268.5)` |

## Color Strategy

Restrained。surface 几乎无色，primary 占比 ≤ 8%（主按钮、选中态、链接），accent（朱砂）≤ 2%（仅删除/危险）。状态色 success/warning/danger 仅在数据点出现，不进装饰层。

## Typography

一套字族多权重，不配对。中文用系统默认 sans-serif（PingFang SC / Noto Sans SC / Microsoft YaHei），数字与拉丁文用同一族。

| Role | Family | Weight | Size | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display（详情页学校名） | system-ui, "PingFang SC", "Noto Sans SC", sans-serif | 600 | `clamp(1.5rem, 4vw, 2.25rem)` | -0.02em | 1.15 |
| H2（区块标题） | 同上 | 600 | 1.125rem | -0.01em | 1.3 |
| H3（卡片标题） | 同上 | 600 | 1rem | 0 | 1.4 |
| Body | 同上 | 400 | 0.9375rem (15px) | 0 | 1.6 |
| Small / Meta | 同上 | 400 | 0.8125rem (13px) | 0.01em | 1.5 |
| Caption / Tag | 同上 | 500 | 0.6875rem (11px) | 0.04em | 1.2 |

- 正文 15px 而不是 16px：移动端密度需要，且中文字宽足够。
- 标题字距 ≥ -0.02em，不挤。
- 长文本用 `text-wrap: pretty`，标题用 `text-wrap: balance`。
- 数字用 tabular-nums，对齐表格与统计。

## Spacing

4px 基准。`--s-1: 4px / --s-2: 8px / --s-3: 12px / --s-4: 16px / --s-5: 24px / --s-6: 32px / --s-7: 48px / --s-8: 64px`。

移动端页面水平 padding 16px，桌面 24px。卡片内 padding 16px。区块垂直间距 24px（移动）/ 32px（桌面）。

## Radius

- 卡片 / 面板：12px
- 按钮 / chip：8px
- 输入框：8px
- 头像 / 标签圆点：50%
- 不出现 16px 以上的圆角，绝不 24px+。

## Layout

- 移动优先单列。桌面在 `≥ 960px` 时详情页双栏（左：宿舍数据，右：评论），列表页保持单列但限制最大宽度 720px 居中。
- 不用 CSS Grid 做简单列表；用 flex + gap。
- 详情页 sticky 顶栏只在学校名 + 返回按钮 + 编辑按钮上，不滚动整个 header。
- z-index 语义层级：`--z-dropdown: 100 / --z-sticky: 200 / --z-modal-backdrop: 300 / --z-modal: 310 / --z-toast: 400`。

## Components

### Button

- Primary：`--primary` 背景，`--bg` 文字，8px 圆角，44px 高度（移动）/ 36px（桌面），按下用 `--primary-press`。
- Secondary：透明背景，1px `--line-strong` 边框，`--ink` 文字，hover 背景 `--surface-2`。**不与 box-shadow 同存。**
- Danger：透明背景，1px `--accent` 边框，`--accent` 文字，hover 背景 `--accent-tint`。
- Ghost（图标按钮）：透明，44×44 触控区，hover 背景 `--surface-2`。

### Chip / Filter

- 未选：`--surface` 背景，1px `--line-strong` 边框，`--ink` 文字，8px 圆角。
- 选中：`--primary-tint` 背景，1px `--primary` 边框，`--primary` 文字。
- 高度 32px（移动 36px），padding 0 12px。
- 多选 chip 间 8px gap。

### Card (School List Item)

- 背景 `--surface`，1px `--line` 边框，12px 圆角。
- **不**加 box-shadow。不嵌套卡片。
- 内 padding 16px。
- 顶部：学校名（H3）+ 城市 chip。第二行：3–4 个关键设施 chip（空调 / 上床下桌 / 几人间 / 地铁）。底部：评论数 + 进入详情链接。
- 点击整张卡片进入详情。

### Form Control

- Input / Select：高度 44px（移动）/ 36px（桌面），8px 圆角，1px `--line-strong` 边框，focus 时边框变 `--primary` + 2px `--primary-tint` 外发光（不用 box-shadow 模糊大范围）。
- Label 在上方，13px，`--muted`。
- 错误态：1px `--accent` 边框 + 下方 13px `--accent` 文字。

### Tag (Data Point)

- 显示"有/无/部分有"等状态。圆角 6px，padding 2px 8px，11px caption 字号。
- 正向：`--success` 文字 + `color-mix(in oklch, var(--success) 12%, transparent)` 背景。
- 中性：`--muted` 文字 + `--surface-2` 背景。
- 负向：`--danger` 文字 + `color-mix(in oklch, var(--danger) 12%, transparent)` 背景。
- 不靠颜色单独传递，文字必伴随。

### Modal / Drawer

- 移动端：底部抽屉（slide-up），圆角顶部 16px，背景 `--surface`，可下滑关闭。
- 桌面：居中模态，圆角 12px，最大宽 480px。
- 背景遮罩 `oklch(0.13 0.02 268.5 / 0.5)` + `backdrop-filter: blur(2px)`。
- 用原生 `<dialog>` 实现，不自己造堆叠层级。

## Motion

- 默认 180ms，`cubic-bezier(0.2, 0.8, 0.2, 1)`（ease-out-quart）。
- chip 选中、按钮按下、卡片 hover：120ms。
- 抽屉滑入：220ms，同曲线。
- 详情页进入：列表项轻微淡出，详情页淡入 + 4px 上移，180ms。
- 所有动画在 `@media (prefers-reduced-motion: reduce)` 下退化为仅 opacity，180ms。
- 不做入场序列、不做视差、不做数字滚动。

## Icons

用内联 SVG，1.5px 描边，`currentColor`。不用 emoji。不用图标库（避免额外网络请求）。每个图标 20px 视口。

## Empty / Loading

- 加载：骨架屏（`--surface-2` 块 + 微弱 `prefers-reduced-motion` 友好的脉冲），不用 spinner。
- 空状态：一句解释 + 一个行动按钮（"清掉筛选，重新看全部"）。
- 无结果：列出当前筛选条件 + "清除全部筛选"按钮。

## Voice & Copy

- 标签用名词不用动词："空调" 不是 "是否有空调"。
- 状态值原样保留 Excel 语义："有""无""部分有""较贵""一般"——不美化、不翻译。
- 评论输入框 placeholder："留下你真实住过这所学校的体验，3 句话就够。"
- 管理员模式提示："管理员模式已开启。你的编辑会保存在本机，刷新不丢。"
