// Main search page - AI Movie Finder landing page
// 主搜索页面 - AI电影搜索首页
// Phase 2: Using TanStack Query for search state persistence

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { FilterBar } from "../components/FilterBar";
import { MovieList } from "../components/MovieList";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { searchMovies } from "../lib/search";
import type { SearchFilters } from "../lib/types";

// Session storage keys for persisting search input state
const STORAGE_KEY = "last_search";

// Route definition
export const Route = createFileRoute("/")({
  component: SearchPage,
});

// Load last search from sessionStorage
function loadLastSearch(): { query: string; filters: SearchFilters } | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

// Save search to sessionStorage
function saveLastSearch(query: string, filters: SearchFilters) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, filters }));
}

// Main search page component
function SearchPage() {
  // Load last search on mount
  const lastSearch = loadLastSearch();

  // Search query and filters state
  const [query, setQuery] = useState(lastSearch?.query || "");
  const [submittedQuery, setSubmittedQuery] = useState(lastSearch?.query || "");
  const [filters, setFilters] = useState<SearchFilters>(
    lastSearch?.filters || { genre: "", region: "", era: "" }
  );
  const [submittedFilters, setSubmittedFilters] = useState<SearchFilters>(
    lastSearch?.filters || { genre: "", region: "", era: "" }
  );

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // TanStack Query for search - caches results automatically
  // Query key includes query and filters so different searches are cached separately
  const {
    data: searchResults,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["movieSearch", submittedQuery, submittedFilters],
    queryFn: () => searchMovies(submittedQuery, submittedFilters),
    enabled: !!submittedQuery.trim(), // Only run when query is submitted
    staleTime: Infinity, // Keep results cached forever
    gcTime: Infinity, // Never garbage collect
  });

  const results = searchResults?.results || [];
  const hasSearched = isFetched && !!submittedQuery;

  // Handle filter change
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ genre: "", region: "", era: "" });
  }, []);

  const hasActiveFilters = Object.values(filters).some((v) => v);

  // Perform search - submit query and filters, close filter bar
  const performSearch = useCallback(() => {
    if (!query.trim()) return;
    const trimmedQuery = query.trim();
    setSubmittedQuery(trimmedQuery);
    setSubmittedFilters({ ...filters });
    setShowFilters(false);
    // Save to sessionStorage for persistence across navigation
    saveLastSearch(trimmedQuery, filters);
  }, [query, filters]);

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        performSearch();
      }
    },
    [performSearch]
  );

  // Handle example query click
  const handleExampleClick = useCallback((example: string) => {
    setQuery(example);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <main className="flex flex-col items-center px-4 pt-12 pb-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          🎬 AI电影搜索
        </h1>

        {/* Subtitle */}
        <p className="text-[#a0a0a0] text-lg mb-8 text-center">
          描述你想看的电影，AI帮你找到它
        </p>

        {/* Search Box */}
        <div className="w-full max-w-2xl">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-32 p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg 
                       text-white placeholder-[#666666] resize-none
                       focus:outline-none focus:border-[#ff6b35] transition-colors"
            placeholder="输入电影描述...&#10;例如：一部关于盗梦的科幻片，主角在梦境中层层深入，有莱昂纳多主演"
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2
                         border ${
                           showFilters || hasActiveFilters
                             ? "bg-[#ff6b35]/20 border-[#ff6b35] text-[#ff6b35]"
                             : "bg-[#1a1a1a] border-[#333333] text-[#a0a0a0] hover:border-[#ff6b35]"
                         }`}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">筛选</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#ff6b35] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={performSearch}
              disabled={isLoading || !query.trim()}
              className="flex-1 py-3 px-6 bg-[#ff6b35] hover:bg-[#ff8555] 
                         disabled:bg-[#333333] disabled:cursor-not-allowed
                         text-white font-semibold rounded-lg transition-colors
                         flex items-center justify-center gap-2"
            >
              <Search size={20} />
              找电影
            </button>
          </div>

          <p className="text-[#666666] text-xs mt-2 text-center">
            按 Ctrl+Enter 快速搜索
          </p>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="w-full max-w-4xl mt-4">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 px-4 py-2 text-[#a0a0a0] text-sm hover:text-white
                           flex items-center gap-1 mx-auto transition-colors"
              >
                <X size={16} />
                清除所有筛选
              </button>
            )}
          </div>
        )}

        {/* Results Section */}
        <div className="w-full mt-8">
          {isLoading && <LoadingState />}

          {!isLoading && error && (
            <EmptyState
              type="error"
              message={error instanceof Error ? error.message : "搜索失败"}
            />
          )}

          {!isLoading && !error && results.length > 0 && (
            <MovieList movies={results} />
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <EmptyState type="no-results" onExampleClick={handleExampleClick} />
          )}

          {!isLoading && !error && !hasSearched && (
            <EmptyState type="initial" onExampleClick={handleExampleClick} />
          )}
        </div>
      </main>
    </div>
  );
}
