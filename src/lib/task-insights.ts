/**
 * Task page insights — generates content for /tasks/[slug] pages.
 * For the 8 high-priority tasks, content is manually curated in TASK_PAGE_CONTENT (task-detail-page.tsx).
 * This file provides programmatic generators for ALL tasks (including those without manual content).
 */

import { comprehensiveTools, Tool } from "@/data/comprehensive-tools";
import { TASK_DEFINITIONS, type TaskDefinition } from "@/data/task-definitions";

// ─── Types ──────────────────────────────────────────────────────────────

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface SelectionTip {
  for: string; // "新手" | "免费优先" | "专业用户"
  description: string;
  toolName?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface RelatedTask {
  value: string;
  label: string;
  icon: string;
  description: string;
}

// ─── Workflow presets ───────────────────────────────────────────────────

const WORKFLOW_PRESETS: Record<string, WorkflowStep[]> = {
  "write-paper": [
    { step: 1, title: "资料检索", description: "用 AI 搜索引擎查找相关论文和文献资料" },
    { step: 2, title: "文献阅读", description: "用 AI 阅读工具快速提取核心观点和方法" },
    { step: 3, title: "大纲生成", description: "利用 AI 辅助生成论文结构和章节大纲" },
    { step: 4, title: "正文润色", description: "逐节生成内容，使用 AI 进行语言润色和学术化表达" },
    { step: 5, title: "格式检查", description: "查重检测、引用格式校对、最终排版调整" },
  ],
  "make-slides": [
    { step: 1, title: "主题梳理", description: "确定演示目标和核心信息框架" },
    { step: 2, title: "大纲生成", description: "使用 AI 生成 PPT 结构大纲和每页要点" },
    { step: 3, title: "内容撰写", description: "用 AI 辅助撰写每页的正文内容" },
    { step: 4, title: "设计排版", description: "自动生成幻灯片并匹配主题风格" },
    { step: 5, title: "演示优化", description: "调整动画、演讲词和视觉一致性" },
  ],
  "write-resume": [
    { step: 1, title: "岗位分析", description: "用 AI 分析目标职位的关键要求和关键词" },
    { step: 2, title: "简历优化", description: "根据岗位要求优化简历内容和表达方式" },
    { step: 3, title: "关键词匹配", description: "确保简历中包含 ATS 系统筛选所需的关键词" },
    { step: 4, title: "求职信生成", description: "定制化生成针对性求职信" },
    { step: 5, title: "面试准备", description: "模拟面试问题和简历内容复盘" },
  ],
  "ai-coding": [
    { step: 1, title: "需求拆解", description: "将功能需求分解为可执行的编程任务" },
    { step: 2, title: "代码生成", description: "使用 AI 生成代码框架和核心功能实现" },
    { step: 3, title: "调试优化", description: "用 AI 辅助调试 Bug、优化性能和代码结构" },
    { step: 4, title: "测试部署", description: "生成单元测试、集成测试并完成部署" },
    { step: 5, title: "复盘迭代", description: "代码审查、性能评估和持续迭代改进" },
  ],
  "video-create": [
    { step: 1, title: "脚本策划", description: "确定视频主题和风格，生成拍摄脚本" },
    { step: 2, title: "素材生成", description: "使用 AI 生成视频画面、配音和背景音乐" },
    { step: 3, title: "剪辑合成", description: "AI 辅助剪辑、特效添加和节奏调整" },
    { step: 4, title: "优化导出", description: "添加字幕、封面和品牌元素后导出" },
    { step: 5, title: "发布运营", description: "适配各平台规格并发布，跟踪数据反馈" },
  ],
  "image-design": [
    { step: 1, title: "创意构思", description: "确定设计风格、配色方案和视觉元素" },
    { step: 2, title: "草图生成", description: "使用 AI 快速生成多个设计草案和方向" },
    { step: 3, title: "精修细化", description: "在选定方案基础上进行细节完善和调整" },
    { step: 4, title: "批量处理", description: "批量导出不同尺寸和格式的最终文件" },
    { step: 5, title: "品牌统一", description: "确保设计风格与品牌指南保持一致" },
  ],
  "automation": [
    { step: 1, title: "流程梳理", description: "明确需要自动化的任务步骤和触发条件" },
    { step: 2, title: "工具选型", description: "根据需求选择合适的自动化工具和平台" },
    { step: 3, title: "搭建配置", description: "配置触发器和执行动作，连接各应用" },
    { step: 4, title: "测试验证", description: "运行测试用例确保流程稳定性和准确性" },
    { step: 5, title: "监控优化", description: "持续监控运行效果，根据数据反馈优化" },
  ],
  "academic-research": [
    { step: 1, title: "文献检索", description: "用学术搜索引擎发现相关研究和论文" },
    { step: 2, title: "论文阅读", description: "用 AI 阅读工具快速理解论文核心内容" },
    { step: 3, title: "数据分析", description: "使用 AI 工具处理和分析研究数据" },
    { step: 4, title: "论文撰写", description: "辅助完成论文草稿和学术表达" },
    { step: 5, title: "投稿准备", description: "语言润色、格式调整和投稿期刊选择" },
  ],
};

// ─── Generic workflow generator for undefined tasks ────────────────────

function generateGenericWorkflow(task: TaskDefinition): WorkflowStep[] {
  return [
    { step: 1, title: "需求分析", description: `明确${task.label}的具体目标和需求` },
    { step: 2, title: "工具选择", description: `根据需求筛选适合${task.label}的 AI 工具` },
    { step: 3, title: "执行操作", description: `使用工具完成${task.label}的主要任务` },
    { step: 4, title: "优化调整", description: "根据效果反馈优化和调整输出结果" },
    { step: 5, title: "结果交付", description: "导出最终结果并应用到实际场景" },
  ];
}

// ─── Selection tip presets ─────────────────────────────────────────────

const SELECTION_TIPS: Record<string, SelectionTip[]> = {
  "write-paper": [
    { for: "新手", description: "从 ChatGPT 或 Kimi 开始，免费、上手简单，适合论文大纲生成和段落润色" },
    { for: "免费优先", description: "推荐 Grammarly（免费版可基础语法检查）+ Perplexity（免费学术搜索）组合" },
    { for: "专业用户", description: "Grammarly Premium + Scite + Connected Papers 深度研究组合" },
  ],
  "make-slides": [
    { for: "新手", description: "从 Gamma 开始，免费额度够用，输入主题即可生成完整 PPT" },
    { for: "免费优先", description: "讯飞智文完全免费 + Gamma 免费版，满足日常 PPT 需求" },
    { for: "专业用户", description: "iSlide AI + PowerPoint 深度集成，支持精细调整和企业模板" },
  ],
  "write-resume": [
    { for: "新手", description: "从超级简历 WonderCV 开始，专注中文简历优化，操作简单" },
    { for: "免费优先", description: "Rezi 免费版 + ChatGPT 辅助改写，零成本完成简历优化" },
    { for: "专业用户", description: "Kickresume Premium + Jobscan ATS 优化，全面覆盖求职流程" },
  ],
  "ai-coding": [
    { for: "新手", description: "从 GitHub Copilot 开始，学生免费，VS Code 集成最好" },
    { for: "免费优先", description: "通义灵码完全免费 + Codeium 免费版，国产和海外各一" },
    { for: "专业用户", description: "Cursor（重度开发）+ Copilot（日常辅助）组合使用" },
  ],
  "video-create": [
    { for: "新手", description: "从剪映 AI 开始，完全免费，模板丰富，中文友好" },
    { for: "免费优先", description: "可灵 AI 免费额度 + 剪映 AI，覆盖生成和剪辑全流程" },
    { for: "专业用户", description: "Runway + 可灵 AI 组合，生成质量最高，支持商业项目" },
  ],
  "image-design": [
    { for: "新手", description: "从通义万相或文心一格开始，免费额度充足，中文提示词友好" },
    { for: "免费优先", description: "Stable Diffusion（开源免费）+ Bing Image Creator（免费）组合" },
    { for: "专业用户", description: "Midjourney（艺术感最强）+ Adobe Firefly（商用安全）双持" },
  ],
  "automation": [
    { for: "新手", description: "从集简云开始，中文界面、可视化配置，不需要编程基础" },
    { for: "免费优先", description: "n8n 开源自托管完全免费 + 集简云免费额度" },
    { for: "专业用户", description: "n8n 自托管 + Zapier/Make 付费版，覆盖复杂业务场景" },
  ],
  "academic-research": [
    { for: "新手", description: "从 Perplexity 和 Connected Papers 开始，免费、学术搜索效果好" },
    { for: "免费优先", description: "Perplexity + Scholarcy + ChatGPT 免费版，完全零成本" },
    { for: "专业用户", description: "Scite + Julius AI + Grammarly Premium 完整学术工作流" },
  ],
};

function generateGenericTips(task: TaskDefinition): SelectionTip[] {
  return [
    { for: "新手", description: `选择评分高、免费且标注"新手友好"的 ${task.label} 工具开始体验` },
    { for: "免费优先", description: `筛选免费工具，优先尝试多个工具后选择最适合自己的` },
    { for: "专业用户", description: `关注功能完整性和专业度，可以接受付费方案获取全部功能` },
  ];
}

// ─── FAQ presets for high-priority tasks ────────────────────────────────

const FAQ_PRESETS: Record<string, FAQItem[]> = {
  "write-paper": [
    { q: "写论文可以用哪些 AI 工具？", a: "AI 写论文工具覆盖全流程：资料检索可以用 AI 搜索引擎（如 Perplexity、秘塔 AI），文献阅读可以用学术 AI（如 Scite、Connected Papers），正文写作可以用 ChatGPT、Claude 等对话助手，润色降重可以用 Grammarly、Paperpal 等专业工具。" },
    { q: "AI 写论文会不会重复率高？", a: "AI 工具应作为辅助而非替代。建议先用 AI 检索资料和生成大纲，再用自己的语言完成正文。最后一定要用查重工具检测。合格的 AI 辅助写作可以显著降低重复率风险。" },
    { q: "如何用 AI 做文献综述？", a: "推荐流程：1）用学术搜索引擎查找相关论文 → 2）用 AI 阅读工具快速提取核心观点 → 3）用 AI 工具对比不同研究方法和结论 → 4）用写作助手整理成结构化的综述段落。" },
    { q: "免费的论文 AI 工具够用吗？", a: "对于基础需求完全够用。免费的 ChatGPT、Claude、Kimi 等可以完成大纲生成、段落润色等任务。专业需求（期刊投稿、毕业论文）建议配合 Grammarly 等专业工具使用。" },
    { q: "AI 能帮我做论文降重吗？", a: "可以。Paperpal 等专业工具提供降重功能。建议先用自己的语言写初稿 → AI 辅助润色表达 → 人工审核逻辑 → 查重检测，这样既保证原创性又提升质量。" },
    { q: "写毕业论文用什么 AI 工具组合？", a: "推荐组合：Kimi（长文阅读+中文理解好）+ ChatGPT（逻辑生成）+ Zotero（文献管理）+ Grammarly（语言润色）。这套组合覆盖从文献到成稿的全流程。" },
  ],
  "make-slides": [
    { q: "做 PPT 用哪个 AI 工具最好？", a: "国内推荐 Gamma、iSlide AI，国外推荐 Tome、Beautiful.ai。Gamma 支持一键生成完整 PPT，iSlide AI 与 PowerPoint 深度集成，适合需要精细调整的用户。" },
    { q: "AI 生成的 PPT 可以直接用吗？", a: "AI 生成的是初稿，建议在内容准确性和视觉细节上做人工调整。AI 最擅长的是结构框架和内容初稿，能节省 70% 的前期工作时间。" },
    { q: "免费的 AI PPT 工具有哪些？", a: "Gamma 提供免费额度，Tome 有免费版，讯飞智文完全免费。免费版通常有页数限制，但足以应对日常需求。" },
    { q: "AI 能做演讲稿吗？", a: "可以。Gamma 和 Tome 支持生成演讲备注。ChatGPT 等对话工具可以直接生成演讲稿，包括开场白、过渡句和结束语。" },
    { q: "AI PPT 工具支持中文吗？", a: "国内工具（Gamma 中文版、讯飞智文、iSlide AI）对中文支持很好。海外工具 Gamma 也支持中文输入，但模板更适合英文内容。" },
    { q: "做路演 PPT 推荐什么工具？", a: "推荐 Beautiful.ai 或 Pitch。Beautiful.ai 的自动排版功能非常适合路演场景，确保每页内容聚焦、视觉一致。Gamma 也适合快速产出路演初稿。" },
  ],
  "write-resume": [
    { q: "AI 优化简历真的有效吗？", a: "有效。AI 可以分析职位描述中的关键词，优化你的简历匹配度。同时能帮你改进表达方式、突出量化成果。建议用 AI 辅助 + 人工审核相结合。" },
    { q: "用 AI 写简历会不会被 HR 看出来？", a: "AI 适合做优化而非完全代写。建议用 AI 改进措辞和格式，但保持个人经历的真实性。好的 AI 简历工具能帮你在不动内容的前提下提升专业度。" },
    { q: "免费的 AI 简历工具有哪些？", a: "Kickresume、Rezi 提供免费功能，Wondercv 也有免费版本。国内推荐超级简历 WonderCV，对中文简历优化效果更好。" },
    { q: "AI 能帮我通过 ATS 筛选吗？", a: "可以。Jobscan 等 AI 工具可以分析岗位描述，帮你优化简历中的关键词匹配度。建议每投递一个职位都用 AI 做针对性优化。" },
    { q: "AI 写求职信靠谱吗？", a: "靠谱但需要定制。AI 可以生成求职信框架和初稿，但一定要根据公司和职位做个性化调整。好的求职信 = AI 框架 + 你的真实经历 + 针对性修改。" },
  ],
  "ai-coding": [
    { q: "最好的 AI 编程助手是哪款？", a: "目前主流是 Cursor（专用 IDE）、GitHub Copilot（VS Code 插件）、Windsurf（AI-first IDE）。Cursor 适合重度开发，Copilot 适合日常辅助，各有优势。" },
    { q: "AI 编程工具适合新手吗？", a: "非常适合。AI 编程助手可以解释代码、生成示例、帮助调试，是学习编程的绝佳工具。建议新手从 Copilot 或 Cursor 开始。" },
    { q: "AI 生成的代码安全吗？", a: "AI 生成的代码需要人工审查后再上线。建议：1）不要直接复制生产环境代码 2）检查安全漏洞 3）确保许可证合规。AI 辅助 + 人工审核是最佳实践。" },
    { q: "免费的 AI 编程工具有哪些？", a: "GitHub Copilot 对学生免费，Codeium 提供免费版，Tabnine 有免费基础版。国内有阿里通义灵码完全免费。" },
    { q: "AI 能做代码审查吗？", a: "可以。Cursor 和 Copilot 都支持代码审查功能，能发现潜在 Bug、性能问题和安全隐患。但复杂业务逻辑的审查仍需要人工参与。" },
    { q: "AI 编程工具有哪些不擅长的？", a: "AI 在以下场景效果有限：1）高度复杂的架构设计 2）遗留系统的全面重构 3）需要深层业务理解的逻辑 4）安全敏感场景。这些仍需开发者主导。" },
  ],
  "video-create": [
    { q: "AI 视频生成工具哪个好？", a: "国内推荐可灵 AI（快手）、即梦 AI（字节）、Vidu（生数科技）。海外推荐 Runway、Pika、Sora。可灵 AI 的中文理解和支持度国内领先。" },
    { q: "用 AI 做视频需要多少钱？", a: "入门级完全免费。可灵 AI、剪映等提供大量免费额度和模板。专业需求（4K、长视频）建议付费，月费通常在 100-500 元区间。" },
    { q: "AI 能直接生成完整的视频吗？", a: "可以，但需要人工编排。推荐流程：AI 写脚本 → AI 生成素材片段 → 人工剪辑拼接 → AI 配乐配音。完全自动生成的视频质量还无法达到专业水平。" },
    { q: "AI 视频生成需要什么配置？", a: "大部分 AI 视频工具都在云端运行，普通电脑即可使用。如果需要本地运行 Stable Video Diffusion 等开源模型，建议 16GB+ 显存。" },
    { q: "AI 做短视频适合什么平台？", a: "适合抖音、快手、视频号、小红书等短视频平台。AI 工具特别适合批量生成口播类、知识类和产品展示类短视频。" },
    { q: "数字人播报用什么工具？", a: "国内推荐 HeyGen、D-ID 的中文版。HeyGen 支持数字人形象+语音合成，适合做口播视频和虚拟形象播报。" },
  ],
  "image-design": [
    { q: "最好的 AI 图像生成工具？", a: "海外推荐 Midjourney（艺术感最强）、DALL·E 3（OpenAI）、Stable Diffusion（开源可控）。国内推荐通义万相、文心一格、即梦 AI。" },
    { q: "AI 生成图片的版权归谁？", a: "不同平台政策不同。Midjourney 付费用户拥有商业使用权，Stable Diffusion 开源模型生成的图片通常归用户所有。建议商用前查看具体平台条款。" },
    { q: "免费的 AI 图像工具有哪些？", a: "Stable Diffusion（开源免费）、Bing Image Creator（使用 DALL·E 免费）、Leonardo.ai（有免费额度）。国内通义万相和文心一格提供每日免费生成额度。" },
    { q: "AI 能帮做 Logo 设计吗？", a: "可以。Looka、LogoAI 专做 Logo 设计，Midjourney 也能生成高质量 Logo 方案。建议生成多个选项后找设计师完善最终版本。" },
    { q: "AI 图像工具能商用吗？", a: "取决于平台政策。Adobe Firefly 的生成内容可商用（内置版权保障），Midjourney 付费版可商用，免费工具需查看具体条款。建议商用选择有明确版权声明的平台。" },
    { q: "如何用 AI 做电商产品图？", a: "推荐流程：1）用 Midjourney/通义万相生成产品场景图 2）用 Remove.bg 去背景 3）用 Canva AI 添加文字和营销元素 4）批量导出适配各平台的尺寸。" },
  ],
  "automation": [
    { q: "自动化工作流用什么工具？", a: "海外推荐 n8n（开源）、Zapier、Make（原 Integromat）。国内推荐集简云、WeAutomate。n8n 适合技术团队自托管，Zapier 适合非技术人员。" },
    { q: "AI Agent 和自动化有什么区别？", a: "传统自动化执行固定规则（如：当 A 发生时执行 B），AI Agent 可以做决策（如：分析邮件内容后决定回复方式）。建议两者的结合取长补短。" },
    { q: "自动化工具需要编程基础吗？", a: "不需要。Zapier、Make、集简云都提供可视化拖拽界面。n8n 需要一定技术基础但更灵活。从零开始推荐 Zapier 或集简云。" },
    { q: "AI 自动化能做哪些日常工作？", a: "常见场景：邮件自动分类回复、CRM 数据同步、社交媒体定时发布、报表自动生成、客户跟进提醒、审批流程自动化等，可节省 30-50% 重复工作时间。" },
    { q: "免费自动化工具有哪些？", a: "n8n（完全开源免费，需自托管）、Make 免费版（1000 次操作/月）、集简云免费版（100 次任务/月）。建议从 n8n 开始，功能最完整。" },
    { q: "自动化工具的安全风险？", a: "主要风险：1）API 密钥泄露 2）数据跨平台传输 3）权限范围过大。建议：最小权限原则、使用自托管方案（如 n8n）、定期审计自动化流程。" },
  ],
  "academic-research": [
    { q: "学术研究用哪些 AI 工具？", a: "文献检索推荐 Perplexity、Scite、Semantic Scholar。论文阅读推荐 Scholarcy、ChatPDF。数据分析推荐 Julius AI、ResearchGate 的 AI 功能。" },
    { q: "AI 能帮助做数据分析吗？", a: "能。Julius AI、ChatGPT 的 Advanced Data Analysis 可以直接处理 CSV 数据、生成统计图表、执行回归分析等。建议作为辅助工具，关键分析结果需要人工验证。" },
    { q: "如何用 AI 提高论文投稿成功率？", a: "1) 用 AI 工具检查语言表达和语法 2) 用学术搜索引擎找到合适的投稿期刊 3) 用 AI 分析目标期刊的论文风格。但要记住 AI 不能替代同行评审和学术贡献。" },
    { q: "AI 做文献管理有什么工具？", a: "Zotero（免费+AI 插件）+ Connected Papers（文献关系图）+ Scite（引用分析）。这套组合可以高效管理上千篇文献。" },
    { q: "AI 能帮我写研究方法部分吗？", a: "AI 可以提供研究方法框架和常用表达模板，但具体实验设计、数据收集和分析需要你基于专业知识完成。AI 适合辅助表达，不适合生成研究方法。" },
    { q: "如何防 AI 检测？", a: "不要让 AI 直接生成整段文字。正确做法：AI 辅助思路和框架 → 自己撰写核心内容 → AI 润色语言表达 → 人工最终审核。保持个人学术风格和原创性最关键。" },
  ],
};

function generateGenericFAQ(task: TaskDefinition): FAQItem[] {
  return [
    { q: `${task.label}可以用哪些 AI 工具？`, a: `目前市面上有很多优秀的 AI 工具支持${task.label}场景。建议根据你的具体需求（预算、使用频率、专业程度）选择合适的工具。可以先从免费工具开始体验。` },
    { q: `${task.label}的 AI 工具免费吗？`, a: `大部分 AI 工具提供免费版本或免费额度，可以满足基础使用需求。专业功能或高频使用通常需要付费订阅。建议先试用免费版，确认满足需求后再考虑升级。` },
    { q: `如何选择适合${task.label}的 AI 工具？`, a: `1）明确你的具体需求场景 2）关注工具的核心功能是否匹配 3）查看用户评价和评分 4）优先选择有免费试用的工具 5）考虑工具的国内访问情况。` },
    { q: `${task.label}的 AI 工具值得付费吗？`, a: `如果你高频使用或需要高级功能，付费通常是值得的。付费版本一般提供更多用量、更好的质量和更完善的支持。建议先充分使用免费版再决定。` },
  ];
}

// ─── Related task rules ─────────────────────────────────────────────────

const RELATED_TASK_RULES: Record<string, string[]> = {
  "write-paper": ["academic-research", "copywriting", "knowledge-base", "data-analysis"],
  "make-slides": ["copywriting", "image-design", "enterprise", "data-analysis"],
  "write-resume": ["copywriting", "enterprise", "interview"],
  "ai-coding": ["automation", "local-deploy", "data-analysis", "knowledge-base"],
  "video-create": ["image-design", "copywriting", "automation", "ecommerce"],
  "image-design": ["video-create", "copywriting", "ecommerce", "enterprise"],
  "automation": ["ai-coding", "knowledge-base", "data-analysis", "enterprise"],
  "academic-research": ["write-paper", "data-analysis", "knowledge-base", "copywriting"],
  "copywriting": ["write-paper", "make-slides", "ecommerce", "enterprise"],
  "data-analysis": ["academic-research", "ai-coding", "automation", "enterprise"],
  "knowledge-base": ["academic-research", "automation", "ai-coding", "enterprise"],
  "ecommerce": ["image-design", "video-create", "copywriting", "automation"],
  "local-deploy": ["ai-coding", "automation", "knowledge-base"],
  "enterprise": ["automation", "data-analysis", "knowledge-base", "copywriting"],
};

// ─── Featured tool selection ────────────────────────────────────────────

/**
 * Select 8-12 featured tools for a task, prioritizing:
 * 1. High rating + featured flag
 * 2. Correct taskTags match
 * 3. Favor free/Freemium for accessibility
 * 4. Then by rating descending
 */
export function getFeaturedToolsForTask(task: TaskDefinition, limit = 12): Tool[] {
  const tools = comprehensiveTools.filter((t) =>
    t.taskTags?.includes(task.value),
  );

  if (tools.length === 0) {
    // Fallback: use category match
    const fallback = comprehensiveTools.filter((t) =>
      task.categoryMatch.some((cat) =>
        t.category.toLowerCase().includes(cat.toLowerCase()),
      ),
    );
    return fallback
      .sort(
        (a, b) =>
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
          (b.rating ?? 0) - (a.rating ?? 0),
      )
      .slice(0, limit);
  }

  return tools
    .sort((a, b) => {
      // Score: featured + rating + free bonus
      const scoreA =
        (a.featured ? 10 : 0) +
        (a.rating ?? 0) * 2 +
        (a.pricing === "Free" ? 5 : a.pricing === "Freemium" ? 3 : 0);
      const scoreB =
        (b.featured ? 10 : 0) +
        (b.rating ?? 0) * 2 +
        (b.pricing === "Free" ? 5 : b.pricing === "Freemium" ? 3 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

// ─── Public API ─────────────────────────────────────────────────────────

export function getTaskWorkflow(task: TaskDefinition): WorkflowStep[] {
  return WORKFLOW_PRESETS[task.value] ?? generateGenericWorkflow(task);
}

export function getTaskSelectionTips(task: TaskDefinition): SelectionTip[] {
  return SELECTION_TIPS[task.value] ?? generateGenericTips(task);
}

export function getTaskFAQ(task: TaskDefinition): FAQItem[] {
  return FAQ_PRESETS[task.value] ?? generateGenericFAQ(task);
}

export function getRelatedTasks(task: TaskDefinition): RelatedTask[] {
  const related = RELATED_TASK_RULES[task.value] ?? [];
  return related
    .map((v) => {
      const def = TASK_DEFINITIONS.find((t) => t.value === v);
      if (!def) return null;
      return {
        value: def.value,
        label: def.label,
        icon: def.icon,
        description: def.description,
      };
    })
    .filter(Boolean) as RelatedTask[];
}

/**
 * Generate a full task intro string based on task definition data.
 */
export function getTaskIntro(task: TaskDefinition): string {
  return `${task.label}场景下，AI 工具可以帮助你提升效率、降低成本。${
    task.description
  }。以下精选了 ${
    comprehensiveTools.filter((t) => t.taskTags?.includes(task.value)).length
  } 个相关 AI 工具，覆盖${
    task.tagMatch.slice(0, 4).join("、")
  }等关键词，帮你快速找到最合适的工具。`;
}

/**
 * Get tool count for a task
 */
export function getTaskToolCount(task: TaskDefinition): number {
  return comprehensiveTools.filter((t) =>
    t.taskTags?.includes(task.value),
  ).length;
}
