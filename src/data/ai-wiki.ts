export interface WikiItem {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export const aiWiki: WikiItem[] = [
  {
    id: "1",
    term: "AGI (通用人工智能)",
    definition: "Artificial General Intelligence，指具备与人类同等或超越人类的智能，能够像人类一样执行任何智力任务的机器智能。",
    category: "基础概念"
  },
  {
    id: "2",
    term: "LLM (大语言模型)",
    definition: "Large Language Model，一种基于深度学习的算法，能够识别、总结、翻译、预测和生成文本和其他形式的内容。代表作有GPT-4、Claude 3等。",
    category: "模型技术"
  },
  {
    id: "3",
    term: "Prompt Engineering (提示工程)",
    definition: "通过设计和优化输入给AI模型的文本提示（Prompt），以引导模型生成更准确、高质量输出的技术和艺术。",
    category: "应用技术"
  },
  {
    id: "4",
    term: "RAG (检索增强生成)",
    definition: "Retrieval-Augmented Generation，一种通过从外部知识库检索相关信息来增强大语言模型生成能力的技术，可减少幻觉并提高准确性。",
    category: "技术架构"
  },
  {
    id: "5",
    term: "Transformer",
    definition: "一种深度学习模型架构，引入了自注意力机制（Self-Attention），彻底改变了自然语言处理领域，是现代大模型的基础。",
    category: "基础架构"
  },
  {
    id: "6",
    term: "Fine-tuning (微调)",
    definition: "在预训练模型的基础上，使用特定领域的数据集进行进一步训练，以使模型更好地适应特定任务或应用场景。",
    category: "训练方法"
  },
  {
    id: "7",
    term: "Hallucination (幻觉)",
    definition: "指AI模型生成看似合理但实际上错误、无意义或与事实不符的内容的现象。",
    category: "问题与挑战"
  },
  {
    id: "8",
    term: "Multimodal (多模态)",
    definition: "指AI模型能够处理和理解多种类型的数据输入（如文本、图像、音频、视频）并生成相应输出的能力。",
    category: "模型能力"
  }
];
