// MovieList component - Modern grid of movie cards
// 电影列表组件 - 现代电影卡片网格

import { useI18n } from "../lib/i18n-context";
import { MovieCard } from "./MovieCard";
import type { MovieResult } from "../lib/types";

interface MovieListProps {
  movies: MovieResult[];
}

export function MovieList({ movies }: MovieListProps) {
  const { t } = useI18n();

  return (
    <div>
      {/* Results header */}
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">
          {t("results.title")}
          <span className="text-gray-600 font-light ml-2">
            ({t("results.count", { count: movies.length })})
          </span>
        </h2>
      </div>

      {/* Movie grid - responsive columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
