import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

// Root route configuration for AI Movie Finder
// Complete SEO setup with meta tags, Open Graph, Twitter Cards
export const Route = createRootRoute({
  head: () => ({
    meta: [
      // Basic meta
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI电影搜索 - 用自然语言描述，AI帮你找电影" },
      {
        name: "description",
        content:
          "AI电影搜索是一款智能电影推荐工具。只需用自然语言描述你想看的电影，AI就能帮你找到最匹配的电影。支持按类型、地区、年代筛选。",
      },
      {
        name: "keywords",
        content:
          "AI电影搜索,电影推荐,找电影,电影查询,智能搜索,DeepSeek,电影筛选,看什么电影",
      },
      { name: "author", content: "AI Movie Finder" },
      { name: "robots", content: "index, follow" },

      // Theme color for mobile browsers
      { name: "theme-color", content: "#ff6b35" },
      { name: "msapplication-TileColor", content: "#0f0f0f" },

      // Open Graph (Facebook, WeChat, etc.)
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI电影搜索 - 用自然语言描述，AI帮你找电影" },
      {
        property: "og:description",
        content:
          "只需描述你想看的电影，AI就能帮你找到最匹配的电影。支持按类型、地区、年代筛选。",
      },
      { property: "og:locale", content: "zh_CN" },
      { property: "og:site_name", content: "AI电影搜索" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI电影搜索 - 用自然语言描述，AI帮你找电影" },
      {
        name: "twitter:description",
        content:
          "只需描述你想看的电影，AI就能帮你找到最匹配的电影。支持按类型、地区、年代筛选。",
      },

      // Apple mobile web app
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "AI电影搜索" },

      // Disable auto-detection
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
      { rel: "manifest", href: "/manifest.json" },
      // Preconnect to API for faster requests
      { rel: "preconnect", href: "https://api.siliconflow.cn" },
    ],
  }),

  component: RootComponent,
});

// Root document component with dark theme styling
function RootComponent() {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0f0f0f] text-white min-h-screen">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
