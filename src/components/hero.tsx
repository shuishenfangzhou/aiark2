"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Search, TrendingUp } from "lucide-react";
import { QUICK_TASKS } from "@/data/task-definitions";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "收录工具", value: "500+" },
  { label: "工具分类", value: "16+" },
  { label: "每日更新", value: "24/7" },
  { label: "免费工具", value: "200+" },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTaskClick = (taskValue: string) => {
    navigate(`/tasks/${taskValue}`);
  };

  return (
    <section className="relative overflow-hidden mb-10">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10" />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] animate-pulse animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>已收录 {stats[0].value} 款 AI 工具，持续更新中</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              发现最全面的
            </span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">
              AI 工具导航
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            一站式探索 <strong className="text-gray-900 dark:text-gray-200">500+</strong> 精选 AI 工具，
            涵盖聊天、图像、视频、编程、办公等 <strong className="text-gray-900 dark:text-gray-200">16+</strong> 分类。
            智能搜索帮你快速找到最适合的工具。
          </p>

          {/* Quiz entry */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/quiz")}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30
                border border-amber-200/60 dark:border-amber-700/50
                text-amber-700 dark:text-amber-300
                hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40
                hover:border-amber-300 dark:hover:border-amber-600
                hover:shadow-md hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30
                active:scale-[0.97]
                transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>不知道选哪个？</span>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">30秒测一测</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick task entry buttons */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {QUICK_TASKS.map((task) => (
              <button
                key={task.value}
                onClick={() => handleTaskClick(task.value)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700
                  hover:border-blue-300 dark:hover:border-blue-600
                  hover:bg-blue-50 dark:hover:bg-blue-900/20
                  hover:text-blue-700 dark:hover:text-blue-300
                  hover:shadow-sm
                  active:scale-95
                  transition-all duration-200 cursor-pointer
                  text-gray-700 dark:text-gray-300"
              >
                <span className="text-base leading-none">{task.icon}</span>
                <span>{task.label}</span>
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 text-base px-8 py-6"
              onClick={() => {
                document
                  .getElementById("advanced-search")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search className="w-5 h-5 mr-2" />
              搜索 AI 工具
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
              onClick={() => {
                const element = document.getElementById("ai-news");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              查看 AI 快讯
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200/50 dark:hover:border-blue-700/50 transition-colors"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
