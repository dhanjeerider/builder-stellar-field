import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Star, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MovieSlider } from '@/components/MovieSlider';
import { MOCK_MOVIES, MOCK_TV_SHOWS, CATEGORIES } from '@shared/mockData';
import { Movie, TVShow } from '@shared/types';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  
  // Find the movie/show from our mock data
  const allMedia = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  const media = allMedia.find(item => item.id === id) as Movie | TVShow;

  if (!media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isMovie = media.type === 'movie';
  const runtime = isMovie ? (media as Movie).runtime : undefined;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${media.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={media.poster}
                alt={media.title}
                className="w-48 md:w-64 aspect-[2/3] object-cover rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">{media.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 rating-star fill-current" />
                  <span className="font-semibold">{media.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{media.year}</span>
                </div>
                
                {runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(runtime / 60)}h {runtime % 60}m</span>
                  </div>
                )}
                
                <Badge variant="secondary" className="quality-badge">
                  {media.quality}
                </Badge>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre, index) => (
                  <Link key={index} to={`/genre/${genre.toLowerCase()}`}>
                    <Badge variant="outline" className="genre-tag hover:bg-accent">
                      {genre}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link to={`/watch/${media.type}/${media.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Play className="w-5 h-5 mr-2" />
                    Play
                  </Button>
                </Link>
                
                <Button variant="outline" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Synopsis */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            {media.synopsis}
          </p>
        </section>

        {/* Trailers */}
        {media.trailers && media.trailers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Trailers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {media.trailers.map((trailer, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.youtube_id}`}
                    title={trailer.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {media.cast && media.cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.cast.map((actor, index) => (
                <div key={index} className="text-center">
                  <img
                    src={actor.profile_image}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-muted mb-2"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/200x300?text=No+Image';
                    }}
                  />
                  <h3 className="font-semibold text-sm">{actor.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* You may also like */}
        <section>
          <MovieSlider 
            title="You may also like" 
            movies={CATEGORIES.popular.filter(m => m.id !== media.id).slice(0, 10)} 
          />
        </section>
      </div>
    </div>
  );
}
