import { Link } from 'react-router-dom';
import { FiPlay, FiStar, FiClock, FiTv, FiFilm, FiHeart } from 'react-icons/fi';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  className?: string;
}

export default function MovieCard({ movie, priority = false, className = '' }: MovieCardProps) {
  const formatYear = (year: number) => year.toString();

  return (
    <article className={`movie-card group ${className}`}>
      <Link
        to={movie.type === 'series' ? `/series/${movie.id}` : `/movie/${movie.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 rounded-xl"
        aria-label={`Lihat detail ${movie.title} (${formatYear(movie.year)})`}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="w-full flex items-center justify-between gap-2">
              <button className="btn-primary group-hover:scale-105 transition-transform">
                <FiPlay className="h-4 w-4 mr-2" aria-hidden="true" />
                Tonton
              </button>
              <button className="btn-secondary px-4">
                <FiHeart className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="rating-badge">
              <FiStar className="h-3.5 w-3.5" aria-hidden="true" />
              {movie.rating.toFixed(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              movie.type === 'series' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {movie.type === 'series' ? <FiTv className="h-3 w-3" /> : <FiFilm className="h-3 w-3" />}
            </span>
            {movie.quality && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                {movie.quality}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-white line-clamp-1 mb-1 group-hover:text-primary-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-dark-400">
            <span className="flex items-center gap-1">
              <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatYear(movie.year)}
            </span>
            {movie.duration && (
              <span className="flex items-center gap-1">
                <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
                {movie.duration}
              </span>
            )}
          </div>
          
          {/* Genres */}
          {movie.genre.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Genres">
              {movie.genre.slice(0, 3).map((g) => (
                <span key={g} className="genre-badge">{g}</span>
              ))}
              {movie.genre.length > 3 && (
                <span className="genre-badge text-dark-500">+{movie.genre.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}