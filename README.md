# AI Ark

AI Ark 是一个面向中文用户的 **AI 工具任务导航与推荐平台**，收录 556 个 AI 工具，覆盖写作、编程、图像、视频、音频、办公、学术研究、自动化工作流等场景。平台围绕 **"按任务找工具"** 的使用逻辑，提供任务场景筛选、中文同义词搜索、30 秒推荐测验、收藏对比、工具详情页、任务解决方案页和反馈提交闭环。

## 在线访问

**https://ai-ark.top**

---

## 核心功能

- **556 个 AI 工具收录**，覆盖写作、编程、图像、视频、音频、办公、学术研究、自动化工作流等 16+ 分类
- **中文同义词搜索**，支持自动补全、热门搜索、任务标签命中、分类命中和权重排序
- **任务场景筛选**，如写论文、做 PPT、AI 编程、视频创作、图像设计、自动化工作流等
- **30 秒 AI 推荐测验**，根据任务、预算、水平和使用环境快速推荐工具组合
- **收藏与对比**，支持工具收藏、对比栏和 `/compare` 多维对比页
- **任务解决方案页** `/tasks/[slug]`，展示任务说明、推荐工作流、精选工具和 FAQ
- **工具详情页** `/tools/[slug]`，展示适合人群、核心优势、可能局限、替代工具和数据状态
- **提交工具与纠错反馈 API**，形成数据更新闭环
- **自动 sitemap**（605 URLs）、robots.txt、JSON-LD 结构化数据、PWA
- **GitHub Actions CI**：TypeScript 检查、ESLint、数据审计、生产构建、Lighthouse CI

---

## 技术栈

