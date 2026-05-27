/**
 * Data quality audit script.
 * Checks: missing fields, duplicates, low-quality descriptions, incomplete records.
 *
 * Usage: tsx scripts/data-audit.ts
 */

import { comprehensiveTools } from "../src/data/comprehensive-tools";

// ═══ Types ═══

interface AuditIssue {
  severity: "error" | "warning" | "info";
  toolName: string;
  toolId: string;
  field: string;
  issue: string;
}

// ═══ Helpers ═══

const LOW_QUALITY_DESC_PATTERNS = [
  /^a /i, /^an /i, /^this is /i, /^it is /i,
  /^ai[- ]?powered/i,
  /（待补充）/,
  /\(待补充\)/,
  /^暂无/i,
  /unknown|待定|暂无/i,
];

const ESSENTIAL_FIELDS = [
  "name",
  "description",
  "url",
  "icon",
  "category",
  "tags",
  "pricing",
] as const;



const ALLOWED_CATEGORIES = [
  "AI写作工具",
  "AI图像工具",
  "AI视频工具",
  "AI办公工具",
  "AI智能体",
  "AI聊天助手",
  "AI编程工具",
  "AI设计工具",
  "AI音频工具",
  "AI搜索引擎",
  "AI开发平台",
  "AI学习网站",
  "AI训练模型",
  "AI内容检测",
  "AI提示指令",
  "AI应用集",
];

const VALID_PRICING = ["Free", "Paid", "Freemium"];

const VALID_DIFFICULTY = ["beginner", "intermediate", "advanced"];

const VALID_REGION = ["domestic", "global", "requires-vpn"];

// ═══ Audit ═══

function runAudit(): {
  issues: AuditIssue[];
  stats: Record<string, number>;
} {
  const issues: AuditIssue[] = [];
  const stats: Record<string, number> = {
    total: comprehensiveTools.length,
    missingEssential: 0,
    missingOptional: 0,
    duplicateNames: 0,
    duplicateUrls: 0,
    lowQualityDescription: 0,
    invalidCategory: 0,
    invalidPricing: 0,
    noTaskTags: 0,
    noRating: 0,
    noRegion: 0,
    noPlatform: 0,
    noDifficulty: 0,
    noBestFor: 0,
    noLastChecked: 0,
    emptyTags: 0,
  };

  // ── Check each tool ──
  for (const tool of comprehensiveTools) {
    const t = tool as unknown as { [key: string]: unknown; name?: string; id?: string; description?: string; pricing?: string; region?: string; difficulty?: string; bestFor?: string; lastChecked?: string; tags?: string[]; url?: string; platform?: string[]; category?: string; taskTags?: string[]; rating?: number; featured?: boolean };
    const name = t.name ?? "(unnamed)";
    const id = t.id ?? "(no-id)";

    // Essential fields
    for (const field of ESSENTIAL_FIELDS) {
      const val = t[field];
      if (val === undefined || val === null || val === "") {
        issues.push({
          severity: "error",
          toolName: name,
          toolId: id,
          field,
          issue: `Missing essential field: ${field}`,
        });
        stats.missingEssential++;
      }
    }

    // Description quality
    if (t.description) {
      const desc = String(t.description);
      if (desc.length < 20) {
        issues.push({
          severity: "warning",
          toolName: name,
          toolId: id,
          field: "description",
          issue: `Description too short (${desc.length} chars): "${desc}"`,
        });
        stats.lowQualityDescription++;
      } else if (LOW_QUALITY_DESC_PATTERNS.some((p) => p.test(desc))) {
        issues.push({
          severity: "warning",
          toolName: name,
          toolId: id,
          field: "description",
          issue: `Low-quality description: "${desc.slice(0, 80)}..."`,
        });
        stats.lowQualityDescription++;
      }
    }

    // Category validity
    if (t.category && !ALLOWED_CATEGORIES.includes(t.category)) {
      issues.push({
        severity: "warning",
        toolName: name,
        toolId: id,
        field: "category",
        issue: `Invalid category: "${t.category}"`,
      });
      stats.invalidCategory++;
    }

    // Pricing validity
    if (t.pricing && !VALID_PRICING.includes(t.pricing)) {
      issues.push({
        severity: "warning",
        toolName: name,
        toolId: id,
        field: "pricing",
        issue: `Invalid pricing: "${t.pricing}"`,
      });
      stats.invalidPricing++;
    }

    // Tags
    if (!t.tags || t.tags.length === 0) {
      issues.push({
        severity: "warning",
        toolName: name,
        toolId: id,
        field: "tags",
        issue: "Empty tags array",
      });
      stats.emptyTags++;
    }

    // Optional missing fields
    if (!t.rating) stats.noRating++;
    if (!t.region) {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "region",
        issue: "Missing region",
      });
      stats.noRegion++;
      stats.missingOptional++;
    }
    if (!t.platform || t.platform.length === 0) {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "platform",
        issue: "Missing platform",
      });
      stats.noPlatform++;
      stats.missingOptional++;
    }
    if (!t.difficulty) {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "difficulty",
        issue: "Missing difficulty",
      });
      stats.noDifficulty++;
      stats.missingOptional++;
    }
    if (!t.bestFor || t.bestFor === "") {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "bestFor",
        issue: "Missing bestFor",
      });
      stats.noBestFor++;
      stats.missingOptional++;
    }
    if (!t.lastChecked) {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "lastChecked",
        issue: "Missing lastChecked date",
      });
      stats.noLastChecked++;
      stats.missingOptional++;
    }
    if (!t.taskTags || t.taskTags.length === 0) {
      issues.push({
        severity: "info",
        toolName: name,
        toolId: id,
        field: "taskTags",
        issue: "No task tags assigned",
      });
      stats.noTaskTags++;
      stats.missingOptional++;
    }

    // Difficulty validity
    if (t.difficulty && !VALID_DIFFICULTY.includes(t.difficulty)) {
      issues.push({
        severity: "warning",
        toolName: name,
        toolId: id,
        field: "difficulty",
        issue: `Invalid difficulty: "${t.difficulty}"`,
      });
    }

    // Region validity
    if (t.region && !VALID_REGION.includes(t.region)) {
      issues.push({
        severity: "warning",
        toolName: name,
        toolId: id,
        field: "region",
        issue: `Invalid region: "${t.region}"`,
      });
    }
  }

  // ── Check duplicates ──
  const nameMap = new Map<string, string[]>();
  const urlMap = new Map<string, string[]>();

  for (const tool of comprehensiveTools) {
    const t = tool as unknown as Record<string, unknown>;
    const rawName = t.name;
    const key = typeof rawName === "string" ? rawName.toLowerCase().trim() : "";
    if (key) {
      const ids = nameMap.get(key) ?? [];
      ids.push(`${String(t.id ?? "")}:${String(t.name ?? "")}`);
      nameMap.set(key, ids);
    }
    const rawUrl = t.url;
    if (typeof rawUrl === "string") {
      const uKey = rawUrl.toLowerCase().trim().replace(/\/$/, "");
      const ids = urlMap.get(uKey) ?? [];
      ids.push(`${t.id}:${t.name}`);
      urlMap.set(uKey, ids);
    }
  }

  for (const [name, ids] of nameMap) {
    if (ids.length > 1) {
      issues.push({
        severity: "error",
        toolName: name,
        toolId: ids.join(", "),
        field: "name",
        issue: `Duplicate name found in ${ids.length} records: ${ids.join(", ")}`,
      });
      stats.duplicateNames += ids.length;
    }
  }

  for (const [_url, ids] of urlMap) {
    if (ids.length > 1) {
      issues.push({
        severity: "error",
        toolName: ids[0].split(":")[1],
        toolId: ids.join(", "),
        field: "url",
        issue: `Duplicate URL found in ${ids.length} records: ${ids.join(", ")}`,
      });
      stats.duplicateUrls += ids.length;
    }
  }

  return { issues, stats };
}

