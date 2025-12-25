import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { I18nProvider } from "../lib/i18n-context";

import appCss from "../styles.css?url";

// Root route configuration for AI Movie Finder
// Complete SEO setup with meta tags, Open Graph, Twitter Cards
// Root route configuration for AI Movie Finder
// Modern glassmorphism UI with Google Fonts
export const Route = createRootRoute({
  head: () => ({
    meta: [
      // Basic meta
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI Movie Finder | AI电影搜索 - Describe & Discover Movies" },
      {
        name: "description",
        content:
          "AI Movie Finder: Describe any movie in natural language and let AI find it for you. Filter by genre, region, era. Works in English and Chinese. | AI电影搜索：用自然语言描述电影，AI智能匹配推荐。",
      },
      {
        name: "keywords",
        content:
          "AI movie finder,movie search,find movies,movie recommendation,AI film search,what movie,movie discovery,AI电影搜索,电影推荐,找电影,电影查询,智能搜索",
      },
      { name: "author", content: "AI Movie Finder" },
      { name: "robots", content: "index, follow" },

      // Alternate languages for SEO
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "zh_CN" },

      // Theme color for mobile browsers - darker for new design
      { name: "theme-color", content: "#050505" },
      { name: "msapplication-TileColor", content: "#050505" },
      { name: "msapplication-TileImage", content: "/logo192.png" },

      // Open Graph (Facebook, LinkedIn, etc.)
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI Movie Finder | AI电影搜索" },
      {
        property: "og:description",
        content: "Describe any movie and let AI find it. Filter by genre, region, era. | 描述电影，AI帮你找。",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:site_name", content: "AI Movie Finder" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Movie Finder | AI电影搜索" },
      {
        name: "twitter:description",
        content: "Describe any movie and let AI find it. Works in English & Chinese.",
      },
      { name: "twitter:image", content: "/og-image.png" },

      // Apple mobile web app
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "AI Movie Finder" },

      // Disable auto-detection
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Google Fonts - Outfit for modern typography
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Noto+Sans+SC:wght@300;400;700&display=swap",
      },
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

// Create QueryClient factory - creates new instance per request for SSR
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

// Browser singleton - reuse same client on client side
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  // Server: always create new client
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  // Browser: reuse existing client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// Root document component with dark theme styling
// Wrapped with QueryClientProvider and I18nProvider
function RootComponent() {
  // Use useState to ensure consistent client between renders
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <html lang="zh-CN">
          <head>
            <HeadContent />
          </head>
          <body className="bg-[#050505] text-white min-h-screen">
            <Outlet />
            <Scripts />
          </body>
        </html>
      </I18nProvider>
    </QueryClientProvider>
  );
}
