import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX, FiFilter, FiFilm, FiTv, FiChevronDown } from 'react-icons/fi';
import { movieApi } from '../services/api';
import type { Movie, Genre } from '../types';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { SkeletonGrid } from '../components/Skeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchGenres = async () => {
      const genresRes = await movieApi.getGenres();
      setGenres(genresRes);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await movieApi.search(query, currentPage);
        setResults(res.results);
        setTotalPages(res.totalPages);
        setTotalResults(res.totalResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, currentPage, selectedGenre]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <main className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Search Header */}
          <div className="mb-8">
            <form onSubmit={(e) => { e.preventDefault(); }} className="relative max-w-xl">
              <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" aria-hidden="true" />
              <input
                type="search"
                defaultValue={query}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) setSearchParams({ q: value });
                    else clearSearch();
                  }
                }}
                placeholder="Cari film, series, aktor..."
                className="input-search-sm w-full py-3 text-base pl-12 pr-14"
                autoFocus
                aria-label="Cari film atau series"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-dark-400 hover:text-white transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </form>
            {query && totalResults > 0 && (
              <p className="mt-4 text-dark-400 text-sm sm:text-base">
                Ditemukan <span className="text-white font-semibold">{totalResults.toLocaleString()}</span> hasil untuk <span className="text-white font-semibold">"{query}"</span>
              </p>
            )}
            {query && totalResults === 0 && (
              <p className="mt-4 text-dark-400 text-sm sm:text-base">
                Tidak ada hasil untuk <span className="text-white font-semibold">"{query}"</span>
              </p>
            )}
          </div>

          {/* Filters */}
          {query && genres.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-3" role="group" aria-label="Filter pencarian">
              <span className="text-sm text-dark-400">Filter:</span>
              <button
                onClick={() => { setSelectedGenre(''); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !selectedGenre ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => { setSelectedGenre('movie'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedGenre === 'movie' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                <FiFilm className="h-3.5 w-3.5" />
                Film
              </button>
              <button
                onClick={() => { setSelectedGenre('tv'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedGenre === 'tv' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                <FiTv className="h-3.5 w-3.5" />
                Series
              </button>
              <div className="relative ml-auto">
                <FiFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-500" />
                <select
                  value={selectedGenre}
                  onChange={(e) => { setSelectedGenre(e.target.value || ''); setCurrentPage(1); }}
                  className="input-search pl-10 w-48 appearance-none"
                  aria-label="Filter by genre"
                >
                  <option value="">Semua Genre</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <SkeletonGrid count={12} />
          ) : query ? (
            <>
              <MovieGrid
                movies={results}
                emptyMessage={`Tidak ada hasil untuk "${query}"`}
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
            </>
          ) : (
            <div className="text-center py-16">
              <FiSearch className="h-16 w-16 mx-auto text-dark-600 mb-4" />
              <h2 className="font-display text-2xl font-bold text-white mb-2">Mulai Pencarian</h2>
              <p className="text-dark-400">Ketik judul film, series, atau nama aktor di kotak pencarian di atas.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}