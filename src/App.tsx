import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/lib/favorites-context";
import { CompareProvider } from "@/lib/compare-context";
import Home from "./app/page";
import { QuizPage } from "@/components/quiz-page";
import { TaskDetailPage } from "@/components/task-detail-page";
import { ToolDetailPage } from "@/components/tool-detail-page";
import { SubmitToolPage } from "@/components/submit-tool-page";
import { FeedbackPage } from "@/components/feedback-page";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <CompareProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/tasks/:slug" element={<TaskDetailPage />} />
              <Route path="/tools/:slug" element={<ToolDetailPage />} />
              <Route path="/submit" element={<SubmitToolPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </CompareProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
