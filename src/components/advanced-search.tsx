"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface AdvancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPricing: string;
  onPricingChange: (pricing: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  categories: string[];
  pricingOptions: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: string; label: string }>;
  activeFilters: number;
  onClearFilters: () => void;
}

export function AdvancedSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPricing,
  onPricingChange,
  selectedSort,
  onSortChange,
  categories,
  pricingOptions,
  sortOptions,
  activeFilters,
  onClearFilters,
}: AdvancedSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* 主要搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="搜索AI工具... (支持中文搜索)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-6 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
        />
      </div>

      {/* 高级筛选器 */}
      <div className="flex flex-wrap items-center gap-3">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              筛选
              {activeFilters > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">高级筛选</h4>
                {activeFilters > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-8 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    清除
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">分类</label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">价格</label>
                <Select value={selectedPricing} onValueChange={onPricingChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择价格" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">排序</label>
                <Select value={selectedSort} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择排序" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 快速标签 */}
        <div className="flex flex-wrap gap-2">
          {pricingOptions.slice(1).map((option) => (
            <Badge
              key={option.value}
              variant={selectedPricing === option.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onPricingChange(selectedPricing === option.value ? "all" : option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* 活跃筛选标签 */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">当前筛选:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {selectedCategory}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryChange("all")}
              />
            </Badge>
          )}
          {selectedPricing !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {pricingOptions.find(p => p.value === selectedPricing)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onPricingChange("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}