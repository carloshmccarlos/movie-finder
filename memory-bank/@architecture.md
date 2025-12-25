# AI Movie Finder - Architecture Document

## Overview

AI-powered movie search website where users describe movies in natural language and get recommendations with watch platform info.

## Tech Stack

### Frontend
- **Framework**: TanStack Start (React + TypeScript)
- **Styling**: Tailwind CSS
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query
- **Language**: Chinese (简体中文)

### Backend
- **Runtime**: TanStack Start server functions
- **Deployment**: Cloudflare Pages/Workers

### AI
- **Provider**: SiliconFlow
- **Model**: `deepseek-ai/DeepSeek-V3` (LLM for movie recommendations)
- **Approach**: Pure LLM-based search (no vector store, no external movie APIs)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Search Box  │  │   Filters   │  │  Results List   │ │
│  │ (描述输入)  │  │ (筛选条件)  │  │   (电影卡片)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              POST /api/search                    │   │
│  │  - Receives: query + filters                     │   │
│  │  - Calls: SiliconFlow DeepSeek-V3               │   │
│  │  - Returns: movie recommendations               │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   SiliconFlow API                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │           deepseek-ai/DeepSeek-V3               │   │
│  │  - Interprets user description                   │   │
│  │  - Returns structured movie data                 │   │
│  │  - Includes: title, year, intro, rating,        │   │
│  │    platforms, match score                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. User enters movie description + selects filters
2. Frontend sends POST to `/api/search`
3. Backend constructs prompt with query + filters
4. SiliconFlow DeepSeek-V3 returns JSON with movie recommendations
5. Backend parses and returns structured results
6. Frontend displays movie cards

## Filter System (Tencent Video Style)

### Hard Filters (严格筛选)
- **类型**: 动作, 爱情, 科幻, 剧情, 喜剧, 恐怖, 悬疑, 动画
- **地区**: 内地, 香港, 台湾, 日本, 韩国, 美国, 欧洲, 其他
- **年代**: 2020s, 2010s, 2000s, 1990s, 更早

### Soft Filters (偏好信号)
- **情绪**: 轻松, 治愈, 烧脑, 催泪, 热血, 浪漫
- **题材**: 校园, 悬疑, 家庭, 历史, 职场, 奇幻
- **热度**: 热门, 经典, 冷门佳作

### Platform Filter (平台)
- 腾讯视频, 爱奇艺, 优酷, Netflix, Disney+, Amazon Prime, Apple TV+

## API Response Schema

```typescript
interface MovieResult {
  id: string;
  title: string;           // 电影名称
  originalTitle?: string;  // 原名（如有）
  year: number;            // 上映年份
  poster?: string;         // 海报URL（可选）
  intro: string;           // 简介
  rating: number;          // 评分 (0-10)
  genres: string[];        // 类型标签
  region: string;          // 地区
  platforms: string[];     // 观看平台
  matchScore: 'high' | 'medium' | 'low';  // 匹配度
  matchReason: string;     // 匹配原因
}

interface SearchResponse {
  results: MovieResult[];
  query: string;
  totalResults: number;
}
```

## File Structure

```
src/
├── components/
│   ├── FilterBar.tsx      # Filter panel with all categories
│   ├── FilterChip.tsx     # Individual filter option button
│   ├── MovieCard.tsx      # Single movie result card
│   ├── MovieList.tsx      # Grid of movie cards
│   ├── MoviePoster.tsx    # (Phase 2) Poster image with fallback
│   ├── LoadingState.tsx   # Loading spinner
│   └── EmptyState.tsx     # Empty/error states
├── routes/
│   ├── __root.tsx         # Root layout (dark theme, Chinese)
│   ├── index.tsx          # Main search page
│   └── movie/
│       └── $id.tsx        # (Phase 2) Movie detail page
├── lib/
│   ├── search.ts          # SiliconFlow API client + search logic
│   ├── tmdb.ts            # (Phase 2) TMDB API for posters
│   ├── geolocation.ts     # (Phase 2) IP-based region detection
│   └── types.ts           # TypeScript interfaces
├── data/
│   └── filters.ts         # Filter options data
├── styles.css
└── router.tsx
```

## Environment Variables

```
VITE_SILICONFLOW_API_KEY=your_api_key_here
VITE_TMDB_API_KEY=your_tmdb_key_here  # Phase 2
```

## Current Implementation Status

### Phase 1 (MVP) ✅ COMPLETED
- [x] Project Setup
- [x] Core UI - Search Page
- [x] Filter UI (类型、地区、年代)
- [x] Results UI (MovieCard, MovieList)
- [x] SiliconFlow Integration (DeepSeek-V3.2 with thinking)
- [x] UX Polish (dark theme, SEO, icons)
- [x] Cloudflare Workers Deployment

### Phase 2 ✅ COMPLETED
- [x] Movie Poster Images (TMDB API integration)
- [x] Movie Detail Page (`/movie/:id` route)
- [x] External Search Link (Bing/Google based on IP)
- [x] Image lazy loading and caching
- [x] Search state persistence (TanStack Query)
- [x] i18n support (Chinese/English)

### Phase 3 (Future)
- [ ] User accounts and favorites
- [ ] Search history
- [ ] Social sharing

## Phase 2 Architecture Updates

### New Routes
```
/movie/:id  →  Movie detail page with full info
```

### New API Integrations
```
┌─────────────────────────────────────────────────────────┐
│                   External APIs                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   TMDB API      │  │   IP Geolocation API        │  │
│  │  - Poster URLs  │  │  - Detect user region       │  │
│  │  - Movie images │  │  - China → Bing             │  │
│  │                 │  │  - Other → Google           │  │
│  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow (Phase 2)
1. User searches → AI returns movie results
2. For each result, fetch poster from TMDB (by title + year)
3. User clicks movie card → navigate to `/movie/:id`
4. Detail page shows full info + "Search Online" button
5. On click, detect IP region and redirect to Bing (China) or Google (other)
