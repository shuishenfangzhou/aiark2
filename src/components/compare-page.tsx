import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPageMeta } from "@/lib/seo";
import {
  ArrowLeft, ExternalLink, Heart, BarChart3, Star,
  Tag, Globe, Smartphone, Target, DollarSign, Zap,
  Trophy, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { comprehensiveTools, Tool } from "@/data/comprehensive-tools";
import { TASK_DEFINITIONS } from "@/data/task-definitions";
import { useCompare } from "@/lib/compare-context";
import { useFavorites } from "@/lib/favorites-context";

// ─── Helpers ────────────────────────────────────────────────────────────

const REGION_LABEL: Record<string, string> = {
  domestic: "国内可用",
  global: "海外",
  "requires-vpn": "需科学上网",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "新手",
  intermediate: "进阶",
  advanced: "专业",
};

const PRICING_LABEL: Record<string, string> = {
  Free: "免费",
  Freemium: "免费增值",
  Paid: "付费",
};

// ─── Compare Page ────────────────────────────────────────────────────────

export function ComparePage() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageMeta({
      title: "AI 工具对比 — AI Ark",
      description: "横向对比多款 AI 工具的功能、价格、评分、平台支持等 12 个维度，帮你快速做出选择。",
    });
  }, []);
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();

  const tools = useMemo(
    () => compareIds.map((id) => comprehensiveTools.find((t) => t.id === id)).filter(Boolean) as Tool[],
    [compareIds],
  );

  // ── Empty state ────────────────────────────────────────────────────
  if (tools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                还没有选择要对比的工具
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                从工具库中挑选 2-4 个 AI 工具，在这里进行详细对比，帮你快速做出最佳选择。
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/quiz")}>
                  去做推荐测验
                </Button>
                <Button onClick={() => navigate("/")}>
                  去工具库添加
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Quick advice ───────────────────────────────────────────────────
  const advice: string[] = [];
  if (tools.length >= 2) {
    // Price-sensitive
    const hasFreeOrFreemium = tools.some((t) => t.pricing === "Free" || t.pricing === "Freemium");
    if (hasFreeOrFreemium) {
      const freeTools = tools.filter((t) => t.pricing === "Free" || t.pricing === "Freemium").map((t) => t.name);
      advice.push(`预算有限推荐：${freeTools.join("、")}（免费/免费增值）`);
    }

    // Beginner
    const beginnerTools = tools.filter((t) => t.difficulty === "beginner").map((t) => t.name);
    if (beginnerTools.length > 0) {
      advice.push(`新手友好推荐：${beginnerTools.join("、")}（上手简单）`);
    }

    // Domestic
    const domesticTools = tools.filter((t) => t.region === "domestic").map((t) => t.name);
    if (domesticTools.length > 0) {
      advice.push(`国内可用推荐：${domesticTools.join("、")}（无需科学上网）`);
    }

    // Rating
    const topRated = [...tools].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
    if (topRated?.rating && topRated.rating >= 4) {
      advice.push(`用户评分最高：${topRated.name}（${topRated.rating}⭐）`);
    }
  }
  if (advice.length === 0) {
    advice.push("建议结合价格、任务场景和访问条件综合判断。");
  }

  // ── Table rows ─────────────────────────────────────────────────────
  type RowDef = {
    label: string;
    icon: React.ReactNode;
    render: (tool: Tool) => React.ReactNode;
  };

  const rows: RowDef[] = [
    {
      label: "简介",
      icon: <Tag className="w-4 h-4" />,
      render: (t) => <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.description}</p>,
    },
    {
      label: "分类",
      icon: null,
      render: (t) => <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.category}</span>,
    },
    {
      label: "适合任务",
      icon: <Target className="w-4 h-4" />,
      render: (t) =>
        t.taskTags && t.taskTags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {t.taskTags.map((tag) => {
              const td = TASK_DEFINITIONS.find((d) => d.value === tag);
              return (
                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  {td ? td.label : tag}
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-sm text-gray-400">暂未收录</span>
        ),
    },
    {
      label: "价格",
      icon: <DollarSign className="w-4 h-4" />,
      render: (t) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
          t.pricing === "Free" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
          t.pricing === "Freemium" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        }`}>
          {PRICING_LABEL[t.pricing] || t.pricing}
        </span>
      ),
    },
    {
      label: "国内可用",
      icon: <Globe className="w-4 h-4" />,
      render: (t) => {
        if (!t.region) return <span className="text-sm text-gray-400">暂未收录</span>;
        const colors: Record<string, string> = {
          domestic: "text-green-600 dark:text-green-400",
          global: "text-blue-600 dark:text-blue-400",
          "requires-vpn": "text-amber-600 dark:text-amber-400",
        };
        return (
          <span className={`text-sm font-medium ${colors[t.region] || "text-gray-400"}`}>
            {REGION_LABEL[t.region] || t.region}
          </span>
        );
      },
    },
    {
      label: "平台支持",
      icon: <Smartphone className="w-4 h-4" />,
      render: (t) => {
        if (!t.platform || t.platform.length === 0) return <span className="text-sm text-gray-400">暂未收录</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {t.platform.map((p) => (
              <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                {p === "web" ? "Web" : p === "api" ? "API" : p === "windows" ? "Windows" :
                 p === "macos" ? "macOS" : p === "ios" ? "iOS" : p === "android" ? "Android" :
                 p === "chrome" ? "Chrome" : p === "vscode" ? "VS Code" : p === "cli" ? "CLI" : p}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      label: "使用难度",
      icon: <Zap className="w-4 h-4" />,
      render: (t) => {
        if (!t.difficulty) return <span className="text-sm text-gray-400">暂未收录</span>;
        const colors: Record<string, string> = {
          beginner: "text-green-600 dark:text-green-400",
          intermediate: "text-blue-600 dark:text-blue-400",
          advanced: "text-purple-600 dark:text-purple-400",
        };
        return (
          <span className={`text-sm font-medium ${colors[t.difficulty] || ""}`}>
            {DIFFICULTY_LABEL[t.difficulty] || t.difficulty}
          </span>
        );
      },
    },
    {
      label: "评分",
      icon: <Star className="w-4 h-4 text-yellow-500" />,
      render: (t) => (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t.rating ? `${t.rating}⭐` : "暂未收录"}
        </span>
      ),
    },
    {
      label: "标签",
      icon: null,
      render: (t) =>
        t.tags && t.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {t.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-400">暂未收录</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI 工具对比</h1>
              <p className="text-xs text-gray-400">对比 {tools.length} 个工具，快速做出选择</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCompare} className="text-gray-400 text-xs">
            清空对比
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick advice */}
        {advice.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">快速建议</h3>
                  <ul className="space-y-1">
                    {advice.map((a, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <table className="w-full min-w-[640px]">
            {/* Header row — tool names */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left p-4 w-28 md:w-36 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  对比维度
                </th>
                {tools.map((tool) => (
                  <th key={tool.id} className="p-4 min-w-[180px] md:min-w-[220px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                        <img
                          src={tool.icon}
                          alt={tool.name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.innerText = tool.name.charAt(0);
                          }}
                        />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{tool.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title={isFavorite(tool.id) ? "取消收藏" : "收藏"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite(tool.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                      <button
                        onClick={() => toggleCompare(tool.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-red-500"
                        title="移出对比"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-blue-500 ml-auto"
                        title="访问官网"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Data rows */}
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      {row.icon && row.icon}
                      {row.label}
                    </div>
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 align-top">
                      {row.render(tool)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom spacer for the floating compare bar */}
        <div className="h-24" />
      </div>
    </div>
  );
}


