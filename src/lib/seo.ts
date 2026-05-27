/**
 * SEO utilities for the SPA.
 * Handles: page title, meta description, canonical, Open Graph, JSON-LD.
 */

export const SITE_URL = "https://ai-ark.top";
export const SITE_NAME = "AI Ark";
export const SITE_DESCRIPTION = "发现最全面的 AI 工具导航，涵盖 500+ 精选工具，16+ 分类，智能推荐帮你快速找到最适合的 AI 工具。";
export const SITE_DEFAULT_TITLE = "AI 工具导航 — 发现最全面的 AI 工具";

interface PageMeta {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  ogImage?: string;
}

/** Clean old SEO script tags to avoid duplicates on re-render */
function cleanupJsonLd() {
  document.querySelectorAll('script[data-seo="1"]').forEach((el) => el.remove());
}

/**
 * Set all SEO-relevant meta tags for a page.
 * Call this in a useEffect (or on mount) for SPA pages.
 */
export function setPageMeta(meta: PageMeta): void {
  // ── Title ──
  document.title = meta.title;

  // ── Meta description ──
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = meta.description;

  // ── Canonical ──
  const canonicalUrl = window.location.href.split("?")[0].split("#")[0];
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  // ── Open Graph ──
  setMetaProp("og:title", meta.title);
  setMetaProp("og:description", meta.description);
  setMetaProp("og:url", canonicalUrl);
  setMetaProp("og:type", "website");
  setMetaProp("og:site_name", SITE_NAME);
  if (meta.ogImage) {
    setMetaProp("og:image", meta.ogImage);
  } else {
    setMetaProp("og:image", `${SITE_URL}/og-image.png`);
  }

  // ── Twitter Card ──
  setMetaName("twitter:card", "summary_large_image");
  setMetaName("twitter:title", meta.title);
  setMetaName("twitter:description", meta.description);
  if (meta.ogImage) {
    setMetaName("twitter:image", meta.ogImage);
  }

  // ── JSON-LD ──
  cleanupJsonLd();
  if (meta.jsonLd) {
    const items = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    for (const item of items) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "1");
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    }
  }
}

/** Helper: set <meta property="..."> */
function setMetaProp(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Helper: set <meta name="..."> */
function setMetaName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}
