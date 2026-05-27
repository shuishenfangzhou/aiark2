"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ToolCard } from "@/components/tool-card";
import { comprehensiveTools, toolCategories, pricingOptions, sortOptions } from "@/data/comprehensive-tools";
import { filterByTask, getTaskLabel, TASK_VALUES, TASK_DEFINITIONS } from "@/data/task-definitions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { NewsSection } from "@/components/news-section";
import { ProjectsSection } from "@/components/projects-section";
import { WikiSection } from "@/components/wiki-section";
import { FeaturedTools } from "@/components/featured-tools";
import { AdvancedSearch } from "@/components/advanced-search";
import { CompareBar } from "@/components/compare-bar";
import { useFavorites } from "@/lib/favorites-context";

export default function Home() {
  // Initialize task from URL search params (native, no Next.js dependency)
  const getInitialTask = (): string => {
    if (typeof window === "undefined") return "all";
    const params = new URLSearchParams(window.location.search);
    const task = params.get("task");
    return task && TASK_VALUES.includes(task) ? task : "all";
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedTask, setSelectedTask] = useState(getInitialTask);
  const { isFavorite, favoritesCount } = useFavorites();

  // Listen for task-select events from Hero buttons
  useEffect(() => {
    const handler = (e: Event) => {
      const taskValue = (e as CustomEvent).detail;
      if (TASK_VALUES.includes(taskValue)) {
        setSelectedTask(taskValue);
      }
    };
    window.addEventListener("task-select", handler);
    return () => window.removeEventListener("task-select", handler);
  }, []);

  // Sync URL with selectedTask (native history API)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTask && selectedTask !== "all") {
      params.set("task", selectedTask);
    } else {
      params.delete("task");
    }
    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    window.history.replaceState(null, "", newUrl);
  }, [selectedTask]);

  // 过滤和排序逻辑
  const filteredTools = useMemo(() => {
    let result = comprehensiveTools;

    // 任务场景筛选
    if (selectedTask && selectedTask !== "all") {
      result = filterByTask(result, selectedTask);
    }

    // 只看收藏
    if (favoritesOnly) {
      result = result.filter(tool => isFavorite(tool.id));
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.chineseName?.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 分类过滤
    if (activeCategory !== "all") {
      result = result.filter(tool => tool.category === activeCategory);
    }

    // 价格过滤
    if (selectedPricing !== "all") {
      result = result.filter(tool => tool.pricing === selectedPricing);
    }

    // 排序逻辑
    switch (selectedSort) {
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result = [...result].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "popular":
        result = [...result].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default: // featured
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, activeCategory, selectedPricing, selectedSort, favoritesOnly, selectedTask, isFavorite]);

  // 按分类分组 (用于"全部工具"视图)
  const toolsByCategory = useMemo(() => {
    return toolCategories.reduce((acc, category) => {
      acc[category] = comprehensiveTools.filter(tool => tool.category === category);
      return acc;
    }, {} as Record<string, typeof comprehensiveTools>);
  }, []);

  const activeFiltersCount = (activeCategory !== "all" ? 1 : 0) + 
                            (selectedPricing !== "all" ? 1 : 0) + 
                            (selectedSort !== "featured" ? 1 : 0) +
                            (selectedTask !== "all" ? 1 : 0);

  const toggleFavoritesOnly = () => setFavoritesOnly(v => !v);

  const clearFilters = () => {
    setActiveCategory("all");
    setSelectedPricing("all");
    setSelectedSort("featured");
    setSelectedTask("all");
    setSearchQuery("");
    setFavoritesOnly(false);
  };

  const isDefaultView = searchQuery === "" && activeCategory === "all" && selectedPricing === "all" && !favoritesOnly && selectedTask === "all";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-col lg:flex-row flex-1">
        <div className={`hidden lg:block transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
          <Sidebar 
            activeCategory={activeCategory} 
            onCategoryClick={setActiveCategory}
            isCollapsed={!isSidebarOpen}
          />
        </div>
        
        <main className="flex-1 p-6">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <Hero />
            
            <div className="space-y-8 mb-8">
              <div id="ai-news">
                <NewsSection />
              </div>
              <div id="ai-projects">
                <ProjectsSection />
              </div>
              <div id="ai-wiki">
                <WikiSection />
              </div>
            </div>

            <div id="advanced-search" className="mb-8">
              <AdvancedSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                selectedPricing={selectedPricing}
                onPricingChange={setSelectedPricing}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                selectedTask={selectedTask}
                onTaskChange={setSelectedTask}
                categories={[...toolCategories]}
                pricingOptions={pricingOptions}
                sortOptions={sortOptions}
                activeFilters={activeFiltersCount}
                onClearFilters={clearFilters}
                showFavoritesOnly={favoritesOnly}
                onFavoritesToggle={toggleFavoritesOnly}
                favoritesCount={favoritesCount}
              />
            </div>

            {/* Task scenario banner */}
            {selectedTask !== "all" && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50">
                <span className="text-xl">
                  {TASK_DEFINITIONS.find(t => t.value === selectedTask)?.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    正在查看：{getTaskLabel(selectedTask)} 相关 AI 工具
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {TASK_DEFINITIONS.find(t => t.value === selectedTask)?.description}
                  </p>
                </div>
              </div>
            )}

            {isDefaultView && (
              <FeaturedTools />
            )}

            <div className="space-y-8 mt-8">
              {isDefaultView ? (
                // 显示所有分类 (无搜索/筛选时)
                toolCategories.map(category => {
                  const categoryTools = toolsByCategory[category];
                  if (!categoryTools || categoryTools.length === 0) return null;
                  
                  return (
                    <section 
                      key={category}
                      id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="space-y-4"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                        {category}
                        <span className="text-sm font-normal text-gray-500 ml-2">({categoryTools.length})</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.slice(0, 6).map(tool => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    </section>
                  );
                })
              ) : (
                // 显示筛选结果
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                    {selectedTask !== "all" 
                      ? `${getTaskLabel(selectedTask)} 相关工具`
                      : activeCategory === "all" 
                        ? "搜索结果" 
                        : activeCategory}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredTools.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              )}
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    未找到相关工具
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    请尝试调整搜索关键词或筛选条件。
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 text-blue-500 hover:underline"
                  >
                    清除所有筛选
                  </button>
                </div>
              )}
            </div>
            
            <Footer />
            <div className="h-32" /> {/* spaser for compare bar */}
          </ScrollArea>
          <CompareBar />
        </main>
      </div>
    </div>
  );
}
