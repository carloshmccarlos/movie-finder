// i18n - Internationalization support (SSR-compatible)
// 国际化支持 - 兼容服务端渲染

export type Locale = "zh" | "en";

// Translation keys and values
export const translations = {
  zh: {
    // Header & Title
    "app.title": "AI电影搜索",
    "app.subtitle": "描述你想看的电影，AI帮你找到它",

    // Hero section
    "hero.title": "描述你的电影梦境",
    "hero.subtitle": "不用在意片名，用自然语言说出任何你想看的故事情节、情绪或场景，AI 会为你精准匹配。",

    // Search
    "search.placeholder": "例如：一部关于在梦境中盗取商业机密的烧脑电影，主角层层深入潜意识...",
    "search.button": "找电影",
    "search.hint": "按 Ctrl+Enter 快速搜索",
    "search.shortcut": "快速搜索",
    "search.filter": "筛选",
    "search.clearFilters": "清除所有筛选",

    // Filters
    "filter.genre": "类型",
    "filter.region": "地区",
    "filter.era": "年代",
    "filter.all": "全部",

    // Results
    "results.title": "为你匹配的结果",
    "results.count": "{count}部",
    "results.found": "找到 {count} 部相关电影",
    "results.loading": "DeepSeek 正在理解你的梦境...",
    "results.loadingHint": "AI正在分析你的描述",
    "results.empty": "没有找到匹配的电影",
    "results.emptyHint": "试试其他描述或调整筛选条件",
    "results.error": "搜索出错了",
    "results.initial": "输入电影描述开始搜索",
    "results.initialHint": "描述剧情、演员、场景或任何你记得的细节",
    "results.tryThese": "试试这些描述：",

    // Match scores
    "match.high": "高度匹配",
    "match.medium": "中度匹配",
    "match.low": "可能相关",
    "match.label": "匹配",
    "match.reason": "推荐理由",

    // Movie detail
    "detail.back": "返回搜索",
    "detail.notFound": "电影未找到",
    "detail.synopsis": "剧情简介",
    "detail.watchOnline": "在线观看",
    "detail.searchOnline": "在线观看 / 搜索资源",
    "detail.searchHint": "根据您的位置自动跳转到 Bing 或 Google 搜索",
    "detail.copyInfo": "复制信息",
    "detail.copied": "已复制",
    "detail.rating": "评分",
    "detail.votes": "评论",
    "detail.popularity": "热度指数",
    "detail.matchScore": "匹配程度",
    "detail.region": "地区",
    "detail.releaseDate": "上映日期",
    "detail.originalAudio": "原声",
    "detail.dataSource": "数据来源: TMDB",
    "detail.aiReason": "AI 匹配理由",

    // Footer
    "footer.about": "关于我们",
    "footer.api": "API 文档",
    "footer.privacy": "隐私政策",
  },

  en: {
    // Header & Title
    "app.title": "AI Movie Finder",
    "app.subtitle": "Describe the movie you want to watch, AI will find it for you",

    // Hero section
    "hero.title": "Describe Your Movie Dream",
    "hero.subtitle": "Don't worry about the title. Just describe any plot, mood, or scene in natural language, and AI will find the perfect match.",

    // Search
    "search.placeholder": "Example: A mind-bending movie about stealing secrets from dreams, going deeper into the subconscious...",
    "search.button": "Find Movie",
    "search.hint": "Press Ctrl+Enter to search",
    "search.shortcut": "Quick Search",
    "search.filter": "Filter",
    "search.clearFilters": "Clear all filters",

    // Filters
    "filter.genre": "Genre",
    "filter.region": "Region",
    "filter.era": "Era",
    "filter.all": "All",

    // Results
    "results.title": "Matched Results",
    "results.count": "{count} movies",
    "results.found": "Found {count} related movies",
    "results.loading": "DeepSeek is understanding your dream...",
    "results.loadingHint": "AI is analyzing your description",
    "results.empty": "No matching movies found",
    "results.emptyHint": "Try a different description or adjust filters",
    "results.error": "Search failed",
    "results.initial": "Enter a movie description to start",
    "results.initialHint": "Describe the plot, actors, scenes, or any details you remember",
    "results.tryThese": "Try these descriptions:",

    // Match scores
    "match.high": "High Match",
    "match.medium": "Medium Match",
    "match.low": "Possible Match",
    "match.label": "Match",
    "match.reason": "Why this match",

    // Movie detail
    "detail.back": "Back to Search",
    "detail.notFound": "Movie not found",
    "detail.synopsis": "Synopsis",
    "detail.watchOnline": "Watch Online",
    "detail.searchOnline": "Watch Online / Search",
    "detail.searchHint": "Will redirect to Bing or Google based on your location",
    "detail.copyInfo": "Copy Info",
    "detail.copied": "Copied",
    "detail.rating": "Rating",
    "detail.votes": "Reviews",
    "detail.popularity": "Popularity",
    "detail.matchScore": "Match Score",
    "detail.region": "Region",
    "detail.releaseDate": "Release Date",
    "detail.originalAudio": "Original Audio",
    "detail.dataSource": "Data source: TMDB",
    "detail.aiReason": "AI Match Reason",

    // Footer
    "footer.about": "About Us",
    "footer.api": "API Docs",
    "footer.privacy": "Privacy Policy",
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;

// Example queries for each locale
export const exampleQueries: Record<Locale, string[]> = {
  zh: [
    "一个男人失去记忆，用纹身记录线索追查真相",
    "机器人和小男孩的感人故事，未来世界",
    "韩国电影，穷人一家住进富人家地下室",
    "时间循环，女主角不断重复同一天",
    "太空探索，父亲穿越虫洞寻找新家园",
  ],
  en: [
    "A man with memory loss uses tattoos to track clues",
    "A touching story about a robot and a little boy in the future",
    "Korean movie about a poor family living in a rich family's basement",
    "Time loop where the main character keeps repeating the same day",
    "Space exploration, a father travels through a wormhole to find a new home",
  ],
};

// Storage key for locale preference
const LOCALE_KEY = "app_locale";

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

/**
 * Get current locale from localStorage or browser (client-side only)
 * Returns 'zh' as default for SSR
 */
export function getLocale(): Locale {
  if (!isBrowser) {
    return "zh"; // Default for SSR
  }

  try {
    // Check localStorage first
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === "zh" || stored === "en") {
      return stored;
    }
    
    // Detect from browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("zh") ? "zh" : "en";
  } catch {
    return "zh";
  }
}

/**
 * Set locale and save to localStorage (client-side only)
 */
export function setLocale(locale: Locale): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get translation by key for a specific locale
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  let text: string = translations[locale][key] || translations.zh[key] || key;
  
  // Replace parameters like {count}
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  
  return text;
}
