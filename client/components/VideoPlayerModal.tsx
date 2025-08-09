import { useState, useEffect } from 'react';
import { X, Share2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SERVERS } from '@shared/types';
import { TMDBMovie, TMDBTVShow } from '@shared/tmdb';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: TMDBMovie | TMDBTVShow;
  type: 'movie' | 'tv';
}

export function VideoPlayerModal({ isOpen, onClose, media, type }: VideoPlayerModalProps) {
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMovie = type === 'movie';
  const tvShow = !isMovie ? media as TMDBTVShow : null;

  // Generate IMDB ID placeholder (would need proper API call for real IMDB IDs)
  const generateIMDBId = (tmdbId: number) => `tt${tmdbId.toString().padStart(7, '0')}`;

  const generatePlayerUrl = (serverIndex: number) => {
    const server = SERVERS[serverIndex];
    const imdbId = generateIMDBId(media.id);
    let url = '';
    
    if (isMovie) {
      url = server.type === 'imdb' 
        ? server.url.replace('{imdb_id}', imdbId)
        : server.url.replace('{tmdb_id}', media.id.toString());
    } else {
      url = server.type === 'imdb'
        ? server.url_tv
            .replace('{imdb_id}', imdbId)
            .replace('{season}', selectedSeason.toString())
            .replace('{episode}', selectedEpisode.toString())
        : server.url_tv
            .replace('{tmdb_id}', media.id.toString())
            .replace('{season}', selectedSeason.toString())
            .replace('{episode}', selectedEpisode.toString());
    }
    
    return url;
  };

  const title = isMovie ? (media as TMDBMovie).title : (media as TMDBTVShow).name;

  const handleShare = async () => {
    const shareData = {
      title: `Watch ${title} on MovieStream`,
      text: `Check out ${title} on MovieStream!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile devices)
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-7xl ${isFullscreen ? 'h-screen' : 'max-h-[90vh]'} p-0 overflow-hidden`}>
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Video Player */}
        <div className={`bg-black ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
          <iframe
            src={generatePlayerUrl(selectedServer)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Server Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Server</label>
              <Select value={selectedServer.toString()} onValueChange={(value) => setSelectedServer(parseInt(value))}>
                <SelectTrigger className="neu-card-inset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVERS.map((server, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season Selection (TV Shows only) */}
            {!isMovie && tvShow?.seasons && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Season</label>
                <Select value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(parseInt(value))}>
                  <SelectTrigger className="neu-card-inset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tvShow.seasons.map((season) => (
                      <SelectItem key={season.season_number} value={season.season_number.toString()}>
                        Season {season.season_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Episode Selection (TV Shows only) */}
            {!isMovie && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Episode</label>
                <Select value={selectedEpisode.toString()} onValueChange={(value) => setSelectedEpisode(parseInt(value))}>
                  <SelectTrigger className="neu-card-inset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Episode {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Server Info */}
          <div className="p-3 bg-muted/30 rounded-lg neu-card-inset">
            <p className="text-sm text-muted-foreground">
              Currently playing from: <span className="font-medium text-foreground">{SERVERS[selectedServer].name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If the video doesn't load or has issues, try switching to a different server above.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
