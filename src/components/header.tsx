"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sun, Moon, PanelLeft, ArrowUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ searchQuery, onSearchChange, activeCategory, onCategoryClick, isSidebarOpen, toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800"
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MobileSidebar
                activeCategory={activeCategory}
                onCategoryClick={onCategoryClick}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden lg:flex hover:bg-gray-100 dark:hover:bg-gray-800"
                title={isSidebarOpen ? "折叠侧边栏" : "展开侧边栏"}
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
                  AI 工具导航
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="搜索 AI 工具... (支持中文)"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                aria-label="切换主题"
              >
                {mounted && (
                  theme === "dark" ?
                    <Sun className="w-5 h-5" /> :
                    <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="返回顶部"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
