"use client";

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, ExternalLink, Heart, BarChart3, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { comprehensiveTools, Tool } from "@/data/comprehensive-tools";
import { TASK_DEFINITIONS, getTaskLabel, type TaskDefinition } from "@/data/task-definitions";
import { filterByTask } from "@/data/task-definitions";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";

// ─── Slug Aliases ────────────────────────────────────────────────────

const SLUG_ALIASES: Record<string, string> = {
  "ppt": "make-slides",
  "slide": "make-slides",
  "resume": "write-resume",
  "resume-job": "write-resume",
  "job": "write-resume",
  "image": "image-design",
  "img": "image-design",
  "coding": "ai-coding",
  "programming": "ai-coding",
  "research": "academic-research",
  "video": "video-create",
  "automate": "automation",
  "paper": "write-paper",
};

// ─── Task-specific content ────────────────────────────────────────────

interface TaskPageContent {
  slug: string;
  title: string;
  subtitle: string;
  scenarios: string[];
  audience: string[];
  faq: { q: string; a: string }[];
}

const TASK_PAGE_CONTENT: Record<string, TaskPageContent> = {
  "write-paper": {
    slug: "write-paper",
    title: "写论文 AI 工具推荐",
    subtitle: "适合论文选题、资料检索、大纲生成、正文润色、降重修改等学术写作场景。帮你找到最合适的 AI 写作助手。",
    scenarios: ["论文选题", "资料检索", "文献阅读", "大纲生成", "正文写作", "语言润色", "查重降重", "格式检查"],
    audience: ["本科生", "研究生", "博士生", "科研人员", "论文初稿写作者", "文献整理需求用户"],
    faq: [
      { q: "写论文可以用哪些 AI 工具？", a: "AI 写论文工具覆盖全流程：资料检索可以用 AI 搜索引擎（如 Perplexity、秘塔 AI），文献阅读可以用学术 AI（如 Scite、Connected Papers），正文写作可以用 ChatGPT、Claude 等对话助手，润色降重可以用 Grammarly、Paperpal 等专业工具。" },
      { q: "AI 写论文会不会重复率高？", a: "AI 工具应作为辅助而非替代。建议先用 AI 检索资料和生成大纲，再用自己的语言完成正文。最后一定要用查重工具检测。合格的 AI 辅助写作可以显著降低重复率风险。" },
      { q: "如何用 AI 做文献综述？", a: "推荐流程：1）用学术搜索引擎查找相关论文 → 2）用 AI 阅读工具快速提取核心观点 → 3）用 AI 工具对比不同研究方法和结论 → 4）用写作助手整理成结构化的综述段落。" },
      { q: "免费的论文 AI 工具够用吗？", a: "对于基础需求完全够用。免费的 ChatGPT、Claude、Kimi 等可以完成大纲生成、段落润色等任务。专业需求（期刊投稿、毕业论文）建议配合 Grammarly 等专业工具使用。" },
    ],
  },
  "make-slides": {
    slug: "make-slides",
    title: "做 PPT 的 AI 工具推荐",
    subtitle: "从主题梳理到演示优化，AI 帮你快速生成高质量幻灯片。适合工作汇报、项目路演、教学课件等场景。",
    scenarios: ["主题梳理", "大纲生成", "内容撰写", "页面设计", "配图生成", "动画制作", "演示优化", "演讲稿撰写"],
    audience: ["职场人士", "学生", "教师", "创业者", "咨询顾问", "市场营销人员"],
    faq: [
      { q: "做 PPT 用哪个 AI 工具最好？", a: "国内推荐 Gamma、iSlide AI，国外推荐 Tome、Beautiful.ai。Gamma 支持一键生成完整 PPT，iSlide AI 与 PowerPoint 深度集成，适合需要精细调整的用户。" },
      { q: "AI 生成的 PPT 可以直接用吗？", a: "AI 生成的是初稿，建议在内容准确性和视觉细节上做人工调整。AI 最擅长的是结构框架和内容初稿，能节省 70% 的前期工作时间。" },
      { q: "免费的 AI PPT 工具有哪些？", a: "Gamma 提供免费额度，Tome 有免费版，讯飞智文完全免费。免费版通常有页数限制，但足以应对日常需求。" },
    ],
  },
  "write-resume": {
    slug: "write-resume",
    title: "写简历的 AI 工具推荐",
    subtitle: "AI 帮你优化简历、分析岗位要求、生成求职信，提升面试率。适合求职者、跳槽者和应届毕业生。",
    scenarios: ["岗位分析", "简历优化", "关键词匹配", "求职信生成", "面试准备", "薪资谈判", "职业规划"],
    audience: ["应届毕业生", "职场跳槽者", "简历需要优化者", "面试准备中的求职者"],
    faq: [
      { q: "AI 优化简历真的有效吗？", a: "有效。AI 可以分析职位描述中的关键词，优化你的简历匹配度。同时能帮你改进表达方式、突出量化成果。建议用 AI 辅助 + 人工审核相结合。" },
      { q: "用 AI 写简历会不会被 HR 看出来？", a: "AI 适合做优化而非完全代写。建议用 AI 改进措辞和格式，但保持个人经历的真实性。好的 AI 简历工具能帮你在不动内容的前提下提升专业度。" },
      { q: "免费的 AI 简历工具有哪些？", a: "Kickresume、Rezi 提供免费功能，Wondercv 也有免费版本。国内推荐 超级简历 WonderCV，对中文简历优化效果更好。" },
    ],
  },
  "ai-coding": {
    slug: "ai-coding",
    title: "AI 编程工具推荐",
    subtitle: "代码生成、调试、代码审查、项目管理 — AI 正在重塑编程方式。适合开发者、技术团队和编程学习者。",
    scenarios: ["代码生成", "Bug 修复", "代码审查", "单元测试", "架构设计", "代码重构", "技术文档", "项目管理"],
    audience: ["前端开发者", "后端开发者", "全栈工程师", "数据科学家", "编程学习者", "技术团队负责人"],
    faq: [
      { q: "最好的 AI 编程助手是哪款？", a: "目前主流是 Cursor（专用 IDE）、GitHub Copilot（VS Code 插件）、Windsurf（AI-first IDE）。Cursor 适合重度开发，Copilot 适合日常辅助，各有优势。" },
      { q: "AI 编程工具适合新手吗？", a: "非常适合。AI 编程助手可以解释代码、生成示例、帮助调试，是学习编程的绝佳工具。建议新手从 Copilot 或 Cursor 开始。" },
      { q: "AI 生成的代码安全吗？", a: "AI 生成的代码需要人工审查后再上线。建议：1）不要直接复制生产环境代码 2）检查安全漏洞 3）确保许可证合规。AI 辅助 + 人工审核是最佳实践。" },
      { q: "免费的 AI 编程工具有哪些？", a: "GitHub Copilot 对学生免费，Codeium 提供免费版，Tabnine 有免费基础版。国内有阿里通义灵码完全免费。" },
    ],
  },
  "video-create": {
    slug: "video-create",
    title: "AI 视频创作工具推荐",
    subtitle: "从脚本撰写到视频生成，AI 帮你完成短视频、宣传片、教学视频等创作。适合内容创作者、营销人员和自媒体。",
    scenarios: ["视频脚本", "AI 视频生成", "数字人播报", "自动剪辑", "配音配乐", "字幕生成", "特效制作", "多平台分发"],
    audience: ["短视频创作者", "自媒体运营", "市场营销人员", "教育培训者", "企业宣传人员"],
    faq: [
      { q: "AI 视频生成工具哪个好？", a: "国内推荐可灵 AI（快手）、即梦 AI（字节）、Vidu（生数科技）。海外推荐 Runway、Pika、Sora。可灵 AI 的中文理解和支持度国内领先。" },
      { q: "用 AI 做视频需要多少钱？", a: "入门级完全免费。可灵 AI、剪映等提供大量免费额度和模板。专业需求（4K、长视频）建议付费，月费通常在 100-500 元区间。" },
      { q: "AI 能直接生成完整的视频吗？", a: "可以，但需要人工编排。推荐流程：AI 写脚本 → AI 生成素材片段 → 人工剪辑拼接 → AI 配乐配音。完全自动生成的视频质量还无法达到专业水平。" },
    ],
  },
  "image-design": {
    slug: "image-design",
    title: "AI 图像设计工具推荐",
    subtitle: "AI 图像生成、编辑、设计 —— 从创意到成品，AI 帮你快速实现。适合设计师、营销人员和创意工作者。",
    scenarios: ["创意构思", "图像生成", "照片编辑", "插画绘制", "Logo 设计", "海报制作", "产品图", "批量处理"],
    audience: ["平面设计师", "UI/UX 设计师", "市场营销人员", "电商运营", "社交媒体运营", "创意爱好者"],
    faq: [
      { q: "最好的 AI 图像生成工具？", a: "海外推荐 Midjourney（艺术感最强）、DALL·E 3（OpenAI）、Stable Diffusion（开源可控）。国内推荐通义万相、文心一格、即梦 AI。" },
      { q: "AI 生成图片的版权归谁？", a: "不同平台政策不同。Midjourney 付费用户拥有商业使用权，Stable Diffusion 开源模型生成的图片通常归用户所有。建议商用前查看具体平台条款。" },
      { q: "免费的 AI 图像工具有哪些？", a: "Stable Diffusion（开源免费）、Bing Image Creator（使用 DALL·E 免费）、Leonardo.ai（有免费额度）。国内通义万相和文心一格提供每日免费生成额度。" },
    ],
  },
  "automation": {
    slug: "automation",
    title: "AI 自动化工作流工具推荐",
    subtitle: "流程自动化、AI Agent、智能助手 —— 用 AI 搭建自动化工作流，提升效率。适合运营人员、开发者和企业。",
    scenarios: ["流程设计", "工具集成", "自动执行", "数据同步", "智能决策", "异常监控", "报表生成", "定时任务"],
    audience: ["运营人员", "开发者", "企业管理者", "效率工具爱好者", "创业团队"],
    faq: [
      { q: "自动化工作流用什么工具？", a: "海外推荐 n8n（开源）、Zapier、Make（原 Integromat）。国内推荐集简云、WeAutomate。n8n 适合技术团队自托管，Zapier 适合非技术人员。" },
      { q: "AI Agent 和自动化有什么区别？", a: "传统自动化执行固定规则（如：当 A 发生时执行 B），AI Agent 可以做决策（如：分析邮件内容后决定回复方式）。建议两者的结合取长补短。" },
      { q: "自动化工具需要编程基础吗？", a: "不需要。Zapier、Make、集简云都提供可视化拖拽界面。n8n 需要一定技术基础但更灵活。从零开始推荐 Zapier 或集简云。" },
    ],
  },
  "academic-research": {
    slug: "academic-research",
    title: "AI 学术研究工具推荐",
    subtitle: "文献检索、数据分析、论文辅助 —— AI 正在改变科研方式。适合研究人员、学者和学术工作者。",
    scenarios: ["文献检索", "论文阅读", "数据分析", "实验设计", "图表生成", "论文润色", "引用管理", "学术交流"],
    audience: ["科研人员", "高校教师", "研究生", "博士生", "学术编辑", "科研管理者"],
    faq: [
      { q: "学术研究用哪些 AI 工具？", a: "文献检索推荐 Perplexity、Scite、Semantic Scholar。论文阅读推荐 Scholarcy、ChatPDF。数据分析推荐 Julius AI、ResearchGate 的 AI 功能。" },
      { q: "AI 能帮助做数据分析吗？", a: "能。Julius AI、ChatGPT 的 Advanced Data Analysis 可以直接处理 CSV 数据、生成统计图表、执行回归分析等。建议作为辅助工具，关键分析结果需要人工验证。" },
      { q: "如何用 AI 提高论文投稿成功率？", a: "1) 用 AI 工具检查语言表达和语法 2) 用学术搜索引擎找到合适的投稿期刊 3) 用 AI 分析目标期刊的论文风格。但要记住 AI 不能替代同行评审和学术贡献。" },
    ],
  },
};

