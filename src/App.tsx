import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/lib/favorites-context";
import { CompareProvider } from "@/lib/compare-context";

// Route-based code splitting — each page loads only when visited
const Home = lazy(() => import("./app/page"));
const QuizPage = lazy(() => import("@/components/quiz-page").then(m => ({ default: m.QuizPage })));
const TaskDetailPage = lazy(() => import("@/components/task-detail-page").then(m => ({ default: m.TaskDetailPage })));
const ToolDetailPage = lazy(() => import("@/components/tool-detail-page").then(m => ({ default: m.ToolDetailPage })));
const SubmitToolPage = lazy(() => import("@/components/submit-tool-page").then(m => ({ default: m.SubmitToolPage })));
const FeedbackPage = lazy(() => import("@/components/feedback-page").then(m => ({ default: m.FeedbackPage })));
const ComparePage = lazy(() => import("@/components/compare-page").then(m => ({ default: m.ComparePage })));
const LearnPage = lazy(() => import("@/components/learn-page").then(m => ({ default: m.LearnPage })));

function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <CompareProvider>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/tasks/:slug" element={<TaskDetailPage />} />
                <Route path="/tools/:slug" element={<ToolDetailPage />} />
                <Route path="/submit" element={<SubmitToolPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/learn" element={<LearnPage />} />
              </Routes>
            </Suspense>
          </CompareProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
