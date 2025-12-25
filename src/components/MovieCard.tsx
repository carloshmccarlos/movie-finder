// MovieCard component - Display single movie result
// 电影卡片组件 - 显示单个电影结果 (SSR-compatible)

import { Star, Monitor } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useI18n } from "../lib/i18n-context";
import type { MovieResult } from "../lib/types";
import { MoviePoster } from "./MoviePoster";

interface MovieCardProps {
  movie: MovieResult;
}

// Match score badge colors
const matchScoreStyles = {
  high: "bg-green-600 text-white",
  medium: "bg-yellow-600 text-white",
  low: "bg-gray-600 text-white",
};

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Match score labels from i18n
  const matchScoreLabels = {
    high: t("match.high"),
    medium: t("match.medium"),
    low: t("match.low"),
  };

  // Navigate to movie detail page
  const handleClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`movie_${movie.id}`, JSON.stringify(movie));
    }
    navigate({
      to: "/movie/$id",
      params: { id: movie.id },
    });
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
      className="bg-[#1a1a1a] border border-[#333333] rounded-lg overflow-hidden
                    hover:border-[#ff6b35] hover:shadow-lg hover:shadow-[#ff6b35]/10
                    hover:scale-[1.02] cursor-pointer
                    transition-all duration-200 flex flex-col"
    >
      {/* Poster */}
      <div className="relative">
        <MoviePoster 
          title={movie.title} 
          year={movie.year} 
          posterUrl={movie.poster}
        />

        {/* Match score badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${matchScoreStyles[movie.matchScore]}`}
        >
          {matchScoreLabels[movie.matchScore]}
        </span>
      </div>

      {/* Movie info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-[#666666] text-sm mb-2">
          {movie.originalTitle && `${movie.originalTitle} · `}
          {movie.year} · {movie.region}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="text-yellow-500 font-medium">{movie.rating}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 bg-[#252525] text-[#a0a0a0] text-xs rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Intro */}
        <p className="text-[#a0a0a0] text-sm line-clamp-2 mb-3 flex-1">
          {movie.intro}
        </p>

        {/* Match reason */}
        <p className="text-[#00d4aa] text-xs mb-3 line-clamp-2">
          💡 {movie.matchReason}
        </p>

        {/* Platforms */}
        <div className="flex items-center gap-2 mt-auto">
          <Monitor size={14} className="text-[#666666]" />
          <div className="flex flex-wrap gap-1">
            {movie.platforms.slice(0, 3).map((platform) => (
              <span
                key={platform}
                className="px-2 py-0.5 bg-[#ff6b35]/20 text-[#ff6b35] text-xs rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
