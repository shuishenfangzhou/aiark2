export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    id: "1",
    name: "ChatGPT",
    description: "OpenAI 的强大对话式 AI 助手，用于自然语言处理和生成。",
    url: "https://chat.openai.com",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=ChatGPT%20logo%20minimalist%20blue%20gradient%20icon&image_size=square",
    category: "聊天机器人",
    tags: ["免费", "GPT-4", "热门"]
  },
  {
    id: "2",
    name: "Claude",
    description: "Anthropic 开发的 AI 助手，具有先进的推理能力和符合伦理的 AI 原则。",
    url: "https://claude.ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Claude%20AI%20logo%20minimalist%20purple%20gradient%20icon&image_size=square",
    category: "聊天机器人",
    tags: ["免费", "高级", "热门"]
  },
  {
    id: "3",
    name: "Midjourney",
    description: "AI 驱动的图像生成工具，可根据文本描述创建令人惊叹的视觉效果。",
    url: "https://midjourney.com",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Midjourney%20logo%20minimalist%20gradient%20icon%20artistic&image_size=square",
    category: "绘画",
    tags: ["付费", "图像生成", "热门"]
  },
  {
    id: "4",
    name: "DALL-E 3",
    description: "OpenAI 的先进图像生成模型，可根据文本提示创建详细图像。",
    url: "https://openai.com/dall-e-3",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=DALL-E%20logo%20minimalist%20colorful%20gradient%20icon&image_size=square",
    category: "绘画",
    tags: ["付费", "图像生成", "OpenAI"]
  },
  {
    id: "5",
    name: "Runway ML",
    description: "面向创意专业人士和内容创作者的 AI 视频生成和编辑平台。",
    url: "https://runwayml.com",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Runway%20ML%20logo%20minimalist%20video%20icon%20gradient&image_size=square",
    category: "视频",
    tags: ["付费", "视频生成", "创意"]
  },
  {
    id: "6",
    name: "Pika Labs",
    description: "AI 视频创作平台，可将文本和图像转化为引人入胜的视频内容。",
    url: "https://pika.art",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Pika%20Labs%20logo%20minimalist%20video%20play%20icon&image_size=square",
    category: "视频",
    tags: ["免费增值", "视频生成", "创意"]
  },
  {
    id: "7",
    name: "GitHub Copilot",
    description: "集成到流行 IDE 中的 AI 驱动的代码补全和结对编程工具。",
    url: "https://github.com/features/copilot",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=GitHub%20Copilot%20logo%20minimalist%20code%20icon%20blue&image_size=square",
    category: "开发者工具",
    tags: ["付费", "代码助手", "GitHub"]
  },
  {
    id: "8",
    name: "Cursor",
    description: "具有先进代码生成和重构功能的 AI 优先代码编辑器。",
    url: "https://cursor.sh",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Cursor%20IDE%20logo%20minimalist%20code%20editor%20icon&image_size=square",
    category: "开发者工具",
    tags: ["免费增值", "IDE", "代码助手"]
  },
  {
    id: "9",
    name: "Stable Diffusion",
    description: "用于根据文本描述生成高质量图像的开源 AI 模型。",
    url: "https://stability.ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Stable%20Diffusion%20logo%20minimalist%20gradient%20icon&image_size=square",
    category: "绘画",
    tags: ["开源", "图像生成", "免费"]
  },
  {
    id: "10",
    name: "Notion AI",
    description: "集成到 Notion 中的 AI 写作助手，用于内容创作和提高生产力。",
    url: "https://www.notion.so/product/ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Notion%20AI%20logo%20minimalist%20black%20and%20white%20icon&image_size=square",
    category: "生产力",
    tags: ["付费", "写作助手", "生产力"]
  },
  {
    id: "11",
    name: "Perplexity",
    description: "提供带有来源和引用的实时答案的 AI 搜索引擎。",
    url: "https://www.perplexity.ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Perplexity%20AI%20logo%20minimalist%20search%20icon%20blue&image_size=square",
    category: "聊天机器人",
    tags: ["免费", "搜索", "研究"]
  },
  {
    id: "12",
    name: "Synthesia",
    description: "AI 视频创作平台，可使用 AI 虚拟形象生成专业视频。",
    url: "https://www.synthesia.io",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Synthesia%20logo%20minimalist%20video%20avatar%20icon&image_size=square",
    category: "视频",
    tags: ["付费", "视频生成", "虚拟形象"]
  },
  {
    id: "13",
    name: "Replit AI",
    description: "具有协作功能和即时部署能力的 AI 驱动的编码平台。",
    url: "https://replit.com",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Replit%20logo%20minimalist%20code%20icon%20purple&image_size=square",
    category: "开发者工具",
    tags: ["免费增值", "云端 IDE", "协作"]
  },
  {
    id: "14",
    name: "Canva AI",
    description: "具有魔力设计功能和内容生成的 AI 驱动的设计平台。",
    url: "https://www.canva.com",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Canva%20logo%20minimalist%20design%20icon%20colorful&image_size=square",
    category: "绘画",
    tags: ["免费增值", "设计", "模板"]
  },
  {
    id: "15",
    name: "Jasper",
    description: "用于营销内容、博客文章和商业文案的 AI 写作助手。",
    url: "https://www.jasper.ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Jasper%20AI%20logo%20minimalist%20writing%20icon%20orange&image_size=square",
    category: "生产力",
    tags: ["付费", "内容写作", "营销"]
  },
  {
    id: "16",
    name: "Copy.ai",
    description: "用于创建营销内容和社交媒体帖子的 AI 驱动的文案撰写工具。",
    url: "https://www.copy.ai",
    icon: "https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=Copy.ai%20logo%20minimalist%20copywriting%20icon%20blue&image_size=square",
    category: "生产力",
    tags: ["免费增值", "文案撰写", "营销"]
  }
];

export const categories = [
  "热门",
  "聊天机器人", 
  "绘画",
  "视频",
  "开发者工具",
  "生产力"
];