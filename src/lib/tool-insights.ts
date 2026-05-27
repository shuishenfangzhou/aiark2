import { Tool } from "@/data/comprehensive-tools";
import { getTaskLabel } from "@/data/task-definitions";
import { comprehensiveTools } from "@/data/comprehensive-tools";

// ─── Types ──────────────────────────────────────────────────────────────

export interface AudienceItem {
  label: string;
  reason: string;
}

export interface StrengthItem {
  label: string;
  detail: string;
}

export interface LimitationItem {
  label: string;
  detail: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface DataStatus {
  label: string;
  populated: boolean;
  value: string;
}

// ─── Category → audience mapping ────────────────────────────────────────

const CATEGORY_AUDIENCE: Record<string, AudienceItem[]> = {
  "AI写作工具": [
    { label: "内容创作者", reason: "需要高质量写作辅助" },
    { label: "学生和研究人员", reason: "论文写作和文献整理" },
    { label: "市场营销人员", reason: "营销文案和内容生产" },
  ],
  "AI图像工具": [
    { label: "设计师", reason: "快速生成和编辑视觉素材" },
    { label: "社交媒体运营", reason: "配图和视觉内容生产" },
    { label: "创意工作者", reason: "探索视觉创意和灵感" },
  ],
  "AI视频工具": [
    { label: "视频创作者", reason: "提升视频制作效率" },
    { label: "短视频运营", reason: "批量生成短视频内容" },
    { label: "教育培训者", reason: "制作教学视频素材" },
  ],
  "AI编程工具": [
    { label: "开发者", reason: "加速编码和调试效率" },
    { label: "独立开发者", reason: "快速搭建项目原型" },
    { label: "编程学习者", reason: "辅助学习和代码理解" },
  ],
  "AI办公工具": [
    { label: "职场人士", reason: "提升日常办公效率" },
    { label: "企业团队", reason: "团队协作和流程优化" },
    { label: "自由职业者", reason: "文档处理和时间管理" },
  ],
  "AI设计工具": [
    { label: "UI/UX 设计师", reason: "界面设计和原型制作" },
    { label: "平面设计师", reason: "视觉设计和品牌物料" },
    { label: "产品经理", reason: "快速出设计稿和演示" },
  ],
  "AI聊天助手": [
    { label: "个人用户", reason: "日常问答和信息获取" },
    { label: "客服团队", reason: "智能客服和对话系统" },
    { label: "研究人员", reason: "信息整理和知识查询" },
  ],
  "AI智能体": [
    { label: "技术爱好者", reason: "探索 Agent 自动化和工作流" },
    { label: "企业开发者", reason: "构建自动化业务流程" },
    { label: "效率追求者", reason: "任务自动化和智能调度" },
  ],
  "AI音频工具": [
    { label: "音乐创作者", reason: "AI 音乐生成和编曲" },
    { label: "播客制作者", reason: "语音处理和音频编辑" },
    { label: "配音工作者", reason: "语音合成和声音处理" },
  ],
  "AI搜索引擎": [
    { label: "研究人员", reason: "快速查找专业资料" },
    { label: "日常用户", reason: "提升搜索效率和信息获取" },
    { label: "内容创作者", reason: "素材收集和调研" },
  ],
  "AI开发平台": [
    { label: "AI 开发者", reason: "模型训练和部署" },
    { label: "数据科学家", reason: "数据处理和分析" },
    { label: "技术团队", reason: "AI 应用开发和集成" },
  ],
  "AI学习网站": [
    { label: "学生", reason: "在线学习和技能提升" },
    { label: "转行学习者", reason: "系统学习 AI 知识和工具" },
    { label: "终身学习者", reason: "紧跟 AI 技术趋势" },
  ],
  "AI训练模型": [
    { label: "AI 研究员", reason: "模型训练和微调" },
    { label: "企业开发者", reason: "私有模型部署" },
    { label: "高级用户", reason: "定制化 AI 能力" },
  ],
  "AI内容检测": [
    { label: "教育工作者", reason: "检测学术诚信" },
    { label: "内容审核员", reason: "确保内容原创性" },
    { label: "招聘人员", reason: "评估申请材料真实性" },
  ],
  "AI提示指令": [
    { label: "Prompt 工程师", reason: "优化提示词技巧" },
    { label: "AI 重度用户", reason: "提升 AI 输出质量" },
    { label: "教育培训者", reason: "教学提示工程" },
  ],
  "AI应用集": [
    { label: "普通用户", reason: "发现实用 AI 工具组合" },
    { label: "效率爱好者", reason: "探索场景化解决方案" },
    { label: "早期采用者", reason: "尝试最新 AI 应用" },
  ],
};

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Generate "适合谁使用" audience items based on structured fields.
 */
export function getToolAudience(tool: Tool): AudienceItem[] {
  const result: AudienceItem[] = [];
  const desc = tool.description.toLowerCase();

  // Start with category-based defaults
  const catAudience = CATEGORY_AUDIENCE[tool.category];
  if (catAudience) {
    result.push(...catAudience);
  }

  // Difficulty-based refinements
  if (tool.difficulty === "beginner") {
    result.push({ label: "AI 新手", reason: "工具上手门槛低，适合零基础" });
  } else if (tool.difficulty === "advanced") {
    result.push({ label: "专业用户", reason: "功能深入，适合有经验的使用者" });
  }

  // Pricing-based
  if (tool.pricing === "Free") {
    result.push({ label: "预算敏感用户", reason: "完全免费，无需付费使用" });
  } else if (tool.pricing === "Freemium") {
    result.push({ label: "试用体验者", reason: "先免费体验，再按需升级" });
  }

  // Description-based detection (additive)
  if (desc.includes("团队") || desc.includes("企业")) {
    result.push({ label: "企业团队", reason: "支持团队协作和企业级需求" });
  }
  if (desc.includes("开发者") || desc.includes("程序员") || desc.includes("编程")) {
    if (!result.some(r => r.label === "开发者"))
      result.push({ label: "开发者", reason: "面向编程和技术开发场景" });
  }
  if (desc.includes("开源") || desc.includes("open source")) {
    result.push({ label: "开源爱好者", reason: "开源工具，可自行部署和定制" });
  }
  if (desc.includes("API")) {
    result.push({ label: "技术集成者", reason: "提供 API 接口，便于集成" });
  }

  return result.slice(0, 6);
}

/**
 * Generate "核心优势" based on category, tags, pricing, and rating.
 */
export function getToolStrengths(tool: Tool): StrengthItem[] {
  const strengths: StrengthItem[] = [];
  const desc = tool.description;

  // Pricing strength
  if (tool.pricing === "Free") {
    strengths.push({ label: "完全免费", detail: "无需任何费用即可使用全部功能，适合预算有限的用户" });
  } else if (tool.pricing === "Freemium") {
    strengths.push({ label: "免费增值", detail: "提供免费版本，可按需升级到付费版本获取更多功能" });
  } else if (tool.rating && tool.rating >= 4.5) {
    strengths.push({ label: "口碑优秀", detail: `用户评分高达 ${tool.rating}，广受好评` });
  }

  // Rating strength
  if (tool.rating && tool.rating >= 4.5) {
    strengths.push({ label: "高用户评分", detail: `${tool.rating} ⭐ 来自 ${tool.reviewCount ?? "众多"} 用户评价` });
  } else if (tool.rating && tool.rating >= 4) {
    strengths.push({ label: "良好口碑", detail: `${tool.rating} ⭐ 用户评分，体验稳定可靠` });
  }

  // Coverage strength
  const coveredTags = tool.taskTags?.length ?? 0;
  if (coveredTags >= 3) {
    strengths.push({ label: "多场景覆盖", detail: `覆盖 ${coveredTags} 个任务场景，适用性强` });
  }

  // Region strength
  if (tool.region === "domestic") {
    strengths.push({ label: "国内直连", detail: "国内可直接访问，无需额外工具" });
  }

  // Difficulty strength
  if (tool.difficulty === "beginner") {
    strengths.push({ label: "入门友好", detail: "操作简单直观，新手也能快速上手" });
  }

  // Platform strength
  if (tool.platform && tool.platform.length >= 3) {
    strengths.push({ label: "多平台支持", detail: `支持 ${tool.platform.length} 种平台（${tool.platform.slice(0, 4).join("、")}）` });
  }

  // Tag/description based
  if (tool.tags.includes("热门") || tool.tags.includes("popular")) {
    strengths.push({ label: "热门推荐", detail: "被广泛使用的热门 AI 工具" });
  }

  if (desc.includes("GPT-4") || desc.includes("gpt-4")) {
    strengths.push({ label: "先进模型", detail: "基于 GPT-4 等先进模型，输出质量高" });
  }
  if (desc.includes("多语言") || desc.includes("多国")) {
    strengths.push({ label: "多语言支持", detail: "支持多种语言，适合国际化场景" });
  }

  // Default fallback
  if (strengths.length === 0) {
    strengths.push({ label: "功能实用", detail: "提供核心功能满足日常使用需求" });
  }

  return strengths.slice(0, 5);
}

/**
 * Generate neutral "可能局限" based on pricing, region, platform, difficulty.
 */
export function getToolLimitations(tool: Tool): LimitationItem[] {
  const limitations: LimitationItem[] = [];

  if (tool.pricing === "Paid") {
    limitations.push({ label: "需付费使用", detail: "该工具为付费产品，建议先查看官网了解定价方案和试用政策" });
  }
  if (tool.pricing === "Freemium") {
    limitations.push({ label: "高级功能付费", detail: "高级功能和用量限制可能需要升级到付费版本" });
  }

  if (tool.region === "requires-vpn") {
    limitations.push({ label: "访问受限", detail: "国内访问可能需要借助网络工具，具体以官网实际情况为准" });
  } else if (tool.region === "global") {
    limitations.push({ label: "海外工具", detail: "以海外用户为主，国内访问体验可能不稳定" });
  }

  if (tool.difficulty === "advanced") {
    limitations.push({ label: "学习曲线", detail: "功能深入但上手可能需要一定学习成本" });
  }

  if (tool.platform && tool.platform.length === 1 && tool.platform[0] === "web") {
    limitations.push({ label: "仅 Web 端", detail: "仅提供网页版，不支持桌面或移动端应用" });
  }

  if (tool.rating && tool.rating < 4) {
    limitations.push({ label: "评分一般", detail: "用户评分相对同类工具偏低" });
  }

  if (!tool.featured) {
    // Use a softer version
  }

  // Generic fallback if no other limitations
  if (limitations.length === 0) {
    limitations.push({ label: "按需评估", detail: "建议结合具体使用场景体验后判断是否适合" });
  }

  return limitations.slice(0, 4);
}

/**
 * Find 3-5 alternative tools from the same category or shared taskTags.
 * Excludes the current tool and prefers higher-rated tools.
 */
export function getAlternativeTools(tool: Tool, limit = 5): Tool[] {
  const sameCategory = comprehensiveTools.filter(
    (t) => t.id !== tool.id && t.category === tool.category,
  );

  const sameTask = comprehensiveTools.filter(
    (t) =>
      t.id !== tool.id &&
      t.taskTags?.some((tag) => tool.taskTags?.includes(tag)),
  );

  // Merge: category matches first, then task matches, deduped, sorted by rating
  const seen = new Set<string>();
  const merged: Tool[] = [];

  for (const t of sameCategory) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      merged.push(t);
    }
  }
  for (const t of sameTask) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      merged.push(t);
    }
  }

  return merged.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, limit);
}

