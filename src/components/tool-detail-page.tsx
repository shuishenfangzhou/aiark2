"use client";

import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Heart, BarChart3, Check, ChevronRight, Star, Users, Tags, Target, DollarSign, ThumbsUp, AlertTriangle, Globe, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { findToolBySlug, findSimilarTools, toolToSlug } from "@/data/tool-slugs";
import { TASK_DEFINITIONS, getTaskLabel } from "@/data/task-definitions";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";
import type { Tool } from "@/data/comprehensive-tools";

// ─── Helpers ────────────────────────────────────────────────────────

const PRICING_LABELS: Record<string, { label: string; color: string }> = {
  Free: { label: "免费", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none" },
  Freemium: { label: "免费增值", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none" },
  Paid: { label: "付费", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none" },
};

function getPros(tool: Tool): string[] {
  const pros: string[] = [];
  if (tool.featured) pros.push("平台精选推荐工具");
  if (tool.rating && tool.rating >= 4.5) pros.push(`用户评分高达 ${tool.rating} ⭐`);
  if (tool.pricing === "Free") pros.push("完全免费使用，零成本上手");
  if (tool.pricing === "Freemium") pros.push("提供免费版本，可按需升级");
  if (tool.taskTags && tool.taskTags.length > 0) {
    pros.push(`覆盖 ${tool.taskTags.length} 个任务场景`);
  }
  if (tool.reviewCount && tool.reviewCount > 1000) pros.push("拥有大量活跃用户和社区支持");
  return pros.length > 0 ? pros : ["功能丰富，满足日常需求"];
}

function getCons(tool: Tool): string[] {
  const cons: string[] = [];
  if (tool.pricing === "Paid") cons.push("需要付费使用");
  if (tool.pricing === "Freemium") cons.push("高级功能需要升级付费");
  if (!tool.featured) cons.push("非平台精选推荐工具");
  if (tool.rating && tool.rating < 4) cons.push("用户评分相对较低");
  if (tool.reviewCount && tool.reviewCount < 100) cons.push("用户评价数量较少");
  return cons.length > 0 ? cons : ["具体功能可能需要实际体验后评估"];
}

function getAudience(tool: Tool): string[] {
  const audience = new Set<string>();
  const desc = tool.description.toLowerCase();

  if (desc.includes("开发者") || desc.includes("程序员") || desc.includes("developer") || tool.category.includes("编程")) audience.add("开发者");
  if (desc.includes("设计师") || desc.includes("设计") || tool.category.includes("设计") || tool.category.includes("图像")) audience.add("设计师");
  if (desc.includes("学生") || tool.category.includes("学习")) audience.add("学生");
  if (desc.includes("企业") || desc.includes("团队") || tool.pricing === "Paid") audience.add("企业团队");
  if (desc.includes("新手") || desc.includes("小白") || desc.includes("easy") || desc.includes("简单")) audience.add("新手入门");
  if (desc.includes("marketing") || desc.includes("营销") || desc.includes("运营")) audience.add("市场营销人员");
  if (desc.includes("research") || desc.includes("学术") || desc.includes("研究")) audience.add("研究人员");
  if (tool.pricing === "Free" || tool.pricing === "Freemium") audience.add("个人用户");
  if (audience.size === 0) audience.add("所有 AI 工具使用者");

  return Array.from(audience);
}

function generateFeatures(tool: Tool): string[] {
  const features: string[] = [];
  const desc = tool.description;

  // Extract meaningful feature phrases from description
  const phrases = desc.split(/[，。、；：,.;:]/).filter(p => p.trim().length > 8);
  features.push(...phrases.slice(0, 3));

  // Add tag-based features
  features.push(`支持标签：${tool.tags.slice(0, 3).join("、")}`);

  // Task-based
  if (tool.taskTags && tool.taskTags.length > 0) {
    features.push(`适用任务：${tool.taskTags.map(t => getTaskLabel(t)).join("、")}`);
  }

  return features.slice(0, 4);
}

// ─── Component ──────────────────────────────────────────────────────

export function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  const tool = slug ? findToolBySlug(slug) : undefined;

  const similarTools = useMemo(() => {
    if (!tool) return [];
    return findSimilarTools(tool, 4);
  }, [tool]);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} — AI 工具导航`;
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
  const pros = getPros(tool);
  const cons = getCons(tool);
  const audience = getAudience(tool);
  const features = generateFeatures(tool);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* Hero section */}
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

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{tool.rating ?? "暂无"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{tool.reviewCount ?? 0}</span>
                </span>
                {tool.category && (
                  <span className="flex items-center gap-1">
                    <Tags className="w-4 h-4" />
                    <span>{tool.category}</span>
                  </span>
                )}
                {tool.region && (
                  <span className={`flex items-center gap-1 ${
                    tool.region === "domestic" ? "text-green-600 dark:text-green-400" :
                    tool.region === "requires-vpn" ? "text-amber-600 dark:text-amber-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    <Globe className="w-4 h-4" />
                    <span>{
                      tool.region === "domestic" ? "国内可用" :
                      tool.region === "requires-vpn" ? "需科学上网" :
                      "海外工具"
                    }</span>
                  </span>
                )}
                {tool.difficulty && (
                  <span className={`flex items-center gap-1 ${
                    tool.difficulty === "beginner" ? "text-green-600 dark:text-green-400" :
                    tool.difficulty === "advanced" ? "text-purple-600 dark:text-purple-400" :
                    "text-blue-600 dark:text-blue-400"
                  }`}>
                    <Star className="w-4 h-4" />
                    <span>{
                      tool.difficulty === "beginner" ? "新手适用" :
                      tool.difficulty === "advanced" ? "专业级" :
                      "进阶"
                    }</span>
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

              {/* Task tags */}
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
                  <BarChart3 className={`w-4 h-4 ${isCompared(tool.id) ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
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

        {/* Core Features */}
        {features.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              核心功能
            </h2>
            <div className="grid gap-3">
              {features.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 mb-3">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                优点
              </h3>
              <ul className="space-y-2">
                {pros.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200/50 dark:border-amber-800/50">
            <CardContent className="p-5">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                注意事项
              </h3>
              <ul className="space-y-2">
                {cons.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Suitable for */}
        {audience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              适合人群
            </h2>
            <div className="flex flex-wrap gap-2">
              {audience.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm border border-green-200/50 dark:border-green-800/50">
                  <Check className="w-3.5 h-3.5" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Price info */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            价格信息
          </h2>
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={pricingInfo.color}>{pricingInfo.label}</Badge>
                <span className="text-sm text-gray-500">
                  {tool.pricing === "Free" && "可免费使用全部功能"}
                  {tool.pricing === "Freemium" && "基础功能免费，高级功能需付费"}
                  {tool.pricing === "Paid" && "需付费订阅或一次性购买"}
                </span>
              </div>
              {tool.pricing === "Free" && (
                <p className="text-sm text-gray-500">该工具完全免费，适合预算有限的个人用户和小团队。</p>
              )}
              {tool.pricing === "Freemium" && (
                <p className="text-sm text-gray-500">提供免费版本，可按需升级到付费版本解锁更多高级功能和用量限制。</p>
              )}
              {tool.pricing === "Paid" && (
                <p className="text-sm text-gray-500">该工具为付费产品，建议先查看官网了解具体定价方案和试用政策。</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Similar tools */}
        {similarTools.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Tags className="w-5 h-5 text-blue-500" />
              相似工具推荐
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similarTools.map(st => (
                <button
                  key={st.id}
                  onClick={() => navigate(`/tools/${toolToSlug(st)}`)}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all text-left"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                    <img
                      src={st.icon}
                      alt={st.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-base font-bold text-blue-500">${st.name.charAt(0)}</div>`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{st.name}</p>
                    <p className="text-xs text-gray-500 truncate">{st.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-500" />
            标签
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 pb-10 border-t border-gray-200 dark:border-gray-800">
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


