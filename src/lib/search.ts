// Search function - AI identifies movies, TMDB provides details
// 搜索函数 - AI识别电影名称，TMDB提供详细信息
// Phase 2 Update: Two-step search - AI → TMDB

import type { SearchFilters, SearchResponse, MovieResult } from "./types";
import { searchTMDBMovie, tmdbToMovieResult, isTMDBConfigured } from "./tmdb";

// SiliconFlow API endpoint
const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";
const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || "";

// AI response structure - just movie identification
interface AIMovieMatch {
  title: string;           // Movie title (Chinese preferred)
  originalTitle: string;   // English/original title for TMDB search
  year: number;            // Release year
  matchScore: "high" | "medium" | "low";
  matchReason: string;     // Why this movie matches
}

/**
 * Build prompt for AI to identify movies from description
 * AI only returns movie names and match reasons, not full details
 */
function buildSearchPrompt(query: string, filters: SearchFilters): string {
  const filterParts: string[] = [];

  if (filters.genre) filterParts.push(`类型：${filters.genre}`);
  if (filters.region) filterParts.push(`地区：${filters.region}`);
  if (filters.era) filterParts.push(`年代：${filters.era}`);

  const filterText =
    filterParts.length > 0 ? `\n用户筛选条件：${filterParts.join("，")}` : "";

  return `# Role
You are a movie identification expert. Your task is to identify movies that match the user's description.

## 🔴 Core Rules
- Identify 1-5 movies that best match the description
- Return movie titles (Chinese + English/Original) and release year
- Explain why each movie matches the description
- Do NOT make up movies - only return real, existing movies

## 👤 User Description
${query}${filterText}

## 📦 Output Format
Return ONLY a valid JSON array. No explanations, no markdown.

[
  {
    "title": "中文电影名",
    "originalTitle": "English or Original Title",
    "year": 2020,
    "matchScore": "high",
    "matchReason": "匹配原因说明"
  }
]

## 📊 Match Score Rules
- "high" → Core plot elements and characters match perfectly
- "medium" → Main theme matches, some details differ
- "low" → Loosely related, may not be exact match

## Example
User: "一个男人失去记忆，用纹身记录线索"

[
  {
    "title": "记忆碎片",
    "originalTitle": "Memento",
    "year": 2000,
    "matchScore": "high",
    "matchReason": "主角患有短期失忆症，用纹身和照片记录线索追查妻子被杀真相"
  }
]`;
}

/**
 * Parse AI response to extract movie matches
 */
function parseAIResponse(content: string): AIMovieMatch[] {
  try {
    let jsonStr = content.trim();

    // Remove markdown code block if present
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }

    const results = JSON.parse(jsonStr.trim());

    if (!Array.isArray(results)) {
      console.error("AI response is not an array");
      return [];
    }

    return results.map((movie: AIMovieMatch) => ({
      title: movie.title || "",
      originalTitle: movie.originalTitle || "",
      year: Number(movie.year) || 0,
      matchScore: movie.matchScore || "medium",
      matchReason: movie.matchReason || "",
    }));
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    console.error("Raw content:", content);
    return [];
  }
}

/**
 * Call AI to identify movies from user description
 * Uses DeepSeek-V3.2 with thinking mode for better reasoning
 * 
 * ⚠️ DO NOT CHANGE THIS CONFIGURATION - LOCKED BY USER
 */
async function identifyMoviesWithAI(
  query: string,
  filters: SearchFilters
): Promise<AIMovieMatch[]> {
  const prompt = buildSearchPrompt(query, filters);

  // ⚠️ LOCKED CONFIGURATION - DO NOT MODIFY
  const response = await fetch(SILICONFLOW_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3.2",  // DO NOT CHANGE
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8192,                     // DO NOT CHANGE
      temperature: 0.7,                     // DO NOT CHANGE
      top_p: 0.7,                           // DO NOT CHANGE
      top_k: 50,                            // DO NOT CHANGE
      frequency_penalty: 0.0,               // DO NOT CHANGE
      enable_thinking: true,                // DO NOT CHANGE
      thinking_budget: 4096,                // DO NOT CHANGE
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("SiliconFlow API error:", errorText);
    throw new Error(`AI 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI 返回内容为空");
  }

  return parseAIResponse(content);
}

/**
 * Fetch movie details from TMDB for each AI match
 */
async function enrichWithTMDB(matches: AIMovieMatch[]): Promise<MovieResult[]> {
  // Fetch TMDB data for each movie in parallel
  const tmdbPromises = matches.map(async (match) => {
    // Try searching with original title first (more accurate for TMDB)
    let tmdbMovie = await searchTMDBMovie(match.originalTitle, match.year);
    
    // Fallback to Chinese title if original title search fails
    if (!tmdbMovie && match.title !== match.originalTitle) {
      tmdbMovie = await searchTMDBMovie(match.title, match.year);
    }

    if (tmdbMovie) {
      // Use TMDB data with AI match info
      return tmdbToMovieResult(tmdbMovie, match.matchScore, match.matchReason);
    } else {
      // Fallback: create result from AI data only (no poster)
      return {
        id: `ai-${match.title}-${match.year}`,
        title: match.title,
        originalTitle: match.originalTitle || undefined,
        year: match.year,
        poster: undefined,
        intro: match.matchReason,
        rating: 0,
        genres: [],
        region: "未知",
        platforms: [],
        matchScore: match.matchScore,
        matchReason: match.matchReason,
      } as MovieResult;
    }
  });

  const enrichedResults = await Promise.all(tmdbPromises);
  return enrichedResults;
}

/**
 * Main search function
 * Step 1: AI identifies movies from description
 * Step 2: TMDB provides full movie details (poster, rating, etc.)
 */
export async function searchMovies(
  query: string,
  filters: SearchFilters
): Promise<SearchResponse> {
  if (!query.trim()) {
    throw new Error("搜索内容不能为空");
  }

  if (!API_KEY) {
    throw new Error("服务配置错误：缺少 AI API Key");
  }

  // Step 1: AI identifies movies
  console.log("[Search] Step 1: Calling AI to identify movies...");
  const aiMatches = await identifyMoviesWithAI(query, filters);
  console.log("[Search] AI returned matches:", aiMatches);

  if (aiMatches.length === 0) {
    return {
      results: [],
      query: query.trim(),
      totalResults: 0,
    };
  }

  // Step 2: Enrich with TMDB data (if configured)
  let results: MovieResult[];
  
  const tmdbConfigured = isTMDBConfigured();
  console.log("[Search] Step 2: TMDB configured?", tmdbConfigured);
  
  if (tmdbConfigured) {
    console.log("[Search] Enriching with TMDB data...");
    results = await enrichWithTMDB(aiMatches);
    console.log("[Search] TMDB enriched results:", results);
  } else {
    // No TMDB key - use AI data only
    console.log("[Search] No TMDB, using AI data only");
    results = aiMatches.map((match, index) => ({
      id: `ai-${index}-${match.title}`,
      title: match.title,
      originalTitle: match.originalTitle || undefined,
      year: match.year,
      poster: undefined,
      intro: match.matchReason,
      rating: 0,
      genres: [],
      region: "未知",
      platforms: [],
      matchScore: match.matchScore,
      matchReason: match.matchReason,
    }));
  }

  return {
    results,
    query: query.trim(),
    totalResults: results.length,
  };
}
