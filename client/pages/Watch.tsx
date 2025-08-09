import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SERVERS } from '@shared/types';
import { MOCK_MOVIES, MOCK_TV_SHOWS } from '@shared/mockData';

export default function Watch() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  // Find the media item
  const allMedia = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  const media = allMedia.find(item => item.id === id);
  
  if (!media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground">The content you're trying to watch doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isMovie = type === 'movie';
  const tvShow = !isMovie ? media as any : null;

  const generatePlayerUrl = (serverIndex: number) => {
    const server = SERVERS[serverIndex];
    let url = '';
    
    if (isMovie) {
      url = server.type === 'imdb' 
        ? server.url.replace('{imdb_id}', media.imdb_id)
        : server.url.replace('{tmdb_id}', media.tmdb_id);
    } else {
      url = server.type === 'imdb'
        ? server.url_tv
            .replace('{imdb_id}', media.imdb_id)
            .replace('{season}', selectedSeason.toString())
            .replace('{episode}', selectedEpisode.toString())
        : server.url_tv
            .replace('{tmdb_id}', media.tmdb_id)
            .replace('{season}', selectedSeason.toString())
            .replace('{episode}', selectedEpisode.toString());
    }
    
    return url;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/${type}/${id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              
              <div>
                <h1 className="font-bold text-lg">{media.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{media.year}</span>
                  <Badge variant="secondary" className="quality-badge">
                    {media.quality}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <div className="aspect-video bg-black">
        <iframe
          src={generatePlayerUrl(selectedServer)}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Controls */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Server Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Server</label>
              <Select value={selectedServer.toString()} onValueChange={(value) => setSelectedServer(parseInt(value))}>
                <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tvShow.seasons.map((season: any) => (
                      <SelectItem key={season.season_number} value={season.season_number.toString()}>
                        Season {season.season_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Episode Selection (TV Shows only) */}
            {!isMovie && tvShow?.seasons && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Episode</label>
                <Select value={selectedEpisode.toString()} onValueChange={(value) => setSelectedEpisode(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tvShow.seasons.find((s: any) => s.season_number === selectedSeason)?.episodes?.map((episode: any) => (
                      <SelectItem key={episode.episode_number} value={episode.episode_number.toString()}>
                        Episode {episode.episode_number}: {episode.title}
                      </SelectItem>
                    )) || (
                      Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Episode {i + 1}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Server Info */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Currently playing from: <span className="font-medium text-foreground">{SERVERS[selectedServer].name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If the video doesn't load or has issues, try switching to a different server.
            </p>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="container mx-auto px-4 py-6 border-t border-border">
        <h2 className="text-xl font-bold mb-3">Synopsis</h2>
        <p className="text-muted-foreground leading-relaxed">
          {media.synopsis}
        </p>
      </div>
    </div>
  );
}
