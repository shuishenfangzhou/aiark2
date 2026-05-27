"use client";

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiWiki } from "@/data/ai-wiki";
import { setPageMeta } from "@/lib/seo";

// ─── Category icon mapping ────────────────────────────────────────

const CATEGORY_BADGES: Record<string, { color: string }> = {
  "基础概念": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  "模型技术": { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  "应用技术": { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  "技术架构": { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  "基础架构": { color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
  "训练方法": { color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
  "问题与挑战": { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  "模型能力": { color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
};

// ─── Page ─────────────────────────────────────────────────────────

export function LearnPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageMeta({
      title: "AI 百科 — AI 核心概念与术语大全 — AI Ark",
      description: "了解人工智能领域的核心概念、技术术语和应用知识，从 AGI 到大语言模型，从 Prompt Engineering 到 RAG。",
    });
    window.scrollTo(0, 0);
  }, []);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof aiWiki>();
    for (const item of aiWiki) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI 百科
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            了解人工智能领域的核心概念、技术术语和应用知识，共 {aiWiki.length} 个词条
          </p>
        </div>

        {/* Term list grouped by category */}
        <div className="space-y-6">
          {grouped.map(([category, items]) => {
            const badge = CATEGORY_BADGES[category];
            return (
              <Card key={category} className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-0">
                  {/* Category header */}
                  <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                    <Badge className={`text-xs ${badge?.color ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}>
                      {category}
                    </Badge>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      {items.length} 个词条
                    </span>
                  </div>

                  {/* Terms */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      >
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {item.term}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-center pt-8 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
