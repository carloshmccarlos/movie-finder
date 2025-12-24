// MovieList component - Grid of movie cards
// 电影列表组件 - 电影卡片网格

import { MovieCard } from "./MovieCard";
import type { MovieResult } from "../lib/types";

interface MovieListProps {
  movies: MovieResult[];
}

export function MovieList({ movies }: MovieListProps) {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-4">
      {/* Results count */}
      <p className="text-[#a0a0a0] text-sm mb-4">
        找到 {movies.length} 部相关电影
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
