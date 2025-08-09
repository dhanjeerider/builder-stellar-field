import { Link } from 'react-router-dom';
import { GENRES } from '@shared/types';
import { MOCK_MOVIES } from '@shared/mockData';

export default function Genres() {
  // Count movies per genre
  const getGenreCount = (genreName: string) => {
    return MOCK_MOVIES.filter(movie => 
      movie.genres.includes(genreName)
    ).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Genres</h1>
        <p className="text-muted-foreground">Browse movies and TV shows by genre</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {GENRES.map((genre) => {
          const count = getGenreCount(genre.name);
          
          return (
            <Link
              key={genre.id}
              to={`/genre/${genre.slug}`}
              className="group block p-6 bg-card hover:bg-card/80 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
            >
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {genre.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {count} movie{count !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Popular Genres Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popular Genres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GENRES.slice(0, 6).map((genre) => {
            const genreMovies = MOCK_MOVIES.filter(movie => 
              movie.genres.includes(genre.name)
            ).slice(0, 3);
            
            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.slug}`}
                className="group block p-4 bg-card hover:bg-card/80 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {genre.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {getGenreCount(genre.name)} movies
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {genreMovies.map((movie) => (
                    <img
                      key={movie.id}
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 aspect-[2/3] object-cover rounded bg-muted"
                    />
                  ))}
                  {genreMovies.length < 3 && Array.from({ length: 3 - genreMovies.length }).map((_, index) => (
                    <div key={index} className="w-16 aspect-[2/3] bg-muted rounded" />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
