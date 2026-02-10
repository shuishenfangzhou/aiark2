"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolCategories } from "@/data/comprehensive-tools";
import { cn } from "@/lib/utils";
import { 
  Menu, 
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

interface MobileSidebarProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
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

export function MobileSidebar({ activeCategory, onCategoryClick }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    setOpen(false);
    
    if (category !== "all") {
      // Give time for the sheet to close before scrolling
      setTimeout(() => {
        const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white dark:bg-gray-950">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            AI 工具导航
          </SheetTitle>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="mb-4 px-2">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                工具导航
              </h2>
            </div>
            
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-medium mb-2 rounded-lg transition-all duration-200",
                  activeCategory === "all"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => handleCategoryClick("all")}
              >
                <LayoutGrid className="w-4 h-4 mr-3" />
                <span>全部工具</span>
                {activeCategory === "all" && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Button>
              
              <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
              
              {toolCategories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-medium rounded-lg transition-all duration-200 group",
                    activeCategory === category 
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className={cn(
                    "mr-3 transition-colors",
                    activeCategory === category 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  )}>
                    {getCategoryIcon(category)}
                  </span>
                  <span>{category}</span>
                  {activeCategory === category && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Button>
              ))}
              
              <div className="my-4 border-t border-gray-100 dark:border-gray-800" />
              
              <div className="mb-4 px-2">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  内容专区
                </h2>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-medium mb-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => scrollToSection('ai-news')}
              >
                <Newspaper className="w-4 h-4 mr-3" />
                <span>AI快讯</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-medium mb-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => scrollToSection('ai-projects')}
              >
                <Github className="w-4 h-4 mr-3" />
                <span>AI项目</span>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-medium mb-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => scrollToSection('ai-wiki')}
              >
                <BookOpen className="w-4 h-4 mr-3" />
                <span>AI百科</span>
              </Button>
            </nav>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            © 2025 AI Tools Directory
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