/**
 * Generate a 4-step recommended workflow based on taskTags.
 * Falls back to a generic workflow if no taskTags match.
 */
export function getRecommendedWorkflow(tool: Tool): WorkflowStep[] {
  const tags = tool.taskTags ?? [];

  // Define preset workflows for common task scenarios
  const WORKFLOWS: Record<string, WorkflowStep[]> = {
    "write-paper": [
      { step: 1, title: "选题与调研", description: "使用工具进行文献检索和研究方向探索" },
      { step: 2, title: "大纲撰写", description: "利用 AI 生成论文大纲和结构框架" },
      { step: 3, title: "内容生成与润色", description: "逐节生成论文内容并进行语言润色" },
      { step: 4, title: "查重与校对", description: "检查内容原创性，完成最终校对和格式调整" },
    ],
    "make-slides": [
      { step: 1, title: "内容梳理", description: "整理演示文稿的核心内容和逻辑结构" },
      { step: 2, title: "大纲生成", description: "使用 AI 辅助生成 PPT 大纲和提纲" },
      { step: 3, title: "设计与排版", description: "自动生成幻灯片并匹配主题风格和排版" },
      { step: 4, title: "演示优化", description: "调整细节，添加动画和过渡效果" },
    ],
    "write-resume": [
      { step: 1, title: "信息整理", description: "梳理个人经历、技能和项目成果" },
      { step: 2, title: "简历生成", description: "利用 AI 生成符合行业标准的简历草稿" },
      { step: 3, title: "优化与定制", description: "针对不同职位定制简历内容" },
      { step: 4, title: "审核与导出", description: "检查语法和格式，导出最终版本" },
    ],
    "ai-coding": [
      { step: 1, title: "需求分析", description: "明确功能需求，拆解为可执行的任务" },
      { step: 2, title: "代码生成", description: "使用 AI 辅助生成基础代码框架" },
      { step: 3, title: "调试与优化", description: "利用 AI 审查代码、修复 Bug 并优化性能" },
      { step: 4, title: "部署与测试", description: "完成测试部署，确保代码质量" },
    ],
    "video-create": [
      { step: 1, title: "脚本策划", description: "确定视频主题，生成文案和分镜头脚本" },
      { step: 2, title: "素材生成", description: "利用 AI 生成视频画面、配音和背景音乐" },
      { step: 3, title: "剪辑合成", description: "自动或辅助进行视频剪辑和特效添加" },
      { step: 4, title: "导出与发布", description: "完成渲染导出，发布到目标平台" },
    ],
    "image-design": [
      { step: 1, title: "概念构思", description: "确定设计方向、风格和配色方案" },
      { step: 2, title: "草图生成", description: "使用 AI 快速生成多个设计草案" },
      { step: 3, title: "精修细化", description: "在选定方案基础上进行细节优化" },
      { step: 4, title: "导出交付", description: "完成导出，适配不同用途的格式要求" },
    ],
    "copywriting": [
      { step: 1, title: "选题定位", description: "明确受众目标、内容方向和核心信息" },
      { step: 2, title: "初稿生成", description: "利用 AI 生成初稿内容" },
      { step: 3, title: "优化调整", description: "根据反馈调整语气、结构和关键信息" },
      { step: 4, title: "发布分发", description: "完成最终打磨，发布到对应渠道" },
    ],
    "academic-research": [
      { step: 1, title: "文献检索", description: "使用 AI 搜索和筛选相关学术文献" },
      { step: 2, title: "文献分析", description: "提取关键信息和研究趋势" },
      { step: 3, title: "数据整理", description: "整理研究数据和实验设计" },
      { step: 4, title: "论文撰写", description: "撰写研究发现并完成论文草稿" },
    ],
    "data-analysis": [
      { step: 1, title: "数据收集", description: "导入和清洗原始数据" },
      { step: 2, title: "探索分析", description: "使用 AI 辅助发现数据模式和异常" },
      { step: 3, title: "可视化呈现", description: "生成图表和仪表盘展示分析结果" },
      { step: 4, title: "报告解读", description: "撰写数据分析报告和洞察总结" },
    ],
    "automation": [
      { step: 1, title: "流程梳理", description: "明确需要自动化的业务步骤和触发条件" },
      { step: 2, title: "工具配置", description: "配置 AI Agent 或自动化工作流" },
      { step: 3, title: "测试运行", description: "测试自动化流程的稳定性和准确性" },
      { step: 4, title: "监控优化", description: "持续监控运行效果，根据反馈优化" },
    ],
  };

  // Find matching workflow from taskTags
  for (const tag of tags) {
    if (WORKFLOWS[tag]) {
      return WORKFLOWS[tag];
    }
  }

  // Generic fallback workflow
  return [
    { step: 1, title: "明确需求", description: "确定使用场景和目标" },
    { step: 2, title: "工具准备", description: "打开工具并了解基本功能" },
    { step: 3, title: "执行操作", description: "按流程使用工具完成主要任务" },
    { step: 4, title: "结果导出", description: "检查和导出最终结果" },
  ];
}

