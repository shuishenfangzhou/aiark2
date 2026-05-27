/**
 * Quiz recommendation engine — pure rule-based, no LLM.
 * Answers 4 questions → returns 3 tool recommendations + 1 workflow combo.
 */

import { comprehensiveTools, Tool } from "./comprehensive-tools";
import { TASK_DEFINITIONS, getTaskLabel } from "./task-definitions";

// ─── Question Definitions ────────────────────────────────────────────

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "task",
    question: "你想完成什么任务？",
    options: [
      { value: "write-paper", label: "写论文", description: "学术写作、文献综述、论文润色" },
      { value: "make-slides", label: "做PPT", description: "幻灯片制作、演示文稿" },
      { value: "write-resume", label: "写简历", description: "简历优化、求职信" },
      { value: "ai-coding", label: "AI编程", description: "代码生成、调试、部署" },
      { value: "video-create", label: "视频创作", description: "视频生成、剪辑、特效" },
      { value: "image-design", label: "图像设计", description: "图片生成、设计、修图" },
      { value: "automation", label: "自动化工作流", description: "流程自动化、AI Agent" },
      { value: "academic-research", label: "学术研究", description: "文献检索、数据分析" },
    ],
  },
  {
    id: "level",
    question: "你的使用水平？",
    options: [
      { value: "beginner", label: "新手", description: "刚接触AI工具，需要上手简单" },
      { value: "experienced", label: "有经验", description: "用过一些AI工具，能快速上手" },
      { value: "professional", label: "专业用户", description: "深度使用，需要高级功能" },
    ],
  },
  {
    id: "budget",
    question: "你的预算？",
    options: [
      { value: "free", label: "免费优先", description: "最好完全免费使用" },
      { value: "paid", label: "可接受付费", description: "愿意为优质工具付费" },
      { value: "enterprise", label: "企业采购", description: "团队使用，预算充足" },
    ],
  },
  {
    id: "environment",
    question: "你的使用环境？",
    options: [
      { value: "domestic", label: "国内可用优先", description: "希望不需要科学上网" },
      { value: "global", label: "海外工具也可以", description: "不在意是否需要科学上网" },
      { value: "local", label: "需要本地部署", description: "数据隐私敏感，需要本地运行" },
      { value: "api", label: "需要 API", description: "需要 API 集成到自己的应用" },
    ],
  },
];

export interface QuizAnswers {
  task: string;
  level: string;
  budget: string;
  environment: string;
}

// ─── Workflow definitions ────────────────────────────────────────────

interface WorkflowStep {
  step: string;
  description: string;
}

interface Workflow {
  task: string;
  title: string;
  steps: WorkflowStep[];
}

