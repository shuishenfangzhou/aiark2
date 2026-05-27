import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setPageMeta } from "@/lib/seo";

interface FormData {
  type: string;
  toolName: string;
  toolUrl: string;
  message: string;
  email: string;
}

const initialForm: FormData = {
  type: "",
  toolName: "",
  toolUrl: "",
  message: "",
  email: "",
};

const FEEDBACK_TYPES = [
  { value: "broken-link", label: "链接失效" },
  { value: "wrong-info", label: "信息错误" },
  { value: "price-change", label: "价格变化" },
  { value: "wrong-category", label: "分类不准" },
  { value: "discontinued", label: "工具已停服" },
  { value: "other", label: "其他" },
];

export function FeedbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageMeta({
      title: "意见反馈 — AI Ark",
      description: "发现链接失效、信息错误或价格变化？告诉我们，一起维护最准确的 AI 工具导航。",
    });
  }, []);
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from URL params (e.g. /feedback?tool=xxx&url=yyy)
  useEffect(() => {
    const tool = searchParams.get("tool");
    const url = searchParams.get("url");
    if (tool || url) {
      // Use a microtask to batch the state update and avoid cascading renders
      queueMicrotask(() => {
        if (tool) setForm((prev) => ({ ...prev, toolName: tool }));
        if (url) setForm((prev) => ({ ...prev, toolUrl: url }));
      });
    }
  }, [searchParams]);

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submit failed");
      }
    } catch (err) {
      console.error("[Feedback] Submit error:", err);
      setSubmitting(false);
      return;
    }

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
                感谢反馈！
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                已收到你的反馈，我们会尽快核验并修正。感谢你帮助提升工具库的质量！
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => { setSubmitted(false); setForm(initialForm); }}>
                  再提一个
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
            纠错反馈
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            纠错反馈
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            发现工具信息有误？告诉我们，我们会尽快核实修正。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              反馈类型 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEEDBACK_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => update("type", ft.value)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    form.type === ft.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tool name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              相关工具名称 <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.toolName}
              onChange={(e) => update("toolName", e.target.value)}
              placeholder="工具名称"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Tool URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              相关工具链接
            </label>
            <input
              type="url"
              value={form.toolUrl}
              onChange={(e) => update("toolUrl", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              具体说明 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="请描述你发现的问题..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              你的邮箱 <span className="text-gray-400 font-normal">（选填，方便我们联系你确认修正）</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              "提交反馈"
            )}
          </Button>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            提交即表示你同意我们根据你的反馈核验和修正工具信息。感谢你的贡献！
          </p>
        </form>
      </div>
    </div>
  );
}
