"use client";

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, ExternalLink, Heart, BarChart3, Check, ChevronRight, Lightbulb, Layers, Users, MessageCircle, Send, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TASK_DEFINITIONS } from "@/data/task-definitions";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";
import {
  getTaskIntro,
  getTaskToolCount,
  getFeaturedToolsForTask,
  getRelatedTasks,
  getTaskSelectionTips,
  getTaskWorkflow,
  getTaskFAQ,
} from "@/lib/task-insights";
import { setPageMeta } from "@/lib/seo";

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

// ─── Manual content overrides (8 high-priority tasks) ───────────────────

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
    faq: [],
  },
  "make-slides": {
    slug: "make-slides",
    title: "做 PPT 的 AI 工具推荐",
    subtitle: "从主题梳理到演示优化，AI 帮你快速生成高质量幻灯片。适合工作汇报、项目路演、教学课件等场景。",
    scenarios: ["主题梳理", "大纲生成", "内容撰写", "页面设计", "配图生成", "动画制作", "演示优化", "演讲稿撰写"],
    audience: ["职场人士", "学生", "教师", "创业者", "咨询顾问", "市场营销人员"],
    faq: [],
  },
  "write-resume": {
    slug: "write-resume",
    title: "写简历的 AI 工具推荐",
    subtitle: "AI 帮你优化简历、分析岗位要求、生成求职信，提升面试率。适合求职者、跳槽者和应届毕业生。",
    scenarios: ["岗位分析", "简历优化", "关键词匹配", "求职信生成", "面试准备", "薪资谈判", "职业规划"],
    audience: ["应届毕业生", "职场跳槽者", "简历需要优化者", "面试准备中的求职者"],
    faq: [],
  },
  "ai-coding": {
    slug: "ai-coding",
    title: "AI 编程工具推荐",
    subtitle: "代码生成、调试、代码审查、项目管理 — AI 正在重塑编程方式。适合开发者、技术团队和编程学习者。",
    scenarios: ["代码生成", "Bug 修复", "代码审查", "单元测试", "架构设计", "代码重构", "技术文档", "项目管理"],
    audience: ["前端开发者", "后端开发者", "全栈工程师", "数据科学家", "编程学习者", "技术团队负责人"],
    faq: [],
  },
  "video-create": {
    slug: "video-create",
    title: "AI 视频创作工具推荐",
    subtitle: "从脚本撰写到视频生成，AI 帮你完成短视频、宣传片、教学视频等创作。适合内容创作者、营销人员和自媒体。",
    scenarios: ["视频脚本", "AI 视频生成", "数字人播报", "自动剪辑", "配音配乐", "字幕生成", "特效制作", "多平台分发"],
    audience: ["短视频创作者", "自媒体运营", "市场营销人员", "教育培训者", "企业宣传人员"],
    faq: [],
  },
  "image-design": {
    slug: "image-design",
    title: "AI 图像设计工具推荐",
    subtitle: "AI 图像生成、编辑、设计 —— 从创意到成品，AI 帮你快速实现。适合设计师、营销人员和创意工作者。",
    scenarios: ["创意构思", "图像生成", "照片编辑", "插画绘制", "Logo 设计", "海报制作", "产品图", "批量处理"],
    audience: ["平面设计师", "UI/UX 设计师", "市场营销人员", "电商运营", "社交媒体运营", "创意爱好者"],
    faq: [],
  },
  "automation": {
    slug: "automation",
    title: "AI 自动化工作流工具推荐",
    subtitle: "流程自动化、AI Agent、智能助手 — 用 AI 搭建自动化工作流，提升效率。适合运营人员、开发者和企业。",
    scenarios: ["流程设计", "工具集成", "自动执行", "数据同步", "智能决策", "异常监控", "报表生成", "定时任务"],
    audience: ["运营人员", "开发者", "企业管理者", "效率工具爱好者", "创业团队"],
    faq: [],
  },
  "academic-research": {
    slug: "academic-research",
    title: "AI 学术研究工具推荐",
    subtitle: "文献检索、数据分析、论文辅助 — AI 正在改变科研方式。适合研究人员、学者和学术工作者。",
    scenarios: ["文献检索", "论文阅读", "数据分析", "实验设计", "图表生成", "论文润色", "引用管理", "学术交流"],
    audience: ["科研人员", "高校教师", "研究生", "博士生", "学术编辑", "科研管理者"],
    faq: [],
  },
};

// ─── Pricing badge ──────────────────────────────────────────────────────

