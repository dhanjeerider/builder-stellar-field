import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Film, Tv } from 'lucide-react';
import { tmdbService, TMDBGenre, TMDBMovie, getImageUrl } from '@shared/tmdb';
import { cn } from '@/lib/utils';

export default function Genres() {
  const [movieGenres, setMovieGenres] = useState<TMDBGenre[]>([]);
  const [tvGenres, setTVGenres] = useState<TMDBGenre[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: number]: TMDBMovie[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        
        // Fetch genres
        const [movieGenresRes, tvGenresRes] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTVGenres(),
        ]);

        setMovieGenres(movieGenresRes.genres);
        setTVGenres(tvGenresRes.genres);

        // Fetch sample movies for each genre (first 6 genres)
        const sampleMovies: { [key: number]: TMDBMovie[] } = {};
        for (const genre of movieGenresRes.genres.slice(0, 6)) {
          try {
            const moviesRes = await tmdbService.getMoviesByGenre(genre.id);
            sampleMovies[genre.id] = moviesRes.results.slice(0, 3);
          } catch (error) {
            console.error(`Error fetching movies for genre ${genre.name}:`, error);
            sampleMovies[genre.id] = [];
          }
        }
        
        setGenreMovies(sampleMovies);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-48 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-64" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="p-6 bg-muted animate-pulse rounded-xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Combine and deduplicate genres
  const allGenres = [...movieGenres];
  const uniqueGenres = allGenres.filter((genre, index, arr) => 
    arr.findIndex(g => g.id === genre.id) === index
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse by Genre</h1>
        <p className="text-muted-foreground">Discover movies and TV shows by your favorite genres</p>
      </div>

      {/* All Genres Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <span>All Genres</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uniqueGenres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.id}`}
              className="genre-card group p-6 text-center min-h-[100px] flex items-center justify-center"
            >
              <div>
                <div className="w-8 h-8 mx-auto mb-2 neu-card flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Film className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {genre.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Genres with Movie Previews */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <span>Popular Genres</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {movieGenres.slice(0, 6).map((genre) => {
            const movies = genreMovies[genre.id] || [];
            
            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="genre-card group p-6 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 neu-card flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Film className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {movies.length > 0 ? `${movies.length}+ movies` : 'Browse movies'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex space-x-2">
                  {movies.slice(0, 3).map((movie) => (
                    <div key={movie.id} className="flex-1">
                      <img
                        src={getImageUrl(movie.poster_path, 'w185')}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover rounded-lg bg-muted group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                  {movies.length < 3 && Array.from({ length: 3 - movies.length }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="flex-1">
                      <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
                        <Film className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* TV Shows Genres */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Tv className="w-5 h-5" />
          <span>TV Show Genres</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tvGenres.slice(0, 12).map((genre) => (
            <Link
              key={`tv-${genre.id}`}
              to={`/genre/${genre.id}?type=tv`}
              className="genre-card group p-6 text-center min-h-[100px] flex items-center justify-center"
            >
              <div>
                <div className="w-8 h-8 mx-auto mb-2 neu-card flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Tv className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {genre.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
