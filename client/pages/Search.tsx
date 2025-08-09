import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { tmdbService, TMDBMovie, TMDBTVShow } from "@shared/tmdb";
import { cn } from "@/lib/utils";

const searchTabs = [
  { id: "all", label: "All", icon: SearchIcon },
  { id: "movie", label: "Movies", icon: SearchIcon },
  { id: "tv", label: "TV Shows", icon: SearchIcon },
];

const filterOptions = ["Popular", "Recent", "Top Rated", "Trending"];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("Popular");
  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [movieResults, setMovieResults] = useState<TMDBMovie[]>([]);
  const [tvResults, setTVResults] = useState<TMDBTVShow[]>([]);
  const [trendingContent, setTrendingContent] = useState<
    (TMDBMovie | TMDBTVShow)[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentSearches] = useState([
    "Avengers",
    "Spider-Man",
    "Game of Thrones",
    "Breaking Bad",
  ]);

  useEffect(() => {
    // Load trending content on initial load
    const fetchTrending = async () => {
      try {
        const trending = await tmdbService.getTrendingAll();
        setTrendingContent(trending.results.slice(0, 20));
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const searchQuery = query.trim();

    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setResults([]);
      setMovieResults([]);
      setTVResults([]);
      setIsSearching(false);
    }
  }, [query, activeTab, currentPage]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery) return;

    try {
      setIsSearching(true);

      let searchResults;

      if (activeTab === "movie") {
        searchResults = await tmdbService.searchMovies(
          searchQuery,
          currentPage,
        );
        setMovieResults(
          currentPage === 1
            ? searchResults.results
            : (prev) => [...prev, ...searchResults.results],
        );
      } else if (activeTab === "tv") {
        searchResults = await tmdbService.searchTVShows(
          searchQuery,
          currentPage,
        );
        setTVResults(
          currentPage === 1
            ? searchResults.results
            : (prev) => [...prev, ...searchResults.results],
        );
      } else {
        searchResults = await tmdbService.searchMulti(searchQuery, currentPage);
        setResults(
          currentPage === 1
            ? searchResults.results
            : (prev) => [...prev, ...searchResults.results],
        );
      }

      setTotalPages(searchResults.total_pages);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getCurrentResults = () => {
    switch (activeTab) {
      case "movie":
        return movieResults;
      case "tv":
        return tvResults;
      default:
        return results;
    }
  };

  const getResultsCount = () => {
    const current = getCurrentResults();
    return current.length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="relative max-w-2xl mb-6">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="search"
            placeholder="Search movies, TV shows, people..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 pr-4 h-14 text-lg neu-card-inset bg-background border-0 text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        {/* Search Tabs */}
        <div className="tab-nav mb-6">
          {searchTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Searches */}
      {!query && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Searches</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="neu-button border-border/50"
                onClick={() => handleSearch(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Content */}
      {!query && trendingContent.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trending Now</span>
          </h2>
          <div className="movies-grid">
            {trendingContent.map((item) => (
              <MovieCard key={item.id} movie={item} showHoverCard={true} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isSearching && getCurrentResults().length === 0
                ? "Searching..."
                : `Results for "${query}"`}
            </h2>
            {!isSearching && getResultsCount() > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm">
                  {getResultsCount()} result{getResultsCount() !== 1 ? "s" : ""}{" "}
                  found
                </span>

                {/* Filter Options */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <div className="flex space-x-1">
                    {filterOptions.map((filter) => (
                      <Button
                        key={filter}
                        variant={activeFilter === filter ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "text-xs",
                          activeFilter === filter
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSearching && getCurrentResults().length === 0 ? (
            <div className="movies-grid">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted aspect-[2/3] rounded-xl mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : getCurrentResults().length > 0 ? (
            <>
              <div className="movies-grid">
                {getCurrentResults().map((item) => (
                  <MovieCard
                    key={`${item.id}-${activeTab}`}
                    movie={item}
                    showHoverCard={true}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    size="lg"
                    className="neu-button border-border/50"
                    disabled={isSearching}
                  >
                    {isSearching ? "Loading..." : "Load More Results"}
                  </Button>
                </div>
              )}
            </>
          ) : !isSearching ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse our trending content
                instead.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
