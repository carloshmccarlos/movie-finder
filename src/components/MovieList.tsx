// MovieList component - Grid of movie cards
// 电影列表组件 - 电影卡片网格 (SSR-compatible)

import { useI18n } from "../lib/i18n-context";
import { MovieCard } from "./MovieCard";
import type { MovieResult } from "../lib/types";

interface MovieListProps {
  movies: MovieResult[];
}

export function MovieList({ movies }: MovieListProps) {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-4">
      {/* Results count */}
      <p className="text-[#a0a0a0] text-sm mb-4">
        {t("results.found", { count: movies.length })}
      </p>

      {/* Movie grid - responsive columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
