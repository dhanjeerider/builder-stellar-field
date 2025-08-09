import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MovieCard } from '@/components/MovieCard';
import { GENRES } from '@shared/types';
import { MOCK_MOVIES, MOCK_TV_SHOWS } from '@shared/mockData';

const sortOptions = ['Popular', 'Top', 'Upcoming', 'Genre', 'Year'];

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeSort, setActiveSort] = useState('Popular');
  
  // Find the genre
  const genre = GENRES.find(g => g.slug === slug);
  
  if (!genre) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Genre Not Found</h1>
          <p className="text-muted-foreground">The genre you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Filter movies by genre
  const allMedia = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  const genreMedia = allMedia.filter(item => 
    item.genres.some(g => g.toLowerCase() === genre.name.toLowerCase())
  );

  // Sort based on active filter
  const getSortedMedia = () => {
    let sorted = [...genreMedia];
    
    switch (activeSort) {
      case 'Popular':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'Top':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'Year':
        return sorted.sort((a, b) => b.year - a.year);
      case 'Upcoming':
        return sorted.filter(item => item.year >= 2025);
      default:
        return sorted;
    }
  };

  const sortedMedia = getSortedMedia();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse movies ({genre.name})</h1>
        <p className="text-muted-foreground">
          Showing {sortedMedia.length} {genre.name.toLowerCase()} movie{sortedMedia.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sort Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={sortOptions}
          activeCategory={activeSort}
          onCategoryChange={setActiveSort}
        />
      </div>

      {/* Movies Grid */}
      {sortedMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedMedia.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">No {genre.name.toLowerCase()} movies found</h3>
          <p className="text-muted-foreground">
            Try browsing other genres or check back later for new releases.
          </p>
        </div>
      )}
    </div>
  );
}
