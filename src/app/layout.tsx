import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI 工具导航 — 发现最全面的 AI 工具集",
    template: "%s | AI 工具导航",
  },
  description:
    "探索 500+ 精选 AI 工具，涵盖聊天机器人、图像生成、视频创作、编程开发、办公效率等 16+ 分类。每日更新，帮你找到最适合的 AI 工具。",
  keywords: [
    "AI工具",
    "人工智能",
    "ChatGPT",
    "AI导航",
    "AI工具集",
    "AI Tool Directory",
    "AI Search",
    "AI 导航站",
  ],
  authors: [{ name: "AI 工具导航" }],
  creator: "AI 工具导航",
  publisher: "AI 工具导航",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "AI 工具导航",
    title: "AI 工具导航 — 发现最全面的 AI 工具集",
    description:
      "探索 500+ 精选 AI 工具，涵盖聊天机器人、图像生成、视频创作、编程开发、办公效率等 16+ 分类。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI 工具导航",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 工具导航 — 发现最全面的 AI 工具集",
    description:
      "探索 500+ 精选 AI 工具，涵盖聊天机器人、图像生成、视频创作、编程开发、办公效率等 16+ 分类。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="baidu-site-verification" content="code-xxx" />
        <meta name="google-site-verification" content="xxx" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider>
          <Suspense>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}