"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ToolCard } from "@/components/tool-card";
import { comprehensiveTools, toolCategories, pricingOptions, sortOptions } from "@/data/comprehensive-tools";
import { filterByTask, getTaskLabel, TASK_VALUES, TASK_DEFINITIONS } from "@/data/task-definitions";
import { searchTools, getSearchExplanation, HOT_SEARCH_TERMS } from "@/lib/search-engine";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { NewsSection } from "@/components/news-section";
import { ProjectsSection } from "@/components/projects-section";
import { WikiSection } from "@/components/wiki-section";
import { FeaturedTools } from "@/components/featured-tools";
import { AdvancedSearch } from "@/components/advanced-search";
import { CompareBar } from "@/components/compare-bar";
import { useFavorites } from "@/lib/favorites-context";
import { setPageMeta, SITE_DEFAULT_TITLE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export default function Home() {
  const navigate = useNavigate();

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

  // SEO meta
  useEffect(() => {
    setPageMeta({
      title: SITE_DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: window.location.origin,
          description: SITE_DESCRIPTION,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${window.location.origin}/?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: window.location.origin,
          description: SITE_DESCRIPTION,
          logo: `${window.location.origin}/icons/icon-512.svg`,
        },
      ],
    });
  }, []);

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

    // 分类过滤
    if (activeCategory !== "all") {
      result = result.filter(tool => tool.category === activeCategory);
    }

    // 价格过滤
    if (selectedPricing !== "all") {
      result = result.filter(tool => tool.pricing === selectedPricing);
    }

    // 搜索过滤 + 权重排序
    if (searchQuery) {
      const scored = searchTools(searchQuery, result);
      result = scored.map(s => s.tool);

      // If user explicitly chose a sort, apply it on top of search results
      if (selectedSort === "rating") {
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (selectedSort === "newest") {
        result = [...result].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      } else if (selectedSort === "popular") {
        result = [...result].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      }
      // When sort is "featured" (default), keep search score ordering
    } else {
      // 排序逻辑（无搜索时）
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

  // Search explanation text
  const searchExplanation = useMemo(() => {
    if (!searchQuery) return "";
    return getSearchExplanation(searchQuery, filteredTools.length);
  }, [searchQuery, filteredTools.length]);

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
                resultsCount={searchQuery ? filteredTools.length : undefined}
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

                  {/* Search explanation */}
                  {searchExplanation && filteredTools.length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-1">
                      {searchExplanation}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              )}
              
              {filteredTools.length === 0 && (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-7 h-7 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      没有找到相关工具
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      请尝试调整搜索关键词或筛选条件。
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        清空搜索
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate("/submit")}>
                        提交工具
                      </Button>
                      <Button size="sm" onClick={() => navigate("/quiz")}>
                        查看热门任务
                      </Button>
                    </div>
                    {searchQuery && (
                      <>
                        <p className="text-xs text-gray-400 mt-6 mb-3">热门搜索</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {HOT_SEARCH_TERMS.map((term) => (
                            <button
                              key={term}
                              onClick={() => setSearchQuery(term)}
                              className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 
                                transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
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
