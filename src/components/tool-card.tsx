"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Users } from "lucide-react";
import { Tool } from "@/data/comprehensive-tools";
// import Image from "next/image";

interface ToolCardProps {
  tool: Tool;
}

const getPricingBadge = (pricing: string) => {
  switch (pricing) {
    case "Free":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">免费</Badge>;
    case "Freemium":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">免费增值</Badge>;
    case "Paid":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">付费</Badge>;
    default:
      return null;
  }
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0">
            <img
              src={tool.icon}
              alt={tool.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {tool.name}
              </CardTitle>
              {getPricingBadge(tool.pricing)}
            </div>
            {tool.chineseName && tool.chineseName !== tool.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tool.chineseName}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 py-2">
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {tool.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-0.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="w-full flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{tool.rating || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{tool.reviewCount ? (tool.reviewCount > 1000 ? `${(tool.reviewCount/1000).toFixed(1)}k` : tool.reviewCount) : 0}</span>
          </div>
        </div>
        
        <Button
          variant="default"
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="w-3.5 h-3.5 mr-2" />
          访问官网
        </Button>
      </CardFooter>
    </Card>
  );
}