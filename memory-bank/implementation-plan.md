# Phase 2 Implementation Plan

## Overview
Phase 2 adds movie poster images (TMDB API), movie detail page (/movie/:id), and external search link (Bing/Google based on IP).

---

## Step 1: TMDB API Setup

### 1.1 Add TMDB API Key to Environment
**Instructions:**
1. Open `.env` file
2. Add new line: `VITE_TMDB_API_KEY=your_tmdb_api_key_here`
3. Get API key from https://www.themoviedb.org/settings/api

**Test:**
- Verify `.env` contains `VITE_TMDB_API_KEY`
- Run `pnpm dev` and check no environment errors in console

### 1.2 Create TMDB API Client
**Instructions:**
1. Create new file `src/lib/tmdb.ts`
2. Define interface `TMDBSearchResult` with fields: `id`, `poster_path`, `title`, `release_date`
3. Define interface `TMDBSearchResponse` with fields: `results`, `total_results`
4. Create async function `searchMoviePoster(title: string, year?: number): Promise<string | null>`
   - Build URL: `https://api.themoviedb.org/3/search/movie`
   - Query params: `query=title`, `year=year`, `language=zh-CN`
   - Add header: `Authorization: Bearer ${VITE_TMDB_API_KEY}`
   - Return poster URL: `https://image.tmdb.org/t/p/w500${poster_path}` or `null` if not found
5. Add error handling with try/catch, return `null` on error
6. Add comment explaining the function purpose

**Test:**
- Import function in browser console or test file
- Call `searchMoviePoster("盗梦空间", 2010)`
- Verify returns valid image URL starting with `https://image.tmdb.org`

---

## Step 2: Movie Poster Component

### 2.1 Create MoviePoster Component
**Instructions:**
1. Create new file `src/components/MoviePoster.tsx`
2. Define props interface: `title: string`, `year?: number`, `className?: string`
3. Use `useState` for: `posterUrl: string | null`, `loading: boolean`, `error: boolean`
4. Use `useEffect` to call `searchMoviePoster(title, year)` on mount
5. Render three states:
   - Loading: Gray skeleton div with `animate-pulse` class
   - Error/No poster: Gradient background with movie emoji 🎬
   - Success: `<img>` tag with `posterUrl`, `alt={title}`, lazy loading
6. Maintain 2:3 aspect ratio using `aspect-[2/3]` Tailwind class
7. Add `onError` handler to img tag to set `error: true`

**Test:**
- Import component in a test page
- Render `<MoviePoster title="盗梦空间" year={2010} />`
- Verify: shows skeleton → then shows actual poster image
- Test with fake title "asdfghjkl" → verify shows fallback gradient

### 2.2 Add Poster Caching
**Instructions:**
1. In `src/lib/tmdb.ts`, add caching logic
2. Before API call, check `sessionStorage.getItem(`poster_${title}_${year}`)`
3. If cached, return cached URL immediately
4. After successful API call, save to `sessionStorage.setItem(`poster_${title}_${year}`, url)`
5. Add comment explaining caching strategy

**Test:**
- Search same movie twice
- Check Network tab: second request should NOT make API call
- Check sessionStorage in DevTools: should contain cached poster URL

---

## Step 3: Update MovieCard with Real Posters

### 3.1 Integrate MoviePoster into MovieCard
**Instructions:**
1. Open `src/components/MovieCard.tsx`
2. Import `MoviePoster` component
3. Replace existing poster placeholder (emoji/gradient div) with `<MoviePoster title={movie.title} year={movie.year} />`
4. Keep existing card structure: title, year, rating, genres, platforms, match info
5. Add `cursor-pointer` class to card for clickability (prep for Step 5)

**Test:**
- Run `pnpm dev`
- Perform a search (e.g., "一部关于盗梦的科幻片")
- Verify movie cards show real poster images
- Verify fallback works for movies without posters

---

## Step 4: IP Geolocation Service

### 4.1 Create Geolocation API Client
**Instructions:**
1. Create new file `src/lib/geolocation.ts`
2. Define interface `GeoLocation` with fields: `country`, `countryCode`
3. Create async function `detectUserRegion(): Promise<GeoLocation>`
   - First check `localStorage.getItem('user_region')`
   - If cached and not expired (24h), return cached value
   - Call free API: `https://ip-api.com/json/?fields=country,countryCode`
   - Cache result in localStorage with timestamp
   - Return `{ country, countryCode }`
4. Create function `isChina(region: GeoLocation): boolean`
   - Return `region.countryCode === 'CN'`
5. Add fallback: if API fails, return `{ country: 'Unknown', countryCode: 'US' }` (default to Google)
6. Add comments explaining the logic

**Test:**
- Call `detectUserRegion()` in console
- Verify returns object with `country` and `countryCode`
- Check localStorage contains `user_region` key
- Call again, verify no new network request (uses cache)

### 4.2 Create External Search URL Builder
**Instructions:**
1. In `src/lib/geolocation.ts`, add function `buildSearchUrl(movieTitle: string, isChineseRegion: boolean): string`
2. Encode movie title with `encodeURIComponent`
3. Build search query: `${movieTitle} 在线观看`
4. If `isChineseRegion`: return `https://www.bing.com/search?q=${query}`
5. Else: return `https://www.google.com/search?q=${query}`
6. Add comment explaining the function

**Test:**
- Call `buildSearchUrl("盗梦空间", true)`
- Verify returns Bing URL with encoded query
- Call `buildSearchUrl("盗梦空间", false)`
- Verify returns Google URL with encoded query