const WORKFLOWS: Workflow[] = [
  {
    task: "write-paper",
    title: "论文写作工作流",
    steps: [
      { step: "资料检索", description: "用 AI 搜索引擎和学术数据库查找文献" },
      { step: "文献阅读", description: "用 AI 阅读工具快速理解论文核心" },
      { step: "大纲生成", description: "用 AI 写作助手生成论文框架" },
      { step: "正文润色", description: "用 AI 润色工具优化语言表达" },
      { step: "格式检查", description: "用 AI 检测查重率和引用格式" },
    ],
  },
  {
    task: "make-slides",
    title: "PPT 制作工作流",
    steps: [
      { step: "主题梳理", description: "用 AI 梳理演示主题和核心信息" },
      { step: "大纲生成", description: "用 AI 生成 PPT 内容框架" },
      { step: "页面设计", description: "用 AI 设计工具生成幻灯片视觉" },
      { step: "演示优化", description: "用 AI 优化演示文案和节奏" },
    ],
  },
  {
    task: "write-resume",
    title: "简历求职工作流",
    steps: [
      { step: "岗位分析", description: "用 AI 分析职位描述和技能要求" },
      { step: "简历优化", description: "用 AI 优化简历内容和关键词" },
      { step: "投递邮件", description: "用 AI 生成个性化求职信" },
      { step: "面试准备", description: "用 AI 模拟面试和准备答题" },
    ],
  },
  {
    task: "ai-coding",
    title: "AI 编程工作流",
    steps: [
      { step: "需求拆解", description: "用 AI 分析需求并拆解为技术任务" },
      { step: "代码生成", description: "用 AI 编程助手生成代码" },
      { step: "调试优化", description: "用 AI 调试工具修复错误" },
      { step: "部署上线", description: "用 AI 辅助部署和监控" },
    ],
  },
  {
    task: "video-create",
    title: "视频创作工作流",
    steps: [
      { step: "选题策划", description: "用 AI 分析热点和策划视频选题" },
      { step: "脚本撰写", description: "用 AI 生成视频脚本和文案" },
      { step: "素材生成", description: "用 AI 生成视频画面和配音" },
      { step: "剪辑发布", description: "用 AI 剪辑工具完成后期制作" },
    ],
  },
  {
    task: "image-design",
    title: "图像设计工作流",
    steps: [
      { step: "创意构思", description: "用 AI 生成创意灵感和设计方向" },
      { step: "素材生成", description: "用 AI 生成图像和设计元素" },
      { step: "编辑优化", description: "用 AI 修图和优化设计细节" },
      { step: "批量输出", description: "用 AI 批量处理和导出" },
    ],
  },
  {
    task: "automation",
    title: "自动化工作流",
    steps: [
      { step: "流程梳理", description: "用 AI 分析和设计自动化流程" },
      { step: "工具连接", description: "用 AI 集成不同工具和 API" },
      { step: "自动执行", description: "用 AI Agent 执行自动化任务" },
      { step: "监控复盘", description: "用 AI 监控执行效果并优化" },
    ],
  },
  {
    task: "academic-research",
    title: "学术研究工作流",
    steps: [
      { step: "文献检索", description: "用 AI 搜索引擎快速定位相关论文" },
      { step: "文献分析", description: "用 AI 分析论文核心发现和结论" },
      { step: "数据整理", description: "用 AI 整理实验数据和统计" },
      { step: "论文撰写", description: "用 AI 辅助撰写研究报告" },
    ],
  },
];

// ─── Recommendation engine ───────────────────────────────────────────

export interface RecommendedTool extends Tool {
  reason: string;
}

export interface RecommendationResult {
  answers: QuizAnswers;
  tools: RecommendedTool[];
  workflow: { title: string; steps: WorkflowStep[] };
  summary: string;
}

function getRelevanceScore(tool: Tool, answers: QuizAnswers): number {
  let score = 0;
  const lowerDesc = tool.description.toLowerCase();
  const lowerName = tool.name.toLowerCase();

  // Task match (core signal)
  if (tool.taskTags?.includes(answers.task)) {
    score += 50;
  }

  // Category bonus for task
  const taskDef = TASK_DEFINITIONS.find(t => t.value === answers.task);
  if (taskDef && taskDef.categoryMatch.some(cat => tool.category.includes(cat))) {
    score += 20;
  }

  // Budget match
  if (answers.budget === "free" && tool.pricing === "Free") score += 15;
  if (answers.budget === "paid" && tool.pricing === "Paid") score += 10;
  if (answers.budget === "paid" && tool.pricing === "Freemium") score += 10;
  if (answers.budget === "enterprise" && tool.pricing !== "Free") score += 10;

  // Environment hints (using structured region field + fallback keyword matching)
  if (answers.environment === "local") {
    if (lowerDesc.includes("开源") || lowerDesc.includes("open source") || lowerDesc.includes("docker") || lowerDesc.includes("本地")) {
      score += 10;
    }
    if (tool.tags.some(t => t.toLowerCase().includes("开源") || t.toLowerCase().includes("open source"))) {
      score += 10;
    }
  }
  if (answers.environment === "domestic") {
    // Use structured region field with fallback
    if (tool.region === "domestic") score += 8;
    else if (lowerDesc.includes("中文") || lowerName.includes("中文") || lowerDesc.includes("百度") || lowerDesc.includes("阿里") || lowerDesc.includes("腾讯") || lowerDesc.includes("讯飞")) {
      score += 5;
    }
  }
  if (answers.environment === "global") {
    if (tool.region === "global") score += 5;
  }
  if (answers.environment === "api") {
    if (lowerDesc.includes("api") || lowerDesc.includes("接口") || lowerDesc.includes("platform") || tool.category.includes("开发平台")) {
      score += 8;
    }
  }

  // Level hints (using structured difficulty field)
  if (answers.level === "beginner") {
    if (tool.difficulty === "beginner") score += 10;
    else if (lowerDesc.includes("简单") || lowerDesc.includes("易用") || lowerDesc.includes("小白") || lowerDesc.includes("快速")) {
      score += 5;
    }
  }
  if (answers.level === "professional") {
    if (tool.difficulty === "advanced") score += 10;
    else if (tool.category === "AI编程工具" || tool.category === "AI开发平台" || tool.category === "AI训练模型") {
      score += 5;
    }
  }

  // Featured/popular bonus
  if (tool.featured) score += 5;
  if (tool.rating && tool.rating >= 4.5) score += 3;

  return score;
}

