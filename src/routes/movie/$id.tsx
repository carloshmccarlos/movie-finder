// Movie Detail Page - Shows full movie information from TMDB
// 电影详情页 - 显示完整电影信息（包含所有TMDB数据）
// Phase 2: Full TMDB data display with backdrop, ratings, popularity

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
import {
  detectUserRegion,
  isChina,
  buildSearchUrl,
} from "../../lib/geolocation";
import type { MovieResult } from "../../lib/types";

// Route definition with movie ID parameter
export const Route = createFileRoute("/movie/$id")({
  component: MovieDetailPage,
});

// Match score badge styles
const matchScoreStyles = {
  high: "bg-green-600 text-white",
  medium: "bg-yellow-600 text-white",
  low: "bg-gray-600 text-white",
};

const matchScoreLabels = {
  high: "高度匹配",
  medium: "中度匹配",
  low: "可能相关",
};

function MovieDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();

  // State for movie data
  const [movie, setMovie] = useState<MovieResult | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load movie data from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(`movie_${id}`);
    if (stored) {
      try {
        setMovie(JSON.parse(stored));
      } catch {
        console.error("Failed to parse movie data");
      }
    }
  }, [id]);

  // Detect user region and build search URL
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

  // Copy all movie info to clipboard
  const handleCopyInfo = async () => {
    if (!movie) return;

    const info = `🎬 ${movie.title} (${movie.year})
${movie.originalTitle ? `原名: ${movie.originalTitle}` : ""}
⭐ 评分: ${movie.rating}/10${movie.voteCount ? ` (${movie.voteCount.toLocaleString()}人评价)` : ""}
${movie.popularity ? `🔥 热度: ${movie.popularity}` : ""}
🎭 类型: ${movie.genres.join(" / ")}
🌍 地区: ${movie.region}
${movie.releaseDate ? `📅 上映: ${movie.releaseDate}` : ""}

📖 简介:
${movie.intro}

💡 匹配原因: ${movie.matchReason}`;

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
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">
        <p className="text-[#a0a0a0] text-lg mb-4">电影未找到</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff8555] transition-colors"
        >
          返回搜索
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Backdrop image (if available from TMDB) */}
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
            <span>返回搜索</span>
          </button>
          <span className="text-[#666666] text-sm">AI电影搜索</span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Hero section - Poster + Basic info */}
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
            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>

            {/* Original title */}
            {movie.originalTitle && (
              <p className="text-[#666666] text-lg mb-2">{movie.originalTitle}</p>
            )}

            {/* Rating with vote count */}
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
                  <span>{movie.voteCount.toLocaleString()} 人评价</span>
                </div>
              )}
            </div>

            {/* Popularity (TMDB热度) */}
            {movie.popularity && movie.popularity > 0 && (
              <div className="flex items-center gap-2 mb-4 text-[#ff6b35]">
                <TrendingUp size={18} />
                <span className="text-sm">热度指数: {movie.popularity}</span>
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

            {/* Meta info row */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#a0a0a0]">
              {/* Region */}
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <span>{movie.region}</span>
              </div>

              {/* Release date */}
              {movie.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{movie.releaseDate}</span>
                </div>
              )}

              {/* Original language */}
              {movie.originalLanguage && (
                <div className="flex items-center gap-1">
                  <Film size={14} />
                  <span>原声: {movie.originalLanguage.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Match score badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${matchScoreStyles[movie.matchScore]}`}
              >
                🎬 {matchScoreLabels[movie.matchScore]}
              </span>
            </div>

            {/* Match reason */}
            <p className="text-[#00d4aa] text-sm">💡 {movie.matchReason}</p>
          </div>
        </div>

        {/* Synopsis section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">剧情简介</h2>
          <p className="text-[#a0a0a0] leading-relaxed whitespace-pre-line">
            {movie.intro}
          </p>
        </section>

        {/* TMDB ID info (for reference) */}
        {movie.tmdbId && (
          <section className="mb-8">
            <p className="text-[#666666] text-xs">
              数据来源: TMDB (ID: {movie.tmdbId})
            </p>
          </section>
        )}

        {/* External search section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">在线观看</h2>
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
            搜索在线观看渠道
          </button>
          <p className="text-[#666666] text-xs mt-2">
            根据您的位置自动跳转到 Bing 或 Google 搜索
          </p>
        </section>

        {/* Action buttons */}
        <section className="flex flex-wrap gap-3 pb-8">
          <button
            onClick={handleCopyInfo}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-[#a0a0a0]
                       hover:border-[#ff6b35] hover:text-white rounded-lg transition-colors
                       flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "已复制" : "复制电影信息"}
          </button>
        </section>
      </main>
    </div>
  );
}
