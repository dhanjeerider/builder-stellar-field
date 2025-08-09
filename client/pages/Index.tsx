import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MovieSlider } from '@/components/MovieSlider';
import { CATEGORIES } from '@shared/mockData';

const browseCategories = ['Popular', 'Top', 'Upcoming', 'Genre', 'Year'];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState('Popular');

  const getFeaturedMovies = () => {
    switch (activeCategory) {
      case 'Popular':
        return CATEGORIES.popular;
      case 'Top':
        return CATEGORIES.top;
      case 'Upcoming':
        return CATEGORIES.upcoming;
      default:
        return CATEGORIES.popular;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Browse movies</h1>
          
          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter
              categories={browseCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          {/* Featured Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {getFeaturedMovies().map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="relative mb-3">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-muted"
                    loading="lazy"
                  />
                  
                  {/* Quality badge */}
                  <div className="absolute top-2 right-2">
                    <span className="quality-badge">{movie.quality}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{movie.year}</span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 rating-star fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <span className="genre-tag">{movie.type === 'movie' ? 'Movie' : 'TV Show'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Playing Movies */}
      <MovieSlider title="Now playing movies" movies={CATEGORIES.nowPlaying} />

      {/* Top Thriller */}
      <MovieSlider title="Top Thriller" movies={CATEGORIES.topThriller} />

      {/* Top Sci-Fi */}
      <MovieSlider title="Top Sci-Fi" movies={CATEGORIES.topSciFi} />

      {/* Top Kids */}
      <MovieSlider title="Top Kids" movies={CATEGORIES.topKids} />

      {/* Top Horror */}
      <MovieSlider title="Top Horror" movies={CATEGORIES.topHorror} />
    </div>
  );
}
