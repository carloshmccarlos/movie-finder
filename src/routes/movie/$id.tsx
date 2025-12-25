// Movie Detail Page - Cinematic glassmorphism design
// 电影详情页 - 电影级玻璃态设计

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { MoviePoster } from "../../components/MoviePoster";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import {
  detectUserRegion,
  isChina,
  buildSearchUrl,
} from "../../lib/geolocation";
import { useI18n } from "../../lib/i18n-context";
import type { MovieResult } from "../../lib/types";

// Route definition
export const Route = createFileRoute("/movie/$id")({
  component: MovieDetailPage,
});

// Match score config for display
const matchScoreConfig = {
  high: { percent: "98%", label: "Perfect", color: "text-green-500" },
  medium: { percent: "85%", label: "Good", color: "text-yellow-500" },
  low: { percent: "70%", label: "Partial", color: "text-gray-500" },
};

function MovieDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { t } = useI18n();

  // State
  const [movie, setMovie] = useState<MovieResult | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load movie data from sessionStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(`movie_${id}`);
    if (stored) {
      try {
        setMovie(JSON.parse(stored));
      } catch {
        console.error("Failed to parse movie data");
      }
    }
  }, [id]);

  // Setup external search URL based on user region
  useEffect(() => {
    async function setupSearchUrl() {
      if (!movie) return;
      try {
        const region = await detectUserRegion();
        const url = buildSearchUrl(movie.title, isChina(region));
        setSearchUrl(url);
      } catch {
        // Fallback to Google if region detection fails
        setSearchUrl(buildSearchUrl(movie?.title || "", false));
      }
    }
    setupSearchUrl();
  }, [movie]);

  const handleBack = () => navigate({ to: "/" });

  const handleExternalSearch = () => {
    if (searchUrl) {
      window.open(searchUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Copy movie info to clipboard
  const handleCopyInfo = async () => {
    if (!movie) return;

    const info = `🎬 ${movie.title} (${movie.year})
${movie.originalTitle ? `Original: ${movie.originalTitle}` : ""}
⭐ ${t("detail.rating")}: ${movie.rating}/10${movie.voteCount ? ` (${movie.voteCount.toLocaleString()} ${t("detail.votes")})` : ""}
🎭 Genre: ${movie.genres.join(" / ")}
🌍 ${t("detail.region")}: ${movie.region}

📖 ${t("detail.synopsis")}:
${movie.intro}

💡 ${movie.matchReason}`;

    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  // Error state - movie not found
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4">
        <p className="text-gray-400 text-lg mb-4">{t("detail.notFound")}</p>
        <button
          onClick={handleBack}
          className="btn-watch"
        >
          {t("detail.back")}
        </button>
      </div>
    );
  }

  const scoreConfig = matchScoreConfig[movie.matchScore];

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Cinematic Backdrop */}
      {movie.backdrop && (
        <div className="backdrop-container">
          <img
            src={movie.backdrop}
            alt=""
            className="backdrop-image"
          />
          <div className="backdrop-overlay" />
        </div>
      )}

      {/* Header Navigation */}
      <header className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
          >
            <ArrowLeft
              size={20}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            <span>{t("detail.back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {/* <span className="text-xl">🎬</span>
            <span className="font-bold tracking-tighter letter-spacing-wide hidden sm:inline">
              AI MOVIE FINDER
            </span> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Poster & Actions */}
          <div className="w-full lg:w-[400px] shrink-0">
            {/* Floating poster */}
            <div className="poster-container mb-10">
              <MoviePoster
                title={movie.title}
                year={movie.year}
                posterUrl={movie.poster}
                className="poster-image w-full"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleExternalSearch}
                disabled={!searchUrl}
                className="btn-watch w-full justify-center"
              >
                <Search size={24} />
                {t("detail.searchOnline")}
              </button>
              <button
                onClick={handleCopyInfo}
                className="btn-secondary flex items-center justify-center gap-2 w-full"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? t("detail.copied") : t("detail.copyInfo")}
              </button>
            </div>
          </div>

          {/* Right: Details & Analysis */}
          <div className="flex-1 space-y-12">
            {/* Title & Meta */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 tracking-tighter">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
                {movie.originalTitle && (
                  <>
                    <p className="text-xl">{movie.originalTitle}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </>
                )}
                <p>{movie.year}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <p>{movie.region}</p>
                {movie.releaseDate && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <p>{movie.releaseDate}</p>
                  </>
                )}
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="badge-stat">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  TMDB {t("detail.rating")}
                </span>
                <div className="flex items-end gap-2 text-yellow-500">
                  <span className="text-3xl font-bold font-mono">
                    {movie.rating || "N/A"}
                  </span>
                  <span className="text-sm pb-1 text-gray-600">/ 10</span>
                </div>
              </div>
              <div className="badge-stat">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  {t("detail.popularity")}
                </span>
                <div className="flex items-end gap-2 text-orange-500">
                  <span className="text-3xl font-bold font-mono">
                    {movie.popularity ? Math.round(movie.popularity) : "—"}
                  </span>
                </div>
              </div>
              <div className="badge-stat">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  {t("detail.matchScore")}
                </span>
                <div className={`flex items-end gap-2 ${scoreConfig.color}`}>
                  <span className="text-3xl font-bold font-mono">
                    {scoreConfig.percent}
                  </span>
                  <span className="text-sm pb-1 text-gray-600">
                    {scoreConfig.label}
                  </span>
                </div>
              </div>
              <div className="badge-stat">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  {t("detail.votes")}
                </span>
                <div className="flex items-end gap-2 text-blue-500">
                  <span className="text-3xl font-bold font-mono">
                    {movie.voteCount
                      ? movie.voteCount >= 1000
                        ? `${(movie.voteCount / 1000).toFixed(1)}K`
                        : movie.voteCount
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Analysis */}
            <div className="match-analysis space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00d4aa] flex items-center justify-center text-black">
                  <Info size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#00d4aa]">
                  {t("detail.aiReason")}
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                {movie.matchReason}
              </p>
            </div>

            {/* Synopsis */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-4">
                {t("detail.synopsis")}
                <div className="flex-1 h-px bg-white/10" />
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed font-light whitespace-pre-line">
                {movie.intro}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-sm relative z-10">
        <p>© 2025 AI Movie Finder. Poster data by TMDB.</p>
      </footer>
    </div>
  );
}
