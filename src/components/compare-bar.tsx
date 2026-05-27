"use client";

import { useMemo } from "react";
import { X, ExternalLink, BarChart3 } from "lucide-react";
import { comprehensiveTools } from "@/data/comprehensive-tools";
import { useCompare } from "@/lib/compare-context";

export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare, compareCount } = useCompare();

  const tools = useMemo(
    () => compareIds.map(id => comprehensiveTools.find(t => t.id === id)).filter(Boolean),
    [compareIds],
  );

  if (compareIds.length === 0) return null;

  const pricingMap: Record<string, string> = {
    Free: "免费",
    Freemium: "免费增值",
    Paid: "付费",
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              工具对比 <span className="text-gray-400 font-normal">({compareIds.length}/4)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {tools.length >= 2 && (
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                可对比 {tools.length} 个工具
              </span>
            )}
            <button
              onClick={clearCompare}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              清空对比
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tools.filter(Boolean).map((tool, index) => (
            <div
              key={tool!.id}
              className="relative bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleCompare(tool!.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label={`移除 ${tool!.name}`}
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {tool!.name}
                </h4>
              </div>

              <div className="flex flex-wrap gap-1 mb-1.5">
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {pricingMap[tool!.pricing] || tool!.pricing}
                </span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {tool!.category?.slice(0, 6)}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {tool!.description}
              </p>

              <a
                href={tool!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                访问官网 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}

          {Array.from({ length: 4 - tools.filter(Boolean).length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-center"
            >
              <span className="text-xs text-gray-400">
                {tools.length < 2 ? "再选一个可对比" : "添加更多工具"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
