import { aiNews } from "@/data/ai-news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

export function NewsSection() {
  return (
    <section id="ai-news" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-red-500 rounded-full"></span>
          AI 快讯
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiNews.map((news) => (
          <Card key={news.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-none">
                  {news.tag}
                </Badge>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {news.date}
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2 leading-tight">
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  {news.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {news.summary}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
                <span>来源: {news.source}</span>
                <a 
                  href={news.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-red-500 hover:underline"
                >
                  阅读全文 <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
