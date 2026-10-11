import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { movieApi } from '../services/api';
import type { Movie, Genre } from '../types';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { SkeletonGrid } from '../components/Skeleton';

export default function GenrePage() {
  const { id } = useParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentGenre, setCurrentGenre] = useState<Genre | null>(null);
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [sortBy, setSortBy] = useState<'popularity.desc' | 'vote_average.desc' | 'release_date.desc'>('popularity.desc');

  useEffect(() => {
    const fetchGenres = async () => {
      const genresRes = await movieApi.getGenres();
      const found = genresRes.find((g: Genre) => g.id === id);
      if (found) setCurrentGenre(found);
    };
    fetchGenres();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await movieApi.getByGenre(id, type, currentPage);
        setMovies(res.results);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to fetch genre movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [id, type, currentPage, sortBy]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Header />
        <main className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl font-bold text-white">Genre</h1>
            </div>
            <SkeletonGrid count={12} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                {currentGenre?.name || 'Genre'}
              </h1>
              <p className="text-dark-400 mt-1">
                {type === 'movie' ? 'Film' : 'Series'} bergenre {currentGenre?.name}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => { setType('movie'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    type === 'movie' ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  Film
                </button>
                <button
                  onClick={() => { setType('tv'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    type === 'tv' ? 'bg-purple-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  Series
                </button>
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                  className="input-search pl-10 w-48 appearance-none"
                  aria-label="Sort by"
                >
                  <option value="popularity.desc">Populer</option>
                  <option value="vote_average.desc">Rating Tertinggi</option>
                  <option value="release_date.desc">Terbaru</option>
                </select>
              </div>
            </div>
          </div>

          <MovieGrid
            movies={movies}
            emptyMessage={`Tidak ada ${type === 'movie' ? 'film' : 'series'} di genre ini`}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary px-4 py-2"
                aria-label="Halaman sebelumnya"
              >
                <FiChevronDown className="h-5 w-5 rotate-180" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      pageNum === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                    }`}
                    aria-label={`Halaman ${pageNum}`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary px-4 py-2"
                aria-label="Halaman selanjutnya"
              >
                <FiChevronDown className="h-5 w-5" />
              </button>
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}