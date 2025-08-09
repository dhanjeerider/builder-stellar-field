import { useState, useEffect, useCallback } from "react";
import { ChevronRight, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { tmdbService, TMDBTVShow } from "@shared/tmdb";
import { cn } from "@/lib/utils";

const tvCategories = ["Popular", "Top Rated", "Airing Today", "On The Air"];

export default function TVShows() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [shows, setShows] = useState<TMDBTVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial fetch
  useEffect(() => {
    fetchTVShows();
  }, [activeCategory]);

  const fetchTVShows = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let showsRes;
      switch (activeCategory) {
        case "Popular":
          showsRes = await tmdbService.getPopularTVShows(page);
          break;
        case "Top Rated":
          showsRes = await tmdbService.getTopRatedTVShows(page);
          break;
        case "Airing Today":
          showsRes = await tmdbService.getAiringTodayTVShows(page);
          break;
        case "On The Air":
          showsRes = await tmdbService.getOnTheAirTVShows(page);
          break;
        default:
          showsRes = await tmdbService.getPopularTVShows(page);
      }

      if (page === 1) {
        setShows(showsRes.results);
        setCurrentPage(1);
      } else {
        setShows((prev) => [...prev, ...showsRes.results]);
        setCurrentPage(page);
      }

      setTotalPages(showsRes.total_pages);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (currentPage >= totalPages || loadingMore) return;
    await fetchTVShows(currentPage + 1);
  }, [currentPage, totalPages, loadingMore, activeCategory]);

  // Infinite scroll
  const { isFetching } = useInfiniteScroll({
    hasNextPage: currentPage < totalPages,
    fetchNextPage,
    threshold: 200,
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  if (loading && shows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-64" />
        </div>

        <div className="flex space-x-2 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-muted animate-pulse rounded w-24"
            />
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
        <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
        <p className="text-muted-foreground">
          Explore amazing TV series and shows from around the world
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Browse by:
          </span>
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {tvCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-none neu-button border-border/50",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted/50",
              )}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* TV Shows Grid */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <span>{activeCategory} TV Shows</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </h2>

          <div className="movies-grid">
            {shows.map((show) => (
              <MovieCard key={show.id} movie={show} showHoverCard={true} />
            ))}
          </div>
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {(isFetching || loadingMore) && currentPage < totalPages && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading more TV shows...
            </p>
          </div>
        )}

        {/* End of content indicator */}
        {currentPage >= totalPages && shows.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              You've reached the end of the list!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
