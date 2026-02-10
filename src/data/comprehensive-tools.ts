import { aiToolsDatabase, categories, Tool } from './ai-tools-database';

export type { Tool };
export const comprehensiveTools = aiToolsDatabase;
export const toolCategories = categories;

export const pricingOptions = [
  { value: "all", label: "全部价格" },
  { value: "Free", label: "免费" },
  { value: "Freemium", label: "免费试用" },
  { value: "Paid", label: "付费" },
];

export const sortOptions = [
  { value: "featured", label: "推荐排序" },
  { value: "rating", label: "评分最高" },
  { value: "popular", label: "最受欢迎" },
  { value: "newest", label: "最新收录" },
];
