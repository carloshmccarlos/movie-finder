# Game Design Document – AI Movie Search Website

## 1. Overview

- **Title**
  AI Movie Finder (working title)

- **Genre**
  Utility / Discovery Web App with game-like exploration ("describe a movie, get a match")

- **Platform**
  Web (desktop and mobile browsers)

- **High Concept**
  The user describes a movie in natural language (plot, actors, vibes, scenes). The AI guesses the most likely movie(s) and returns a rich result: title, introduction/summary, rating, and where to watch (streaming platforms / stores).

- **Target Audience**
  - Movie fans who forgot a movie title
  - Users browsing for something to watch based on mood or description
  - Casual users who enjoy experimenting with AI

## 2. Core Experience

- **Player Fantasy**
  "I can describe any movie in my own words and instantly discover what it is and where to watch it."

- **Core Loop**
  1. **Describe** – User types a description, keywords, feelings, or partial info.
  2. **Search** – AI processes the description and matches candidate movies.
  3. **Review Results** – User sees likely matches with intro, ratings, and watch platforms.
  4. **Refine** – User refines description or adjusts filters (genre, platform) to sharpen results.
  5. **Choose & Watch** – User clicks through to a platform to watch or save to a list.

- **Session Length**
  1–5 minutes per search; can support longer browsing sessions.

## 3. Mechanics & Features

### 3.1 Input Mechanics

- **Free-text Description Box**
  - Single main text area for natural language input.
  - Optional placeholder examples, e.g. "A sci-fi movie about dreams inside dreams with Leonardo DiCaprio".

- **Filter System (Tencent Video–style)**
  - Uses familiar Chinese streaming dimensions: **类型、地区、年代、热度、情绪、题材**.
  - Prioritizes clarity, speed, and cultural relevance for Chinese users.

- **Structured Filters (Hard Constraints)**
  - **类型** – Movie type/genre (e.g. 动作, 爱情, 科幻, 剧情).
  - **地区** – Production region (e.g. 内地, 香港, 日本, 美国, 韩国).
  - **年代** – Release era (e.g. 1990s, 2000s, 2010s, 2020s).
  - **平台 / 服务** – Optional availability filter by platform/service (e.g. 腾讯视频, 爱奇艺, 优酷, Netflix), when data is available.

- **Soft Filters (AI Relevance Signals)**
  - **情绪** – Emotional tone (e.g. 轻松, 治愈, 烧脑, 催泪).
  - **题材** – Thematic focus (e.g. 校园, 悬疑, 家庭, 历史).
  - **热度** – Popularity / trending level, used to boost trending or classic hits.
  - These dimensions do **not** strictly exclude results; they are used by the AI to boost semantically relevant candidates.

- **Hybrid Behavior with AI Semantic Search**
  - Structured filters (类型、地区、年代、平台) are applied as **hard constraints** on the candidate set.
  - Softer dimensions (情绪、题材、热度) act as **relevance-boosting signals** in the AI ranking, not absolute filters.
  - This keeps results accurate and controlled, while still feeling flexible and intelligent.

- **Search Action**
  - Primary CTA button: `Find my movie`
  - Pressing Enter triggers search.

### 3.2 Output / Result Mechanics

For each result (movie candidate), show:

- **Title & Year**
- **Poster / Thumbnail** (if available)
- **Short Introduction / Synopsis**
- **Rating**
  - Source: e.g. TMDB rating, IMDB rating, or internal score
- **Platforms to Watch**
  - Streaming platforms (e.g. Netflix, Amazon, Disney+, etc.)
  - Rental / purchase platforms where applicable
- **Confidence / Match Score**
  - Short note like "High match", "Medium match" (optional but helpful)


## 4. AI & Data

### 4.1 AI Responsibilities

- Interpret user description and extract:
  - Plot concepts
  - Genre, mood, themes
  - Character / actor clues
  - Time period and setting clues
- Map extracted information to movie candidates.

### 4.2 Data Sources (Conceptual)

- **Movie Metadata API**
  - Example: TMDB or similar APIs (title, year, synopsis, genre, ratings, images).
