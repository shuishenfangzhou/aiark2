/**
 * Auto-enrichment logic for inferred tool fields.
 * No manual curation needed — derives region, platform, difficulty, bestFor
 * from existing description, category, tags, and pricing.
 */

import type { Tool } from "./ai-tools-database";

// ─── Region inference ────────────────────────────────────────────────

const DOMESTIC_HINTS = [
  "百度", "阿里", "腾讯", "讯飞", "字节", "抖音", "快手", "华为",
  "科大讯飞", "商汤", "旷视", "智谱", "月之暗面", "MiniMax", "阶跃星辰",
  "零一万物", "百川", "通义", "文心", "豆包", "可灵", "即梦", "Kimi",
  "秘塔", "夸克", "天工", "万相", "通义千问", "通义万相",
  "chinese", "中文", "国产",
];

const DOMESTIC_TAGS = ["中文", "国产", "国内"];

const OVERSEAS_HINTS = [
  "openai", "google", "meta", "microsoft", "anthropic", "stability.ai",
  "midjourney", "runway", "hugging face", "github",
];

const REQUIRES_VPN_HINTS = [
  "openai", "chatgpt", "midjourney", "claude", "perplexity",
  "character.ai", "sora", "runway", "pika",
];

function inferRegion(tool: Tool): 'domestic' | 'global' | 'requires-vpn' {
  const fullText = `${tool.name} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase();

  // Check for domestic tools first (strongest signal)
  if (DOMESTIC_HINTS.some(h => fullText.includes(h.toLowerCase()))) return "domestic";
  if (DOMESTIC_TAGS.some(t => tool.tags.some(tag => tag.toLowerCase().includes(t.toLowerCase())) || fullText.includes(t.toLowerCase()))) return "domestic";
  if (tool.category.includes("学习网站") && !OVERSEAS_HINTS.some(h => fullText.includes(h))) return "domestic";

  // Check for requires-vpn (specific tools blocked in China)
  if (REQUIRES_VPN_HINTS.some(h => fullText.includes(h))) return "requires-vpn";

  // Default to global
  return "global";
}

// ─── Platform inference ──────────────────────────────────────────────

const PLATFORM_MAP: [string, string[]][] = [
  ["web", ["web", "网站", "browser", "saas", "在线"]],
  ["windows", ["windows", "win", "desktop"]],
  ["macos", ["macos", "mac", "apple"]],
  ["ios", ["ios", "iphone", "ipad", "app store"]],
  ["android", ["android", "google play"]],
  ["api", ["api", "接口", "sdk", "integration"]],
  ["chrome", ["chrome", "extension", "插件", "浏览器扩展"]],
  ["vscode", ["vscode", "vs code", "visual studio", "ide plugin", "插件"]],
  ["cli", ["cli", "terminal", "command line", "命令行"]],
  ["docker", ["docker", "container", "容器"]],
];

function inferPlatform(tool: Tool): string[] {
  const platforms: string[] = [];
  const fullText = `${tool.description} ${tool.tags.join(" ")}`.toLowerCase();
  const cat = tool.category.toLowerCase();

  // Category-based defaults
  if (cat.includes("编程") || cat.includes("开发") || cat.includes("训练")) {
    platforms.push("web", "api");
  }
  if (cat.includes("聊天") || cat.includes("写作") || cat.includes("办公") || cat.includes("搜索")) {
    platforms.push("web");
  }
  if (cat.includes("图像") || cat.includes("设计") || cat.includes("视频")) {
    platforms.push("web");
  }

  // Tag/description-based detection
  for (const [platform, keywords] of PLATFORM_MAP) {
    if (keywords.some(k => fullText.includes(k))) {
      if (!platforms.includes(platform)) platforms.push(platform);
    }
  }

  // If nothing found, default to web
  if (platforms.length === 0) platforms.push("web");

  // Deduplicate
  return [...new Set(platforms)];
}

// ─── Difficulty inference ────────────────────────────────────────────

function inferDifficulty(tool: Tool): 'beginner' | 'intermediate' | 'advanced' {
  const fullText = `${tool.description} ${tool.tags.join(" ")} ${tool.name}`.toLowerCase();
  const cat = tool.category;

  // Advanced signals
  if (cat === "AI训练模型" || cat === "AI开发平台") return "advanced";
  if (fullText.includes("专业") || fullText.includes("advanced") || fullText.includes("企业")) return "advanced";
  if (tool.pricing === "Paid" && !fullText.includes("简单") && !fullText.includes("小白")) return "advanced";

  // Beginner signals
  if (fullText.includes("新手") || fullText.includes("小白") || fullText.includes("easy") || fullText.includes("简单"))
    return "beginner";
  if (cat === "AI学习网站") return "beginner";
  if (tool.pricing === "Free" && (cat.includes("聊天") || cat.includes("写作"))) return "beginner";

  // Default
  return "intermediate";
}

// ─── bestFor inference ──────────────────────────────────────────────

/**
 * Derive a concise "best for" summary from the first line of description
 * or the first meaningful phrase.
 */
function inferBestFor(tool: Tool): string {
  const desc = tool.description.trim();

  // Use the first sentence/clause of the description
  const firstClause = desc.split(/[，。、；,.;:]/).filter(s => s.trim().length > 4)[0];
  if (firstClause) return firstClause.slice(0, 60);

  // Fallback: first meaningful segment
  return desc.slice(0, 50);
}

// ─── Main enrichment function ────────────────────────────────────────

export function enrichTool(tool: Tool): Tool {
  return {
    ...tool,
    region: tool.region ?? inferRegion(tool),
    platform: tool.platform ?? inferPlatform(tool),
    difficulty: tool.difficulty ?? inferDifficulty(tool),
    bestFor: tool.bestFor ?? inferBestFor(tool),
    lastChecked: tool.lastChecked ?? "2026-05",
  };
}
