import { Tool } from "@/data/comprehensive-tools";
import { expandQuery, HOT_SEARCH_TERMS } from "./search-synonyms";
import { TASK_DEFINITIONS } from "@/data/task-definitions";

// ─── Types ──────────────────────────────────────────────────────────────

export interface SearchResult {
  tool: Tool;
  score: number;
  matchReasons: string[]; // debugging / explanation
}

export interface AutocompleteSuggestion {
  type: "tool" | "task" | "category";
  label: string;
  subtitle: string;
  value: string; // id for tool, value for task, category name for category
  icon?: string;
}

// ─── Weights ────────────────────────────────────────────────────────────

const W = {
  nameExact: 100,
  nameContains: 80,
  chineseNameExact: 100,
  chineseNameContains: 75,
  taskTags: 70,
  category: 55,
  tags: 45,
  bestFor: 40,
  description: 20,
  meta: 10, // pricing, platform, region
  ratingBonus: 5, // tiny bonus per rating point
};

// ─── Scorer ─────────────────────────────────────────────────────────────

function scoreTool(tool: Tool, lowerTerms: string[]): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const lowerName = tool.name.toLowerCase();
  const lowerChinese = (tool.chineseName ?? "").toLowerCase();
  const lowerDesc = tool.description.toLowerCase();
  const lowerCategory = tool.category.toLowerCase();
  const lowerTags = tool.tags.map((t) => t.toLowerCase());
  const lowerBestFor = (tool.bestFor ?? "").toLowerCase();
  const lowerRegion = (tool.region ?? "").toLowerCase();
  const lowerPlatforms = (tool.platform ?? []).join(" ").toLowerCase();
  const lowerPricing = tool.pricing.toLowerCase();
  const lowerTaskTags = (tool.taskTags ?? []).join(" ").toLowerCase();

  for (const term of lowerTerms) {
    // ── Name exact ──
    if (lowerName === term) {
      score += W.nameExact;
      reasons.push("名称完全匹配");
      continue; // exact match is strongest signal, skip other checks for this term
    }
    if (lowerChinese === term) {
      score += W.chineseNameExact;
      reasons.push("中文名称完全匹配");
    }

    // ── Name contains ──
    if (lowerName.includes(term)) {
      score += W.nameContains;
      if (!reasons.includes("名称包含关键词")) reasons.push("名称包含关键词");
    }
    if (lowerChinese.includes(term) && lowerChinese !== term) {
      score += W.chineseNameContains;
      if (!reasons.includes("中文名称匹配")) reasons.push("中文名称匹配");
    }

    // ── taskTags ──
    if (lowerTaskTags.includes(term)) {
      score += W.taskTags;
      if (!reasons.includes("任务场景匹配")) reasons.push("任务场景匹配");
    }

    // ── category ──
    if (lowerCategory.includes(term)) {
      score += W.category;
      if (!reasons.includes("分类匹配")) reasons.push("分类匹配");
    }

    // ── tags ──
    if (lowerTags.some((t) => t.includes(term))) {
      score += W.tags;
      if (!reasons.includes("标签匹配")) reasons.push("标签匹配");
    }

    // ── bestFor ──
    if (lowerBestFor.includes(term)) {
      score += W.bestFor;
      if (!reasons.includes("场景描述匹配")) reasons.push("场景描述匹配");
    }

    // ── description ──
    if (lowerDesc.includes(term)) {
      score += W.description;
    }

    // ── meta (pricing / platform / region) ──
    if (lowerPricing.includes(term) || lowerPlatforms.includes(term) || lowerRegion.includes(term)) {
      score += W.meta;
    }
  }

  // Small rating bonus
  if (tool.rating) {
    score += Math.round(tool.rating * W.ratingBonus);
  }

  return { score, reasons };
}

// ─── Main search function ───────────────────────────────────────────────

/**
 * Weighted search across all tool fields.
 * Returns tools sorted by relevance score descending.
 * Empty query returns empty results (caller should handle unfiltered state).
 */
export function searchTools(
  query: string,
  tools: Tool[],
): SearchResult[] {
  if (!query.trim()) return [];

  const lowerTerms = expandQuery(query.trim());

  const scored = tools.map((tool) => {
    const { score, reasons } = scoreTool(tool, lowerTerms);
    return { tool, score, matchReasons: reasons };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.tool.rating ?? 0) - (a.tool.rating ?? 0));
}

// ─── Autocomplete suggestions ───────────────────────────────────────────

/**
 * Generate autocomplete suggestions from search query.
 * Returns three groups: tool matches, task matches, category matches.
 */
