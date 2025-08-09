export interface Movie {
  id: string;
  tmdb_id: string;
  imdb_id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  backdrop: string;
  synopsis: string;
  runtime: number;
  genres: string[];
  cast: Cast[];
  trailers: Trailer[];
  type: "movie";
  quality: "HD" | "4K" | "CAM";
}

export interface TVShow {
  id: string;
  tmdb_id: string;
  imdb_id: string;
  title: string;
  year: number;
  rating: number;
  poster: string;
  backdrop: string;
  synopsis: string;
  genres: string[];
  cast: Cast[];
  trailers: Trailer[];
  seasons: Season[];
  type: "tv";
  quality: "HD" | "4K" | "CAM";
}

export interface Season {
  season_number: number;
  episode_count: number;
  episodes: Episode[];
}

export interface Episode {
  episode_number: number;
  title: string;
  synopsis: string;
  runtime: number;
}

export interface Cast {
  name: string;
  character: string;
  profile_image: string;
}

export interface Trailer {
  title: string;
  youtube_id: string;
  type: "trailer" | "teaser" | "clip";
}

export interface Server {
  name: string;
  type: "imdb" | "tmdb";
  url: string;
  url_tv: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export type MediaType = Movie | TVShow;

export const GENRES: Genre[] = [
  { id: "1", name: "Action", slug: "action" },
  { id: "2", name: "Adventure", slug: "adventure" },
  { id: "3", name: "Animation", slug: "animation" },
  { id: "4", name: "Comedy", slug: "comedy" },
  { id: "5", name: "Crime", slug: "crime" },
  { id: "6", name: "Drama", slug: "drama" },
  { id: "7", name: "Fantasy", slug: "fantasy" },
  { id: "8", name: "Horror", slug: "horror" },
  { id: "9", name: "Romance", slug: "romance" },
  { id: "10", name: "Sci-Fi", slug: "sci-fi" },
  { id: "11", name: "Thriller", slug: "thriller" },
  { id: "12", name: "War", slug: "war" },
];

export const SERVERS: Server[] = [
  {
    name: "change server if not playing",
    type: "imdb",
    url: "https://vidsrc.vip/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.vip/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "All in one 🔥with download + 4k size",
    type: "tmdb",
    url: "https://iframe.pstream.mov/media/tmdb-movie-{tmdb_id}",
    url_tv:
      "https://iframe.pstream.mov/media/tmdb-tv-{tmdb_id}-{season}-{episode}",
  },
  {
    name: "2",
    type: "imdb",
    url: "https://vidsrc.to/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.to/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "3",
    type: "imdb",
    url: "https://vidsrc.icu/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.icu/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "4",
    type: "imdb",
    url: "https://vidsrc.cc/v2/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.cc/v2/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "5",
    type: "imdb",
    url: "https://embed.su/embed/movie/{imdb_id}",
    url_tv: "https://embed.su/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "6",
    type: "imdb",
    url: "https://vidsrc.me/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.me/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "7 fast",
    type: "imdb",
    url: "https://autoembed.pro/embed/movie/{imdb_id}",
    url_tv: "https://autoembed.pro/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "vid fast 8",
    type: "imdb",
    url: "https://vidfast.pro/movie/{imdb_id}",
    url_tv: "https://vidfast.pro/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "low ads 9",
    type: "imdb",
    url: "https://player.autoembed.cc/embed/movie/{imdb_id}",
    url_tv: "https://player.autoembed.cc/embed/tv/{imdb_id}/{season}/{episode}",
  },
  {
    name: "Hd better 10",
    type: "imdb",
    url: "https://hyhd.org/embed/{imdb_id}",
    url_tv: "https://hyhd.org/embed/tv/{imdb_id}/{season}",
  },
];
