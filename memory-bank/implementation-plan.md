# Implementation Plan – AI Movie Search Website

This plan provides small, concrete steps for AI and full‑stack developers to implement the AI Movie Finder using TanStack Start, SiliconFlow, and Tencent Video–style filters. **Each step includes a test** to validate correct implementation. No code snippets are included.

---

## Phase 0 – Project Setup & Baseline

### Step 0.1 – Verify Tooling & Environment
- **Action**: Ensure Node.js (LTS), pnpm, Git, and a modern IDE are installed.
- **Test**: Run `pnpm -v` and `node -v` in a terminal and confirm versions print without errors.

### Step 0.2 – Initialize TanStack Start Project (if not already)
- **Action**: Create or confirm a TanStack Start app exists in the `movie-search` folder.
- **Test**: Start the dev server with pnpm and open the local URL in a browser; confirm the starter page renders.

### Step 0.3 – Clean Up Default Routes & Pages
- **Action**: Remove or simplify any default starter/demo routes, keeping only a basic root layout.
- **Test**: Refresh the app; confirm only a minimal layout or placeholder root page is visible with no broken links.

### Step 0.4 – Configure Environment Variables Structure
- **Action**: Define `.env` keys for SiliconFlow, movie API, and where‑to‑watch API (e.g., SILICONFLOW_API_KEY, MOVIE_API_KEY).
- **Test**: Add placeholder values and run the dev server; confirm it starts without environment‑variable‑related crashes.

---

## Phase 1 – Core UI: Search Page Skeleton

### Step 1.1 – Create Main Search Route
- **Action**: Add a main route corresponding to the landing/search page (root path) that will house the search box and results.
- **Test**: Navigate to the root URL and confirm a labelled “Movie Search” section or similar heading is displayed.

### Step 1.2 – Add Free‑Text Description Input
- **Action**: Place a large text input/textarea in the main search page for the movie description, with a clear label and example placeholder.
- **Test**: Type text into the input and confirm the value is retained and visually clear; no console errors should appear when typing.

### Step 1.3 – Add Primary Search Button
- **Action**: Add a prominent “Find my movie” button beneath or beside the input and wire it to a placeholder search handler.
- **Test**: Click the button and verify a simple feedback mechanism occurs (e.g., a temporary message or console log) without any runtime error.

### Step 1.4 – Capture Enter Key to Trigger Search
- **Action**: Ensure pressing Enter while focused on the description input triggers the same search handler as the button.
- **Test**: Type a short description and press Enter; confirm the same feedback as clicking the button is triggered.

---

## Phase 2 – Filter UI (Tencent Video–Style)

### Step 2.1 – Design Filter Layout
- **Action**: Add a dedicated filter bar or panel with labelled groups for 类型, 地区, 年代, 平台 / 服务, 情绪, 题材, 热度.
- **Test**: Confirm all labels are visible, readable, and grouped logically above or beside the search results area.

### Step 2.2 – Implement 类型 Filter Controls
- **Action**: Provide choices for 类型 (e.g., 动作, 爱情, 科幻, 剧情) as clickable chips, buttons, or tags; allow a single or clearly defined multi‑select behavior.
- **Test**: Click different 类型 options and verify visual selection state changes and internal state updates (e.g., via simple logging) with no overlap or ambiguity.

### Step 2.3 – Implement 地区 Filter Controls
- **Action**: Provide options for regions (e.g., 内地, 香港, 日本, 美国, 韩国) similar to 类型 controls.
- **Test**: Select and change 地区 options; confirm the selected value is tracked correctly and is distinguishable from 类型 state.

### Step 2.4 – Implement 年代 Filter Controls
- **Action**: Provide decade/era options (e.g., 1990s, 2000s, 2010s, 2020s) as clear choices.
- **Test**: Select different 年代 options and confirm the internal state updates; verify only one era is active at a time (or clearly defined multi‑select behavior).

### Step 2.5 – Implement 平台 / 服务 Availability Filter
- **Action**: Add platform/service filter items (e.g., 腾讯视频, 爱奇艺, 优酷, Netflix, etc.), allowing at least one selection.
- **Test**: Toggle platforms on and off; confirm state correctly represents the selected platforms and no runtime errors occur.