export function getAutocompleteSuggestions(
  query: string,
  tools: Tool[],
): AutocompleteSuggestion[] {
  if (!query.trim()) return [];

  const lowerQuery = query.trim().toLowerCase();
  const results: AutocompleteSuggestion[] = [];
  const seenIds = new Set<string>();

  // ── Tool suggestions (top 5) ──
  const toolMatches = tools
    .filter((t) => {
      const match =
        t.name.toLowerCase().includes(lowerQuery) ||
        (t.chineseName ?? "").toLowerCase().includes(lowerQuery);
      if (match) seenIds.add(t.id);
      return match;
    })
    .slice(0, 5);

  for (const t of toolMatches) {
    results.push({
      type: "tool",
      label: t.name,
      subtitle: t.category,
      value: t.id,
      icon: t.icon,
    });
  }

  // ── Task suggestions (top 4) ──
  const taskMatches = TASK_DEFINITIONS.filter((task) => {
    return (
      task.label.includes(query) ||
      task.value.includes(lowerQuery) ||
      task.description.includes(query) ||
      task.tagMatch.some((tag) => tag.includes(lowerQuery))
    );
  }).slice(0, 4);

  for (const t of taskMatches) {
    results.push({
      type: "task",
      label: t.label,
      subtitle: t.description,
      value: t.value,
      icon: t.icon,
    });
  }

  // ── Category suggestions (top 4) ──
  const seenCategories = new Set<string>();
  const categoryMatches: { category: string; count: number }[] = [];

  for (const tool of tools) {
    if (
      !seenCategories.has(tool.category) &&
      tool.category.toLowerCase().includes(lowerQuery)
    ) {
      seenCategories.add(tool.category);
      categoryMatches.push({
        category: tool.category,
        count: tools.filter((t) => t.category === tool.category).length,
      });
    }
  }

  for (const c of categoryMatches.slice(0, 4)) {
    results.push({
      type: "category",
      label: c.category,
      subtitle: `${c.count} 个工具`,
      value: c.category,
    });
  }

  return results;
}

// ─── Search explanation ─────────────────────────────────────────────────

/**
 * Generate a human-readable explanation of search results
 * e.g. "已为你找到 36 个与"论文"相关的 AI 工具，优先展示学术研究、AI搜索和写作办公类工具。"
 */
export function getSearchExplanation(query: string, resultsCount: number): string {
  if (!query.trim()) return "";

  const lowerQuery = query.trim().toLowerCase();

  // Check task/category hints
  const hintMap: [string, string][] = [
    ["论文", "优先展示学术研究、AI搜索和写作办公类工具"],
    ["写论文", "优先展示学术研究、AI搜索和写作办公类工具"],
    ["PPT", "优先展示办公工具和设计类工具"],
    ["简历", "优先展示办公工具和写作类工具"],
    ["编程", "优先展示编程工具和开发平台类工具"],
    ["代码", "优先展示编程工具和开发平台类工具"],
    ["视频", "优先展示视频生成、图像设计和音频处理类工具"],
    ["图片", "优先展示图像生成和设计类工具"],
    ["图像", "优先展示图像生成和设计类工具"],
    ["聊天", "优先展示聊天助手和智能体类工具"],
    ["翻译", "优先展示写作工具和搜索引擎类工具"],
    ["搜索", "优先展示搜索引擎和聊天助手类工具"],
    ["音乐", "优先展示音频工具类工具"],
    ["音频", "优先展示音频工具类工具"],
    ["自动化", "优先展示智能体和开发平台类工具"],
    ["工作流", "优先展示智能体和开发平台类工具"],
    ["知识库", "优先展示智能体和知识管理类工具"],
    ["免费", "优先展示免费和免费增值工具"],
    ["开源", "优先展示免费和开源工具"],
    ["客服", "优先展示聊天助手和智能体类工具"],
    ["写作", "优先展示写作办公类工具"],
    ["设计", "优先展示设计工具和图像工具类工具"],
    ["数据分析", "优先展示办公工具和开发平台类工具"],
    ["3D", "优先展示设计工具和图像工具类工具"],
    ["营销", "优先展示写作办公和应用集类工具"],
    ["电商", "优先展示应用集和办公工具类工具"],
    ["办公", "优先展示办公工具和应用集类工具"],
    ["学习", "优先展示学习网站和搜索引擎类工具"],
    ["开发", "优先展示编程工具和开发平台类工具"],
    ["文档", "优先展示写作工具和知识管理类工具"],
  ];

  for (const [key, suffix] of hintMap) {
    if (lowerQuery.includes(key)) {
      return `已为你找到 ${resultsCount} 个与"${query.trim()}"相关的 AI 工具，${suffix}。`;
    }
  }

  return `已为你找到 ${resultsCount} 个相关 AI 工具。`;
}

export { HOT_SEARCH_TERMS };
