import { aiWiki } from "@/data/ai-wiki";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export function WikiSection() {
  return (
    <section id="ai-wiki" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
          AI 百科
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiWiki.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-all duration-200 border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <Badge className="w-fit mb-2 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-100 border-none">
                {item.category}
              </Badge>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                {item.term}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.definition}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
