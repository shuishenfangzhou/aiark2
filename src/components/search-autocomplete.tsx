"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, FileText, Layers } from "lucide-react";
import { getAutocompleteSuggestions, HOT_SEARCH_TERMS } from "@/lib/search-engine";
import { comprehensiveTools } from "@/data/comprehensive-tools";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSelectTask?: (task: string) => void;
  onSelectCategory?: (category: string) => void;
  /** Called when user submits (Enter with no suggestion selected) */
  onSubmit?: () => void;
  /** Unique ID for the connected input element */
  inputId?: string;
  /** Whether to show hot search terms (only when query is empty) */
  showHotSearch?: boolean;
}

export function SearchAutocomplete({
  query,
  onQueryChange,
  onSelectTask,
  onSelectCategory,
  onSubmit,
  inputId,
  showHotSearch = true,
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  // Get ref to the connected input element
  useEffect(() => {
    if (inputId) {
      inputEl.current = document.getElementById(inputId) as HTMLInputElement;
    }
  }, [inputId]);

  // Suggestions based on current query
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return getAutocompleteSuggestions(query, comprehensiveTools);
  }, [query]);

  const showSuggestions = isFocused && query.trim().length > 0 && suggestions.length > 0;
  const showHot = isFocused && showHotSearch && !query.trim();

  // Reset index when suggestions change
  useEffect(() => {
    const raf = requestAnimationFrame(() => setSelectedIndex(-1));
    return () => cancelAnimationFrame(raf);
  }, [suggestions]);

  // Open when focusing with query
  useEffect(() => {
    if (isFocused && query.trim()) {
      const raf = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isFocused, query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const totalItems = showSuggestions
    ? suggestions.length + (showHot ? 1 : 0)
    : showHot
      ? 1
      : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          // Select the highlighted item
          if (showSuggestions && selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            // Hot search term selected
            setIsOpen(false);
            setIsFocused(false);
          }
        } else {
          // Just submit the search
          onSubmit?.();
          setIsOpen(false);
          setIsFocused(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setIsFocused(false);
        (e.target as HTMLInputElement).blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: (typeof suggestions)[0]) => {
    setIsOpen(false);
    setIsFocused(false);

    switch (suggestion.type) {
      case "tool":
        navigate(`/tools/${suggestion.value}`);
        break;
      case "task":
        onSelectTask?.(suggestion.value);
        onQueryChange("");
        break;
      case "category":
        onSelectCategory?.(suggestion.value);
        onQueryChange("");
        break;
    }
  };

  const handleHotTermClick = (term: string) => {
    onQueryChange(term);
    setIsOpen(true);
    // Keep focus on input after clicking a hot term
    if (inputEl.current) {
      inputEl.current.focus();
    }
  };

  // ── Render ──

  const shouldRender = showSuggestions || showHot;

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {shouldRender && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-2xl overflow-hidden">
          <div ref={listRef} className="max-h-[400px] overflow-y-auto">
            {/* ── Suggestions ── */}
            {showSuggestions && (
              <>
                {/* Tools */}
                {renderGroup(
                  suggestions.filter((s) => s.type === "tool"),
                  "工具建议",
                  <FileText className="w-3.5 h-3.5" />,
                  selectedIndex,
                  0,
                  handleSuggestionClick,
                  setSelectedIndex,
                )}

                {/* Tasks */}
                {renderGroup(
                  suggestions.filter((s) => s.type === "task"),
                  "任务建议",
                  <Search className="w-3.5 h-3.5" />,
                  selectedIndex,
                  suggestions.filter((s) => s.type === "tool").length,
                  handleSuggestionClick,
                  setSelectedIndex,
                )}

                {/* Categories */}
                {renderGroup(
                  suggestions.filter((s) => s.type === "category"),
                  "分类建议",
                  <Layers className="w-3.5 h-3.5" />,
                  selectedIndex,
                  suggestions.filter((s) => s.type !== "category").length,
                  handleSuggestionClick,
                  setSelectedIndex,
                )}
              </>
            )}

            {/* ── Hot search terms ── */}
            {showHot && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  热门搜索
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HOT_SEARCH_TERMS.map((term, i) => {
                    const idx = suggestions.length + i;
                    return (
                      <button
                        key={term}
                        onClick={() => handleHotTermClick(term)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs transition-colors border",
                          selectedIndex === idx
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
                        )}
                      >
                        {term}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Group renderer helper ──────────────────────────────────────────────

function renderGroup(
  items: ReturnType<typeof getAutocompleteSuggestions>,
  groupLabel: string,
  icon: React.ReactNode,
  selectedIndex: number,
  offset: number,
  onClick: (item: (typeof items)[0]) => void,
  setSelectedIndex: (idx: number) => void,
) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {icon}
        {groupLabel}
      </div>
      {items.map((item, i) => {
        const idx = offset + i;
        return (
          <button
            key={`${item.type}-${item.value}`}
            onClick={() => onClick(item)}
            onMouseEnter={() => setSelectedIndex(idx)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
              selectedIndex === idx
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
            )}
          >
            {/* Icon */}
            {item.type === "tool" && item.icon ? (
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 ring-1 ring-gray-200 dark:ring-gray-700">
                <img
                  src={item.icon}
                  alt=""
                  className="object-cover w-full h-full"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerText =
                      item.label.charAt(0);
                  }}
                />
              </div>
            ) : item.type === "task" && item.icon ? (
              <span className="text-lg flex-shrink-0">{item.icon}</span>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
              </div>
            )}

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0",
                    item.type === "tool"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : item.type === "task"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
                  )}
                >
                  {item.type === "tool"
                    ? "工具"
                    : item.type === "task"
                      ? "任务"
                      : "分类"}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
