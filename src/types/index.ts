export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  year: number;
  rating: number;
  genre: string[];
  description: string;
  type: 'movie' | 'series';
  quality?: string;
  duration?: string;
  episodes?: number;
}

export interface MovieDetail extends Movie {
  videos: VideoSource[];
  cast: Cast[];
  similar: Movie[];
}

export interface VideoSource {
  server: string;
  url: string;
  quality: string;
}

export interface Cast {
  id: string;
  name: string;
  character: string;
  image: string;
}

export interface SearchResult {
  results: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface Genre {
  id: string;
  name: string;
}