import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WatchStateButton } from '@/components/WatchStateButton';
import { useQuery } from '@tanstack/react-query';

interface MovieDetails {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
}

interface MediaItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  backdrop_with_title: string;
}

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchMovieDetails = async (id: string): Promise<MediaItem> => {
    const response = await fetch('https://sources.hexa.watch/4k');
    const data = await response.json();
    
    const movie = data.movies.find((m: MediaItem) => m.id === parseInt(id));
    if (!movie) {
      throw new Error('Movie not found');
    }
    
    return movie;
  };

  const { data: movieDetails } = useQuery({
    queryKey: ['movie-details', id],
    queryFn: () => fetchMovieDetails(id || ''),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (movieDetails) {
      setIsLoading(false);
    }
  }, [movieDetails]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
            >
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-lg font-medium text-foreground/70">Loading movie details...</p>
            </motion.div>
          ) : movieDetails ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Movie Info */}
              <div className="relative">
                <div className="absolute inset-0">
                  <img
                    src={movieDetails.backdrop_with_title}
                    alt={movieDetails.title}
                    className="w-full h-full object-cover opacity-20 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8">
                  <div className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                      alt={movieDetails.title}
                      className="w-64 rounded-lg shadow-2xl"
                    />
                    {/* Watch Button positioned over poster bottom */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-max">
                      <WatchStateButton
                        id={id!}
                        title={movieDetails.title}
                        poster_path={movieDetails.poster_path}
                        media_type="movie"
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 pt-4">
                    <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
                    <p className="text-lg text-muted-foreground">{movieDetails.overview}</p>
                    <p className="text-sm text-muted-foreground">
                      Release Date: {new Date(movieDetails.release_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Server Selection Message */}
              <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4">
                <p className="text-foreground/70 font-medium flex items-center gap-2">
                  <span className="text-yellow-500">⚠️</span>
                  Important: Make sure to select the Yuru server for 4K content
                </p>
              </div>

              {/* Video Player */}
              <div className="aspect-video w-full bg-black/50 rounded-xl overflow-hidden border border-foreground/10">
                <iframe
                  ref={iframeRef}
                  src={`https://player.videasy.net/movie/${id}?color=ffffff`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="fullscreen"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
            >
              <p className="text-lg font-medium text-foreground/70">
                Unable to load movie details. Please try again later.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 