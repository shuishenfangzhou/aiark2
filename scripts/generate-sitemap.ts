/**
 * Generate sitemap.xml at build time.
 * Run BEFORE `vite build` to output dist/sitemap.xml.
 *
 * Usage: tsx scripts/generate-sitemap.ts
 */

import * as fs from "fs";
import * as path from "path";
import { comprehensiveTools } from "../src/data/comprehensive-tools";
import { TASK_DEFINITIONS } from "../src/data/task-definitions";
import { toolToSlug } from "../src/data/tool-slugs";

const BASE_URL = "https://ai-ark.top";
const DIST_DIR = path.resolve(__dirname, "../dist");

// ═══ XML Builder ═══

function xml(urls: { loc: string; priority: number; changefreq: string }[]): string {
  const items = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority.toFixed(1)}</priority>\n    <changefreq>${u.changefreq}</changefreq>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
}

// ═══ Generate ═══

const urls: { loc: string; priority: number; changefreq: string }[] = [
  { loc: BASE_URL, priority: 1.0, changefreq: "daily" },
  { loc: `${BASE_URL}/quiz`, priority: 0.9, changefreq: "weekly" },
  { loc: `${BASE_URL}/compare`, priority: 0.8, changefreq: "weekly" },
  { loc: `${BASE_URL}/submit`, priority: 0.5, changefreq: "monthly" },
  { loc: `${BASE_URL}/feedback`, priority: 0.3, changefreq: "monthly" },
  { loc: `${BASE_URL}/learn`, priority: 0.7, changefreq: "monthly" },
];

// /tasks/[slug]
for (const def of TASK_DEFINITIONS) {
  urls.push({
    loc: `${BASE_URL}/tasks/${def.value}`,
    priority: 0.85,
    changefreq: "weekly",
  });
}

// Known slug aliases (resolved by task-detail-page.tsx redirect logic)
const ALIAS_SLUGS = [
  "ppt", "slide", "resume", "resume-job", "job",
  "image", "img", "coding", "programming", "research",
  "video", "automate", "paper",
];
for (const slug of ALIAS_SLUGS) {
  urls.push({
    loc: `${BASE_URL}/tasks/${slug}`,
    priority: 0.8,
    changefreq: "weekly",
  });
}

// /tools/[slug] — derive from all actual tool data
const SEEN_SLUGS = new Set<string>();
for (const tool of comprehensiveTools) {
  const slug = toolToSlug(tool);
  if (SEEN_SLUGS.has(slug)) {
    urls.push({
      loc: `${BASE_URL}/tools/${slug}-${tool.id}`,
      priority: 0.7,
      changefreq: "weekly",
    });
  } else {
    SEEN_SLUGS.add(slug);
    urls.push({
      loc: `${BASE_URL}/tools/${slug}`,
      priority: 0.7,
      changefreq: "weekly",
    });
  }
}

// Category pages (hash-based)
const categories = [
  "AI写作工具", "AI图像工具", "AI视频工具", "AI办公工具",
  "AI智能体", "AI聊天助手", "AI编程工具", "AI设计工具",
  "AI音频工具", "AI搜索引擎", "AI开发平台", "AI学习网站",
  "AI训练模型", "AI内容检测", "AI提示指令", "AI应用集",
];
for (const cat of categories) {
  urls.push({
    loc: `${BASE_URL}/#category-${cat.toLowerCase().replace(/\s+/g, "-")}`,
    priority: 0.6,
    changefreq: "weekly",
  });
}

// ═══ Write ═══

// Ensure dist dir exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const output = xml(urls);
fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), output, "utf-8");
console.log(`✅ sitemap.xml written (${urls.length} URLs)`);
