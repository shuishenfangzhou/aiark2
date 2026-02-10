import { ToolCard } from "@/components/tool-card";
import { tools } from "@/data/tools";
import { Star } from "lucide-react";

export function FeaturedTools() {
  const featuredTools = tools.filter(tool => 
    tool.tags.includes("热门") || tool.tags.includes("GPT-4")
  ).slice(0, 6);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          精选工具
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}