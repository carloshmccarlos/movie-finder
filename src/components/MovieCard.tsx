// MovieCard component - Modern glassmorphism movie card with hover overlay
// 电影卡片组件 - 现代玻璃态设计，悬停显示推荐理由

import { Star } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useI18n } from "../lib/i18n-context";
import type { MovieResult } from "../lib/types";
import { MoviePoster } from "./MoviePoster";

interface MovieCardProps {
  movie: MovieResult;
}

// Match score badge colors and percentages
const matchScoreConfig = {
  high: { bg: "bg-green-500/90", percent: "98%" },
  medium: { bg: "bg-yellow-500/90", percent: "85%" },
  low: { bg: "bg-gray-500/90", percent: "70%" },
};

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

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

  const scoreConfig = matchScoreConfig[movie.matchScore];

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
      className="movie-card group cursor-pointer"
    >
      {/* Poster with overlay */}
      <div className="relative aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-4 shadow-xl">
        <MoviePoster
          title={movie.title}
          year={movie.year}
          posterUrl={movie.poster}
          className="w-full h-full"
        />

        {/* Match score badge - top right */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded ${scoreConfig.bg} text-[8px] md:text-[10px] font-bold text-white backdrop-blur`}>
            {scoreConfig.percent} {t("match.label")}
          </span>
        </div>

        {/* Hover overlay with match reason - hidden on mobile */}
        <div className="poster-overlay absolute inset-0 hidden md:flex flex-col justify-end p-4">
          <p className="text-xs text-[#ff6b35] font-bold mb-1">💡 {t("match.reason")}</p>
          <p className="text-[11px] text-gray-200 line-clamp-3 leading-relaxed">
            {movie.matchReason}
          </p>
        </div>
      </div>

      {/* Movie title */}
      <h3 className="font-bold text-sm md:text-lg group-hover:text-[#ff6b35] transition-colors line-clamp-1">
        {movie.title}
      </h3>

      {/* Year, genres, rating */}
      <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
        <span className="truncate">
          {movie.year} · {movie.genres.slice(0, 2).join(" / ")}
        </span>
        <div className="flex items-center gap-0.5 md:gap-1 text-yellow-500 shrink-0 ml-1">
          <Star size={10} className="md:w-3 md:h-3 fill-current" />
          <span className="font-bold">{movie.rating || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
