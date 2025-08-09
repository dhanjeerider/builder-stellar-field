import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Play, Plus, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieSlider } from '@/components/MovieSlider';
import { tmdbService, TMDBMovie, TMDBTVShow, getImageUrl, getBackdropUrl, TMDBCast, TMDBVideo } from '@shared/tmdb';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [cast, setCast] = useState<TMDBCast[]>([]);
  const [videos, setVideos] = useState<TMDBVideo[]>([]);
  const [similarContent, setSimilarContent] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const mediaId = parseInt(id);
        const path = window.location.pathname;
        const isMovie = path.includes('/movie/');
        
        if (isMovie) {
          // Fetch movie details
          const [movieDetails, credits, videosRes, similar] = await Promise.all([
            tmdbService.getMovieDetails(mediaId),
            tmdbService.getMovieCredits(mediaId),
            tmdbService.getMovieVideos(mediaId),
            tmdbService.getSimilarMovies(mediaId),
          ]);
          
          setMedia(movieDetails);
          setCast(credits.cast.slice(0, 12));
          setVideos(videosRes.results.filter(v => v.type === 'Trailer').slice(0, 3));
          setSimilarContent(similar.results.slice(0, 20));
        } else {
          // Fetch TV show details
          const [tvDetails, credits, videosRes, similar] = await Promise.all([
            tmdbService.getTVShowDetails(mediaId),
            tmdbService.getTVShowCredits(mediaId),
            tmdbService.getTVShowVideos(mediaId),
            tmdbService.getSimilarTVShows(mediaId),
          ]);
          
          setMedia(tvDetails);
          setCast(credits.cast.slice(0, 12));
          setVideos(videosRes.results.filter(v => v.type === 'Trailer').slice(0, 3));
          setSimilarContent(similar.results.slice(0, 20));
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
        setError('Failed to load content details');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <section className="relative h-[60vh] bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="w-48 md:w-64 aspect-[2/3] bg-muted-foreground/20 rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-muted-foreground/20 rounded w-3/4" />
                <div className="h-6 bg-muted-foreground/20 rounded w-1/2" />
                <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
                <div className="flex space-x-3">
                  <div className="h-10 bg-muted-foreground/20 rounded w-24" />
                  <div className="h-10 bg-muted-foreground/20 rounded w-24" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The content you're looking for doesn't exist."}
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isMovie = 'title' in media;
  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const overview = media.overview;
  const runtime = isMovie ? (media as TMDBMovie).runtime : undefined;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getBackdropUrl(media.backdrop_path, 'original')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(media.poster_path, 'w500')}
                alt={title}
                className="w-48 md:w-64 aspect-[2/3] object-cover rounded-xl shadow-2xl"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 rating-star fill-current" />
                  <span className="font-semibold">{media.vote_average.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
                
                {runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
                  </div>
                )}
                
                <Badge variant="secondary" className="quality-badge">
                  HD
                </Badge>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {media.genres?.map((genre) => (
                  <Link key={genre.id} to={`/genre/${genre.id}`}>
                    <Badge variant="outline" className="genre-tag hover:bg-accent">
                      {genre.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3 max-w-3xl">
                {overview}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link to={`/watch/${isMovie ? 'movie' : 'tv'}/${media.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play Now
                  </Button>
                </Link>
                
                <Button variant="outline" size="lg" className="neu-button">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Synopsis */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl text-lg">
            {overview}
          </p>
        </section>

        {/* Trailers */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Trailers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="aspect-video bg-muted rounded-xl overflow-hidden neu-card">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center group">
                  <div className="movie-card p-3">
                    <img
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      className="w-full aspect-[2/3] object-cover rounded-lg bg-muted mb-3"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/placeholder.svg';
                      }}
                    />
                    <h3 className="font-semibold text-sm line-clamp-1">{actor.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Content */}
        {similarContent.length > 0 && (
          <section>
            <MovieSlider 
              title={`More like ${title}`} 
              movies={similarContent}
              showHoverCard={true}
            />
          </section>
        )}
      </div>
    </div>
  );
}
