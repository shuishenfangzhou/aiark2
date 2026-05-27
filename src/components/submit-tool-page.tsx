import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPageMeta } from "@/lib/seo";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/ai-tools-database";

interface FormData {
  toolName: string;
  website: string;
  description: string;
  task: string;
  category: string;
  pricing: string;
  region: string;
  email: string;
  note: string;
}

const initialForm: FormData = {
  toolName: "",
  website: "",
  description: "",
  task: "",
  category: "",
  pricing: "",
  region: "",
  email: "",
  note: "",
};

const TASK_OPTIONS = [
  { value: "write-paper", label: "写论文" },
  { value: "ai-coding", label: "AI 编程" },
  { value: "video-create", label: "视频创作" },
  { value: "image-design", label: "图像设计" },
  { value: "make-slides", label: "做 PPT" },
  { value: "write-resume", label: "写简历" },
  { value: "automation", label: "自动化工作流" },
  { value: "academic-research", label: "学术研究" },
  { value: "other", label: "其他" },
];

const PRICING_OPTIONS = [
  { value: "Free", label: "免费" },
  { value: "Freemium", label: "免费增值" },
  { value: "Paid", label: "付费" },
  { value: "unknown", label: "不确定" },
];

const REGION_OPTIONS = [
  { value: "domestic", label: "国内可用" },
  { value: "global", label: "海外工具" },
  { value: "requires-vpn", label: "需科学上网" },
  { value: "unknown", label: "不确定" },
];

export function SubmitToolPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageMeta({
      title: "提交 AI 工具 — AI Ark",
      description: "推荐你发现的好用 AI 工具，帮助更多人找到适合的工具。提交后我们会审核并收录到 AI Ark 导航站。",
    });
  }, []);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission — replace with Formspree / API call later
    console.log("[SubmitTool] New tool submission:", form);
    await new Promise((r) => setTimeout(r, 800));

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                提交成功！
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                已收到你的工具推荐，我们会尽快核验后收录到工具库中。感谢你的贡献！
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  再提交一个
                </Button>
                <Button onClick={() => navigate("/")}>
                  返回首页
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            提交 AI 工具
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            推荐 AI 工具
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            发现了好用的 AI 工具？分享给更多人。提交后我们会审核并收录到工具库中。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tool name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              工具名称 <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.toolName}
              onChange={(e) => update("toolName", e.target.value)}
              placeholder="例如：ChatGPT"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              官网链接 <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              一句话介绍 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="这个工具是做什么的？"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Task + Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                适合任务
              </label>
              <select
                value={form.task}
                onChange={(e) => update("task", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">请选择</option>
                {TASK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                分类 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">请选择</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing + Region row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                价格模式 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.pricing}
                onChange={(e) => update("pricing", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">请选择</option>
                {PRICING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                国内可用
              </label>
              <select
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">请选择</option>
                {REGION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              你的邮箱 <span className="text-gray-400 font-normal">（选填，方便我们联系你）</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              补充说明 <span className="text-gray-400 font-normal">（选填）</span>
            </label>
            <textarea
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="有什么想补充的吗？"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={submitting} className="w-full py-6 text-base">
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </span>
            ) : (
              "提交工具推荐"
            )}
          </Button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            提交即表示你同意我们审核后决定是否收录该工具。我们会尽快处理。
          </p>
        </form>
      </div>
    </div>
  );
}
