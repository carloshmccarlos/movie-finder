// Movie Detail Page - Shows full movie information from TMDB
// 电影详情页 - 显示完整电影信息 (SSR-compatible)

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Search,
  Copy,
  Check,
  Calendar,
  Globe,
  TrendingUp,
  Users,
  Film,
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

// Match score badge styles
const matchScoreStyles = {
  high: "bg-green-600 text-white",
  medium: "bg-yellow-600 text-white",
  low: "bg-gray-600 text-white",
};

function MovieDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const { t } = useI18n();

  // Match score labels from i18n
  const matchScoreLabels = {
    high: t("match.high"),
    medium: t("match.medium"),
    low: t("match.low"),
  };

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

  // Setup external search URL
  useEffect(() => {
    async function setupSearchUrl() {
      if (!movie) return;
      try {
        const region = await detectUserRegion();
        const url = buildSearchUrl(movie.title, isChina(region));
        setSearchUrl(url);
      } catch {
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

  const handleCopyInfo = async () => {
    if (!movie) return;

    const info = `🎬 ${movie.title} (${movie.year})
${movie.originalTitle ? `Original: ${movie.originalTitle}` : ""}
⭐ ${t("detail.rating")}: ${movie.rating}/10${movie.voteCount ? ` (${movie.voteCount.toLocaleString()} ${t("detail.votes")})` : ""}
${movie.popularity ? `🔥 ${t("detail.popularity")}: ${movie.popularity}` : ""}
🎭 Genre: ${movie.genres.join(" / ")}
🌍 ${t("detail.region")}: ${movie.region}
${movie.releaseDate ? `📅 ${t("detail.releaseDate")}: ${movie.releaseDate}` : ""}

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

  // Error state
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">
        <p className="text-[#a0a0a0] text-lg mb-4">{t("detail.notFound")}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff8555] transition-colors"
        >
          {t("detail.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Backdrop image */}
      {movie.backdrop && (
        <div className="absolute top-0 left-0 w-full h-80 overflow-hidden">
          <img
            src={movie.backdrop}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0f0f0f]" />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0f0f0f]/80 backdrop-blur border-b border-[#333333]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t("detail.back")}</span>
          </button>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-[#666666] text-sm">{t("app.title")}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Poster */}
          <div className="w-full md:w-64 shrink-0">
            <MoviePoster
              title={movie.title}
              year={movie.year}
              posterUrl={movie.poster}
              className="w-full shadow-2xl"
            />
          </div>

          {/* Movie info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>

            {movie.originalTitle && (
              <p className="text-[#666666] text-lg mb-2">{movie.originalTitle}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star size={24} className="text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-2xl font-bold">
                  {movie.rating || "N/A"}
                </span>
                <span className="text-[#666666]">/ 10</span>
              </div>
              {movie.voteCount && movie.voteCount > 0 && (
                <div className="flex items-center gap-1 text-[#666666] text-sm">
                  <Users size={14} />
                  <span>{movie.voteCount.toLocaleString()} {t("detail.votes")}</span>
                </div>
              )}
            </div>

            {/* Popularity */}
            {movie.popularity && movie.popularity > 0 && (
              <div className="flex items-center gap-2 mb-4 text-[#ff6b35]">
                <TrendingUp size={18} />
                <span className="text-sm">{t("detail.popularity")}: {movie.popularity}</span>
              </div>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-[#252525] text-[#a0a0a0] rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#a0a0a0]">
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <span>{movie.region}</span>
              </div>
              {movie.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{movie.releaseDate}</span>
                </div>
              )}
              {movie.originalLanguage && (
                <div className="flex items-center gap-1">
                  <Film size={14} />
                  <span>{t("detail.originalAudio")}: {movie.originalLanguage.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Match score */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${matchScoreStyles[movie.matchScore]}`}
              >
                🎬 {matchScoreLabels[movie.matchScore]}
              </span>
            </div>

            <p className="text-[#00d4aa] text-sm">💡 {movie.matchReason}</p>
          </div>
        </div>

        {/* Synopsis */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{t("detail.synopsis")}</h2>
          <p className="text-[#a0a0a0] leading-relaxed whitespace-pre-line">
            {movie.intro}
          </p>
        </section>

        {/* TMDB reference */}
        {movie.tmdbId && (
          <section className="mb-8">
            <p className="text-[#666666] text-xs">
              {t("detail.dataSource")} (ID: {movie.tmdbId})
            </p>
          </section>
        )}

        {/* External search */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{t("detail.watchOnline")}</h2>
          <button
            onClick={handleExternalSearch}
            disabled={!searchUrl}
            className="w-full md:w-auto px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] 
                       disabled:bg-[#333333] disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg transition-all
                       hover:scale-[1.02] hover:shadow-lg hover:shadow-[#ff6b35]/20
                       flex items-center justify-center gap-2"
          >
            <Search size={20} />
            {t("detail.searchOnline")}
          </button>
          <p className="text-[#666666] text-xs mt-2">{t("detail.searchHint")}</p>
        </section>

        {/* Actions */}
        <section className="flex flex-wrap gap-3 pb-8">
          <button
            onClick={handleCopyInfo}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#a0a0a0]
                       hover:border-[#ff6b35] hover:text-white rounded-lg transition-colors
                       flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? t("detail.copied") : t("detail.copyInfo")}
          </button>
        </section>
      </main>
    </div>
  );
}
