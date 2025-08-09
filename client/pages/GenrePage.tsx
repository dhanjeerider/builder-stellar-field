import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieCard } from "@/components/MovieCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useLanguage } from "@/hooks/use-language";
import { tmdbService, TMDBMovie, TMDBTVShow, TMDBGenre } from "@shared/tmdb";
import { cn } from "@/lib/utils";

const sortOptions = ["Popular", "Top Rated", "Latest", "Vote Average"];

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "movie";
  const { getDiscoverParams } = useLanguage();

  const [activeSort, setActiveSort] = useState("Popular");
  const [genre, setGenre] = useState<TMDBGenre | null>(null);
  const [content, setContent] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initial fetch
  useEffect(() => {
    const fetchGenreContent = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setCurrentPage(1);
        const genreId = parseInt(slug);

        // Fetch genre info and content
        const languageParams = getDiscoverParams();
        const [genresRes, contentRes] = await Promise.all([
          type === "tv"
            ? tmdbService.getTVGenres()
            : tmdbService.getMovieGenres(),
          type === "tv"
            ? tmdbService.getTVShowsByGenre(genreId, 1, languageParams)
            : tmdbService.getMoviesByGenre(genreId, 1, languageParams),
        ]);

        const foundGenre = genresRes.genres.find((g) => g.id === genreId);
        setGenre(foundGenre || null);
        setContent(contentRes.results);
        setTotalPages(contentRes.total_pages);
      } catch (error) {
        console.error("Error fetching genre content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreContent();
  }, [slug, type, activeSort, getDiscoverParams]);

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (!slug || currentPage >= totalPages || loadingMore) return;

    try {
      setLoadingMore(true);
      const genreId = parseInt(slug);
      const nextPage = currentPage + 1;

      const languageParams = getDiscoverParams();
      const contentRes =
        type === "tv"
          ? await tmdbService.getTVShowsByGenre(
              genreId,
              nextPage,
              languageParams,
            )
          : await tmdbService.getMoviesByGenre(
              genreId,
              nextPage,
              languageParams,
            );

      setContent((prev) => [...prev, ...contentRes.results]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more content:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [slug, type, currentPage, totalPages, loadingMore, getDiscoverParams]);

  // Infinite scroll
  const { isFetching } = useInfiniteScroll({
    hasNextPage: currentPage < totalPages,
    fetchNextPage,
    threshold: 200,
  });

  if (loading && content.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted animate-pulse rounded w-64 mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-48" />
        </div>

        <div className="flex space-x-2 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-muted animate-pulse rounded w-20"
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

  if (!genre) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Genre Not Found</h1>
          <p className="text-muted-foreground">
            The genre you're looking for doesn't exist.
          </p>
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
            <h1 className="text-3xl font-bold">
              {genre.name} {type === "tv" ? "TV Shows" : "Movies"}
            </h1>
            <p className="text-muted-foreground">
              Discover the best {genre.name.toLowerCase()}{" "}
              {type === "tv" ? "TV shows" : "movies"}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Browse by:
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Language Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-muted-foreground">
              Language:
            </label>
            <LanguageSelector showLabel={true} className="neu-card-inset" />
          </div>

          {/* Sort Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-muted-foreground">
              Sort by:
            </label>
            <Select value={activeSort} onValueChange={setActiveSort}>
              <SelectTrigger className="w-48 neu-card-inset">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {content.length > 0 ? (
        <>
          <div className="movies-grid mb-8">
            {content.map((item) => (
              <MovieCard key={item.id} movie={item} showHoverCard={true} />
            ))}
          </div>

          {/* Infinite Scroll Loading Indicator */}
          {(isFetching || loadingMore) && currentPage < totalPages && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading more content...
              </p>
            </div>
          )}

          {/* End of content indicator */}
          {currentPage >= totalPages && content.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                You've reached the end of the list!
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">
            No {type === "tv" ? "TV shows" : "movies"} found
          </h3>
          <p className="text-muted-foreground">
            No {genre.name.toLowerCase()}{" "}
            {type === "tv" ? "TV shows" : "movies"} available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