function generateReason(tool: Tool, answers: QuizAnswers): string {
  const taskLabel = getTaskLabel(answers.task);
  const parts: string[] = [];

  if (answers.budget === "free" && tool.pricing === "Free") {
    parts.push(`完全免费`);
  } else if (tool.pricing === "Free") {
    parts.push(`完全免费`);
  } else if (tool.pricing === "Freemium") {
    parts.push(`提供免费版本`);
  }

  if (tool.featured) {
    parts.push(`精选推荐工具`);
  }

  if (tool.rating && tool.rating >= 4.5) {
    parts.push(`用户评分 ${tool.rating} ⭐`);
  }

  if (answerTaskMatches(tool, answers.task)) {
    parts.push(`适合${taskLabel}场景`);
  }

  if (answers.level === "beginner") {
    if (tool.difficulty === "beginner") parts.push(`新手友好，上手简单`);
    else parts.push(`上手简单`);
  }
  if (answers.level === "professional" && tool.difficulty === "advanced") {
    parts.push(`专业级工具`);
  }
  if (tool.region === "domestic" && answers.environment === "domestic") {
    parts.push(`国内可直接访问`);
  }
  if (answers.environment === "global" && tool.region === "global") {
    parts.push(`海外优质工具`);
  }

  return parts.length > 0
    ? `推荐理由：${parts.join("，")}。${tool.description.slice(0, 60)}`
    : `推荐理由：适合${taskLabel}场景。${tool.description.slice(0, 60)}`;
}

function answerTaskMatches(tool: Tool, task: string): boolean {
  return tool.taskTags?.includes(task) ?? false;
}

function generateSummary(answers: QuizAnswers): string {
  const taskLabel = getTaskLabel(answers.task);
  const levelLabel = QUIZ_QUESTIONS[1].options.find(o => o.value === answers.level)?.label ?? answers.level;
  const budgetLabel = QUIZ_QUESTIONS[2].options.find(o => o.value === answers.budget)?.label ?? answers.budget;

  return `你选择了「${taskLabel}」+「${levelLabel}」+「${budgetLabel}」偏好，以下推荐基于这些条件自动匹配。`;
}

export function getRecommendation(answers: QuizAnswers): RecommendationResult {
  const scored = comprehensiveTools
    .map(tool => ({
      tool,
      score: getRelevanceScore(tool, answers),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Take top 3 with some variety (different categories)
  const topTools: RecommendedTool[] = [];
  const usedCategories = new Set<string>();

  for (const item of scored) {
    if (topTools.length >= 3) break;
    // Mix categories for variety, but allow same category if unique enough
    if (usedCategories.size < 2 || !usedCategories.has(item.tool.category) || topTools.length < 2) {
      usedCategories.add(item.tool.category);
      topTools.push({
        ...item.tool,
        reason: generateReason(item.tool, answers),
      });
    }
  }

  // Fallback: if < 3 found, add top scored regardless of category
  if (topTools.length < 3) {
    for (const item of scored) {
      if (topTools.length >= 3) break;
      if (!topTools.find(t => t.id === item.tool.id)) {
        topTools.push({
          ...item.tool,
          reason: generateReason(item.tool, answers),
        });
      }
    }
  }

  // Get workflow
  const workflow = WORKFLOWS.find(w => w.task === answers.task) ?? WORKFLOWS[0];

  return {
    answers,
    tools: topTools,
    workflow: { title: workflow.title, steps: workflow.steps },
    summary: generateSummary(answers),
  };
}
