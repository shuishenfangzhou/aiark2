"use client";

import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/tools";
import { Hash } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          onClick={() => onCategorySelect(category)}
        >
          <Hash className="w-3 h-3 mr-1" />
          {category}
        </Badge>
      ))}
    </div>
  );
}