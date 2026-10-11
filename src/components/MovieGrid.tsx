import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  className?: string;
  emptyMessage?: string;
  priorityCount?: number;
}

export default function MovieGrid({
  movies,
  title,
  seeAllHref,
  seeAllLabel = 'Lihat Semua',
  className = '',
  emptyMessage = 'Tidak ada film ditemukan',
  priorityCount = 4,
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <section className={className} aria-labelledby={title ? 'section-title' : undefined}>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 id="section-title" className="font-display text-2xl font-bold text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="text-center py-12">
          <p className="text-dark-400">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={className} aria-labelledby={title ? 'section-title' : undefined}>
      {(title || seeAllHref) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 id="section-title" className="font-display text-2xl font-bold text-white">
              {title}
            </h2>
          )}
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="btn-ghost text-sm hidden sm:inline-flex"
              aria-label={seeAllLabel}
            >
              {seeAllLabel}
            </a>
          )}
        </div>
      )}

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        role="list"
        aria-label={title || 'Daftar film'}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            priority={index < priorityCount}
          />
        ))}
      </div>

      {seeAllHref && (
        <div className="mt-6 text-center sm:hidden">
          <a href={seeAllHref} className="btn-secondary w-full sm:w-auto">
            {seeAllLabel}
          </a>
        </div>
      )}
    </section>
  );
}