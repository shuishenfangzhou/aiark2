import { MetadataRoute } from "next";
import { comprehensiveTools } from "@/data/comprehensive-tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aiark2.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Dynamic tool pages (if we had individual tool pages)
  // For now, categories act as landing pages
  const categories = Array.from(
    new Set(comprehensiveTools.map((tool) => tool.category))
  );

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/#${category.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
