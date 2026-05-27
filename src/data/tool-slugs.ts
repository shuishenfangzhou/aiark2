/**
 * Tool slug generation and lookup utilities.
 * Auto-generates slugs from tool names — no manual entries needed.
 */

import { comprehensiveTools, Tool } from "./comprehensive-tools";

/**
 * Generate a URL slug from a tool name.
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Build a unique slug for a tool, appending ID if collision exists.
 */
export function toolToSlug(tool: Tool): string {
  const base = nameToSlug(tool.name);
  // Check for collision
  const same = comprehensiveTools.filter(t => nameToSlug(t.name) === base);
  if (same.length <= 1) return base;
  // Append id for uniqueness
  return `${base}-${tool.id}`;
}

/** Build a lookup map: slug → tool */
function buildSlugMap(): Map<string, Tool> {
  const map = new Map<string, Tool>();
  for (const tool of comprehensiveTools) {
    const slug = toolToSlug(tool);
    // If collision, append id
    if (map.has(slug)) {
      map.set(`${slug}-${tool.id}`, tool);
    } else {
      map.set(slug, tool);
    }
  }
  return map;
}

const SLUG_MAP = buildSlugMap();

/**
 * Look up a tool by its slug. Returns undefined if not found.
 */
export function findToolBySlug(slug: string): Tool | undefined {
  return SLUG_MAP.get(slug);
}

/**
 * Find similar tools (same category, excluding self).
 */
export function findSimilarTools(tool: Tool, limit = 4): Tool[] {
  return comprehensiveTools
    .filter(t => t.id !== tool.id && (t.category === tool.category || t.taskTags?.some(tag => tool.taskTags?.includes(tag))))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}
