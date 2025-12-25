// TypeScript types for AI Movie Finder

// Movie result returned from search - includes all TMDB data
export interface MovieResult {
  id: string;
  title: string;              // 电影名称
  originalTitle?: string;     // 原名（如有）
  year: number;               // 上映年份
  releaseDate?: string;       // 完整上映日期 (YYYY-MM-DD)
  poster?: string;            // 海报URL
  backdrop?: string;          // 背景大图URL
  intro: string;              // 简介/概述
  rating: number;             // 评分 (0-10)
  voteCount?: number;         // 评分人数
  popularity?: number;        // 热度指数
  genres: string[];           // 类型标签
  region: string;             // 地区
  originalLanguage?: string;  // 原始语言
  platforms: string[];        // 观看平台
  matchScore: "high" | "medium" | "low"; // 匹配度
  matchReason: string;        // 匹配原因
  tmdbId?: number;            // TMDB ID (用于获取更多信息)
}

// Search API response
export interface SearchResponse {
  results: MovieResult[];
  query: string;
  totalResults: number;
}

// Search API request
export interface SearchRequest {
  query: string;
  filters: SearchFilters;
}

// Filter selections from UI
// Only keeping: 类型, 地区, 年代
export interface SearchFilters {
  genre?: string; // 类型
  region?: string; // 地区
  era?: string; // 年代
}

// Filter option for UI rendering
export interface FilterOption {
  value: string;
  label: string;
}

// Filter category configuration
export interface FilterCategory {
  key: keyof SearchFilters;
  label: string;
  options: FilterOption[];
  type: "hard" | "soft"; // hard = strict filter, soft = preference signal
}
