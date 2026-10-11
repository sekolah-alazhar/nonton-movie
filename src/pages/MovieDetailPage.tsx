import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiStar, FiHeart, FiShare2, FiArrowLeft, FiX, FiChevronRight } from 'react-icons/fi';
import { movieApi } from '../services/api';
import type { MovieDetail, VideoSource } from '../types';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { SkeletonDetail, SkeletonVideoPlayer, SkeletonCast, SkeletonGrid } from '../components/Skeleton';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoSource | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const detail = await movieApi.getMovieDetail(id);
        if (detail) {
          setMovie(detail);
          // Set first video as active
          if (detail.videos.length > 0) {
            setActiveVideo(detail.videos[0]);
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Header />
        <main className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-7xl">
            <SkeletonDetail />
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-white mb-4">Video Player</h2>
              <SkeletonVideoPlayer />
            </div>
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-white mb-4">Cast</h2>
              <SkeletonCast />
            </div>
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-white mb-4">Film Serupa</h2>
              <SkeletonGrid count={6} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Header />
        <main className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-7xl text-center py-16">
            <FiPlay className="h-16 w-16 mx-auto text-dark-600 mb-4" />
            <h1 className="font-display text-3xl font-bold text-white mb-2">Film Tidak Ditemukan</h1>
            <p className="text-dark-400 mb-6">Film yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link to="/" className="btn-primary inline-flex">
              <FiArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <main className="pt-16 pb-12 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-dark-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <FiChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link to="/movies" className="hover:text-white">Film</Link>
            <FiChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-white truncate max-w-[200px]">{movie.title}</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Poster & Video */}
            <div className="lg:col-span-1 space-y-6">
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {movie.backdrop && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="absolute bottom-4 left-4 right-4 btn-primary w-auto mx-4"
                  >
                    <FiPlay className="h-5 w-5 mr-2" />
                    Putar Trailer
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button className="btn-primary flex-1">
                  <FiPlay className="h-5 w-5 mr-2" />
                  Tonton
                </button>
                <button className="btn-secondary px-6">
                  <FiHeart className="h-5 w-5" />
                </button>
                <button className="btn-secondary px-6">
                  <FiShare2 className="h-5 w-5" />
                </button>
              </div>

              {/* Info Card */}
              <div className="glass-dark p-6 rounded-2xl">
                <h3 className="font-display text-lg font-bold text-white mb-4">Informasi</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Tahun</dt>
                    <dd className="text-white font-medium">{movie.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Rating</dt>
                    <dd className="flex items-center gap-1 text-white font-medium">
                      <FiStar className="h-4 w-4 text-primary-500" />
                      {movie.rating.toFixed(1)}/10
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Durasi</dt>
                    <dd className="text-white font-medium">
                      {movie.duration ? `${parseInt(movie.duration)} menit` : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Tipe</dt>
                    <dd className="text-white font-medium capitalize">{movie.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Kualitas</dt>
                    <dd className="text-white font-medium">{movie.quality}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Title & Meta */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="rating-badge">
                    <FiStar className="h-3.5 w-3.5" />
                    {movie.rating.toFixed(1)}
                  </span>
                  <span className="genre-badge bg-dark-800">{movie.year}</span>
                  <span className={`genre-badge ${
                    movie.type === 'series' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {movie.type === 'series' ? 'Series' : 'Film'}
                  </span>
                  {movie.quality && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {movie.quality}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <p className="text-dark-300 text-base sm:text-lg line-clamp-3 max-w-3xl">
                  {movie.description}
                </p>
                {movie.genre.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2" aria-label="Genres">
                    {movie.genre.map((g) => (
                      <span key={g} className="genre-badge">{g}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Player */}
              <section aria-labelledby="player-title">
                <div className="flex items-center gap-2 mb-4">
                  <h2 id="player-title" className="font-display text-xl font-bold text-white">Video Player</h2>
                  {activeVideo && ['VidSrc','2Embed','VidLink'].includes(activeVideo.server) && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">FILM FULL</span>
                  )}
                  {activeVideo && activeVideo.server === 'YouTube' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">TRAILER</span>
                  )}
                </div>
                <div className="video-container rounded-2xl overflow-hidden">
                  {activeVideo ? (
                    <iframe
                      key={activeVideo.url}
                      src={activeVideo.url}
                      title={`${movie.title} - ${activeVideo.server}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-900">
                      <div className="text-center p-8">
                        <FiPlay className="h-16 w-16 mx-auto text-dark-600 mb-4" />
                        <p className="text-dark-400">Tidak ada video tersedia</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Sources — grouped: Film & Trailer */}
                {movie.videos.length > 1 && (() => {
                  const filmServers = movie.videos.filter(v => ['VidSrc','2Embed','VidLink'].includes(v.server));
                  const trailerServers = movie.videos.filter(v => !['VidSrc','2Embed','VidLink'].includes(v.server));
                  return (
                    <div className="mt-4 space-y-3">
                      {filmServers.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-green-400 mb-2">🎬 Film Full — pilih server:</p>
                          <div className="flex flex-wrap gap-2">
                            {filmServers.map((video, idx) => (
                              <button key={'film-'+idx} onClick={() => setActiveVideo(video)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeVideo === video ? 'bg-green-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'}`}>
                                {video.server} {video.quality}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {trailerServers.length > 0 && (
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Trailer / Teaser:</p>
                          <div className="flex flex-wrap gap-2">
                            {trailerServers.map((video, idx) => (
                              <button key={'trl-'+idx} onClick={() => setActiveVideo(video)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeVideo === video ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'}`}>
                                {video.server} {video.quality}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </section>

              {/* Cast */}
              {movie.cast.length > 0 && (
                <section aria-labelledby="cast-title">
                  <h2 id="cast-title" className="font-display text-xl font-bold text-white mb-4">Pemeran Utama</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {movie.cast.slice(0, 12).map((actor) => (
                      <Link
                        key={actor.id}
                        to="/"
                        className="group space-y-2"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden">
                          <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="font-medium text-white line-clamp-1">{actor.name}</p>
                        <p className="text-sm text-dark-400 line-clamp-1">{actor.character}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Similar Movies */}
              {movie.similar.length > 0 && (
                <MovieGrid
                  movies={movie.similar.slice(0, 10)}
                  title="Film Serupa"
                  priorityCount={3}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Trailer Modal */}
      {showTrailer && movie.videos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowTrailer(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trailer-title"
        >
          <div className="relative w-full max-w-4xl mx-4 aspect-video">
            <button
              onClick={(e) => { e.stopPropagation(); setShowTrailer(false); }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark-800/50 text-white hover:bg-dark-700 transition-colors"
              aria-label="Tutup trailer"
            >
              <FiX className="h-6 w-6" />
            </button>
            <iframe
              src={movie.videos[0].url}
              title={`${movie.title} Trailer`}
              className="w-full h-full rounded-xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}