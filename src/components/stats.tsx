import { comprehensiveTools as tools, toolCategories as categories } from "@/data/comprehensive-tools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Layers, Users, Zap } from "lucide-react";

export function Stats() {
  const totalTools = tools.length;
  const totalCategories = categories.length;
  const popularTools = tools.filter(tool => tool.tags.includes("热门")).length;
  const freeTools = tools.filter(tool => tool.tags.includes("免费")).length;

  const stats = [
    {
      title: "工具总数",
      value: totalTools.toString(),
      icon: BarChart3,
      description: "目录中的 AI 工具"
    },
    {
      title: "分类",
      value: totalCategories.toString(),
      icon: Layers,
      description: "不同的工具分类"
    },
    {
      title: "热门工具",
      value: popularTools.toString(),
      icon: Users,
      description: "最受欢迎的工具"
    },
    {
      title: "免费工具",
      value: freeTools.toString(),
      icon: Zap,
      description: "完全免费使用"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}