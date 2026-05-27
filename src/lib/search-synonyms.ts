/**
 * Chinese search synonym map for AI tools queries.
 * Maps common Chinese search terms to expanded query terms
 * so searching "论文" also matches tools tagged with "学术研究" / "paper" / "research".
 */

export const SEARCH_SYNONYMS: Record<string, string[]> = {
  论文: ["写论文", "学术研究", "文献", "paper", "research", "学术", "期刊", "essay"],
  "写论文": ["论文", "学术研究", "文献", "paper", "research"],
  PPT: ["演示文稿", "presentation", "slides", "幻灯片", "演示", "slide"],
  简历: ["求职", "resume", "CV", "招聘", "面试", "找工作"],
  编程: ["代码", "开发", "coding", "programming", "程序员", "软件开发", "程序"],
  代码: ["编程", "开发", "coding", "programming", "程序员"],
  视频: ["剪辑", "生成视频", "video", "短视频", "视频生成", "视频编辑", "动画", "短视频"],
  图片: ["图像", "绘画", "设计", "image", "图片生成", "AI绘画", "修图", "插画"],
  图像: ["图片", "绘画", "设计", "image", "图片生成", "AI绘画"],
  自动化: ["workflow", "agent", "工作流", "自动", "流程", "RPA", "机器人"],
  工作流: ["自动化", "workflow", "agent", "流程"],
  知识库: ["RAG", "问答", "检索", "knowledge base", "知识管理", "文档", "知识"],
  翻译: ["translation", "语言", "多语言", "英文", "中文", "英语"],
  聊天: ["对话", "chat", "chatbot", "客服", "问答", "助手"],
  音乐: ["音频", "music", "audio", "配音", "语音", "声音", "歌曲"],
  音频: ["音乐", "music", "audio", "配音", "语音"],
  数据分析: ["data", "分析", "可视化", "报表", "统计", "excel", "数据"],
  搜索: ["search", "搜索引擎", "查找", "检索", "搜索"],
  免费: ["free", "开源", "open source", "免费工具", "免费增值"],
  开源: ["free", "免费", "open source"],
  设计: ["图片", "图像", "设计工具", "平面设计", "UI设计", "design"],
  写作: ["文案", "文章", "内容创作", "writing", "copywriting", "文案写作"],
  文案: ["写作", "文章", "copywriting", "营销", "内容创作"],
  客服: ["聊天", "对话", "chatbot", "客户服务", "support"],
  办公: ["企业", "效率", "办公工具", "团队协作", "office"],
  企业: ["办公", "团队", "enterprise", "商务"],
  教育: ["学习", "教学", "education", "课程", "培训"],
  学习: ["教育", "教学", "education", "课程"],
  营销: ["文案", "推广", "marketing", "SEO", "广告", "社交"],
  电商: ["ecommerce", "商品", "商城", "店铺", "零售", "商品管理"],
  开发: ["编程", "代码", "development", "coding", "API", "部署", "程序员"],
  部署: ["开发", "devops", "部署", "docker", "hosting"],
  聊天机器人: ["聊天", "chatbot", "对话", "助手", "AI聊天"],
  提示词: ["prompt", "提示工程", "prompt engineering", "指令"],
  prompt: ["提示词", "提示工程", "提示"],
  人物: ["角色", "character", "虚拟角色", "AI角色", "角色扮演"],
  角色: ["人物", "character", "虚拟角色", "角色扮演"],
  "3D": ["三维", "3D建模", "3D设计", "建模", "模型"],
  建模: ["3D", "三维", "3D建模", "3D设计"],
  表格: ["excel", "电子表格", "数据", "spreadsheet"],
  文档: ["知识库", "文档管理", "document", "文档写作"],
  博客: ["blog", "写作", "内容创作", "文章"],
  邮件: ["email", "邮件写作", "营销邮件"],
  面试: ["求职", "简历", "面试准备", "interview"],
};

/**
 * Expand a user's query into a set of related search terms.
 * Example: "论文" → ["论文", "写论文", "学术研究", "文献", "paper", "research", ...]
 */
export function expandQuery(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  const terms = new Set<string>();

  // Always include the original query
  terms.add(normalized);

  // Match against known synonyms
  for (const [key, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      for (const s of synonyms) {
        terms.add(s.toLowerCase());
      }
    }
  }

  // Word-level matching: if the query is "写论文", match "写论文" and "论文"
  // This is already covered above by the inclusive check

  return [...terms];
}

/**
 * Hot search terms for display in the autocomplete dropdown
 */
export const HOT_SEARCH_TERMS = [
  "写论文",
  "AI编程",
  "视频生成",
  "PPT",
  "简历",
  "自动化",
  "图像设计",
  "知识库",
];
