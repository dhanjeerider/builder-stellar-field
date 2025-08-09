import { useState, useEffect } from "react";
import { X, Trash2, Play, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TMDBMovie, TMDBTVShow, getImageUrl } from "@shared/tmdb";
import { Link } from "react-router-dom";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WatchlistItem extends TMDBMovie {
  type: "movie";
  addedAt: string;
}

interface WatchlistTVItem extends TMDBTVShow {
  type: "tv";
  addedAt: string;
}

type WatchlistEntry = WatchlistItem | WatchlistTVItem;

export function WatchlistModal({ isOpen, onClose }: WatchlistModalProps) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("moviestream-watchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error("Error loading watchlist:", error);
        setWatchlist([]);
      }
    }
  }, [isOpen]);

  const removeFromWatchlist = (id: number) => {
    const updatedWatchlist = watchlist.filter((item) => item.id !== id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem(
      "moviestream-watchlist",
      JSON.stringify(updatedWatchlist),
    );
  };

  const clearWatchlist = () => {
    setWatchlist([]);
    localStorage.removeItem("moviestream-watchlist");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              My Watchlist
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {watchlist.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearWatchlist}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-1">
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-xl font-semibold mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-muted-foreground">
                Add movies and TV shows to your watchlist to watch them later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((item) => {
                const isMovie = item.type === "movie";
                const title = isMovie
                  ? (item as WatchlistItem).title
                  : (item as WatchlistTVItem).name;
                const releaseDate = isMovie
                  ? (item as WatchlistItem).release_date
                  : (item as WatchlistTVItem).first_air_date;
                const year = releaseDate
                  ? new Date(releaseDate).getFullYear()
                  : "";

                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover:bg-card/80 transition-colors"
                  >
                    <img
                      src={getImageUrl(item.poster_path, "w154")}
                      alt={title}
                      className="w-16 h-24 object-cover rounded-lg bg-muted flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg leading-tight mb-1">
                        {title}
                      </h4>

                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 rating-star fill-current" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="genre-tag">
                          {item.type === "movie" ? "Movie" : "TV Show"}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.overview}
                      </p>

                      <p className="text-xs text-muted-foreground mt-2">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link to={`/${item.type}/${item.id}`} onClick={onClose}>
                        <Button size="sm" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWatchlist(item.id)}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Utility functions for managing watchlist
export const addToWatchlist = (
  item: TMDBMovie | TMDBTVShow,
  type: "movie" | "tv",
) => {
  const watchlistItem = {
    ...item,
    type,
    addedAt: new Date().toISOString(),
  };

  const savedWatchlist = localStorage.getItem("moviestream-watchlist");
  let watchlist: WatchlistEntry[] = [];

  if (savedWatchlist) {
    try {
      watchlist = JSON.parse(savedWatchlist);
    } catch (error) {
      console.error("Error parsing watchlist:", error);
    }
  }

  // Check if item already exists
  const exists = watchlist.some(
    (existingItem) => existingItem.id === item.id && existingItem.type === type,
  );
  if (exists) {
    return false; // Already in watchlist
  }

  watchlist.unshift(watchlistItem);
  localStorage.setItem("moviestream-watchlist", JSON.stringify(watchlist));
  return true; // Successfully added
};

export const removeFromWatchlist = (id: number, type: "movie" | "tv") => {
  const savedWatchlist = localStorage.getItem("moviestream-watchlist");
  if (!savedWatchlist) return;

  try {
    const watchlist: WatchlistEntry[] = JSON.parse(savedWatchlist);
    const updatedWatchlist = watchlist.filter(
      (item) => !(item.id === id && item.type === type),
    );
    localStorage.setItem(
      "moviestream-watchlist",
      JSON.stringify(updatedWatchlist),
    );
    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return false;
  }
};

export const isInWatchlist = (id: number, type: "movie" | "tv"): boolean => {
  const savedWatchlist = localStorage.getItem("moviestream-watchlist");
  if (!savedWatchlist) return false;

  try {
    const watchlist: WatchlistEntry[] = JSON.parse(savedWatchlist);
    return watchlist.some((item) => item.id === id && item.type === type);
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
};
