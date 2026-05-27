/**
 * Link checker for AI Tools Database.
 *
 * Scans all tool URLs in the database, checks HTTP status,
 * and generates a report at reports/broken-links.json.
 *
 * Usage: npm run check:links
 */

import { comprehensiveTools } from "../src/data/comprehensive-tools";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────

interface CheckResult {
  name: string;
  url: string;
  status: number | "error";
  ok: boolean;
  error?: string;
}

interface Report {
  checkedAt: string;
  total: number;
  ok: number;
  broken: number;
  results: CheckResult[];
}

// ─── Config ──────────────────────────────────────────────────────────

const TIMEOUT_MS = 8_000;
const CONCURRENCY = 5; // parallel requests

// ─── HTTP check ──────────────────────────────────────────────────────

async function checkUrl(
  name: string,
  url: string
): Promise<CheckResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timer);

    return { name, url, status: response.status, ok: response.ok };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err);
    return { name, url, status: "error", ok: false, error: message };
  }
}

// ─── Progress helpers ────────────────────────────────────────────────

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  return min > 0 ? `${min}m${sec % 60}s` : `${sec}s`;
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const tools = comprehensiveTools.filter(
    (t) => t.url && t.url.startsWith("http")
  );

  // Deduplicate by URL (some tools may share the same domain)
  const seen = new Set<string>();
  const unique = tools.filter((t) => {
    const key = t.url.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n🔍 Link Checker — ${unique.length} unique URLs to check\n`);

  const results: CheckResult[] = [];
  let okCount = 0;
  let brokenCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  // Batch processing
  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((t) => checkUrl(t.name, t.url))
    );

    for (const r of batchResults) {
      results.push(r);
      const idx = results.length;

      if (r.ok) {
        okCount++;
        process.stdout.write(
          `  ✅ [${idx}/${unique.length}] ${r.name} — ${r.status}\n`
        );
      } else if (r.status === "error") {
        errorCount++;
        console.log(
          `  ⚠️  [${idx}/${unique.length}] ${r.name} — ${r.error}`
        );
      } else {
        brokenCount++;
        console.log(
          `  ❌ [${idx}/${unique.length}] ${r.name} — ${r.url} (HTTP ${r.status})`
        );
      }
    }
  }

  const elapsed = Date.now() - startTime;

  // Generate report
  const report: Report = {
    checkedAt: new Date().toISOString(),
    total: unique.length,
    ok: okCount,
    broken: brokenCount + errorCount,
    results,
  };

  const reportDir = path.resolve(__dirname, "..", "reports");
  fs.mkdirSync(reportDir, { recursive: true });

  const reportPath = path.join(reportDir, "broken-links.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Summary
  console.log(`\n📊 检查完成 (${formatTime(elapsed)})\n`);
  console.log(`   总数:     ${unique.length}`);
  console.log(`   正常:     ${okCount}`);
  console.log(`   异常:     ${brokenCount + errorCount}`);
  console.log(`     ├─ HTTP 错误: ${brokenCount}`);
  console.log(`     └─ 请求失败:  ${errorCount}`);
  console.log(`\n📄 报告: ${reportPath}\n`);

  // Exit with non-zero if any broken links found
  if (brokenCount + errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
