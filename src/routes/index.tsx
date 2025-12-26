// Main search page - AI Movie Finder landing page
// 主搜索页面 - AI电影搜索首页 (Modern Glassmorphism UI)
// Fixed: No sessionStorage persistence - fresh state on refresh
// Added: Collapsible filter bar with toggle

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

import { FilterBar } from "../components/FilterBar";
import { MovieList } from "../components/MovieList";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { searchMovies } from "../lib/search";
import { useI18n } from "../lib/i18n-context";
import type { SearchFilters } from "../lib/types";

// Route definition
export const Route = createFileRoute("/")({
  component: SearchPage,
});

// Main search page component
function SearchPage() {
  const { t, examples, locale } = useI18n();

  // Search state - no persistence, fresh on every page load
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({ genre: "", region: "", era: "" });
  const [submittedFilters, setSubmittedFilters] = useState<SearchFilters>({ genre: "", region: "", era: "" });
  
  // Filter bar toggle state
  const [showFilters, setShowFilters] = useState(false);

  // TanStack Query for search
  const {
    data: searchResults,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["movieSearch", submittedQuery, submittedFilters],
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

  const performSearch = useCallback(() => {
    if (!query.trim()) return;
    const trimmedQuery = query.trim();
    setSubmittedQuery(trimmedQuery);
    setSubmittedFilters({ ...filters });
    // Auto-close filter bar when search is triggered
    setShowFilters(false);
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

  // Toggle filter bar visibility
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Animated mesh background */}
      <div className="mesh-bg" />
      <div className="glow-sphere" style={{ top: "10%", right: "10%" }} />
      <div className="glow-sphere" style={{ bottom: "10%", left: "5%" }} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-4 md:px-6 py-3 md:py-4 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🎬</span>
            <span className="text-base md:text-xl font-bold tracking-tighter letter-spacing-wide hidden sm:inline">
              AI MOVIE FINDER
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-16 md:pb-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight gradient-text">
            {t("hero.title")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-400 mx-auto font-light px-2">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Search Container */}
        <div className="mb-8 md:mb-12 relative">
          <div className="glass-card p-2 group focus-within:ring-2 ring-[#ff6b35]/20 transition-all">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("search.placeholder")}
              className="w-full h-32 md:h-40 p-4 md:p-6 bg-transparent border-none focus:ring-0 focus:outline-none
                         text-base md:text-xl text-white placeholder-gray-600 resize-none font-light"
            />
            <div className="flex justify-between items-center p-3 md:p-4 border-t border-white/5 bg-black/20 rounded-b-2xl">
              {/* Filter toggle button */}
              <button
                type="button"
                onClick={toggleFilters}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${showFilters || hasActiveFilters
                    ? "bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/50"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">{t("search.filter")}</span>
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full" />
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* Search button */}
              <button
                onClick={performSearch}
                disabled={isLoading || !query.trim()}
                className="btn-primary px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold flex items-center gap-2 md:gap-3 text-white disabled:opacity-50 text-sm md:text-base"
              >
                <Search size={18} className="md:w-5 md:h-5" />
                {t("search.button")}
              </button>
            </div>
          </div>

          {/* Hint - hidden on mobile */}
          <div className="mt-4 hidden sm:flex justify-center text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px]">Ctrl</kbd>
              +
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px]">Enter</kbd>
              {t("search.shortcut")}
            </span>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="mb-8 md:mb-12 animate-in slide-in-from-top-2 duration-200">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Results Section */}
        <div className="mt-8 md:mt-12">
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

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-sm">
        <p>© 2025 AI Movie Finder. Powered by DeepSeek-V3.2 & TMDB.</p>
      </footer>
    </div>
  );
}