---

## Step 5: Movie Detail Page

### 5.1 Create Movie Detail Route
**Instructions:**
1. Create new folder `src/routes/movie/`
2. Create new file `src/routes/movie/$id.tsx`
3. Define route with TanStack Router file-based routing
4. Export `Route` with path `/movie/$id`
5. Add `loader` function to get movie data from route state or URL params
6. Add basic component shell returning "Movie Detail Page - {id}"

**Test:**
- Run `pnpm dev`
- Navigate to `/movie/test-id` in browser
- Verify page renders with "Movie Detail Page - test-id"
- Check no console errors

### 5.2 Implement Movie Detail UI
**Instructions:**
1. In `src/routes/movie/$id.tsx`, import necessary components
2. Get movie data from route state (passed from MovieCard click)
3. Build layout matching design document:
   - Header with back button "← 返回搜索" linking to `/`
   - Hero section: large poster (left) + title, year, rating, genres (right)
   - Match badge showing match score and reason
   - Synopsis section with full `intro` text
   - Platforms section showing available platforms
4. Use Tailwind classes matching existing dark theme
5. Add responsive layout: stack on mobile, side-by-side on desktop

**Test:**
- Navigate to detail page with movie data
- Verify all sections render correctly
- Verify back button navigates to home
- Test on mobile viewport: verify stacked layout

### 5.3 Add External Search Button
**Instructions:**
1. In movie detail page, import `detectUserRegion`, `isChina`, `buildSearchUrl`
2. Add state for `searchUrl: string | null`
3. In `useEffect`, call `detectUserRegion()`, then `buildSearchUrl(movie.title, isChina(region))`
4. Render button: "🔍 在线搜索更多观看渠道"
5. Style: orange background (#ff6b35), white text, rounded corners
6. On click: `window.open(searchUrl, '_blank')`
7. Add hover effect: scale and shadow

**Test:**
- Open movie detail page
- Click "在线搜索更多观看渠道" button
- Verify new tab opens with correct search engine (Bing for China, Google otherwise)
- Verify search query contains movie title

---

## Step 6: Navigation Integration

### 6.1 Make MovieCard Clickable
**Instructions:**
1. Open `src/components/MovieCard.tsx`
2. Import `useNavigate` from TanStack Router
3. Wrap card content in clickable div or use `Link` component
4. On click, navigate to `/movie/${movie.id}` with state: `{ movie }`
5. Add hover effect: slight scale up, shadow increase
6. Add `transition-transform` for smooth animation

**Test:**
- Perform a search
- Click on any movie card
- Verify navigates to `/movie/{id}` page
- Verify movie data is displayed on detail page

### 6.2 Preserve Search State on Return
**Instructions:**
1. In `src/routes/index.tsx`, store search results in route state or context
2. When navigating back from detail page, restore previous search results
3. Use `useNavigate` with `replace: false` to maintain history
4. Consider using TanStack Query cache for automatic persistence

**Test:**
- Perform a search
- Click a movie card to go to detail page
- Click back button
- Verify search results are still displayed (not cleared)

---

## Step 7: Loading States & Error Handling

### 7.1 Add Poster Loading Skeleton
**Instructions:**
1. In `MoviePoster.tsx`, ensure loading state shows animated skeleton
2. Use Tailwind: `bg-gray-700 animate-pulse rounded-lg`
3. Match exact dimensions of poster (2:3 aspect ratio)

**Test:**
- Throttle network in DevTools to Slow 3G
- Perform search
- Verify skeleton animation shows while posters load

### 7.2 Add Detail Page Loading State
**Instructions:**
1. In `src/routes/movie/$id.tsx`, add loading state
2. If movie data not available, show loading spinner
3. Use existing `LoadingState` component or create similar
4. Add error state if movie not found

**Test:**
- Navigate directly to `/movie/invalid-id`
- Verify error state shows "电影未找到"
- Verify back button still works

---

## Step 8: Final Polish

### 8.1 Update Types
**Instructions:**
1. Open `src/lib/types.ts`
2. Ensure `MovieResult` interface includes `poster?: string` field
3. Add any new types needed for Phase 2

**Test:**
- Run `pnpm build`
- Verify no TypeScript errors

### 8.2 Update Architecture Document
**Instructions:**
1. Open `memory-bank/@architecture.md`
2. Mark Phase 2 items as completed
3. Add any new learnings or changes to architecture

**Test:**
- Review document for accuracy
- Verify all Phase 2 features are documented

---

## Summary Checklist

- [ ] Step 1: TMDB API Setup (1.1, 1.2)
- [ ] Step 2: MoviePoster Component (2.1, 2.2)
- [ ] Step 3: Update MovieCard (3.1)
- [ ] Step 4: IP Geolocation (4.1, 4.2)
- [ ] Step 5: Movie Detail Page (5.1, 5.2, 5.3)
- [ ] Step 6: Navigation (6.1, 6.2)
- [ ] Step 7: Loading States (7.1, 7.2)
- [ ] Step 8: Final Polish (8.1, 8.2)

---

## Dependencies

- TMDB API key (free tier available)
- ip-api.com (free, no key required, 45 requests/minute limit)

## Estimated Time

- Step 1-2: 1-2 hours
- Step 3: 30 minutes
- Step 4: 1 hour
- Step 5: 2-3 hours
- Step 6: 1 hour
- Step 7: 30 minutes
- Step 8: 30 minutes

**Total: ~7-9 hours**
