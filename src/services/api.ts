import axios from 'axios';
import type { Movie, MovieDetail, SearchResult, Genre, VideoSource } from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

// Create axios instance
const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'id-ID',
    region: 'ID',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Transform TMDB movie to our Movie type
const transformMovie = (movie: any): Movie => ({
  id: movie.id.toString(),
  title: movie.title || movie.name || 'Unknown',
  poster: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : '/placeholder-poster.svg',
  backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}` : undefined,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 
        movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : new Date().getFullYear(),
  rating: movie.vote_average || 0,
  genre: movie.genre_ids ? [] : [], // Will be populated separately
  description: movie.overview || 'No description available.',
  type: movie.media_type === 'tv' || movie.first_air_date ? 'series' : 'movie',
  quality: 'HD',
});

export const YEAR_OPTIONS: number[] = (() => {
  const cur = new Date().getFullYear();
  const arr: number[] = [];
  for (let y = cur; y >= 1990; y--) arr.push(y);
  return arr;
})();

// Get genre names from IDs
const getGenreNames = (genreIds: number[], genres: Genre[]): string[] => {
  return genreIds.map(id => genres.find(g => g.id === id.toString())?.name || '').filter(Boolean);
};

// Sort YouTube videos: keep only YouTube entries, official first,
// type priority Trailer > Teaser > Featurette > Clip > Behind the Scenes > others.
const sortYouTubeVideos = (videos: any[]): any[] => {
  const order = ['Trailer', 'Teaser', 'Featurette', 'Clip', 'Behind the Scenes'];
  return (videos || [])
    .filter((v: any) => v && v.site === 'YouTube' && v.key)
    .sort((a: any, b: any) => {
      const ai = order.indexOf(a.type);
      const bi = order.indexOf(b.type);
      const ao = ai === -1 ? order.length : ai;
      const bo = bi === -1 ? order.length : bi;
      if (ao !== bo) return ao - bo;
      // official first
      const aOff = a.official === false ? 1 : 0;
      const bOff = b.official === false ? 1 : 0;
      return aOff - bOff;
    });
};

// API Functions
export const movieApi = {
  // Get genres
  async getGenres(): Promise<Genre[]> {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        api.get('/genre/movie/list'),
        api.get('/genre/tv/list'),
      ]);
      const allGenres = [...movieGenres.data.genres, ...tvGenres.data.genres];
      const uniqueGenres = allGenres.filter((genre: any, index: number, self: any[]) => 
        index === self.findIndex((g: any) => g.id === genre.id)
      );
      return uniqueGenres.map((g: any) => ({ id: g.id.toString(), name: g.name }));
    } catch {
      // Fallback genres
      return [
        { id: '28', name: 'Action' },
        { id: '12', name: 'Adventure' },
        { id: '16', name: 'Animation' },
        { id: '35', name: 'Comedy' },
        { id: '80', name: 'Crime' },
        { id: '99', name: 'Documentary' },
        { id: '18', name: 'Drama' },
        { id: '10751', name: 'Family' },
        { id: '14', name: 'Fantasy' },
        { id: '36', name: 'History' },
        { id: '27', name: 'Horror' },
        { id: '10402', name: 'Music' },
        { id: '9648', name: 'Mystery' },
        { id: '10749', name: 'Romance' },
        { id: '878', name: 'Science Fiction' },
        { id: '10770', name: 'TV Movie' },
        { id: '53', name: 'Thriller' },
        { id: '10752', name: 'War' },
        { id: '37', name: 'Western' },
      ];
    }
  },

  // Get trending
  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get(`/trending/all/${timeWindow}`),
      ]);
      return response.data.results
        .filter((m: any) => m.poster_path)
        .slice(0, 20)
        .map((m: any) => ({
          ...transformMovie(m),
          genre: getGenreNames(m.genre_ids || [], genres),
        }));
    } catch {
      return [];
    }
  },

  // Get popular movies
  async getPopularMovies(page = 1): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get('/movie/popular', { params: { page } }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Get popular TV series
  async getPopularSeries(page = 1): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get('/tv/popular', { params: { page } }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Get discover (with sorting and genre filter)
  async getDiscover(
    type: 'movie' | 'tv',
    page = 1,
    sortBy: string = 'popularity.desc',
    genre: string = '',
    year: string = ''
  ): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get(`/discover/${type}`, {
          params: {
            page,
            sort_by: sortBy,
            with_genres: genre || undefined,
            ...(year
              ? type === 'movie'
                ? { primary_release_year: year }
                : { first_air_date_year: year }
              : {}),
          },
        }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Get top rated
  async getTopRated(type: 'movie' | 'tv' = 'movie', page = 1): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get(`/${type}/top_rated`, { params: { page } }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Get by genre
  async getByGenre(genreId: string, type: 'movie' | 'tv' = 'movie', page = 1): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get(`/discover/${type}`, { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Search
  async search(query: string, page = 1): Promise<SearchResult> {
    try {
      const [genres, response] = await Promise.all([
        this.getGenres(),
        api.get('/search/multi', { params: { query, page, include_adult: false } }),
      ]);
      return {
        results: response.data.results
          .filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv'))
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch {
      return { results: [], page: 1, totalPages: 1, totalResults: 0 };
    }
  },

  // Get movie detail
  async getMovieDetail(id: string): Promise<MovieDetail | null> {
    try {
      const [genres, movieRes, videosRes, creditsRes, similarRes] = await Promise.all([
        this.getGenres(),
        api.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits,similar' } }),
        // NOTE: /videos with language=id-ID is almost always empty on TMDB.
        // Use en-US for videos so trailers actually exist.
        api.get(`/movie/${id}/videos`, { params: { language: 'en-US' } }),
        api.get(`/movie/${id}/credits`),
        api.get(`/movie/${id}/similar`),
      ]);

      const movie = movieRes.data;
      const videoSources = sortYouTubeVideos(videosRes.data.results).map((v: any) => ({
        server: v.type || 'YouTube',
        url: `https://www.youtube.com/embed/${v.key}`,
        quality: 'HD',
      }));

      return {
        ...transformMovie(movie),
        genre: getGenreNames(movie.genre_ids || [], genres),
        videos: videoSources,
        cast: creditsRes.data.cast.slice(0, 10).map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          character: c.character,
          image: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : '/placeholder-avatar.svg',
        })),
        similar: similarRes.data.results
          .filter((m: any) => m.poster_path)
          .slice(0, 10)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
      };
    } catch {
      return null;
    }
  },

  // Get TV series detail
  async getSeriesDetail(id: string): Promise<MovieDetail | null> {
    try {
      const [genres, seriesRes, videosRes, creditsRes, similarRes] = await Promise.all([
        this.getGenres(),
        api.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits,similar' } }),
        // NOTE: /videos with language=id-ID is almost always empty on TMDB.
        // Use en-US for videos so trailers actually exist.
        api.get(`/tv/${id}/videos`, { params: { language: 'en-US' } }),
        api.get(`/tv/${id}/credits`),
        api.get(`/tv/${id}/similar`),
      ]);

      const series = seriesRes.data;
      const videoSources = sortYouTubeVideos(videosRes.data.results).map((v: any) => ({
        server: v.type || 'YouTube',
        url: `https://www.youtube.com/embed/${v.key}`,
        quality: 'HD',
      }));

      return {
        ...transformMovie(series),
        genre: getGenreNames(series.genre_ids || [], genres),
        videos: videoSources,
        cast: creditsRes.data.cast.slice(0, 10).map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          character: c.character,
          image: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : '/placeholder-avatar.svg',
        })),
        similar: similarRes.data.results
          .filter((m: any) => m.poster_path)
          .slice(0, 10)
          .map((m: any) => ({
            ...transformMovie(m),
            genre: getGenreNames(m.genre_ids || [], genres),
          })),
      };
    } catch {
      return null;
    }
  },

  // Get streaming links (using a free streaming API or embed)
  async getStreamingLinks(id: string, type: 'movie' | 'tv'): Promise<VideoSource[]> {
    // This would typically integrate with a streaming provider
    // For now, return YouTube trailers as placeholder
    try {
      const response = await api.get(`/${type}/${id}/videos`, { params: { language: 'en-US' } });
      return sortYouTubeVideos(response.data.results)
        .map((v: any) => ({
          server: v.type || 'YouTube',
          url: `https://www.youtube.com/embed/${v.key}`,
          quality: 'HD',
        }));
    } catch {
      return [];
    }
  },
};

export default api;