### Step 2.6 – Implement 情绪, 题材, 热度 as Soft Filters
- **Action**: Add UI controls for 情绪 (轻松, 治愈, 烧脑, 催泪), 题材 (校园, 悬疑, 家庭, 历史), and 热度 (e.g., 热门, 经典, 冷门) with visual distinction that they are “soft” preferences.
- **Test**: Change these options and verify the state captures selections for each category separately, without interfering with structured filters.

### Step 2.7 – Aggregate Filter State into a Single Object
- **Action**: Combine all filter selections into a single structured filter object that can be sent to the backend.
- **Test**: Trigger a search and log the filter object; verify it includes fields for 类型, 地区, 年代, 平台, 情绪, 题材, 热度 with expected values.

---

## Phase 3 – Basic Results UI (Front‑End Only)

### Step 3.1 – Create Results List Area
- **Action**: Reserve a section below the search bar/filters for result cards, starting with placeholder data.
- **Test**: Hard‑wire a small list of sample movies to display; confirm multiple cards render with spacing and alignment matching the design.

### Step 3.2 – Define Movie Card Layout
- **Action**: For each movie card, include space for title, year, poster, short intro, rating, platforms, and a match score label.
- **Test**: With placeholder data, verify all these fields appear on each card and remain responsive across desktop and mobile widths.

### Step 3.3 – Add Loading, Empty, and Error States (UI Only)
- **Action**: Implement simple UI elements for loading (spinner + text), empty state (example queries), and error display (user‑friendly message).
- **Test**: Manually toggle internal state flags to simulate each state; confirm the correct UI state appears and no overlapping elements render incorrectly.

---

## Phase 4 – /search API Endpoint (Backend Skeleton)

### Step 4.1 – Create /search Endpoint Handler
- **Action**: Add a backend route (e.g., POST /search) that accepts `query` and `filters` in the request body and returns a fixed, mock response.
- **Test**: Call the endpoint using a REST client or browser tool; verify a 200 response with the expected JSON structure for results.

### Step 4.2 – Define Request Validation
- **Action**: Validate inputs on the backend: ensure `query` is non‑empty text and `filters` fields match expected types and allowed values.
- **Test**: Send malformed requests (missing query, invalid filter values) and confirm the endpoint responds with clear 4xx errors and messages.

### Step 4.3 – Connect Frontend to /search Endpoint
- **Action**: Replace placeholder frontend search handler with a real request to the /search endpoint, using TanStack Query or an equivalent asynchronous call.
- **Test**: Perform a search from the UI and confirm that mock data from the backend is displayed as movie cards; inspect network requests to ensure payload matches query and filters.

### Step 4.4 – Wire Loading and Error States to API
- **Action**: Connect the frontend loading and error UI states to the actual API request lifecycle.
- **Test**: Temporarily delay or break the backend and verify the frontend shows the loading indicator and error message appropriately.

---

## Phase 5 – Integrate Movie Metadata & Platform Data

### Step 5.1 – Implement Movie Metadata Client (e.g., TMDB)
- **Action**: Create a backend integration that can fetch movie details (title, year, genres, synopsis, poster, rating) by ID or search term from the chosen metadata API.
- **Test**: Call this integration with a known movie and confirm the response fields map correctly to your internal movie result format.

### Step 5.2 – Implement Where‑to‑Watch Client
- **Action**: Create a backend integration that fetches platform availability (e.g., Tencent Video, iQIYI, Youku, others or JustWatch‑style service) for given movies.
- **Test**: For a handful of known titles, call this integration and verify that platform availability information is returned and normalized into your internal structure.

### Step 5.3 – Combine Metadata and Platform Data into Unified Result
- **Action**: Build a merger step that, for each candidate movie, joins metadata and platform availability into a single movie object.
- **Test**: Call this merger with sample IDs and confirm each result includes title, year, intro, rating, and platforms, with no missing or inconsistent fields.

### Step 5.4 – Connect Backend /search Mock to Real Data
- **Action**: Replace mock data in /search with data coming from metadata + platform APIs for a small fixed list of movies.
- **Test**: Trigger a search from the UI and verify that cards display real titles, posters, and platforms instead of placeholders.

---

## Phase 6 – SiliconFlow AI Integration (Semantic Search)

### Step 6.1 – Configure SiliconFlow API Client
- **Action**: Implement a backend helper that calls SiliconFlow’s LLM/embedding endpoints, reading configuration from environment variables.
- **Test**: Trigger a simple backend call to SiliconFlow with a test prompt or text; verify a successful response and handle error cases gracefully.

