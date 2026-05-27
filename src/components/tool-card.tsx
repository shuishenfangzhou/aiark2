"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Users, Heart, Share2, BarChart3, Globe } from "lucide-react";
import { Tool } from "@/data/comprehensive-tools";
import { TASK_DEFINITIONS } from "@/data/task-definitions";
import { toolToSlug } from "@/data/tool-slugs";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  tool: Tool;
}

const getPricingBadge = (pricing: string) => {
  switch (pricing) {
    case "Free":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none">免费</Badge>;
    case "Freemium":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none">免费增值</Badge>;
    case "Paid":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none">付费</Badge>;
    default:
      return null;
  }
};

export function ToolCard({ tool }: ToolCardProps) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  const handleShare = async () => {
    const shareData = {
      title: tool.name,
      text: `${tool.name} - ${tool.description}`,
      url: tool.url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(tool.url);
      }
    } catch {
      // User cancelled or clipboard not available
    }
  };

  return (
    <Card
      className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/tools/${toolToSlug(tool)}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-blue-500">
                {tool.name.charAt(0)}
              </div>
            ) : (
              <img
                src={tool.icon}
                alt={`${tool.name} 图标`}
                className="object-cover w-full h-full"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {tool.name}
              </CardTitle>
              <div className="flex items-center gap-1 flex-shrink-0">
                {tool.difficulty && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                    tool.difficulty === "beginner" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                    tool.difficulty === "advanced" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`} title={
                    tool.difficulty === "beginner" ? "新手适用" :
                    tool.difficulty === "advanced" ? "专业级" : "进阶"
                  }>
                    {tool.difficulty === "beginner" ? "新" : tool.difficulty === "advanced" ? "专" : "进"}
                  </span>
                )}
                {getPricingBadge(tool.pricing)}
              </div>
            </div>
            {tool.chineseName && tool.chineseName !== tool.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tool.chineseName}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 py-2">
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {tool.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tool.tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-0.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Task tags (max 2) */}
        {tool.taskTags && tool.taskTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tool.taskTags.slice(0, 2).map((taskTag) => {
              const taskDef = TASK_DEFINITIONS.find(t => t.value === taskTag);
              if (!taskDef) return null;
              return (
                <span
                  key={taskTag}
                  className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
                >
                  <span className="text-xs leading-none">{taskDef.icon}</span>
                  <span>{taskDef.label}</span>
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="w-full flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{tool.rating || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{tool.reviewCount ? (tool.reviewCount > 1000 ? `${(tool.reviewCount/1000).toFixed(1)}k` : tool.reviewCount) : 0}</span>
          </div>
          {tool.region && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded ${
              tool.region === "domestic" ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
              tool.region === "requires-vpn" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
              "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            }`}>
              <Globe className="w-2.5 h-2.5" />
              {tool.region === "domestic" ? "国内" : tool.region === "requires-vpn" ? "需工具" : "海外"}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }}
              className="hover:scale-110 transition-transform"
              aria-label={isFavorite(tool.id) ? "取消收藏" : "收藏"}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorite(tool.id) ? "fill-red-500 text-red-500" : "hover:text-red-400"
                }`}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(tool.id); }}
              className="hover:scale-110 transition-transform"
              aria-label={isCompared(tool.id) ? "移出对比" : "加入对比"}
            >
              <BarChart3 className={`w-3.5 h-3.5 transition-colors ${
                isCompared(tool.id) ? "text-blue-500 fill-blue-500" : "hover:text-blue-400"
              }`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="hover:scale-110 transition-transform"
              aria-label="分享"
            >
              <Share2 className="w-3.5 h-3.5 hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>
        
        <Button
          variant="default"
          size="sm"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); window.open(tool.url, '_blank', 'noopener', 'noreferrer'); }}
        >
          <ExternalLink className="w-3.5 h-3.5 mr-2" />
          访问官网
        </Button>
      </CardFooter>
    </Card>
  );
}
