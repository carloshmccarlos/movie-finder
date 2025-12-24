// Search function - calls SiliconFlow API directly from client
// 搜索函数 - 从客户端直接调用 SiliconFlow API
// Note: API key is passed from server via route loader

import type { SearchFilters, SearchResponse, MovieResult } from "./types";

// SiliconFlow API endpoint
const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";

// Build the prompt for movie search - strict matching rules
function buildSearchPrompt(query: string, filters: SearchFilters): string {
  const filterParts: string[] = [];

  if (filters.genre) filterParts.push(`genra：${filters.genre},`);
  if (filters.region) filterParts.push(`region：${filters.region}`);
  if (filters.era) filterParts.push(`era：${filters.era}`);

  const filterText =
    filterParts.length > 0 ? `\n用户筛选条件：${filterParts.join("，")}` : "";

  return `# Role
You are a movie recommendation expert. Your task is to recommend movies that strictly match the user's description.

## 🔴 Core Rules (Must Follow)
- Ignore the language of user description
- Use ONLY the factors explicitly mentioned by the user as primary decision criteria.
- Genre and region are the highest-priority constraints.
- If a movie does not match the user-specified genre or region, DO NOT recommend it.
- Story elements (characters, events, themes) may be used only after genre and region are satisfied.
- Do NOT infer, expand, or guess any user intent (no "similar vibes", "target audience", or popularity-based guesses).
- If no perfect match exists:
  - You may return medium or low matches
  - You must clearly explain the mismatch reason

## 👤 User Description
${query}${filterText}

## 🎯 Task
- Recommend 1–5 movies that best match the description
- Match characters, plot elements, genre, and region strictly
- Do not add filters the user did not mention (director, franchise, era, etc.)

## 📦 Output Requirements
Return ONLY a valid JSON array. No explanations, no markdown, no extra text.

Each movie must include the following fields:
[
  {
    "id": "movie-english-slug",
    "title": "Chinese Title",
    "originalTitle": "Original or English Title (empty string if none)",
    "year": "",
    "intro": "A 50–100 word summary tightly aligned with the user description",
    "rating": "",
    "genres": [],
    "region": "",
    "platforms": [""],
    "matchScore": "",
    "matchReason": "20–40 words explaining exactly which user factors this movie matches"
  }
]

### Example
For user description: "主角是一个狐狸和一个兔子警察，作为搭档一起破案的故事，里面还有个局长是个牛"

[
  {
    "id": "zootopia",
    "title": "疯狂动物城",
    "originalTitle": "Zootopia",
    "year": "2016",
    "intro": "在一个动物世界中，兔子朱迪成为首位兔子警官，与狐狸尼克搭档调查一起神秘失踪案。他们的上司是一头水牛局长。影片探讨了偏见与友谊的主题。",
    "rating": "8.2",
    "genres": ["动画", "喜剧", "冒险"],
    "region": "美国",
    "platforms": ["Disney+", "腾讯视频"],
    "matchScore": "high",
    "matchReason": "完全匹配：狐狸和兔子警察搭档破案，水牛局长角色都与用户描述一致"
  }
]

## 📊 Match Score Rules
- "high" → Genre, region, and core story elements all match
- "medium" → Genre and region match, story partially matches
- "low" → Only some hard constraints match (must explain why)

## ✅ Final Constraints
- Output valid JSON only
- All fields must be present
- Every recommendation must be directly traceable to user-provided facts`;
}

// Parse LLM response to extract movie results
function parseMovieResults(content: string): MovieResult[] {
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

    jsonStr = jsonStr.trim();
    const results = JSON.parse(jsonStr);

    if (!Array.isArray(results)) {
      console.error("LLM response is not an array");
      return [];
    }

    return results.map((movie: MovieResult, index: number) => ({
      id: movie.id || `movie-${index}`,
      title: movie.title || "未知电影",
      originalTitle: movie.originalTitle,
      year: Number(movie.year) || 2000,
      intro: movie.intro || "",
      rating: Number(movie.rating) || 0,
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      region: movie.region || "未知",
      platforms: Array.isArray(movie.platforms) ? movie.platforms : [],
      matchScore: movie.matchScore || "medium",
      matchReason: movie.matchReason || "",
    }));
  } catch (error) {
    console.error("Failed to parse LLM response:", error);
    console.error("Raw content:", content);
    return [];
  }
}

// Main search function - calls SiliconFlow API with DeepSeek-R1
export async function searchMovies(
  query: string,
  filters: SearchFilters,
  apiKey: string
): Promise<SearchResponse> {
  if (!query.trim()) {
    throw new Error("搜索内容不能为空");
  }

  if (!apiKey) {
    throw new Error("缺少 API Key");
  }

  const prompt = buildSearchPrompt(query, filters);

  // Use DeepSeek-V3.2 with thinking mode enabled
  const response = await fetch(SILICONFLOW_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3.2",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 8192,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.0,
      enable_thinking: true,
      thinking_budget: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("SiliconFlow API error:", errorText);
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("API 返回内容为空");
  }

  const results = parseMovieResults(content);

  return {
    results,
    query: query.trim(),
    totalResults: results.length,
  };
}