function PricingBadge({ pricing }: { pricing: string }) {
  const cls =
    pricing === "Free"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none text-xs"
      : pricing === "Freemium"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none text-xs"
        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none text-xs";
  const label =
    pricing === "Free" ? "免费" : pricing === "Freemium" ? "免费增值" : "付费";
  return <Badge className={cls}>{label}</Badge>;
}

// ─── Component ──────────────────────────────────────────────────────

export function TaskDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  // Resolve slug (handle aliases)
  const resolvedSlug = (slug ? SLUG_ALIASES[slug] ?? slug : "") as string;
  const taskDef = TASK_DEFINITIONS.find((t) => t.value === resolvedSlug);
  const pageContent = TASK_PAGE_CONTENT[resolvedSlug];

  // Featured tools for this task
  const featuredTools = useMemo(() => {
    if (!taskDef) return [];
    return getFeaturedToolsForTask(taskDef);
  }, [taskDef]);

  // Related tasks
  const relatedTasks = useMemo(() => {
    if (!taskDef) return [];
    return getRelatedTasks(taskDef);
  }, [taskDef]);

  // Selection tips
  const selectionTips = useMemo(() => {
    if (!taskDef) return [];
    return getTaskSelectionTips(taskDef);
  }, [taskDef]);

  // Workflow steps
  const workflowSteps = useMemo(() => {
    if (!taskDef) return [];
    return getTaskWorkflow(taskDef);
  }, [taskDef]);

  // FAQ
  const faqItems = useMemo(() => {
    if (!taskDef) return [];
    return getTaskFAQ(taskDef);
  }, [taskDef]);

  // Counts
  const toolCount = useMemo(() => {
    if (!taskDef) return 0;
    return getTaskToolCount(taskDef);
  }, [taskDef]);

  // Set page SEO
  useEffect(() => {
    if (pageContent) {
      setPageMeta({
        title: `${pageContent.title}与使用工作流 — AI Ark`,
        description: pageContent.subtitle?.slice(0, 200) || `发现最适合${taskDef?.label}场景的 AI 工具，了解工作流与选择技巧。`,
        jsonLd:
          faqItems.length > 0
            ? ({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              } as Record<string, unknown>)
            : undefined,
      });
    } else if (taskDef) {
      setPageMeta({
        title: `${taskDef.label} AI 工具推荐与使用工作流 — AI Ark`,
        description: taskDef.description || `发现最适合${taskDef.label}场景的 AI 工具，了解工作流与选择技巧。`,
        jsonLd:
          faqItems.length > 0
            ? ({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.a,
                  },
                })),
              } as Record<string, unknown>)
            : undefined,
      });
    }
    window.scrollTo(0, 0);
  }, [pageContent, taskDef, faqItems]);

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
    subtitle: getTaskIntro(taskDef),
    scenarios: [] as string[],
    audience: [] as string[],
    faq: [] as { q: string; a: string }[],
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

        {/* ═══ Header ═══ */}
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

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-4 py-2.5 border border-gray-100 dark:border-gray-800">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{toolCount}</p>
              <p className="text-xs text-gray-500">相关工具</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-4 py-2.5 border border-gray-100 dark:border-gray-800">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{featuredTools.filter((t) => t.featured).length}</p>
              <p className="text-xs text-gray-500">精选推荐</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg px-4 py-2.5 border border-gray-100 dark:border-gray-800">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{featuredTools.filter((t) => t.pricing === "Free").length}</p>
              <p className="text-xs text-gray-500">免费工具</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              onClick={() => navigate("/quiz")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              开始测一测
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const el = document.getElementById("task-featured-tools");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Star className="w-4 h-4 mr-2" />
              查看精选工具
            </Button>
          </div>
        </div>

        {/* ═══ Main Content (Two Column on Desktop) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column (2/3) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* 1. Recommended Workflow */}
            {workflowSteps.length > 0 && (
              <section>
                <SectionTitle icon={<Layers className="w-5 h-5 text-purple-500" />} title="推荐工作流" />
                <div className="relative">
                  <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-purple-100 dark:bg-purple-900/50 rounded-full" />
                  <div className="space-y-5">
                    {workflowSteps.map((step) => (
                      <div key={step.step} className="flex items-start gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 z-10 text-sm font-bold text-white shadow-sm">
                          {step.step}
                        </div>
                        <div className="pt-1.5">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 2. Featured Tools */}
            <section id="task-featured-tools">
              <SectionTitle
                icon={<Star className="w-5 h-5 text-blue-500" />}
                title={`精选工具 (${featuredTools.length})`}
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/?task=${resolvedSlug}`)}
                    className="text-xs text-blue-500"
                  >
                    查看全部 <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                }
              />
              <div className="grid gap-3">
                {featuredTools.slice(0, 8).map((tool, idx) => (
                  <Card key={tool.id} className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
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

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <button
                                onClick={() => navigate(`/tools/${tool.id}`)}
                                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                              >
                                {idx + 1}. {tool.name}
                              </button>
                              {tool.chineseName && (
                                <span className="text-xs text-gray-500 ml-1">{tool.chineseName}</span>
                              )}
                            </div>
                            <PricingBadge pricing={tool.pricing} />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>

                          {/* Task tags */}
                          {tool.taskTags && tool.taskTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tool.taskTags.slice(0, 2).map((tag) => {
                                const td = TASK_DEFINITIONS.find((t) => t.value === tag);
                                if (!td) return null;
                                return (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
                                  >
                                    <span>{td.icon}</span>
                                    <span>{td.label}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-2.5">
                            <Button
                              size="xs"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-7 px-3"
                              onClick={() => window.open(tool.url, "_blank", "noopener,noreferrer")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              访问官网
                            </Button>
                            <button
                              onClick={() => toggleFavorite(tool.id)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="收藏"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isFavorite(tool.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => toggleCompare(tool.id)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="对比"
                            >
                              <BarChart3
                                className={`w-3.5 h-3.5 ${
                                  isCompared(tool.id)
                                    ? "text-blue-500"
                                    : "text-gray-400 hover:text-blue-400"
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => navigate(`/tools/${tool.id}`)}
                              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-blue-500 ml-auto text-xs"
                            >
                              详情 <ChevronRight className="w-3 h-3 inline" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 3. Selection Tips */}
            {selectionTips.length > 0 && (
              <section>
                <SectionTitle icon={<Lightbulb className="w-5 h-5 text-amber-500" />} title="工具选择建议" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectionTips.map((tip, idx) => {
                    const iconMap: Record<string, string> = {
                      "新手": "🌱",
                      "免费优先": "💰",
                      "专业用户": "🎯",
                    };
                    return (
                      <Card key={idx} className="border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{iconMap[tip.for] ?? "💡"}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              {tip.for}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {tip.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. Audience */}
            {content.audience.length > 0 && (
              <section>
                <SectionTitle icon={<Users className="w-5 h-5 text-green-500" />} title="适合人群" />
                <div className="flex flex-wrap gap-2">
                  {content.audience.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm border border-green-200/50 dark:border-green-800/50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. FAQ */}
            {faqItems.length > 0 && (
              <section>
                <SectionTitle icon={<MessageCircle className="w-5 h-5 text-amber-500" />} title="常见问题" />
                <div className="space-y-3">
                  {faqItems.map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm pr-4">
                          {item.q}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right Column (1/3) — Related + CTA ── */}
          <div className="space-y-6">
            {/* Related Tasks */}
            {relatedTasks.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                    <Zap className="w-4 h-4 text-blue-500" />
                    相关任务
                  </h3>
                  <div className="space-y-1.5">
                    {relatedTasks.map((rt) => (
                      <button
                        key={rt.value}
                        onClick={() => navigate(`/tasks/${rt.value}`)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <span className="text-lg flex-shrink-0">{rt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {rt.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {rt.description}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Tool Entry */}
            <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  <Send className="w-4 h-4 text-amber-500" />
                  没有找到合适的工具？
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  提交工具建议，帮助我们完善 {taskDef.label} 场景的工具库。
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  onClick={() => navigate("/submit")}
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  提交工具建议
                </Button>
              </CardContent>
            </Card>

            {/* Quiz CTA */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  不知道选哪个？
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  花 30 秒回答几个问题，获得个性化工具推荐。
                </p>
                <Button
                  size="sm"
                  className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => navigate("/quiz")}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  30 秒快速推荐
                </Button>
              </CardContent>
            </Card>

            {/* Quick task stats */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  任务概览
                </h3>
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>相关工具</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{toolCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>免费工具</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {featuredTools.filter((t) => t.pricing === "Free").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>精选推荐</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {featuredTools.filter((t) => t.featured).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>最高评分</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {featuredTools.length > 0
                        ? Math.max(...featuredTools.map((t) => t.rating ?? 0))
                        : "-"}
                      ⭐
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ═══ Footer CTA ═══ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8 pb-10 mt-10 border-t border-gray-200 dark:border-gray-800">
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
          <Button variant="outline" onClick={() => navigate("/submit")}>
            <Send className="w-4 h-4 mr-2" />
            提交工具
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Title (Reusable) ──────────────────────────────────────────

function SectionTitle({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        {icon}
        {title}
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-3 hidden sm:block" />
      </h2>
      {action}
    </div>
  );
}
