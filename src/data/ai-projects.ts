export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  stars: string;
  language: string;
  url: string;
  tags: string[];
}

export const aiProjects: ProjectItem[] = [
  {
    id: "1",
    name: "AutoGPT",
    description: "一个实验性的开源应用程序，展示了GPT-4语言模型的功能。该程序由GPT-4驱动，可以自主链接LLM的'思想'来达到设定的任何目标。",
    stars: "162k+",
    language: "Python",
    url: "https://github.com/Significant-Gravitas/AutoGPT",
    tags: ["Agent", "Automation", "GPT-4"]
  },
  {
    id: "2",
    name: "LangChain",
    description: "用于开发由语言模型驱动的应用程序的框架。它使应用程序能够连接到其他数据源并与其环境进行交互。",
    stars: "85k+",
    language: "Python/JS",
    url: "https://github.com/langchain-ai/langchain",
    tags: ["Framework", "LLM", "DevTools"]
  },
  {
    id: "3",
    name: "Stable Diffusion WebUI",
    description: "基于Gradio库的Stable Diffusion浏览器界面，提供了丰富的图像生成功能和插件支持。",
    stars: "130k+",
    language: "Python",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    tags: ["Image Generation", "UI", "Stable Diffusion"]
  },
  {
    id: "4",
    name: "Llama.cpp",
    description: "Facebook的Llama模型的C/C++移植版本，允许在普通硬件（如MacBook）上高效运行大语言模型。",
    stars: "58k+",
    language: "C++",
    url: "https://github.com/ggerganov/llama.cpp",
    tags: ["Inference", "Optimization", "LLM"]
  },
  {
    id: "5",
    name: "GPT4All",
    description: "一个开源生态系统，用于在消费级CPU上训练和部署庞大的语言模型，无需互联网连接。",
    stars: "65k+",
    language: "C++",
    url: "https://github.com/nomic-ai/gpt4all",
    tags: ["Local LLM", "Privacy", "Chat"]
  },
  {
    id: "6",
    name: "Ollama",
    description: "轻量级、可扩展的框架，用于在本地机器上构建和运行大语言模型。",
    stars: "70k+",
    language: "Go",
    url: "https://github.com/ollama/ollama",
    tags: ["Local LLM", "Tool", "Runner"]
  }
];