/**
 * Check which data fields are populated for a tool.
 */
export function getToolDataStatus(tool: Tool): DataStatus[] {
  return [
    {
      label: "价格信息",
      populated: !!tool.pricing,
      value: tool.pricing === "Free" ? "免费" : tool.pricing === "Freemium" ? "免费增值" : tool.pricing === "Paid" ? "付费" : "暂未收录",
    },
    {
      label: "国内可用情况",
      populated: !!tool.region,
      value: tool.region === "domestic" ? "已确认" : tool.region === "requires-vpn" ? "需工具访问" : tool.region === "global" ? "海外工具" : "暂未收录",
    },
    {
      label: "平台支持",
      populated: !!(tool.platform && tool.platform.length > 0),
      value: tool.platform && tool.platform.length > 0 ? tool.platform.join("、") : "暂未收录",
    },
    {
      label: "适合任务标签",
      populated: !!(tool.taskTags && tool.taskTags.length > 0),
      value: tool.taskTags && tool.taskTags.length > 0 ? tool.taskTags.map((t) => getTaskLabel(t)).join("、") : "暂未记录",
    },
    {
      label: "使用难度",
      populated: !!tool.difficulty,
      value: tool.difficulty === "beginner" ? "新手" : tool.difficulty === "intermediate" ? "进阶" : tool.difficulty === "advanced" ? "专业" : "暂未记录",
    },
    {
      label: "最近检查",
      populated: !!tool.lastChecked,
      value: tool.lastChecked ? new Date(tool.lastChecked).toLocaleDateString("zh-CN") : "暂未记录",
    },
  ];
}
