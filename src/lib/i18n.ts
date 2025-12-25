// i18n - Internationalization support (SSR-compatible)
// 国际化支持 - 兼容服务端渲染

export type Locale = "zh" | "en";

// Translation keys and values
export const translations = {
  zh: {
    // Header & Title
    "app.title": "AI电影搜索",
    "app.subtitle": "描述你想看的电影，AI帮你找到它",
    
    // Search
    "search.placeholder": "输入电影描述...\n例如：一部关于盗梦的科幻片，主角在梦境中层层深入，有莱昂纳多主演",
    "search.button": "找电影",
    "search.hint": "按 Ctrl+Enter 快速搜索",
    "search.filter": "筛选",
    "search.clearFilters": "清除所有筛选",
    
    // Filters
    "filter.genre": "类型",
    "filter.region": "地区",
    "filter.era": "年代",
    "filter.all": "全部",
    
    // Results
    "results.found": "找到 {count} 部相关电影",
    "results.loading": "正在搜索电影...",
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
    
    // Movie detail
    "detail.back": "返回搜索",
    "detail.notFound": "电影未找到",
    "detail.synopsis": "剧情简介",
    "detail.watchOnline": "在线观看",
    "detail.searchOnline": "搜索在线观看渠道",
    "detail.searchHint": "根据您的位置自动跳转到 Bing 或 Google 搜索",
    "detail.copyInfo": "复制电影信息",
    "detail.copied": "已复制",
    "detail.rating": "评分",
    "detail.votes": "人评价",
    "detail.popularity": "热度指数",
    "detail.region": "地区",
    "detail.releaseDate": "上映日期",
    "detail.originalAudio": "原声",
    "detail.dataSource": "数据来源: TMDB",
  },
  
  en: {
    // Header & Title
    "app.title": "AI Movie Finder",
    "app.subtitle": "Describe the movie you want to watch, AI will find it for you",
    
    // Search
    "search.placeholder": "Enter movie description...\nExample: A sci-fi movie about dreams within dreams, starring Leonardo DiCaprio",
    "search.button": "Find Movie",
    "search.hint": "Press Ctrl+Enter to search",
    "search.filter": "Filter",
    "search.clearFilters": "Clear all filters",
    
    // Filters
    "filter.genre": "Genre",
    "filter.region": "Region",
    "filter.era": "Era",
    "filter.all": "All",
    
    // Results
    "results.found": "Found {count} related movies",
    "results.loading": "Searching movies...",
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
    
    // Movie detail
    "detail.back": "Back to Search",
    "detail.notFound": "Movie not found",
    "detail.synopsis": "Synopsis",
    "detail.watchOnline": "Watch Online",
    "detail.searchOnline": "Search for streaming options",
    "detail.searchHint": "Will redirect to Bing or Google based on your location",
    "detail.copyInfo": "Copy movie info",
    "detail.copied": "Copied",
    "detail.rating": "Rating",
    "detail.votes": "votes",
    "detail.popularity": "Popularity",
    "detail.region": "Region",
    "detail.releaseDate": "Release Date",
    "detail.originalAudio": "Original Audio",
    "detail.dataSource": "Data source: TMDB",
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
