// Main search page - AI Movie Finder landing page
// 主搜索页面 - AI电影搜索首页

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { FilterBar } from "../components/FilterBar";
import { MovieList } from "../components/MovieList";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { searchMovies } from "../lib/search";
import type { SearchFilters, MovieResult } from "../lib/types";

// Route definition with loader to get API key from server
export const Route = createFileRoute("/")({
  component: SearchPage,
  loader: async () => {
    // Get API key from environment on server side
    const apiKey = process.env.SILICONFLOW_API_KEY || "";
    return { apiKey };
  },
});

// Main search page component
function SearchPage() {
  // Get API key from loader data
  const { apiKey } = Route.useLoaderData();

  // Search query state
  const [query, setQuery] = useState("");

  // Filter state - default to "全部" (empty string means all)
  const [filters, setFilters] = useState<SearchFilters>({
    genre: "",
    region: "",
    era: "",
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search results
  const [results, setResults] = useState<MovieResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle filter change - update single filter value
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Clear all filters - reset to "全部"
  const clearFilters = useCallback(() => {
    setFilters({
      genre: "",
      region: "",
      era: "",
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((v) => v);

  // Perform search - call SiliconFlow API
  const performSearch = useCallback(async () => {
    // Validate query
    if (!query.trim()) {
      return;
    }

    // Check API key
    if (!apiKey) {
      setError("服务配置错误：缺少 API Key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Call search function
      const response = await searchMovies(query.trim(), filters, apiKey);

      // Update results
      setResults(response.results);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "搜索失败，请稍后重试");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, apiKey]);

  // Handle Enter key press in textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl+Enter or Cmd+Enter to search (allow normal Enter for newlines)
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
      {/* Hero Section - Search area */}
      <main className="flex flex-col items-center px-4 pt-12 pb-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          🎬 AI电影搜索
        </h1>

        {/* Subtitle */}
        <p className="text-[#a0a0a0] text-lg mb-8 text-center">
          描述你想看的电影，AI帮你找到它
        </p>

        {/* Search Box Container */}
        <div className="w-full max-w-2xl">
          {/* Text Input Area */}
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-32 p-4 bg-[#1a1a1a] border border-[#333333] rounded-lg 
                       text-white placeholder-[#666666] resize-none
                       focus:outline-none focus:border-[#ff6b35] transition-colors"
            placeholder="输入电影描述...&#10;例如：一部关于盗梦的科幻片，主角在梦境中层层深入，有莱昂纳多主演"
          />

          {/* Action buttons row */}
          <div className="flex gap-3 mt-4">
            {/* Filter toggle button */}
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

            {/* Search Button */}
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

          {/* Keyboard hint */}
          <p className="text-[#666666] text-xs mt-2 text-center">
            按 Ctrl+Enter 快速搜索
          </p>
        </div>

        {/* Filter Bar - collapsible */}
        {showFilters && (
          <div className="w-full max-w-4xl mt-4">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />

            {/* Clear filters button */}
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
          {/* Loading state */}
          {isLoading && <LoadingState />}

          {/* Error state */}
          {!isLoading && error && <EmptyState type="error" message={error} />}

          {/* Results list */}
          {!isLoading && !error && results.length > 0 && (
            <MovieList movies={results} />
          )}

          {/* Empty state - no results after search */}
          {!isLoading && !error && hasSearched && results.length === 0 && (
            <EmptyState type="no-results" onExampleClick={handleExampleClick} />
          )}

          {/* Initial state - before any search */}
          {!isLoading && !error && !hasSearched && (
            <EmptyState type="initial" onExampleClick={handleExampleClick} />
          )}
        </div>
      </main>
    </div>
  );
}
