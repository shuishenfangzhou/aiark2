"use client";

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Heart, BarChart3, Star, Users, Tags,
  DollarSign, AlertTriangle, Globe, Smartphone, Monitor, Check, Trophy,
  ChevronRight, Zap, Clock, ThumbsUp, XCircle, Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { findToolBySlug, toolToSlug } from "@/data/tool-slugs";
import { TASK_DEFINITIONS } from "@/data/task-definitions";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";
import {
  getToolAudience,
  getToolStrengths,
  getToolLimitations,
  getAlternativeTools,
  getRecommendedWorkflow,
  getToolDataStatus,
} from "@/lib/tool-insights";
import { setPageMeta } from "@/lib/seo";

// ─── Helpers ────────────────────────────────────────────────────────

const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  Free: { label: "免费", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none" },
  Freemium: { label: "免费增值", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none" },
  Paid: { label: "付费", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none" },
};

const REGION_LABEL: Record<string, string> = {
  domestic: "国内可用",
  global: "海外",
  "requires-vpn": "需科学上网",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "新手适用",
  intermediate: "进阶",
  advanced: "专业级",
};

// ─── Component ──────────────────────────────────────────────────────

export function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  const tool = slug ? findToolBySlug(slug) : undefined;

  const alternativeTools = useMemo(() => {
    if (!tool) return [];
    return getAlternativeTools(tool);
  }, [tool]);

  useEffect(() => {
    if (tool) {
      const name = tool.name;
      const description =
        tool.description?.slice(0, 200) ||
        `了解 ${name} 的功能、价格、平台支持、适用场景和替代工具。`;
      const rating = tool.rating ?? 0;

      setPageMeta({
        title: `${name} AI 工具介绍、价格与替代工具 — AI Ark`,
        description: `${name} — ${description}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name,
          description,
          applicationCategory: "AIApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: tool.pricing === "Free" ? "0" : undefined,
            priceCurrency: "CNY",
            availability: "https://schema.org/OnlineOnly",
          },
          aggregateRating:
            rating > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: rating,
                  bestRating: 5,
                  ratingCount: tool.reviewCount ?? 1,
                }
              : undefined,
          url: window.location.href,
          image: tool.icon || undefined,
        },
      });
    }
    window.scrollTo(0, 0);
  }, [tool]);

  // ─── 404 ──────────────────────────────────────────
  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">工具未找到</h1>
        <p className="text-gray-500 mb-6">该工具页面不存在</p>
        <Button onClick={() => navigate("/")}>返回首页</Button>
      </div>
    );
  }

  const pricingInfo = PRICING_LABELS[tool.pricing] ?? { label: tool.pricing, color: "bg-gray-100 text-gray-800 border-none" };
  const audience = getToolAudience(tool);
  const strengths = getToolStrengths(tool);
  const limitations = getToolLimitations(tool);
  const workflow = getRecommendedWorkflow(tool);
  const dataStatus = getToolDataStatus(tool);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* ── Hero Section ─────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-start gap-5 mb-6">
            {/* Icon */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
              <img
                src={tool.icon}
                alt={`${tool.name} 图标`}
                className="object-cover w-full h-full"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-500">${tool.name.charAt(0)}</div>`;
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </h1>
                  {tool.chineseName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tool.chineseName}</p>
                  )}
                </div>
                <Badge className={pricingInfo.color}>{pricingInfo.label}</Badge>
              </div>

              <p className="text-base text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                {tool.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                {tool.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{tool.rating}</span>
                  </span>
                )}
                {tool.reviewCount && tool.reviewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{tool.reviewCount}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Tags className="w-4 h-4" />
                  <span>{tool.category}</span>
                </span>
                {tool.region && (
                  <span className={`flex items-center gap-1 ${
                    tool.region === "domestic" ? "text-green-600 dark:text-green-400" :
                    tool.region === "requires-vpn" ? "text-amber-600 dark:text-amber-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    <Globe className="w-4 h-4" />
                    <span>{REGION_LABEL[tool.region] ?? tool.region}</span>
                  </span>
                )}
                {tool.difficulty && (
                  <span className={`flex items-center gap-1 ${
                    tool.difficulty === "beginner" ? "text-green-600 dark:text-green-400" :
                    tool.difficulty === "advanced" ? "text-purple-600 dark:text-purple-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    <Zap className="w-4 h-4" />
                    <span>{DIFFICULTY_LABEL[tool.difficulty]}</span>
                  </span>
                )}
              </div>

              {/* bestFor */}
              {tool.bestFor && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 italic border-l-2 border-blue-300 dark:border-blue-600 pl-3">
                  {tool.bestFor}
                </p>
              )}

              {/* Platform badges */}
              {tool.platform && tool.platform.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tool.platform.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {p === "web" && <Monitor className="w-3 h-3" />}
                      {p === "api" && <span className="text-[10px] font-bold">API</span>}
                      {p === "windows" && <span className="text-[10px] font-bold">Win</span>}
                      {p === "macos" && <span className="text-[10px] font-bold">Mac</span>}
                      {p === "ios" && <Smartphone className="w-3 h-3" />}
                      {p === "android" && <Smartphone className="w-3 h-3" />}
                      {p === "chrome" && <span className="text-[10px] font-bold">Ext</span>}
                      {p === "vscode" && <span className="text-[10px] font-bold">IDE</span>}
                      {p === "cli" && <span className="text-[10px] font-bold">CLI</span>}
                      {p === "docker" && <span className="text-[10px] font-bold">Dkr</span>}
                      {!["web","api","windows","macos","ios","android","chrome","vscode","cli","docker"].includes(p) && p}
                    </span>
                  ))}
                </div>
              )}

              {/* Task tags (clickable) */}
              {tool.taskTags && tool.taskTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tool.taskTags.map(tag => {
                    const td = TASK_DEFINITIONS.find(t => t.value === tag);
                    if (!td) return null;
                    return (
                      <button
                        key={tag}
                        onClick={() => navigate(`/tasks/${tag}`)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        title={`查看 ${td.label} 相关工具`}
                      >
                        <span>{td.icon}</span>
                        <span>{td.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                  onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  访问官网
                </Button>
                <button
                  onClick={() => toggleFavorite(tool.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(tool.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  {isFavorite(tool.id) ? "已收藏" : "收藏"}
                </button>
                <button
                  onClick={() => toggleCompare(tool.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  <BarChart3 className={`w-4 h-4 ${isCompared(tool.id) ? "text-blue-500" : "text-gray-400"}`} />
                  {isCompared(tool.id) ? "已加入对比" : "加入对比"}
                </button>
                <button
                  onClick={() => navigate(`/feedback?tool=${encodeURIComponent(tool.name)}&url=${encodeURIComponent(tool.url)}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-500 dark:text-gray-400"
                >
                  <AlertTriangle className="w-4 h-4" />
                  纠错反馈
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-Column Layout ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ Main Content (Left) ═══ */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. 适合谁使用 */}
            <section>
              <SectionTitle icon={<Users className="w-5 h-5 text-blue-500" />} title="适合谁使用" />
              <div className="grid gap-2.5">
                {audience.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
                    <div className="w-7 h-7 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. 核心优势 */}
            <section>
              <SectionTitle icon={<Trophy className="w-5 h-5 text-amber-500" />} title="核心优势" />
              <div className="grid gap-2.5">
                {strengths.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
                    <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. 可能局限 */}
            <section>
              <SectionTitle icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} title="可能局限" />
              <div className="grid gap-2.5">
                {limitations.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
                    <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. 推荐工作流 */}
            <section>
              <SectionTitle icon={<Layers className="w-5 h-5 text-blue-500" />} title="推荐工作流" />
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-blue-100 dark:bg-blue-900/50 rounded-full" />
                <div className="space-y-5">
                  {workflow.map((step) => (
                    <div key={step.step} className="flex items-start gap-4 relative">
                      {/* Step circle */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 z-10 text-sm font-bold text-white shadow-sm">
                        {step.step}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Tags */}
            <section>
              <SectionTitle icon={<Tags className="w-5 h-5 text-blue-500" />} title="标签" />
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* ═══ Sidebar (Right) ═══ */}
          <div className="space-y-6">

            {/* 6. Price info */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  价格信息
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={pricingInfo.color}>{pricingInfo.label}</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {tool.pricing === "Free" && "可免费使用全部功能，零成本上手"}
                  {tool.pricing === "Freemium" && "基础功能免费，高级功能需付费升级"}
                  {tool.pricing === "Paid" && "需付费订阅或一次性购买，建议查看官网了解具体方案"}
                </p>
              </CardContent>
            </Card>

            {/* 7. Data status */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  数据状态
                </h3>
                <div className="space-y-2">
                  {dataStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className={`flex items-center gap-1 ${
                        item.populated
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}>
                        {item.populated ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{item.populated ? "已收录" : "暂未收录"}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  信息可能有所滞后，建议访问官网确认最新详情
                </p>
              </CardContent>
            </Card>

            {/* 8. Similar / Alternative tools */}
            {alternativeTools.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                    <Search className="w-4 h-4 text-blue-500" />
                    替代工具
                  </h3>
                  <div className="space-y-2">
                    {alternativeTools.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => navigate(`/tools/${toolToSlug(alt)}`)}
                        className="w-full flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                          <img
                            src={alt.icon}
                            alt={alt.name}
                            className="object-cover w-full h-full"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs font-bold text-blue-500">${alt.name.charAt(0)}</div>`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{alt.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{alt.category} · {alt.pricing === "Free" ? "免费" : alt.pricing === "Freemium" ? "免费增值" : "付费"}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 9. Feedback CTA */}
            <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  信息有误？
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  发现信息不准确或链接失效？帮助我们改进。
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  onClick={() => navigate(`/feedback?tool=${encodeURIComponent(tool.name)}&url=${encodeURIComponent(tool.url)}`)}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  提交纠错
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Footer CTA ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8 pb-10 mt-10 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            访问 {tool.name} 官网
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            浏览更多 AI 工具
          </Button>
          <Button variant="outline" onClick={() => navigate("/quiz")}>
            30 秒快速推荐
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Title Component ─────────────────────────────────────────

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
      {icon}
      {title}
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-3" />
    </h2>
  );
}
