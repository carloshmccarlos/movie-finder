// MoviePoster component - Displays movie poster with fallback
// 电影海报组件 - 显示电影海报，支持回退和加载动画

import { useState, useEffect } from "react";
import { searchMoviePoster } from "../lib/tmdb";

interface MoviePosterProps {
  title: string;
  year?: number;
  posterUrl?: string;  // Pre-fetched poster URL from TMDB
  className?: string;
}

/**
 * MoviePoster component with three states:
 * 1. Loading - Shows animated skeleton
 * 2. Error/No poster - Shows gradient background with emoji
 * 3. Success - Shows actual poster image
 */
export function MoviePoster({ title, year, posterUrl, className = "" }: MoviePosterProps) {
  const [finalPosterUrl, setFinalPosterUrl] = useState<string | null>(posterUrl || null);
  const [loading, setLoading] = useState(!posterUrl);
  const [error, setError] = useState(false);

  // Fetch poster only if not provided
  useEffect(() => {
    // If posterUrl is provided, use it directly
    if (posterUrl) {
      setFinalPosterUrl(posterUrl);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPoster() {
      setLoading(true);
      setError(false);

      try {
        const url = await searchMoviePoster(title, year);
        if (!cancelled) {
          setFinalPosterUrl(url);
          if (!url) {
            setError(true);
          }
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPoster();

    return () => {
      cancelled = true;
    };
  }, [title, year, posterUrl]);

  // Handle image load error (broken URL)
  const handleImageError = () => {
    setError(true);
    setFinalPosterUrl(null);
  };

  // Base classes for poster container - maintains 2:3 aspect ratio
  const baseClasses = `aspect-[2/3] rounded-2xl overflow-hidden ${className}`;

  // Loading state - animated skeleton
  if (loading) {
    return (
      <div className={`${baseClasses} bg-[#252525] animate-pulse`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl opacity-30">🎬</span>
        </div>
      </div>
    );
  }

  // Error or no poster - gradient fallback with emoji
  if (error || !finalPosterUrl) {
    return (
      <div
        className={`${baseClasses} bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center`}
      >
        <span className="text-6xl">🎬</span>
      </div>
    );
  }

  // Success - actual poster image with lazy loading
  return (
    <div className={baseClasses}>
      <img
        src={finalPosterUrl}
        alt={title}
        loading="lazy"
        onError={handleImageError}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
