// TMDB API client for fetching movie information and posters
// TMDB API 客户端 - 获取电影信息和海报
// Phase 2 Update: Now fetches full movie details, not just posters
// i18n Update: Locale-aware API calls and genre mapping

import type { MovieResult } from "./types";
import type { Locale } from "./i18n";

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
const GENRE_MAP_ZH: Record<number, string> = {
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

// TMDB genre ID to English name mapping
const GENRE_MAP_EN: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Language code to region mapping (Chinese)
const LANGUAGE_TO_REGION_ZH: Record<string, string> = {
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

// Language code to region mapping (English)
const LANGUAGE_TO_REGION_EN: Record<string, string> = {
  zh: "China",
  en: "USA",
  ja: "Japan",
  ko: "Korea",
  fr: "France",
  de: "Germany",
  es: "Spain",
  it: "Italy",
  ru: "Russia",
  hi: "India",
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
 * Locale-aware: uses appropriate TMDB language parameter
 */
export async function searchTMDBMovie(
  title: string,
  year?: number,
  locale: Locale = "zh"
): Promise<TMDBMovie | null> {
  if (!isTMDBConfigured()) {
    console.log("[TMDB] Not configured, skipping search");
    return null;
  }

  console.log("[TMDB] Searching for:", title, year, "Locale:", locale);

  try {
    // Map locale to TMDB language code
    const tmdbLanguage = locale === "en" ? "en-US" : "zh-CN";
    
    const params = buildParams({
      query: title,
      language: tmdbLanguage,
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
 * Locale-aware: uses appropriate genre and region mappings
 */
export function tmdbToMovieResult(
  tmdb: TMDBMovie,
  matchScore: "high" | "medium" | "low",
  matchReason: string,
  locale: Locale = "zh"
): MovieResult {
  // Extract year from release_date
  const year = tmdb.release_date 
    ? parseInt(tmdb.release_date.split("-")[0], 10) 
    : 0;

  // Select locale-appropriate mappings
  const genreMap = locale === "en" ? GENRE_MAP_EN : GENRE_MAP_ZH;
  const regionMap = locale === "en" ? LANGUAGE_TO_REGION_EN : LANGUAGE_TO_REGION_ZH;
  const defaultGenre = locale === "en" ? "Movie" : "电影";
  const defaultRegion = locale === "en" ? "Other" : "其他";
  const noSynopsis = locale === "en" ? "No synopsis available" : "暂无简介";

  // Convert genre IDs to localized names
  const genres = tmdb.genre_ids
    .map((id) => genreMap[id])
    .filter(Boolean);

  // Determine region from original language
  const region = regionMap[tmdb.original_language] || defaultRegion;

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
    intro: tmdb.overview || noSynopsis,
    rating: Math.round(tmdb.vote_average * 10) / 10,
    voteCount: tmdb.vote_count,
    popularity: Math.round(tmdb.popularity),
    genres: genres.length > 0 ? genres : [defaultGenre],
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
