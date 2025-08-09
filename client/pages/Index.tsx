import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { MovieSlider } from '@/components/MovieSlider';
import { tmdbService, TMDBMovie, TMDBTVShow, getImageUrl, getBackdropUrl } from '@shared/tmdb';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'movies', label: 'Movies', icon: Play },
  { id: 'tv', label: 'TV Shows', icon: Star },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const movieCategories = ['Popular', 'Top Rated', 'Upcoming', 'Now Playing'];

export default function Index() {
  const [activeTab, setActiveTab] = useState('movies');
  const [activeCategory, setActiveCategory] = useState('Popular');
  const [featuredMovie, setFeaturedMovie] = useState<TMDBMovie | null>(null);
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMovie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<TMDBMovie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TMDBTVShow[]>([]);
  const [trendingContent, setTrendingContent] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all movie categories
        const [popularRes, topRatedRes, upcomingRes, nowPlayingRes, tvRes, trendingRes] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getUpcomingMovies(),
          tmdbService.getNowPlayingMovies(),
          tmdbService.getPopularTVShows(),
          tmdbService.getTrendingAll(),
        ]);

        setPopularMovies(popularRes.results);
        setTopRatedMovies(topRatedRes.results);
        setUpcomingMovies(upcomingRes.results);
        setNowPlayingMovies(nowPlayingRes.results);
        setPopularTVShows(tvRes.results);
        setTrendingContent(trendingRes.results);
        
        // Set featured movie (first popular movie)
        if (popularRes.results.length > 0) {
          setFeaturedMovie(popularRes.results[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentMovies = () => {
    switch (activeCategory) {
      case 'Popular':
        return popularMovies;
      case 'Top Rated':
        return topRatedMovies;
      case 'Upcoming':
        return upcomingMovies;
      case 'Now Playing':
        return nowPlayingMovies;
      default:
        return popularMovies;
    }
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'movies':
        return getCurrentMovies();
      case 'tv':
        return popularTVShows;
      case 'trending':
        return trendingContent;
      default:
        return getCurrentMovies();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <section className="relative h-[60vh] bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="space-y-4 max-w-2xl">
              <div className="h-8 bg-muted-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-muted-foreground/20 rounded w-full" />
              <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
              <div className="flex space-x-3">
                <div className="h-10 bg-muted-foreground/20 rounded w-24" />
                <div className="h-10 bg-muted-foreground/20 rounded w-24" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-muted animate-pulse rounded w-48 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Featured Hero Section */}
      {featuredMovie && (
        <section className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getBackdropUrl(featuredMovie.backdrop_path, 'original')})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 rating-star fill-current" />
                    <span>{featuredMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {featuredMovie.title}
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                {featuredMovie.overview}
              </p>
              
              <div className="flex space-x-4">
                <Link to={`/watch/movie/${featuredMovie.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play Now
                  </Button>
                </Link>
                
                <Link to={`/movie/${featuredMovie.id}`}>
                  <Button variant="outline" size="lg" className="neu-button border-border/50">
                    More Info
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="tab-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  data-active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter (for movies tab) */}
        {activeTab === 'movies' && (
          <div className="mb-8">
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
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <span>
                {activeTab === 'movies' ? `${activeCategory} Movies` : 
                 activeTab === 'tv' ? 'Popular TV Shows' : 
                 'Trending Now'}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </h2>
            
            <div className="movies-grid">
              {getCurrentContent().slice(0, 18).map((item) => (
                <MovieCard 
                  key={item.id} 
                  movie={item} 
                  showHoverCard={true}
                />
              ))}
            </div>
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <Button variant="outline" size="lg" className="neu-button border-border/50">
              Load More
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Additional Sliders */}
        {activeTab === 'movies' && popularMovies.length > 0 && (
          <>
            <MovieSlider 
              title="Trending Movies" 
              movies={popularMovies.slice(0, 20)} 
            />
            <MovieSlider 
              title="Top Rated Movies" 
              movies={topRatedMovies.slice(0, 20)} 
            />
          </>
        )}
      </div>
    </div>
  );
}
