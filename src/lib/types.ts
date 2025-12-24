// TypeScript types for AI Movie Finder

// Movie result returned from search
export interface MovieResult {
  id: string;
  title: string; // 电影名称
  originalTitle?: string; // 原名（如有）
  year: number; // 上映年份
  poster?: string; // 海报URL（可选）
  intro: string; // 简介
  rating: number; // 评分 (0-10)
  genres: string[]; // 类型标签
  region: string; // 地区
  platforms: string[]; // 观看平台
  matchScore: "high" | "medium" | "low"; // 匹配度
  matchReason: string; // 匹配原因
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
