const TMDB_API_KEY = '7bffed716d50c95ed1c4790cfab4866a';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  runtime?: number;
  genres?: TMDBGenre[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: TMDBSeason[];
  genres?: TMDBGenre[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface TMDBEpisode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  runtime: number;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBCreditsResponse {
  id: number;
  cast: TMDBCast[];
  crew: any[];
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

class TMDBService {
  private async fetchFromTMDB<T>(endpoint: string, extraParams?: Record<string, string>): Promise<T> {
    let url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value) {
          url += `&${key}=${encodeURIComponent(value)}`;
        }
      });
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  // Movies
  async getPopularMovies(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/movie/popular?page=${page}`);
  }

  async getTopRatedMovies(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/movie/top_rated?page=${page}`);
  }

  async getUpcomingMovies(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/movie/upcoming?page=${page}`);
  }

  async getNowPlayingMovies(page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/movie/now_playing?page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<TMDBCreditsResponse> {
    return this.fetchFromTMDB(`/movie/${movieId}/credits`);
  }

  async getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
    return this.fetchFromTMDB(`/movie/${movieId}/videos`);
  }

  async getSimilarMovies(movieId: number): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/movie/${movieId}/similar`);
  }

  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  }

  // TV Shows
  async getPopularTVShows(page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/tv/popular?page=${page}`);
  }

  async getTopRatedTVShows(page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/tv/top_rated?page=${page}`);
  }

  async getAiringTodayTVShows(page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/tv/airing_today?page=${page}`);
  }

  async getOnTheAirTVShows(page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/tv/on_the_air?page=${page}`);
  }

  async getTVShowDetails(tvId: number): Promise<TMDBTVShow> {
    return this.fetchFromTMDB(`/tv/${tvId}`);
  }

  async getTVShowCredits(tvId: number): Promise<TMDBCreditsResponse> {
    return this.fetchFromTMDB(`/tv/${tvId}/credits`);
  }

  async getTVShowVideos(tvId: number): Promise<TMDBVideosResponse> {
    return this.fetchFromTMDB(`/tv/${tvId}/videos`);
  }

  async getSimilarTVShows(tvId: number): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/tv/${tvId}/similar`);
  }

  async getTVShowsByGenre(genreId: number, page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  }

  async getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeason> {
    return this.fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  }

  // Genres
  async getMovieGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB('/genre/tv/list');
  }

  // Search
  async searchMovies(query: string, page = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchTVShows(query: string, page = 1): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async searchMulti(query: string, page = 1): Promise<TMDBSearchResponse<TMDBMovie | TMDBTVShow>> {
    return this.fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Trending
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse<TMDBMovie>> {
    return this.fetchFromTMDB(`/trending/movie/${timeWindow}`);
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse<TMDBTVShow>> {
    return this.fetchFromTMDB(`/trending/tv/${timeWindow}`);
  }

  async getTrendingAll(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse<TMDBMovie | TMDBTVShow>> {
    return this.fetchFromTMDB(`/trending/all/${timeWindow}`);
  }
}

// Image URL helpers
export const getImageUrl = (path: string | null, size: 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Convert TMDB data to our app format
export const convertTMDBMovieToAppFormat = (tmdbMovie: TMDBMovie): any => {
  return {
    id: tmdbMovie.id.toString(),
    tmdb_id: tmdbMovie.id.toString(),
    imdb_id: '', // Will need to fetch separately if needed
    title: tmdbMovie.title,
    year: new Date(tmdbMovie.release_date).getFullYear(),
    rating: tmdbMovie.vote_average,
    poster: getImageUrl(tmdbMovie.poster_path),
    backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
    synopsis: tmdbMovie.overview,
    runtime: tmdbMovie.runtime || 0,
    genres: tmdbMovie.genres?.map(g => g.name) || [],
    cast: [],
    trailers: [],
    type: 'movie' as const,
    quality: 'HD' as const,
  };
};

export const convertTMDBTVShowToAppFormat = (tmdbShow: TMDBTVShow): any => {
  return {
    id: tmdbShow.id.toString(),
    tmdb_id: tmdbShow.id.toString(),
    imdb_id: '', // Will need to fetch separately if needed
    title: tmdbShow.name,
    year: new Date(tmdbShow.first_air_date).getFullYear(),
    rating: tmdbShow.vote_average,
    poster: getImageUrl(tmdbShow.poster_path),
    backdrop: getBackdropUrl(tmdbShow.backdrop_path),
    synopsis: tmdbShow.overview,
    genres: tmdbShow.genres?.map(g => g.name) || [],
    cast: [],
    trailers: [],
    seasons: tmdbShow.seasons || [],
    type: 'tv' as const,
    quality: 'HD' as const,
  };
};

export const tmdbService = new TMDBService();
