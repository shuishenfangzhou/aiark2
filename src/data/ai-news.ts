export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  url: string;
  tag: string;
}

export const aiNews: NewsItem[] = [
  {
    id: "1",
    title: "2025年AI指数报告发布：AI全面融入生活",
    summary: "斯坦福HAI发布2025年AI指数报告，指出人工智能现已深入整合到日常生活的方方面面，但在技术性能和社会影响方面仍需深思熟虑的发展。",
    date: "2025-04-10",
    source: "Stanford HAI",
    url: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
    tag: "行业报告"
  },
  {
    id: "2",
    title: "OpenAI发布Sora：文生视频模型震撼登场",
    summary: "OpenAI推出的Sora模型能够根据文本指令生成长达一分钟的高质量视频，展现了惊人的物理世界模拟能力。",
    date: "2024-02-16",
    source: "OpenAI",
    url: "https://openai.com/sora",
    tag: "技术突破"
  },
  {
    id: "3",
    title: "Google发布Gemini 1.5 Pro",
    summary: "Google推出了Gemini 1.5 Pro，支持高达100万token的上下文窗口，大幅提升了长文本处理和多模态理解能力。",
    date: "2024-02-15",
    source: "Google DeepMind",
    url: "https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/",
    tag: "模型更新"
  },
  {
    id: "4",
    title: "GitHub加速器：11个塑造开源AI未来的项目",
    summary: "GitHub公布了2024年加速器计划的入选项目，涵盖了从模型微调、3D AI到AI机器人等多个前沿领域。",
    date: "2024-04-11",
    source: "GitHub",
    url: "https://github.blog/news-insights/company-news/2024-github-accelerator-meet-the-11-projects-shaping-open-source-ai/",
    tag: "开源生态"
  },
  {
    id: "5",
    title: "欧盟通过全球首部《人工智能法案》",
    summary: "欧洲议会正式通过了《人工智能法案》，这是全球首部全面监管AI的法律，将根据风险等级对AI系统进行分级管理。",
    date: "2024-03-13",
    source: "European Parliament",
    url: "https://www.europarl.europa.eu/news/en/press-room/20240308IPR19015/artificial-intelligence-act-meps-adopt-landmark-law",
    tag: "政策法规"
  },
  {
    id: "6",
    title: "Claude 3系列模型发布",
    summary: "Anthropic发布了Claude 3系列模型（Haiku, Sonnet, Opus），其中Opus在多项基准测试中超越了GPT-4。",
    date: "2024-03-04",
    source: "Anthropic",
    url: "https://www.anthropic.com/news/claude-3-family",
    tag: "模型更新"
  }
];