// ─── Component ──────────────────────────────────────────────────────

export function TaskDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  // Resolve slug (handle aliases)
  const resolvedSlug = (slug ? SLUG_ALIASES[slug] ?? slug : "") as string;
  const taskDef = TASK_DEFINITIONS.find(t => t.value === resolvedSlug);
  const pageContent = TASK_PAGE_CONTENT[resolvedSlug];

  // Filter tools by task
  const taskTools = useMemo(() => {
    if (!resolvedSlug) return [];
    const filtered = filterByTask(comprehensiveTools, resolvedSlug);
    // Sort by featured + rating
    return filtered
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
      .slice(0, 12);
  }, [resolvedSlug]);

  // Set page title for SEO
  useEffect(() => {
    if (pageContent) {
      document.title = `${pageContent.title} — AI 工具导航`;
    } else if (taskDef) {
      document.title = `${taskDef.label} AI 工具推荐 — AI 工具导航`;
    }
    window.scrollTo(0, 0);
  }, [pageContent, taskDef]);

  // ─── 404 ──────────────────────────────────────────
  if (!taskDef) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">页面未找到</h1>
        <p className="text-gray-500 mb-6">该任务页面不存在</p>
        <Button onClick={() => navigate("/")}>返回首页</Button>
      </div>
    );
  }

  const content = pageContent ?? {
    title: `${taskDef.label} AI 工具推荐`,
    subtitle: taskDef.description,
    scenarios: [],
    audience: [],
    faq: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 mb-4">
            <span className="text-base">{taskDef.icon}</span>
            <span>{taskDef.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {content.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { label: "相关工具", value: taskTools.length },
            { label: "精选推荐", value: taskTools.filter(t => t.featured).length },
            { label: "免费工具", value: taskTools.filter(t => t.pricing === "Free").length },
          ].map(s => (
            <div key={s.label} className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-4 py-2.5 border border-gray-100 dark:border-gray-800">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recommended Workflow */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            推荐工作流
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {content.scenarios.slice(0, 5).map((scenario, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{scenario}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              精选工具
              <span className="text-sm font-normal text-gray-500">({taskTools.length})</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/?task=${resolvedSlug}`)}
              className="text-xs"
            >
              查看全部
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="grid gap-4">
            {taskTools.slice(0, 8).map((tool, idx) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-base font-bold text-blue-500">${tool.name.charAt(0)}</div>`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{idx + 1}. {tool.name}</h3>
                          {tool.chineseName && <p className="text-xs text-gray-500">{tool.chineseName}</p>}
                        </div>
                        <Badge variant="secondary" className={
                          tool.pricing === "Free" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none text-xs" :
                          tool.pricing === "Freemium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none text-xs" :
                          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none text-xs"
                        }>
                          {tool.pricing === "Free" ? "免费" : tool.pricing === "Freemium" ? "免费增值" : "付费"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                      {/* Task tags */}
                      {tool.taskTags && tool.taskTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tool.taskTags.slice(0, 2).map(tag => {
                            const td = TASK_DEFINITIONS.find(t => t.value === tag);
                            if (!td) return null;
                            return (
                              <span key={tag} className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                <span>{td.icon}</span>
                                <span>{td.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-7 px-3"
                          onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          访问官网
                        </Button>
                        <button onClick={() => toggleFavorite(tool.id)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="收藏">
                          <Heart className={`w-3.5 h-3.5 ${isFavorite(tool.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}`} />
                        </button>
                        <button onClick={() => toggleCompare(tool.id)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="对比">
                          <BarChart3 className={`w-3.5 h-3.5 ${isCompared(tool.id) ? "text-blue-500 fill-blue-500" : "text-gray-400 hover:text-blue-400"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Audience */}
        {content.audience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              适合人群
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.audience.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm border border-green-200/50 dark:border-green-800/50">
                  <Check className="w-3.5 h-3.5" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {content.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
              常见问题
            </h2>
            <div className="space-y-3">
              {content.faq.map((item, idx) => (
                <details key={idx} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors [&::-webkit-details-marker]:hidden">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.q}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 pb-10">
          <Button
            onClick={() => navigate(`/?task=${resolvedSlug}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            查看全部 {taskDef.label} 工具
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/quiz")}>
            <Sparkles className="w-4 h-4 mr-2" />
            30 秒快速推荐
          </Button>
        </div>
      </div>
    </div>
  );
}