- **Where-to-Watch API**
  - Example services like JustWatch or similar for platform availability.

### 4.3 Quality & Safety

- Handle ambiguous queries by:
  - Showing multiple likely results
  - Asking follow-up clarifying questions when needed
- Avoid hallucinating platforms if data source is unavailable:
  - Clearly label uncertain availability (e.g. "Platform info not found").

## 5. UI / UX

### 5.1 Layout

- **Landing Screen**
  - Centered hero section with large description box
  - Short subtitle explaining the app
  - Example prompts under the input field

- **Results Screen**
  - Stack of movie cards under the search bar
  - Each card includes poster, info, rating, platforms, and a call-to-action

### 5.2 Visual Style

- Modern, clean UI
- Dark theme by default to match cinema vibe
- Accent colors for primary actions (e.g. bright orange or teal)

### 5.3 Feedback & States

- Loading state with spinner and text like "Searching the movie multiverse…"
- Empty state with example queries
- Error state with helpful retry suggestions

## 6. Technical Overview

- **Frontend**
  - Web application (e.g. React + TypeScript + TanStack Router, if applicable)
  - Responsive layout for desktop and mobile

- **Backend / API Layer**
  - Endpoint that accepts text description and optional filters
  - Integrates with:
    - LLM or embedding-based similarity search
    - Movie metadata API
    - Watch-platform API

- **Performance Considerations**
  - Debounced requests or explicit search butto
  - Caching previous search results per session

## 7. Scope & MVP

### 7.1 MVP Features (Phase 1) ✅ COMPLETED

- Single-page search and results
- Text input + search button
- AI-powered matching to a movie list
- Display of title, intro, rating, and platforms
- Filter system (类型、地区、年代)
- Dark theme with cinema vibe
- Deployed to Cloudflare Workers

### 7.2 Phase 2 Features (Next Sprint)

#### 7.2.1 Movie Poster Images
- **Goal**: Add visual movie posters to result cards
- **Implementation**:
  - Use TMDB API to fetch poster images by movie title/year
  - Fallback to placeholder gradient if poster not found
  - Lazy load images for performance
  - Cache poster URLs in session storage
- **UI Changes**:
  - Replace emoji placeholder with actual poster image
  - Maintain 2:3 aspect ratio
  - Add loading skeleton while image loads

#### 7.2.2 Movie Detail Page
- **Goal**: Dedicated page for each movie with full information
- **Route**: `/movie/:id` (dynamic route)
- **Content**:
  - Large poster image (hero section)
  - Full synopsis/introduction
  - Rating with visual stars
  - Genre tags
  - Release year and region
  - Available platforms with icons
  - Match score and reason (from search)
  - "Search More Like This" button
- **Navigation**:
  - Click movie card → navigate to detail page
  - Back button to return to search results
  - Preserve search state when returning

#### 7.2.3 External Search Link (Smart Redirect)
- **Goal**: Help users find where to watch or learn more
- **Implementation**:
  - Detect user's region via IP geolocation
  - If China IP → redirect to Bing (bing.com)
  - If non-China IP → redirect to Google (google.com)
  - Search query: movie title + "在线观看" or "watch online"
- **UI**:
  - Button: "🔍 搜索更多" or "Search Online"
  - Opens in new tab
  - Located on detail page below platforms section
- **Technical**:
  - Use free IP geolocation API (e.g., ip-api.com, ipinfo.io)
  - Cache region detection in localStorage
  - Fallback to Google if detection fails

### 7.3 Phase 3 Features (Future)

- User accounts and favorites
- Search history persistence
- More advanced filters (language, runtime, director)
- Social sharing of results
- Movie recommendations based on history
- Multi-language support

## 8. Success Metrics

- **Core KPIs**
  - Percentage of sessions with at least one result clicked
  - User-reported accuracy ("Did we find your movie?")
  - Repeat usage rate

- **Qualitative Goals**
  - Feels fast, fun, and magical
  - Reduces frustration when trying to recall movies
