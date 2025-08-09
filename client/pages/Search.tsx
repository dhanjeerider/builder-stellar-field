import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MovieCard } from '@/components/MovieCard';
import { MOCK_MOVIES, MOCK_TV_SHOWS } from '@shared/mockData';
import { Movie, TVShow } from '@shared/types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const allMedia = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];

  useEffect(() => {
    const searchQuery = query.trim().toLowerCase();
    
    if (searchQuery) {
      setIsSearching(true);
      
      // Simulate search delay
      const timeoutId = setTimeout(() => {
        const filtered = allMedia.filter(item =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.genres.some(genre => genre.toLowerCase().includes(searchQuery)) ||
          item.synopsis.toLowerCase().includes(searchQuery)
        );
        
        setResults(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="search"
            placeholder="Search movies, TV shows, genres..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 pr-4 h-12 text-lg bg-muted/50 border-border"
            autoFocus
          />
        </div>
      </div>

      {/* Search Results */}
      {query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isSearching ? 'Searching...' : `Results for "${query}"`}
            </h2>
            {!isSearching && results.length > 0 && (
              <span className="text-muted-foreground">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {isSearching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted aspect-[2/3] rounded-lg mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse our categories instead.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">Discover amazing content</h3>
          <p className="text-muted-foreground">
            Search for movies, TV shows, actors, or genres to get started.
          </p>
        </div>
      )}
    </div>
  );
}
