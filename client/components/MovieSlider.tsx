import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TMDBMovie, TMDBTVShow } from '@shared/tmdb';
import { MovieCard } from './MovieCard';
import { Button } from './ui/button';

interface MovieSliderProps {
  title: string;
  movies: (TMDBMovie | TMDBTVShow)[];
  showHoverCard?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
}

export function MovieSlider({
  title,
  movies,
  showHoverCard = false,
  viewAllLink,
  viewAllText = "View All"
}: MovieSliderProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 100);
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={`neu-button ${!canScrollLeft ? 'opacity-50' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`neu-button ${!canScrollRight ? 'opacity-50' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          {/* Movie slider */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
            onScroll={checkScrollButtons}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-none w-40 sm:w-48 lg:w-52">
                <MovieCard movie={movie} showHoverCard={showHoverCard} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
