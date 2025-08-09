import { Link } from 'react-router-dom';
import { Star, Play, Info, Calendar } from 'lucide-react';
import { TMDBMovie, TMDBTVShow, getImageUrl } from '@shared/tmdb';
import { VideoPlayerModal } from './VideoPlayerModal';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MovieCardProps {
  movie: TMDBMovie | TMDBTVShow;
  className?: string;
  showHoverCard?: boolean;
}

export function MovieCard({ movie, className, showHoverCard = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const isMovie = 'title' in movie;
  const title = isMovie ? movie.title : movie.name;
  const releaseDate = isMovie ? movie.release_date : movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const linkTo = isMovie ? `/movie/${movie.id}` : `/tv/${movie.id}`;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlayerOpen(true);
  };

  return (
    <div 
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={linkTo} className="block">
        <div className="movie-card p-3 h-full relative overflow-hidden">
          <div className="relative mb-3">
            <img
              src={getImageUrl(movie.poster_path, 'w342')}
              alt={title}
              className="w-full aspect-[2/3] object-cover rounded-xl bg-muted transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Quality badge */}
            <div className="absolute top-2 right-2">
              <span className="quality-badge">HD</span>
            </div>
            
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary/90"
              >
                <Play className="w-6 h-6 text-primary-foreground ml-1 fill-current" />
              </button>
            </div>

            {/* Rating badge */}
            <div className="absolute bottom-2 left-2 bg-black/80 rounded-lg px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 rating-star fill-current" />
              <span className="text-white text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{year}</span>
              </span>
              <span className="genre-tag">{isMovie ? 'Movie' : 'TV Show'}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Hover Card */}
      {showHoverCard && isHovered && (
        <div className="absolute top-0 left-full ml-2 w-80 p-4 bg-background/95 backdrop-blur-md rounded-xl shadow-2xl border border-border/50 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex space-x-3">
            <img
              src={getImageUrl(movie.poster_path, 'w185')}
              alt={title}
              className="w-20 aspect-[2/3] object-cover rounded-lg bg-muted flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-base leading-tight">{title}</h4>
              
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 rating-star fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <span>{year}</span>
                <span className="quality-badge">HD</span>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {movie.overview}
              </p>
              
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handlePlayClick}
                  className="flex-1 bg-primary text-primary-foreground text-xs font-medium py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play</span>
                </button>
                <Link
                  to={linkTo}
                  className="flex-1 bg-muted text-muted-foreground text-xs font-medium py-2 px-3 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center space-x-1"
                >
                  <Info className="w-3 h-3" />
                  <span>Info</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        media={movie}
        type={isMovie ? 'movie' : 'tv'}
      />
    </div>
  );
}
