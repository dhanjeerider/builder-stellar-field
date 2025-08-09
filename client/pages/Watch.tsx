import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SERVERS } from "@shared/types";
import { tmdbService, TMDBMovie, TMDBTVShow, getImageUrl } from "@shared/tmdb";

export default function Watch() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [media, setMedia] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const mediaId = parseInt(id);
        const isMovie = type === "movie";

        if (isMovie) {
          const movieDetails = await tmdbService.getMovieDetails(mediaId);
          setMedia(movieDetails);
        } else {
          const tvDetails = await tmdbService.getTVShowDetails(mediaId);
          setMedia(tvDetails);
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
        setError("Failed to load content details");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id, type]);

  // Generate IMDB ID placeholder (would need proper API call for real IMDB IDs)
  const generateIMDBId = (tmdbId: number) =>
    `tt${tmdbId.toString().padStart(7, "0")}`;

  const generatePlayerUrl = (serverIndex: number) => {
    if (!media) return "";

    const server = SERVERS[serverIndex];
    const imdbId = generateIMDBId(media.id);
    let url = "";

    const isMovie = type === "movie";

    if (isMovie) {
      url =
        server.type === "imdb"
          ? server.url.replace("{imdb_id}", imdbId)
          : server.url.replace("{tmdb_id}", media.id.toString());
    } else {
      url =
        server.type === "imdb"
          ? server.url_tv
              .replace("{imdb_id}", imdbId)
              .replace("{season}", selectedSeason.toString())
              .replace("{episode}", selectedEpisode.toString())
          : server.url_tv
              .replace("{tmdb_id}", media.id.toString())
              .replace("{season}", selectedSeason.toString())
              .replace("{episode}", selectedEpisode.toString());
    }

    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The content you're trying to watch doesn't exist."}
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isMovie = type === "movie";
  const title = isMovie
    ? (media as TMDBMovie).title
    : (media as TMDBTVShow).name;
  const releaseDate = isMovie
    ? (media as TMDBMovie).release_date
    : (media as TMDBTVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const tvShow = !isMovie ? (media as TMDBTVShow) : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="neu-header border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/${type}/${id}`}>
                <Button variant="ghost" size="icon" className="neu-button">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <img
                  src={getImageUrl(media.poster_path, "w154")}
                  alt={title}
                  className="w-12 h-16 object-cover rounded bg-muted"
                />
                <div>
                  <h1 className="font-bold text-lg">{title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{year}</span>
                    <Badge variant="secondary" className="quality-badge">
                      HD
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="neu-button">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="neu-button">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="neu-button">
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
          className="w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Controls */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Server Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Server</label>
              <Select
                value={selectedServer.toString()}
                onValueChange={(value) => setSelectedServer(parseInt(value))}
              >
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
              <div className="space-y-3">
                <label className="text-sm font-medium">Season</label>
                <Select
                  value={selectedSeason.toString()}
                  onValueChange={(value) => setSelectedSeason(parseInt(value))}
                >
                  <SelectTrigger className="neu-card-inset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tvShow.seasons.map((season) => (
                      <SelectItem
                        key={season.season_number}
                        value={season.season_number.toString()}
                      >
                        Season {season.season_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Episode Selection (TV Shows only) */}
            {!isMovie && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Episode</label>
                <Select
                  value={selectedEpisode.toString()}
                  onValueChange={(value) => setSelectedEpisode(parseInt(value))}
                >
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
          <div className="mt-6 p-4 neu-card-inset bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Currently streaming from:{" "}
              <span className="font-medium text-foreground">
                {SERVERS[selectedServer].name}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If the video doesn't load or has buffering issues, try switching
              to a different server above.
            </p>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="container mx-auto px-4 py-6 border-t border-border">
        <h2 className="text-xl font-bold mb-3">About</h2>
        <p className="text-muted-foreground leading-relaxed">
          {media.overview}
        </p>
      </div>
    </div>
  );
}
