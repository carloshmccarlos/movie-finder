// Main search page - AI Movie Finder landing page
// 主搜索页面 - AI电影搜索首页 (Modern Glassmorphism UI)

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

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
            <div className="flex justify-end items-center p-3 md:p-4 border-t border-white/5 bg-black/20 rounded-b-2xl">
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

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Results Section */}
        <div className="mt-12">
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
        {/* <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-white transition-colors">{t("footer.about")}</a>
          <a href="#" className="hover:text-white transition-colors">{t("footer.api")}</a>
          <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
        </div> */}
      </footer>
    </div>
  );
}