| 类别         | 技术                                                                 |
| ------------ | -------------------------------------------------------------------- |
| 前端框架     | [React](https://react.dev) 18 + [TypeScript](https://www.typescriptlang.org) |
| 构建工具     | [Vite](https://vitejs.dev) 7                                         |
| 样式         | [Tailwind CSS](https://tailwindcss.com) 4 + [shadcn/ui](https://ui.shadcn.com) |
| 路由         | [react-router-dom](https://reactrouter.com) 7                        |
| 状态管理     | React Context                                                        |
| 部署         | [Vercel](https://vercel.com)                                         |
| CI/CD        | [GitHub Actions](https://github.com/features/actions)                |
| 性能审计     | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)       |
| 结构化数据   | JSON-LD（WebSite / Organization / SoftwareApplication / FAQPage）    |
| PWA          | Web App Manifest + Service Worker 就绪                                |
| 后端 API     | Express（Node.js，文件持久化）                                        |
| 数据脚本     | tsx 运行，Node.js 文件系统                                           |

---

## 数据治理

项目内置 `data:audit` 脚本，对工具数据库进行自动化质量检查：

| 检查项           | 说明                                    |
| ---------------- | --------------------------------------- |
| 重复工具名称     | 检查 name 字段是否重复                  |
| 重复官网 URL     | 检查 url 字段是否重复                   |
| 缺失 slug        | 检查工具是否缺少 URL 友好的标识符       |
| 缺失分类         | 检查 category 是否为空                  |
| 缺失价格信息     | 检查 pricing 是否为空                   |
| 缺失任务标签     | 检查 taskTags 是否为空                  |
| 低质量描述       | 检查 description 是否过短或为空         |
| 无效字段值       | 检查 pricing/region 等枚举字段是否合法  |

### 当前数据质量

```
工具总数：      556
data:audit errors：0
低质量描述：    0
sitemap URLs：  605
```

---

## 产品亮点

### 1. 从"工具目录"升级为"任务导航"

AI Ark 不只是列出工具，而是围绕用户任务组织工具。用户可以从 **写论文、AI 编程、视频创作、做 PPT、写简历** 等任务入口进入，再根据推荐工作流选择工具。每个任务页包含：

- 任务说明与适用人群
- 推荐工作流步骤
- 精选工具列表（按 Featured + Rating + Free 排序）
- 常见问题 FAQ
- 相关任务导航

### 2. 中文语义搜索增强

搜索系统支持多层匹配策略：

1. **中文同义词扩展**：搜索"论文"同时匹配"写论文"、"学术研究"、"文献"、"paper"、"research"
2. **自动补全建议**：基于已有工具和任务标签
3. **任务标签命中**：匹配工具的 taskTags 字段
4. **分类命中**：匹配工具的 category 字段
5. **权重排序**：Featured 工具优先，Rating 加权，Free 工具加分

### 3. 推荐测验与对比决策

平台提供 **30 秒推荐测验**，通过 4 个问题（任务类型 × 使用水平 × 预算 × 环境）推荐工具组合。同时支持：

- **收藏**：保存感兴趣的工具
- **对比栏**：最多 4 个工具实时对比
- **/compare 页**：并排展示价格、评分、平台、难度、用途等维度

形成 **"搜索 → 推荐 → 详情 → 对比 → 反馈"** 的产品闭环。

### 4. SEO 与可维护性

- 自动生成 **sitemap.xml**（605 URLs，全站覆盖）
- **robots.txt** 屏蔽 AI 训练爬虫（GPTBot / Claude-Web / CCBot / Google-Extended）
- **JSON-LD** 结构化数据：首页 WebSite + Organization，工具页 SoftwareApplication，任务页 FAQPage
- **Open Graph** / **Twitter Card** 社交分享标签
- **PWA**：manifest.json + 图标（SVG + PNG），可添加到主屏幕
- **GitHub Actions CI**：每次 push 自动执行 tsc → lint → data:audit → build → Lighthouse CI
- **Vercel 自动部署**：main 分支 push 即部署

---

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`。

---

## 构建检查

```bash
# TypeScript 类型检查
npx tsc --noEmit

# ESLint
npm run lint

# 数据质量审计
npm run data:audit

# 生产构建（含 sitemap 生成）
npm run build

# 仅生成 sitemap
npm run generate:sitemap
```

---

## 部署

项目部署在 **Vercel**，正式域名：

```
https://ai-ark.top
```

每次向 `main` 分支推送代码，Vercel 自动部署，同时 GitHub Actions 执行 CI 检查。

---

## 后续计划

- [ ] 接入 PageSpeed Insights API，补充真实 Lighthouse 评分
- [ ] 提交 Google Search Console、Bing Webmaster、百度搜索资源平台
- [ ] 持续补充高质量工具详情
- [ ] 增加更多任务场景和 AI 使用指南
- [ ] 优化反馈数据处理和运营后台
- [ ] 服务端部署反馈/提交 API（当前为文件持久化）

---

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── ui/           # shadcn/ui 基础组件
│   ├── task-detail-page.tsx
│   ├── tool-detail-page.tsx
│   ├── tool-card.tsx
│   ├── quiz-page.tsx
│   ├── compare-page.tsx
│   ├── feedback-page.tsx
│   ├── submit-tool-page.tsx
│   └── learn-page.tsx
├── data/             # 数据层
│   ├── ai-tools-database.ts   # 556 个工具
│   ├── task-definitions.ts    # 任务定义
│   ├── quiz-recommendations.ts
│   ├── comprehensive-tools.ts
│   └── tool-slugs.ts
├── lib/              # 工具函数
│   ├── seo.ts        # SEO 元数据管理
│   ├── search.ts     # 搜索 + 同义词
│   └── favorites-context.tsx
├── pages/            # 路由页面
├── App.tsx
└── main.tsx
scripts/
├── data-audit.ts     # 数据质量检查
├── generate-sitemap.ts
└── generate-icons.ts
api/                  # Express API
├── app.ts
└── routes/
    ├── feedback.ts
    └── submit-tool.ts
```

---

## License

MIT
