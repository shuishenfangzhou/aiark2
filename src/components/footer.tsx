import { Github, Twitter, MessageCircle } from "lucide-react";

const footerLinks = [
  {
    title: "工具分类",
    links: [
      { label: "AI 写作工具", href: "#" },
      { label: "AI 图像工具", href: "#" },
      { label: "AI 视频工具", href: "#" },
      { label: "AI 编程工具", href: "#" },
      { label: "AI 办公工具", href: "#" },
    ],
  },
  {
    title: "内容专区",
    links: [
      { label: "AI 快讯", href: "#ai-news" },
      { label: "AI 项目", href: "#ai-projects" },
      { label: "AI 百科", href: "#ai-wiki" },
      { label: "精选工具", href: "#" },
    ],
  },
  {
    title: "关于",
    links: [
      { label: "提交工具", href: "/submit" },
      { label: "纠错反馈", href: "/feedback" },
      { label: "友情链接", href: "#" },
      { label: "隐私政策", href: "#" },
      { label: "联系我们", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 mt-12">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                AI 工具导航
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              发现最全面的 AI 工具集合。
              智能搜索、分类筛选，帮你快速找到最适合的 AI 工具。
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sky-100 dark:hover:bg-sky-900 hover:text-sky-500 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-500 transition-all duration-200"
                aria-label="WeChat"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} AI 工具导航。保留所有权利。
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              发现 · 分类 · 精选 · 一站式 AI 工具导航平台
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
