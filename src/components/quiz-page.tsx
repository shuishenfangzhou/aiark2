"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RefreshCw, Check, Sparkles, Heart, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QUIZ_QUESTIONS, getRecommendation, type QuizAnswers, type RecommendedTool } from "@/data/quiz-recommendations";
import { getTaskLabel, TASK_DEFINITIONS } from "@/data/task-definitions";
import { useFavorites } from "@/lib/favorites-context";
import { useCompare } from "@/lib/compare-context";

type Step = "welcome" | 0 | 1 | 2 | 3 | "results";

const STEP_TOTAL = 4;

export function QuizPage() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, toggleCompare } = useCompare();

  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<QuizAnswers>({
    task: "",
    level: "",
    budget: "",
    environment: "",
  });
  const [result, setResult] = useState<ReturnType<typeof getRecommendation> | null>(null);

  const progressPercent = step === "welcome"
    ? 0
    : step === "results"
      ? 100
      : ((step + 1) / STEP_TOTAL) * 100;

  const handleSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step === 3) {
      // Last question → compute results
      const rec = getRecommendation(newAnswers);
      setResult(rec);
      setStep("results");
    } else {
      setStep((step + 1) as Step);
    }
  };

  const handleRestart = () => {
    setStep("welcome");
    setAnswers({ task: "", level: "", budget: "", environment: "" });
    setResult(null);
  };

  const goToTask = (task: string) => {
    navigate(`/tasks/${task}`);
  };

  // ─── Results View ────────────────────────────────────────
  if (step === "results" && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新测试
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              返回首页
            </button>
          </div>

          {/* Summary */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 mb-4">
              <Sparkles className="w-4 h-4" />
              推荐结果
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              为你推荐的工具
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {result.summary}
            </p>
          </div>

          {/* Recommended Tools */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              推荐工具
              <span className="text-sm font-normal text-gray-500">（{result.tools.length} 个）</span>
            </h2>
            <div className="grid gap-4">
              {result.tools.map((tool, idx) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700">
                        <img
                          src={tool.icon}
                          alt={tool.name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg font-bold text-blue-500">${tool.name.charAt(0)}</div>`;
                          }}
                        />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                              {idx + 1}. {tool.name}
                            </h3>
                            {tool.chineseName && (
                              <p className="text-xs text-gray-500">{tool.chineseName}</p>
                            )}
                          </div>
                          <Badge variant="secondary" className={
                            tool.pricing === "Free" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none" :
                            tool.pricing === "Freemium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none" :
                            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none"
                          }>
                            {tool.pricing === "Free" ? "免费" : tool.pricing === "Freemium" ? "免费增值" : "付费"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                        {/* Reason */}
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                          {tool.reason}
                        </p>
                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-8"
                            onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            访问官网
                          </Button>
                          <button
                            onClick={() => toggleFavorite(tool.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={isFavorite(tool.id) ? "取消收藏" : "收藏"}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(tool.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}`} />
                          </button>
                          <button
                            onClick={() => toggleCompare(tool.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={isCompared(tool.id) ? "移出对比" : "加入对比"}
                          >
                            <BarChart3 className={`w-4 h-4 ${isCompared(tool.id) ? "text-blue-500 fill-blue-500" : "text-gray-400 hover:text-blue-400"}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Workflow recommendation */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              推荐工作流
            </h2>
            <Card className="border-purple-200/50 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-950/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  {result.workflow.title}
                </CardTitle>
                <CardDescription>
                  根据你选择的「{getTaskLabel(result.answers.task)}」任务，推荐以下工作流
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.workflow.steps.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{s.step}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button
              onClick={() => goToTask(result.answers.task)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              查看更多 {getTaskLabel(result.answers.task)} 工具
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新测试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Welcome Screen ──────────────────────────────────────
  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200/50 dark:border-blue-800/50 mb-6">
            <Sparkles className="w-4 h-4" />
            30 秒快速测验
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            不知道选哪个 AI 工具？
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            回答 4 个简单问题，我们会为你推荐最适合的 AI 工具和完整工作流。
            无需注册，完全免费。
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { label: "4 个问题", desc: "不到 30 秒" },
              { label: "精准推荐", desc: "基于 500+ 工具库" },
              { label: "工具组合", desc: "完整工作流建议" },
              { label: "免费使用", desc: "无需注册登录" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => setStep(0)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 text-base px-10 py-6"
          >
            开始测试
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="mt-4 text-xs text-gray-400">
            点击即表示你同意我们的服务条款
          </p>
        </div>
      </div>
    );
  }

  // ─── Quiz Steps ──────────────────────────────────────────
  const question = QUIZ_QUESTIONS[step];
  const taskIcon = question.id === "task"
    ? TASK_DEFINITIONS.find(t => t.value === answers.task)?.icon
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => step > 0 ? setStep((step - 1) as Step) : setStep("welcome")}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
            <span className="text-sm text-gray-500">
              {step + 1} / {STEP_TOTAL}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                第 {step + 1} 题
              </p>
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {taskIcon && <span>{taskIcon}</span>}
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                {question.options.map((option) => {
                  const selected = answers[question.id as keyof QuizAnswers] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(question.id, option.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{option.label}</p>
                          {option.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
                          )}
                        </div>
                        {selected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
