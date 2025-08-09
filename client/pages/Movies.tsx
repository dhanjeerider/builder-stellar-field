import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { tmdbService, TMDBMovie } from '@shared/tmdb';
import { cn } from '@/lib/utils';

const movieCategories = ['Popular', 'Top Rated', 'Upcoming', 'Now Playing'];

export default function Movies() {
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial fetch
  useEffect(() => {
    fetchMovies();
  }, [activeCategory]);

  const fetchMovies = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let moviesRes;
      switch (activeCategory) {
        case 'Popular':
          moviesRes = await tmdbService.getPopularMovies(page);
          break;
        case 'Top Rated':
          moviesRes = await tmdbService.getTopRatedMovies(page);
          break;
        case 'Upcoming':
          moviesRes = await tmdbService.getUpcomingMovies(page);
          break;
        case 'Now Playing':
          moviesRes = await tmdbService.getNowPlayingMovies(page);
          break;
        default:
          moviesRes = await tmdbService.getPopularMovies(page);
      }

      if (page === 1) {
        setMovies(moviesRes.results);
        setCurrentPage(1);
      } else {
        setMovies(prev => [...prev, ...moviesRes.results]);
        setCurrentPage(page);
      }

      setTotalPages(moviesRes.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (currentPage >= totalPages || loadingMore) return;
    await fetchMovies(currentPage + 1);
  }, [currentPage, totalPages, loadingMore, activeCategory]);

  // Infinite scroll
  const { isFetching } = useInfiniteScroll({
    hasNextPage: currentPage < totalPages,
    fetchNextPage,
    threshold: 200
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  if (loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-64" />
        </div>

        <div className="flex space-x-2 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 bg-muted animate-pulse rounded w-24" />
          ))}
        </div>

        <div className="movies-grid">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted aspect-[2/3] rounded-xl mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies</h1>
        <p className="text-muted-foreground">
          Discover the latest and greatest movies from around the world
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Browse by:</span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {movieCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-none neu-button border-border/50",
                activeCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background text-foreground hover:bg-muted/50"
              )}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <span>{activeCategory} Movies</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </h2>
          
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showHoverCard={true} />
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="text-center">
            <Button 
              onClick={loadMore}
              variant="outline" 
              size="lg" 
              className="neu-button border-border/50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Movies'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
