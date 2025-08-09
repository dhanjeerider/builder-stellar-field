import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie, TVShow } from '@shared/types';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie | TVShow;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const linkTo = movie.type === 'movie' ? `/movie/${movie.id}` : `/tv/${movie.id}`;

  return (
    <Link 
      to={linkTo}
      className={cn("group block", className)}
    >
      <div className="movie-card p-3 h-full">
        <div className="relative mb-3">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover rounded-lg bg-muted"
            loading="lazy"
          />
          
          {/* Quality badge */}
          <div className="absolute top-2 right-2">
            <span className="quality-badge">{movie.quality}</span>
          </div>
          
          {/* Play overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{movie.year}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 rating-star fill-current" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="genre-tag">{movie.type === 'movie' ? 'Movie' : 'TV Show'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
