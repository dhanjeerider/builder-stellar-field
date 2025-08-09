import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MovieCard } from '@/components/MovieCard';
import { MOCK_TV_SHOWS } from '@shared/mockData';

const tvCategories = ['Popular', 'Top Rated', 'Airing Today', 'On The Air', 'Latest'];

export default function TVShows() {
  const [activeCategory, setActiveCategory] = useState('Popular');

  const getTVShowsByCategory = () => {
    const shows = [...MOCK_TV_SHOWS];
    
    switch (activeCategory) {
      case 'Popular':
        return shows.sort((a, b) => b.rating - a.rating);
      case 'Top Rated':
        return shows.filter(s => s.rating >= 7.0).sort((a, b) => b.rating - a.rating);
      case 'Airing Today':
        return shows.slice(0, 8);
      case 'On The Air':
        return shows.filter(s => s.year >= 2024);
      case 'Latest':
        return shows.sort((a, b) => b.year - a.year);
      default:
        return shows;
    }
  };

  const filteredShows = getTVShowsByCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
        <p className="text-muted-foreground">
          Explore amazing TV series and shows
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={tvCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* TV Shows Grid */}
      {filteredShows.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredShows.map((show) => (
              <MovieCard key={show.id} movie={show} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Load More TV Shows
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold mb-2">No TV shows found</h3>
          <p className="text-muted-foreground">
            Check back later for new TV series and episodes.
          </p>
        </div>
      )}
    </div>
  );
}
