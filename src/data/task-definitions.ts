/**
 * Task/scenario definitions and auto-tagging for AI tools.
 * Maps tool category + tags + description to real-world tasks.
 */

export interface TaskDefinition {
  value: string;
  label: string;
  icon: string;
  description: string;
  /** Category keywords that match this task */
  categoryMatch: string[];
  /** Tag keywords that match this task */
  tagMatch: string[];
  /** Priority order for display (lower = higher) */
  priority: number;
}

export const TASK_DEFINITIONS: TaskDefinition[] = [
  {
    value: "write-paper",
    label: "写论文",
    icon: "📄",
    description: "学术写作、文献综述、论文润色",
    categoryMatch: ["写作工具", "学习网站", "内容检测"],
    tagMatch: ["学术", "论文", "写作", "research", "paper", "文献", "润色", "essay"],
    priority: 1,
  },
  {
    value: "make-slides",
    label: "做PPT",
    icon: "📊",
    description: "幻灯片制作、演示文稿",
    categoryMatch: ["办公工具", "设计工具"],
    tagMatch: ["PPT", "演示", "slides", "presentation", "幻灯片", "模板"],
    priority: 2,
  },
  {
    value: "write-resume",
    label: "写简历",
    icon: "📝",
    description: "简历优化、求职信、面试准备",
    categoryMatch: ["办公工具", "写作工具"],
    tagMatch: ["简历", "求职", "resume", "CV", "面试", "招聘", "job"],
    priority: 3,
  },
  {
    value: "ai-coding",
    label: "AI编程",
    icon: "💻",
    description: "代码生成、调试、代码审查",
    categoryMatch: ["编程工具", "开发平台", "智能体"],
    tagMatch: ["代码", "编程", "开发", "coding", "programming", "developer", "API", "deploy", "debug", "code"],
    priority: 4,
  },
  {
    value: "video-create",
    label: "视频创作",
    icon: "🎬",
    description: "视频生成、剪辑、特效",
    categoryMatch: ["视频工具", "图像工具", "音频工具"],
    tagMatch: ["视频", "video", "剪辑", "动画", "animation", "短视频", "配音", "字幕"],
    priority: 5,
  },
  {
    value: "image-design",
    label: "图像设计",
    icon: "🎨",
    description: "图片生成、设计、修图",
    categoryMatch: ["图像工具", "设计工具"],
    tagMatch: ["图像", "图片", "设计", "image", "design", "photo", "插画", "logo", "海报", "素材"],
    priority: 6,
  },
  {
    value: "copywriting",
    label: "文案写作",
    icon: "✍️",
    description: "营销文案、内容创作、广告语",
    categoryMatch: ["写作工具", "办公工具"],
    tagMatch: ["文案", "营销", "广告", "copywriting", "内容", "marketing", "写作", "推广", "social media"],
    priority: 7,
  },
  {
    value: "academic-research",
    label: "学术研究",
    icon: "🔬",
    description: "文献检索、数据分析、论文辅助",
    categoryMatch: ["学习网站", "搜索引擎", "内容检测"],
    tagMatch: ["research", "学术", "文献", "论文", "科学", "数据", "分析", "study", "实验"],
    priority: 8,
  },
  {
    value: "data-analysis",
    label: "数据分析",
    icon: "📈",
    description: "数据处理、可视化、报表",
    categoryMatch: ["办公工具", "开发平台", "智能体"],
    tagMatch: ["数据", "分析", "data", "analytics", "报表", "可视化", "统计", "chart", "dashboard", "excel"],
    priority: 9,
  },
  {
    value: "automation",
    label: "自动化工作流",
    icon: "⚡",
    description: "流程自动化、AI Agent、RPA",
    categoryMatch: ["智能体", "开发平台", "应用集"],
    tagMatch: ["自动", "agent", "自动化", "workflow", "pipeline", "integration", "bot", "RPA", "trigger"],
    priority: 10,
  },
  {
    value: "ecommerce",
    label: "电商运营",
    icon: "🛒",
    description: "商品管理、营销、客服",
    categoryMatch: ["应用集", "办公工具"],
    tagMatch: ["电商", "shop", "商品", "商城", "ecommerce", "运营", "客服", "店铺", "零售"],
    priority: 11,
  },
  {
    value: "knowledge-base",
    label: "知识库问答",
    icon: "💡",
    description: "知识管理、智能问答、RAG",
    categoryMatch: ["聊天助手", "智能体", "训练模型"],
    tagMatch: ["知识", "问答", "知识库", "RAG", "chatbot", "QA", "文档", "search", "检索"],
    priority: 12,
  },
  {
    value: "local-deploy",
    label: "本地部署",
    icon: "🖥️",
    description: "本地运行、自托管、隐私优先",
    categoryMatch: ["开发平台", "训练模型", "智能体"],
    tagMatch: ["本地", "开源", "self-hosted", "docker", "部署", "private", "offline", "local", "open source"],
    priority: 13,
  },
  {
    value: "enterprise",
    label: "企业办公",
    icon: "🏢",
    description: "团队协作、OA、企业管理",
    categoryMatch: ["办公工具", "应用集", "聊天助手"],
    tagMatch: ["企业", "团队", "enterprise", "办公", "协作", "team", "管理", "会议", "project", "work"],
    priority: 14,
  },
];

/** Quick-access tasks for homepage entry buttons (top 8) */
export const QUICK_TASKS = TASK_DEFINITIONS.filter(t =>
  ["write-paper","make-slides","write-resume","ai-coding","video-create","image-design","automation","academic-research"].includes(t.value)
);

export const TASK_VALUES = TASK_DEFINITIONS.map(t => t.value);

/**
 * Auto-assign task tags to a tool based on its category, tags, and description.
 * Uses priority ranking — a tool gets at most 4 task tags to avoid noise.
 */
export function assignTaskTags(
  category: string,
  tags: string[],
  description: string,
): string[] {
  const lowerDesc = description.toLowerCase();
  const lowerCategory = category.toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());

  const matched: { value: string; score: number; priority: number }[] = [];

  for (const task of TASK_DEFINITIONS) {
    let score = 0;

    // Category match (strong signal)
    for (const cat of task.categoryMatch) {
      if (lowerCategory.includes(cat.toLowerCase())) score += 10;
    }

    // Tag match (medium signal)
    for (const tag of task.tagMatch) {
      if (lowerTags.some(t => t.includes(tag.toLowerCase()))) score += 5;
    }

    // Description match (weak signal)
    for (const tag of task.tagMatch) {
      if (lowerDesc.includes(tag.toLowerCase())) score += 2;
    }

    if (score >= 5) { // minimum threshold
      matched.push({ value: task.value, score, priority: task.priority });
    }
  }

  // Sort by score desc → priority asc, take top 4
  const sorted = matched.sort((a, b) => b.score - a.score || a.priority - b.priority);
  return sorted.slice(0, 4).map(m => m.value);
}

/**
 * Filter tools by a task value.
 * If task is "all", returns all tools.
 */
export function filterByTask(tools: any[], task: string): any[] {
  if (task === "all") return tools;
  return tools.filter(t =>
    t.taskTags && t.taskTags.includes(task)
  );
}

/** Get task label from value */
export function getTaskLabel(value: string): string {
  return TASK_DEFINITIONS.find(t => t.value === value)?.label ?? value;
}