### Step 6.2 – Define Embedding Strategy for Movies
- **Action**: Decide which text fields per movie to embed (e.g., plot summary, genres, emotions, themes) and how to represent them for SiliconFlow.
- **Test**: For a small sample of movies, generate embeddings and confirm each embedding is stored and retrievable from your vector store or interim storage.

### Step 6.3 – Populate Vector Store with Movie Embeddings
- **Action**: Write a one‑time or repeatable process to compute and store embeddings for the movie catalog into your chosen vector database or pgvector.
- **Test**: Query the vector store directly (without frontend) to ensure stored vectors exist and basic similarity search returns plausible neighbors for a given movie.

### Step 6.4 – Implement Query Embedding & Similarity Search
- **Action**: For each incoming /search request, create an embedding using SiliconFlow for the combination of user `query` and soft filters (情绪, 题材, 热度), then perform a similarity search in the vector store.
- **Test**: Submit multiple different natural language descriptions and verify that similar movies appear more frequently than unrelated ones; inspect logs for similarity scores.

### Step 6.5 – Apply Hard vs Soft Filters in Ranking
- **Action**: After retrieving candidate movies from vector search, filter them by hard constraints (类型, 地区, 年代, 平台) and use soft filters as scoring boosts.
- **Test**: Run test searches varying only hard filters and confirm excluded categories do not appear; then adjust soft filters and verify ranking order changes while remaining relevant.

### Step 6.6 – Map AI Scores to User‑Facing Match Labels
- **Action**: Convert internal similarity and ranking scores into simple user‑facing labels such as “High match” or “Medium match.”
- **Test**: Inspect returned results to ensure each card shows a correct label and that extremely low‑score items are either demoted or omitted.

---

## Phase 7 – UX Polish & Localization Details

### Step 7.1 – Refine Dark Theme & Visual Hierarchy
- **Action**: Adjust typography, spacing, and dark‑theme colors to emphasize the description box, filters, and primary search call‑to‑action.
- **Test**: Review the app in both desktop and mobile widths; confirm readability, contrast, and that key actions are visually prominent.

### Step 7.2 – Add Chinese‑Relevant Copy & Microcopy
- **Action**: Update labels, placeholders, and helper text to be culturally relevant and easy to understand for Chinese users, especially around filters and examples.
- **Test**: Have at least one native or fluent Chinese speaker review the UI text and validate it feels natural and clear.

### Step 7.3 – Implement Hint Prompts & Example Queries
- **Action**: Add example descriptions near the input box (e.g., describing well‑known movies) to teach users how to use the system.
- **Test**: Observe test users trying the app for the first time; confirm they understand how to phrase queries without additional explanation.

---

## Phase 8 – Testing, Performance, and Launch

### Step 8.1 – Functional Test of Core Flow
- **Action**: Manually walk through the full user journey: open app → enter description → select filters → search → review results → click through to a platform.
- **Test**: Confirm there are no broken interactions or crashes; record any mismatches between expected and actual movie guesses.

### Step 8.2 – Automated Test Coverage for Critical Paths
- **Action**: Add automated tests (unit/integration/E2E) for the /search endpoint, filter handling, and basic UI flows (including at least one happy path and one error scenario).
- **Test**: Run the test suite in CI or locally and confirm all tests pass and fail appropriately when intentional regressions are introduced.

### Step 8.3 – Performance & Latency Checks
- **Action**: Measure time from search submission to first results, and identify any slow steps (SiliconFlow, vector store, external APIs).
- **Test**: Run multiple searches and log total response times; ensure they remain within an acceptable target (e.g., under a few seconds for typical queries).

### Step 8.4 – Error Handling & Fallback Behavior
- **Action**: Simulate failures in SiliconFlow, metadata API, or platform API and ensure the system degrades gracefully (e.g., partial results, clear messages).
- **Test**: Temporarily disable each external dependency and confirm the app shows informative error or partial‑data messages without crashing.

### Step 8.5 – Final Pre‑Launch Review
- **Action**: Review the app against the Game Design Document and Tech Stack document to ensure all MVP features are implemented.
- **Test**: Use a checklist derived from the GDD and tech‑stack docs; verify each item is either completed or consciously deferred with a note.

---

This implementation plan should guide developers step by step, with each step validated by a specific, observable test to ensure the AI Movie Finder behaves as designed.
