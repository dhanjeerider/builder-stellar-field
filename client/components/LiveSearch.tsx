import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Calendar, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { tmdbService, TMDBMovie, TMDBTVShow, getImageUrl } from '@shared/tmdb';
import { cn } from '@/lib/utils';

interface LiveSearchProps {
  className?: string;
  placeholder?: string;
}

export function LiveSearch({ className, placeholder = "Search movies, TV shows..." }: LiveSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (query.trim().length < 2) {
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const searchResults = await tmdbService.searchMulti(query.trim());
        setResults(searchResults.results.slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-10 pr-4 neu-card-inset bg-background/50 border-0"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      {/* Live Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground p-2 border-b border-border/30">
                Search Results
              </div>
              {results.map((item) => {
                const isMovie = 'title' in item;
                const title = isMovie ? item.title : item.name;
                const releaseDate = isMovie ? item.release_date : item.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
                const linkTo = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

                return (
                  <Link
                    key={item.id}
                    to={linkTo}
                    onClick={handleResultClick}
                    className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <img
                      src={getImageUrl(item.poster_path, 'w154')}
                      alt={title}
                      className="w-12 h-16 object-cover rounded bg-muted flex-shrink-0"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/placeholder.svg';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                      </h4>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 rating-star fill-current" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="genre-tag">{isMovie ? 'Movie' : 'TV Show'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              {query.trim() && (
                <Link
                  to={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={handleResultClick}
                  className="block p-3 text-center text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors border-t border-border/30 mt-2"
                >
                  View all results for "{query}"
                </Link>
              )}
            </div>
          ) : query.trim().length >= 2 && !isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