// ═══ Report ═══

function printReport(issues: AuditIssue[], stats: Record<string, number>) {
  console.log("\n" + "=".repeat(64));
  console.log("  📊 AI Ark Data Quality Audit Report");
  console.log("=".repeat(64));

  console.log(`\n  Total tools:    ${stats.total}`);
  console.log(`  Essential issues: ${stats.missingEssential}`);
  console.log(`  Optional issues:  ${stats.missingOptional}`);
  console.log(`  Duplicate names:  ${stats.duplicateNames}`);
  console.log(`  Duplicate URLs:   ${stats.duplicateUrls}`);
  console.log(`  Low-quality desc: ${stats.lowQualityDescription}`);
  console.log(`  Empty tags:       ${stats.emptyTags}`);
  console.log(`  No taskTags:      ${stats.noTaskTags}`);
  console.log(`  No region:        ${stats.noRegion}`);
  console.log(`  No platform:      ${stats.noPlatform}`);
  console.log(`  No difficulty:    ${stats.noDifficulty}`);
  console.log(`  No bestFor:       ${stats.noBestFor}`);
  console.log(`  No lastChecked:   ${stats.noLastChecked}`);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  console.log(`\n  ${"─".repeat(54)}`);
  console.log(`  🔴 Errors:   ${errors.length}`);
  console.log(`  🟡 Warnings: ${warnings.length}`);
  console.log(`  🔵 Info:     ${infos.length}`);

  if (errors.length > 0) {
    console.log(`\n  ── Errors ──`);
    for (const issue of errors.slice(0, 20)) {
      console.log(`    [${issue.severity}] ${issue.toolName} (#${issue.toolId}): ${issue.issue}`);
    }
    if (errors.length > 20) {
      console.log(`    ... and ${errors.length - 20} more errors`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\n  ── Warnings (first 20) ──`);
    for (const issue of warnings.slice(0, 20)) {
      console.log(`    [${issue.severity}] ${issue.toolName}: ${issue.issue}`);
    }
    if (warnings.length > 20) {
      console.log(`    ... and ${warnings.length - 20} more warnings`);
    }
  }

  console.log("\n" + "=".repeat(64));
  console.log("  Audit complete.");
  console.log("=".repeat(64) + "\n");
}

// ═══ Main ═══

const { issues, stats } = runAudit();
printReport(issues, stats);

// Exit with non-zero if any errors
if (stats.missingEssential > 0 || stats.duplicateNames > 0 || stats.duplicateUrls > 0) {
  process.exit(1);
}
