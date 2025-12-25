// Main search page - AI Movie Finder landing page
// 主搜索页面 - AI电影搜索首页
// Using TanStack Query + custom i18n (SSR-compatible)

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { FilterBar } from "../components/FilterBar";
import { MovieList } from "../components/MovieList";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { searchMovies } from "../lib/search";
import { useI18n } from "../lib/i18n-context";
import type { SearchFilters } from "../lib/types";

// Session storage key for persisting search state
const STORAGE_KEY = "last_search";

// Route definition
export const Route = createFileRoute("/")({
  component: SearchPage,
});

// Load/save search state helpers (client-side only)
function loadLastSearch(): { query: string; filters: SearchFilters } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveLastSearch(query: string, filters: SearchFilters) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, filters }));
  } catch {}
}

// Main search page component
function SearchPage() {
  const { t, examples, locale } = useI18n();
  const lastSearch = loadLastSearch();

  // Search state
  const [query, setQuery] = useState(lastSearch?.query || "");
  const [submittedQuery, setSubmittedQuery] = useState(lastSearch?.query || "");
  const [filters, setFilters] = useState<SearchFilters>(
    lastSearch?.filters || { genre: "", region: "", era: "" }
  );
  const [submittedFilters, setSubmittedFilters] = useState<SearchFilters>(
    lastSearch?.filters || { genre: "", region: "", era: "" }
  );
  const [showFilters, setShowFilters] = useState(false);

  // TanStack Query for search - locale-aware
  const {
    data: searchResults,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["movieSearch", submittedQuery, submittedFilters, locale],
    queryFn: () => searchMovies(submittedQuery, submittedFilters, locale),
    enabled: !!submittedQuery.trim(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const results = searchResults?.results || [];
  const hasSearched = isFetched && !!submittedQuery;
  const hasActiveFilters = Object.values(filters).some((v) => v);

  // Handlers
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({ genre: "", region: "", era: "" });
  }, []);

  const performSearch = useCallback(() => {
    if (!query.trim()) return;
    const trimmedQuery = query.trim();
    setSubmittedQuery(trimmedQuery);
    setSubmittedFilters({ ...filters });
    setShowFilters(false);
    saveLastSearch(trimmedQuery, filters);
  }, [query, filters]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        performSearch();
      }
    },
    [performSearch]
  );

  const handleExampleClick = useCallback((example: string) => {
    setQuery(example);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Language switcher - top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <main className="flex flex-col items-center px-4 pt-12 pb-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          🎬 {t("app.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-[#a0a0a0] text-lg mb-8 text-center">
          {t("app.subtitle")}
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
            placeholder={t("search.placeholder")}
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
              <span className="hidden sm:inline">{t("search.filter")}</span>
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
              {t("search.button")}
            </button>
          </div>

          <p className="text-[#666666] text-xs mt-2 text-center">
            {t("search.hint")}
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
                {t("search.clearFilters")}
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
              message={error instanceof Error ? error.message : t("results.error")}
            />
          )}

          {!isLoading && !error && results.length > 0 && (
            <MovieList movies={results} />
          )}

          {!isLoading && !error && hasSearched && results.length === 0 && (
            <EmptyState 
              type="no-results" 
              onExampleClick={handleExampleClick}
              examples={examples}
            />
          )}

          {!isLoading && !error && !hasSearched && (
            <EmptyState 
              type="initial" 
              onExampleClick={handleExampleClick}
              examples={examples}
            />
          )}
        </div>
      </main>
    </div>
  );
}
