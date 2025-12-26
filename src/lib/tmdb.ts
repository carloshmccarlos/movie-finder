// TMDB API client for fetching movie information and posters
// TMDB API 客户端 - 获取电影信息和海报
// Note: TMDB API may be blocked in China. Calls timeout gracefully.

import { createServerFn } from "@tanstack/react-start";
import type { Locale } from "./i18n";
import type { MovieResult } from "./types";

// TMDB API configuration
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getServerApiKey(): string {
  // Cloudflare Workers via wrangler vars
  if (typeof globalThis !== "undefined") {
    const globals = globalThis as unknown as {
      TMDB_API_KEY?: unknown;
      VITE_TMDB_API_KEY?: unknown;
    };
    const globalKey = globals.TMDB_API_KEY || globals.VITE_TMDB_API_KEY;
    if (typeof globalKey === "string" && globalKey) return globalKey;
  }

  // Node/Vite dev server
  // eslint-disable-next-line no-undef
  const envKey = typeof process !== "undefined" ? (process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY) : undefined;
  return envKey || "";
}

// TMDB movie search result
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

export const searchTMDBMovieServer = createServerFn({ method: "GET" })
  .inputValidator(
    (data: { title: string; year?: number; locale?: Locale }) => data
  )
  .handler(async ({ data }): Promise<TMDBMovie | null> => {
    const API_KEY = getServerApiKey();

    if (!API_KEY || API_KEY === "your_tmdb_api_key_here") {
      console.log("[TMDB] API not configured");
      return null;
    }

    const { title, year, locale = "zh" } = data;
    console.log("[TMDB] Searching for:", title, year, "Locale:", locale);

    try {
      const tmdbLanguage = locale === "en" ? "en-US" : "zh-CN";
      const params = new URLSearchParams({
        query: title,
        language: tmdbLanguage,
        include_adult: "false",
        api_key: API_KEY,
      });

      if (year) {
        params.append("year", year.toString());
      }

      const url = `${TMDB_API_URL}/search/movie?${params.toString()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error("[TMDB] Error:", response.status);
        return null;
      }

      const result: TMDBSearchResponse = await response.json();
      console.log("[TMDB] Results count:", result.results?.length);
      return result.results[0] || null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("[TMDB] Request timed out");
        } else {
          console.error("[TMDB] Network error:", error.message);
        }
      }
      return null;
    }
  });

// TMDB genre ID to Chinese name mapping
const GENRE_MAP_ZH: Record<number, string> = {
  28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪",
  99: "纪录片", 18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史",
  27: "恐怖", 10402: "音乐", 9648: "悬疑", 10749: "爱情", 878: "科幻",
  10770: "电视电影", 53: "惊悚", 10752: "战争", 37: "西部",
};

// TMDB genre ID to English name mapping
const GENRE_MAP_EN: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

// Language code to region mapping
const LANGUAGE_TO_REGION_ZH: Record<string, string> = {
  zh: "中国", en: "美国", ja: "日本", ko: "韩国", fr: "法国",
  de: "德国", es: "西班牙", it: "意大利", ru: "俄罗斯", hi: "印度",
};

const LANGUAGE_TO_REGION_EN: Record<string, string> = {
  zh: "China", en: "USA", ja: "Japan", ko: "Korea", fr: "France",
  de: "Germany", es: "Spain", it: "Italy", ru: "Russia", hi: "India",
};

/**
 * Check if TMDB API key is configured
 */
export function isTMDBConfigured(): boolean {
  if (typeof window === "undefined") {
    const key = getServerApiKey();
    return !!key && key !== "your_tmdb_api_key_here";
  }

  // On the client we don't have access to the server secret.
  // We allow TMDB enrichment attempts and let the server function decide.
  return true;
}

/**
 * Search TMDB for a movie by title and optional year
 * Note: May fail in China due to firewall - gracefully returns null
 */
export async function searchTMDBMovie(
  title: string,
  year?: number,
  locale: Locale = "zh"
): Promise<TMDBMovie | null> {
  try {
    return await searchTMDBMovieServer({
      data: {
        title,
        year,
        locale,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TMDB] ServerFn error:", error.message);
    }
    return null;
  }
}

/**
 * Convert TMDB movie to our MovieResult format
 */
export function tmdbToMovieResult(
  tmdb: TMDBMovie,
  matchScore: "high" | "medium" | "low",
  matchReason: string,
  locale: Locale = "zh"
): MovieResult {
  const year = tmdb.release_date
    ? parseInt(tmdb.release_date.split("-")[0], 10)
    : 0;

  const genreMap = locale === "en" ? GENRE_MAP_EN : GENRE_MAP_ZH;
  const regionMap = locale === "en" ? LANGUAGE_TO_REGION_EN : LANGUAGE_TO_REGION_ZH;
  const defaultGenre = locale === "en" ? "Movie" : "电影";
  const defaultRegion = locale === "en" ? "Other" : "其他";
  const noSynopsis = locale === "en" ? "No synopsis available" : "暂无简介";

  const genres = tmdb.genre_ids.map((id) => genreMap[id]).filter(Boolean);
  const region = regionMap[tmdb.original_language] || defaultRegion;

  const poster = tmdb.poster_path
    ? `${TMDB_IMAGE_BASE}${tmdb.poster_path}`
    : undefined;

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
    platforms: [],
    matchScore,
    matchReason,
  };
}

/**
 * Fetch movie poster URL by title
 * Used by MoviePoster component - includes client-side caching
 * Note: May fail in China due to firewall, gracefully falls back
 */
export async function searchMoviePoster(
  title: string,
  year?: number
): Promise<string | null> {
  // Check client-side cache first
  if (typeof window !== "undefined") {
    const cacheKey = `poster_${title}_${year || ""}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return cached === "null" ? null : cached;
    }
  }

  try {
    const movie = await searchTMDBMovie(title, year);
    
    const posterUrl = movie?.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : null;

    // Cache result on client
    if (typeof window !== "undefined") {
      const cacheKey = `poster_${title}_${year || ""}`;
      sessionStorage.setItem(cacheKey, posterUrl || "null");
    }

    return posterUrl;
  } catch {
    return null;
  }
}
