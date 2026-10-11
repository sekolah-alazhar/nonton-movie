import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiStar, FiHeart, FiShare2, FiArrowLeft, FiX, FiChevronRight, FiFilm } from 'react-icons/fi';
import { movieApi } from '../services/api';
import type { MovieDetail, VideoSource } from '../types';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import { SkeletonDetail, SkeletonVideoPlayer, SkeletonCast, SkeletonGrid } from '../components/Skeleton';

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoSource | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const detail = await movieApi.getSeriesDetail(id);
        if (detail) {
          setSeries(detail);
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
              <h2 className="font-display text-xl font-bold text-white mb-4">Series Serupa</h2>
              <SkeletonGrid count={6} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Header />
        <main className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-7xl text-center py-16">
            <FiPlay className="h-16 w-16 mx-auto text-dark-600 mb-4" />
            <h1 className="font-display text-3xl font-bold text-white mb-2">Series Tidak Ditemukan</h1>
            <p className="text-dark-400 mb-6">Series yang Anda cari tidak tersedia atau telah dihapus.</p>
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
            <Link to="/series" className="hover:text-white">Series</Link>
            <FiChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-white truncate max-w-[200px]">{series.title}</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Poster & Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                <img
                  src={series.poster}
                  alt={`${series.title} poster`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {series.backdrop && (
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
                    <dd className="text-white font-medium">{series.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Rating</dt>
                    <dd className="flex items-center gap-1 text-white font-medium">
                      <FiStar className="h-4 w-4 text-primary-500" />
                      {series.rating.toFixed(1)}/10
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Episode</dt>
                    <dd className="text-white font-medium">{series.episodes || 'N/A'} Episode</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Tipe</dt>
                    <dd className="text-white font-medium capitalize">{series.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-dark-400">Kualitas</dt>
                    <dd className="text-white font-medium">{series.quality}</dd>
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
                    {series.rating.toFixed(1)}
                  </span>
                  <span className="genre-badge bg-dark-800">{series.year}</span>
                  <span className="genre-badge bg-purple-500/20 text-purple-400">
                    <FiFilm className="h-3.5 w-3.5 mr-1" />
                    Series
                  </span>
                  {series.quality && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {series.quality}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                  {series.title}
                </h1>
                <p className="text-dark-300 text-base sm:text-lg line-clamp-3 max-w-3xl">
                  {series.description}
                </p>
                {series.genre.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2" aria-label="Genres">
                    {series.genre.map((g) => (
                      <span key={g} className="genre-badge">{g}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Season Selector */}
              {series.episodes && series.episodes > 1 && (
                <section aria-labelledby="season-title">
                  <h2 id="season-title" className="font-display text-xl font-bold text-white mb-4">Pilih Musim</h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(series.episodes / 10 + 1, 5) }, (_, i) => i + 1).map((season) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedSeason === season
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                        }`}
                      >
                        Season {season}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Player */}
              <section aria-labelledby="player-title">
                <h2 id="player-title" className="font-display text-xl font-bold text-white mb-4">Video Player</h2>
                <div className="video-container rounded-2xl overflow-hidden">
                  {activeVideo ? (
                    <iframe
                      src={activeVideo.url}
                      title={`${series.title} - ${activeVideo.server}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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

                {/* Video Sources */}
                {series.videos.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm text-dark-400 mb-2">Pilih Server:</p>
                    <div className="flex flex-wrap gap-2">
                      {series.videos.map((video, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveVideo(video)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            activeVideo === video
                              ? 'bg-primary-600 text-white'
                              : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                          }`}
                        >
                          {video.server} {video.quality}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Cast */}
              {series.cast.length > 0 && (
                <section aria-labelledby="cast-title">
                  <h2 id="cast-title" className="font-display text-xl font-bold text-white mb-4">Pemeran Utama</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {series.cast.slice(0, 12).map((actor) => (
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

              {/* Similar Series */}
              {series.similar.length > 0 && (
                <MovieGrid
                  movies={series.similar.slice(0, 10)}
                  title="Series Serupa"
                  priorityCount={3}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Trailer Modal */}
      {showTrailer && series.videos.length > 0 && (
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
              src={series.videos[0].url}
              title={`${series.title} Trailer`}
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