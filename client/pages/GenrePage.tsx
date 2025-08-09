import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { tmdbService, TMDBMovie, TMDBTVShow, TMDBGenre } from '@shared/tmdb';
import { cn } from '@/lib/utils';

const sortOptions = ['Popular', 'Top Rated', 'Latest', 'Vote Average'];

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'movie';
  
  const [activeSort, setActiveSort] = useState('Popular');
  const [genre, setGenre] = useState<TMDBGenre | null>(null);
  const [content, setContent] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenreContent = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const genreId = parseInt(slug);
        
        // Fetch genre info and content
        const [genresRes, contentRes] = await Promise.all([
          type === 'tv' ? tmdbService.getTVGenres() : tmdbService.getMovieGenres(),
          type === 'tv' 
            ? tmdbService.getTVShowsByGenre(genreId, currentPage)
            : tmdbService.getMoviesByGenre(genreId, currentPage)
        ]);

        const foundGenre = genresRes.genres.find(g => g.id === genreId);
        setGenre(foundGenre || null);
        setContent(contentRes.results);
        setTotalPages(contentRes.total_pages);
      } catch (error) {
        console.error('Error fetching genre content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreContent();
  }, [slug, type, currentPage, activeSort]);

  const loadMore = async () => {
    if (currentPage >= totalPages || !slug) return;
    
    try {
      const genreId = parseInt(slug);
      const nextPage = currentPage + 1;
      
      const contentRes = type === 'tv' 
        ? await tmdbService.getTVShowsByGenre(genreId, nextPage)
        : await tmdbService.getMoviesByGenre(genreId, nextPage);
      
      setContent(prev => [...prev, ...contentRes.results]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more content:', error);
    }
  };

  if (loading && content.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-64 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-48" />
        </div>

        <div className="flex space-x-2 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 bg-muted animate-pulse rounded w-20" />
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

  if (!genre) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Genre Not Found</h1>
          <p className="text-muted-foreground">The genre you're looking for doesn't exist.</p>
          <Button 
            onClick={() => window.history.back()} 
            className="mt-6 neu-button"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            size="icon"
            className="neu-button"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{genre.name} {type === 'tv' ? 'TV Shows' : 'Movies'}</h1>
            <p className="text-muted-foreground">
              Discover the best {genre.name.toLowerCase()} {type === 'tv' ? 'TV shows' : 'movies'}
            </p>
          </div>
        </div>
      </div>

      {/* Sort Filter */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {sortOptions.map((option) => (
            <Button
              key={option}
              variant={activeSort === option ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-none neu-button border-border/50",
                activeSort === option 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background text-foreground hover:bg-muted/50"
              )}
              onClick={() => setActiveSort(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {content.length > 0 ? (
        <>
          <div className="movies-grid mb-12">
            {content.map((item) => (
              <MovieCard key={item.id} movie={item} showHoverCard={true} />
            ))}
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
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">No {type === 'tv' ? 'TV shows' : 'movies'} found</h3>
          <p className="text-muted-foreground">
            No {genre.name.toLowerCase()} {type === 'tv' ? 'TV shows' : 'movies'} available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
