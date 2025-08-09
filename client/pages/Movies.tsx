import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MovieCard } from '@/components/MovieCard';
import { MOCK_MOVIES } from '@shared/mockData';

const movieCategories = ['Popular', 'Top Rated', 'Upcoming', 'Now Playing', 'Latest'];

export default function Movies() {
  const [activeCategory, setActiveCategory] = useState('Popular');

  const getMoviesByCategory = () => {
    const movies = [...MOCK_MOVIES];
    
    switch (activeCategory) {
      case 'Popular':
        return movies.sort((a, b) => b.rating - a.rating);
      case 'Top Rated':
        return movies.filter(m => m.rating >= 6.0).sort((a, b) => b.rating - a.rating);
      case 'Upcoming':
        return movies.filter(m => m.year >= 2025).sort((a, b) => b.year - a.year);
      case 'Now Playing':
        return movies.slice(0, 12);
      case 'Latest':
        return movies.sort((a, b) => b.year - a.year);
      default:
        return movies;
    }
  };

  const filteredMovies = getMoviesByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies</h1>
        <p className="text-muted-foreground">
          Discover the latest and greatest movies
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={movieCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Load More Movies
        </button>
      </div>
    </div>
  );
}
