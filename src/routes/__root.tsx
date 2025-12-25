import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import appCss from "../styles.css?url";

// Create QueryClient with default options
// gcTime: Infinity keeps cached data forever (until page refresh)
// staleTime: Infinity prevents automatic refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Root route configuration for AI Movie Finder
// Complete SEO setup with meta tags, Open Graph, Twitter Cards
export const Route = createRootRoute({
  head: () => ({
    meta: [
      // Basic meta
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI电影搜索 - 描述电影，AI帮你找" },
      {
        name: "description",
        content:
          "AI电影搜索：用自然语言描述你想看的电影，AI智能匹配最相关的电影推荐。支持按类型、地区、年代筛选，快速找到你想看的电影。",
      },
      {
        name: "keywords",
        content:
          "AI电影搜索,电影推荐,找电影,电影查询,智能搜索,电影筛选,看什么电影,电影AI,movie finder,movie search",
      },
      { name: "author", content: "AI Movie Finder" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "zh-CN" },

      // Theme color for mobile browsers
      { name: "theme-color", content: "#0f0f0f" },
      { name: "msapplication-TileColor", content: "#0f0f0f" },
      { name: "msapplication-TileImage", content: "/logo192.png" },

      // Open Graph (Facebook, WeChat, etc.)
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI电影搜索 - 描述电影，AI帮你找" },
      {
        property: "og:description",
        content: "用自然语言描述你想看的电影，AI智能匹配最相关的电影推荐。",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:locale", content: "zh_CN" },
      { property: "og:site_name", content: "AI电影搜索" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI电影搜索 - 描述电影，AI帮你找" },
      {
        name: "twitter:description",
        content: "用自然语言描述你想看的电影，AI智能匹配最相关的电影推荐。",
      },
      { name: "twitter:image", content: "/og-image.png" },

      // Apple mobile web app
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "AI电影搜索" },

      // Disable auto-detection
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      // Preconnect to API for faster requests
      { rel: "preconnect", href: "https://api.siliconflow.cn" },
      { rel: "dns-prefetch", href: "https://api.siliconflow.cn" },
    ],
  }),

  component: RootComponent,
});

// Root document component with dark theme styling
// Wrapped with QueryClientProvider for TanStack Query
function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="zh-CN">
        <head>
          <HeadContent />
        </head>
        <body className="bg-[#0f0f0f] text-white min-h-screen">
          <Outlet />
          <Scripts />
        </body>
      </html>
    </QueryClientProvider>
  );
}
