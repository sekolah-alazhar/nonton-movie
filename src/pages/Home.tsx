import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiArrowRight, FiStar } from 'react-icons/fi';
import { movieApi } from '../services/api';
import type { Movie, Genre } from '../types';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { SkeletonHero, SkeletonGrid } from '../components/Skeleton';

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularSeries, setPopularSeries] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, moviesRes, seriesRes, topRatedRes, genresRes] = await Promise.all([
          movieApi.getTrending('week'),
          movieApi.getPopularMovies(1),
          movieApi.getPopularSeries(1),
          movieApi.getTopRated('movie', 1),
          movieApi.getGenres(),
        ]);

        setTrending(trendingRes);
        setPopularMovies(moviesRes.results);
        setPopularSeries(seriesRes.results);
        setTopRated(topRatedRes.results);
        setGenres(genresRes);

        // Set hero movie from trending
        if (trendingRes.length > 0) {
          setHeroMovie(trendingRes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-rotate hero
    const interval = setInterval(() => {
      if (trending.length > 1) {
        setHeroIndex((prev) => (prev + 1) % trending.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [trending.length]);

  // Update hero when trending changes
  useEffect(() => {
    if (trending.length > 0 && !heroMovie) {
      setHeroMovie(trending[heroIndex]);
    } else if (trending.length > 0) {
      setHeroMovie(trending[heroIndex]);
    }
  }, [trending, heroIndex, heroMovie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Header />
        <main className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-7xl space-y-12">
            <SkeletonHero />
            <div className="space-y-8">
              <SkeletonGrid count={6} />
              <SkeletonGrid count={6} />
              <SkeletonGrid count={6} />
              <SkeletonGrid count={6} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-7xl space-y-14">
          {/* Hero Section */}
          <section aria-labelledby="hero-title" className="relative">
            {heroMovie && (
              <>
                {/* Backdrop */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  {heroMovie.backdrop && (
                    <img
                      src={heroMovie.backdrop}
                      alt={`${heroMovie.title} backdrop`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-900/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
                    <div className="max-w-3xl animate-slide-up">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="rating-badge">
                          <FiStar className="h-3.5 w-3.5" aria-hidden="true" />
                          {heroMovie.rating.toFixed(1)}
                        </span>
                        <span className="genre-badge bg-dark-800">{heroMovie.year}</span>
                        <span className={`genre-badge ${
                          heroMovie.type === 'series' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {heroMovie.type === 'series' ? 'Series' : 'Film'}
                        </span>
                        {heroMovie.genre.slice(0, 3).map((g) => (
                          <span key={g} className="genre-badge">{g}</span>
                        ))}
                      </div>
                      <h1 id="hero-title" className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 line-clamp-2">
                        {heroMovie.title}
                      </h1>
                      <p className="text-dark-300 text-lg sm:text-xl mb-6 line-clamp-3 max-w-2xl">
                        {heroMovie.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          to={heroMovie.type === 'series' ? `/series/${heroMovie.id}` : `/movie/${heroMovie.id}`}
                          className="btn-primary group"
                        >
                          <FiPlay className="h-5 w-5 mr-2" aria-hidden="true" />
                          Tonton Sekarang
                          <FiArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                        <Link
                          to={heroMovie.type === 'series' ? `/series/${heroMovie.id}` : `/movie/${heroMovie.id}`}
                          className="btn-secondary"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Hero Indicators */}
                  {trending.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {trending.slice(0, 5).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setHeroIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === heroIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                          aria-current={index === heroIndex ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>

          {/* Trending */}
          <MovieGrid
            movies={trending.slice(0, 12)}
            title="Trending Minggu Ini"
            seeAllHref="/trending"
            priorityCount={4}
          />

          {/* Popular Movies */}
          <MovieGrid
            movies={popularMovies.slice(0, 12)}
            title="Film Populer"
            seeAllHref="/movies"
            priorityCount={4}
          />

          {/* Popular Series */}
          <MovieGrid
            movies={popularSeries.slice(0, 12)}
            title="Series Populer"
            seeAllHref="/series"
            priorityCount={4}
          />

          {/* Top Rated */}
          <MovieGrid
            movies={topRated.slice(0, 12)}
            title="Rating Tertinggi"
            seeAllHref="/top-rated"
            priorityCount={4}
          />

          {/* Genres */}
          {genres.length > 0 && (
            <section aria-labelledby="genres-title" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 id="genres-title" className="font-display text-2xl font-bold text-white">
                  Jelajahi Genre
                </h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {genres.slice(0, 16).map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}`}
                    className="genre-badge hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/50 border border-transparent transition-all"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}