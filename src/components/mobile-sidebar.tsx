"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Hash } from "lucide-react";
import { categories } from "@/data/tools";

interface MobileSidebarProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

export function MobileSidebar({ activeCategory, onCategoryClick }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onCategoryClick(category);
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 px-2">
            分类导航
          </h2>
          <nav className="space-y-2 px-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                className={`w-full justify-start text-left font-medium transition-all duration-200 ${
                  activeCategory === category 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => scrollToCategory(category)}
              >
                <Hash className={`w-4 h-4 mr-2 ${activeCategory === category ? "text-white" : "text-gray-500"}`} />
                {category}
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}