// TMDB API client for fetching movie information and posters
// TMDB API 客户端 - 获取电影信息和海报
// Phase 2 Update: Now fetches full movie details, not just posters

import type { MovieResult } from "./types";

// TMDB API configuration
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

// TMDB movie search result - all available fields
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_results: number;
}

// TMDB genre ID to Chinese name mapping
const GENRE_MAP: Record<number, string> = {
  28: "动作",
  12: "冒险",
  16: "动画",
  35: "喜剧",
  80: "犯罪",
  99: "纪录片",
  18: "剧情",
  10751: "家庭",
  14: "奇幻",
  36: "历史",
  27: "恐怖",
  10402: "音乐",
  9648: "悬疑",
  10749: "爱情",
  878: "科幻",
  10770: "电视电影",
  53: "惊悚",
  10752: "战争",
  37: "西部",
};

// Language code to region mapping
const LANGUAGE_TO_REGION: Record<string, string> = {
  zh: "中国",
  en: "美国",
  ja: "日本",
  ko: "韩国",
  fr: "法国",
  de: "德国",
  es: "西班牙",
  it: "意大利",
  ru: "俄罗斯",
  hi: "印度",
};

/**
 * Check if TMDB API key is configured
 */
export function isTMDBConfigured(): boolean {
  const configured = !!API_KEY && API_KEY !== "your_tmdb_api_key_here";
  console.log("[TMDB] API configured:", configured, "Key length:", API_KEY?.length);
  return configured;
}

/**
 * Build request headers for TMDB API
 * Supports both v3 (api_key param) and v4 (Bearer token) auth
 */
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // v4 tokens start with "eyJ"
  if (API_KEY.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }
  
  return headers;
}

/**
 * Build URL params, adding api_key for v3 auth
 */
function buildParams(params: Record<string, string>): URLSearchParams {
  const urlParams = new URLSearchParams(params);
  
  // Add api_key for v3 auth (non-Bearer tokens)
  if (!API_KEY.startsWith("eyJ")) {
    urlParams.append("api_key", API_KEY);
  }
  
  return urlParams;
}

/**
 * Search TMDB for a movie by title and optional year
 * Returns full movie details including poster, rating, overview
 */
export async function searchTMDBMovie(
  title: string,
  year?: number
): Promise<TMDBMovie | null> {
  if (!isTMDBConfigured()) {
    console.log("[TMDB] Not configured, skipping search");
    return null;
  }

  console.log("[TMDB] Searching for:", title, year);

  try {
    const params = buildParams({
      query: title,
      language: "zh-CN",
      include_adult: "false",
    });

    if (year) {
      params.append("year", year.toString());
    }

    const url = `${TMDB_API_URL}/search/movie?${params.toString()}`;
    console.log("[TMDB] Request URL:", url);

    const response = await fetch(url, { headers: buildHeaders() });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TMDB] Search error:", response.status, errorText);
      return null;
    }

    const data: TMDBSearchResponse = await response.json();
    console.log("[TMDB] Results count:", data.results?.length);
    
    // Return first result (best match)
    return data.results[0] || null;
  } catch (error) {
    console.error("[TMDB] Search failed:", error);
    return null;
  }
}

/**
 * Convert TMDB movie to our MovieResult format
 * Merges AI match info with TMDB movie data - includes ALL available fields
 */
export function tmdbToMovieResult(
  tmdb: TMDBMovie,
  matchScore: "high" | "medium" | "low",
  matchReason: string
): MovieResult {
  // Extract year from release_date
  const year = tmdb.release_date 
    ? parseInt(tmdb.release_date.split("-")[0], 10) 
    : 0;

  // Convert genre IDs to Chinese names
  const genres = tmdb.genre_ids
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  // Determine region from original language
  const region = LANGUAGE_TO_REGION[tmdb.original_language] || "其他";

  // Build poster URL (w500 for cards)
  const poster = tmdb.poster_path
    ? `${TMDB_IMAGE_BASE}${tmdb.poster_path}`
    : undefined;

  // Build backdrop URL (original size for detail page)
  const backdrop = tmdb.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`
    : undefined;

  return {
    id: `tmdb-${tmdb.id}`,
    tmdbId: tmdb.id,
    title: tmdb.title || tmdb.original_title,
    originalTitle: tmdb.original_title !== tmdb.title ? tmdb.original_title : undefined,
    year,
    releaseDate: tmdb.release_date || undefined,
    poster,
    backdrop,
    intro: tmdb.overview || "暂无简介",
    rating: Math.round(tmdb.vote_average * 10) / 10,
    voteCount: tmdb.vote_count,
    popularity: Math.round(tmdb.popularity),
    genres: genres.length > 0 ? genres : ["电影"],
    region,
    originalLanguage: tmdb.original_language,
    platforms: [], // TMDB doesn't provide streaming platforms in search
    matchScore,
    matchReason,
  };
}

/**
 * Fetch movie poster URL by title (legacy function for MoviePoster component)
 */
export async function searchMoviePoster(
  title: string,
  year?: number
): Promise<string | null> {
  // Check cache first
  const cacheKey = `poster_${title}_${year || ""}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return cached === "null" ? null : cached;
  }

  const movie = await searchTMDBMovie(title, year);
  
  if (movie?.poster_path) {
    const posterUrl = `${TMDB_IMAGE_BASE}${movie.poster_path}`;
    sessionStorage.setItem(cacheKey, posterUrl);
    return posterUrl;
  }

  sessionStorage.setItem(cacheKey, "null");
  return null;
}
