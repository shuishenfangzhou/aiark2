import { aiProjects } from "@/data/ai-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Star, Code } from "lucide-react";

export function ProjectsSection() {
  return (
    <section id="ai-projects" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-green-500 rounded-full"></span>
          AI 项目
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="flex items-center gap-1 border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                  <Code className="w-3 h-3" />
                  {project.language}
                </Badge>
                <div className="flex items-center text-xs font-medium text-yellow-500">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  {project.stars}
                </div>
              </div>
              <CardTitle className="text-lg">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2">
                  {project.name}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 min-h-[60px]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
