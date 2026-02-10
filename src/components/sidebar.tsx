"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolCategories } from "@/data/comprehensive-tools";
import { cn } from "@/lib/utils";
import { 
  Hash, 
  Flame, 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  Code2, 
  Briefcase, 
  Search, 
  Bot, 
  Mic, 
  Palette, 
  Cpu, 
  GraduationCap, 
  ShieldCheck,
  LayoutGrid,
  MessageSquare,
  Database,
  Terminal,
  FileText,
  Newspaper,
  Github,
  BookOpen
} from "lucide-react";

interface SidebarProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  isCollapsed?: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "AI写作工具": return <PenTool className="w-4 h-4" />;
    case "AI图像工具": return <ImageIcon className="w-4 h-4" />;
    case "AI视频工具": return <Video className="w-4 h-4" />;
    case "AI办公工具": return <Briefcase className="w-4 h-4" />;
    case "AI智能体": return <Bot className="w-4 h-4" />;
    case "AI聊天助手": return <MessageSquare className="w-4 h-4" />;
    case "AI编程工具": return <Code2 className="w-4 h-4" />;
    case "AI设计工具": return <Palette className="w-4 h-4" />;
    case "AI音频工具": return <Mic className="w-4 h-4" />;
    case "AI搜索引擎": return <Search className="w-4 h-4" />;
    case "AI开发平台": return <Terminal className="w-4 h-4" />;
    case "AI学习网站": return <GraduationCap className="w-4 h-4" />;
    case "AI训练模型": return <Database className="w-4 h-4" />;
    case "AI内容检测": return <ShieldCheck className="w-4 h-4" />;
    case "AI提示指令": return <FileText className="w-4 h-4" />;
    case "AI应用集": return <LayoutGrid className="w-4 h-4" />;
    default: return <Hash className="w-4 h-4" />;
  }
};

export function Sidebar({ activeCategory, onCategoryClick, isCollapsed = false }: SidebarProps) {
  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    if (category !== "all") {
      const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 h-[calc(100vh-4rem)] sticky top-16 flex flex-col transition-all duration-300`}>
      <div className="p-2 flex-1 overflow-hidden flex flex-col">
        {!isCollapsed && (
          <div className="mb-4 px-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              工具导航
            </h2>
          </div>
        )}
        
        <ScrollArea className="flex-1 -mx-2">
          <nav className="space-y-1 px-2 pb-4">
            <Button
              variant="ghost"
              className={cn(
                `${isCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full justify-start text-left'} font-medium mb-2 rounded-lg transition-all duration-200`,
                activeCategory === "all"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              onClick={() => handleCategoryClick("all")}
              title={isCollapsed ? "全部工具" : ""}
            >
              <LayoutGrid className="w-4 h-4" />
              {!isCollapsed && <span className="ml-3">全部工具</span>}
              {!isCollapsed && activeCategory === "all" && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </Button>
            
            {!isCollapsed && <div className="my-2 border-t border-gray-100 dark:border-gray-800" />}
            
            {toolCategories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  `${isCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full justify-start text-left'} font-medium rounded-lg transition-all duration-200 group`,
                  activeCategory === category 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                )}
                onClick={() => handleCategoryClick(category)}
                title={isCollapsed ? category : ""}
              >
                <span className={cn(
                  "transition-colors",
                  activeCategory === category 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )}>
                  {getCategoryIcon(category)}
                </span>
                {!isCollapsed && <span className="ml-3">{category}</span>}
                {!isCollapsed && activeCategory === category && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Button>
            ))}
            
            {!isCollapsed && (
              <>
                <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                
                <div className="mb-4 px-2">
                  <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    内容专区
                  </h2>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-medium mb-2 h-10 px-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => {
                    const element = document.getElementById('ai-news');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <Newspaper className="w-4 h-4 mr-3" />
                  <span>AI快讯</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-medium mb-2 h-10 px-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => {
                    const element = document.getElementById('ai-projects');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <Github className="w-4 h-4 mr-3" />
                  <span>AI项目</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-medium mb-2 h-10 px-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => {
                    const element = document.getElementById('ai-wiki');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  <span>AI百科</span>
                </Button>
              </>
            )}
          </nav>
        </ScrollArea>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2025 AI Tools Directory
          </div>
        </div>
      )}
    </div>
  );
}