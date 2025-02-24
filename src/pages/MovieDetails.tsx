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

interface ApiResponse {
  movies: MediaItem[];
}

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchMovieDetails = async (id: string): Promise<MediaItem> => {
    const response = await fetch('https://fishstick.hexa.watch/api/4k');
    const data = (await response.json()) as ApiResponse;
    
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
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
              </div>
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
              <div className="relative min-h-[70vh] rounded-[2rem] overflow-hidden">
                <motion.div 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <img
                    src={movieDetails.backdrop_with_title}
                    alt={movieDetails.title}
                    className="w-full h-full object-cover opacity-20 scale-105 rounded-[2rem]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40 rounded-[2rem]" />
                </motion.div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 pt-32">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative flex flex-col items-center"
                  >
                    <div className="relative group">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                        alt={movieDetails.title}
                        className="w-64 rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 rounded-2xl shadow-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-t from-primary/20 via-primary/0 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -bottom-4 transform -translate-y-2"
                    >
                      <WatchStateButton
                        id={id!}
                        title={movieDetails.title}
                        poster_path={movieDetails.poster_path}
                        media_type="movie"
                        className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 space-y-6 pt-4"
                  >
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                      {movieDetails.title}
                    </h1>
                    <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl">
                      {movieDetails.overview}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {new Date(movieDetails.release_date).toLocaleDateString(undefined, { 
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 backdrop-blur-xl"
              >
                <p className="text-foreground/70 font-medium flex items-center gap-3">
                  <span className="text-yellow-500 animate-pulse">⚠️</span>
                  <span>Important: Make sure to select the Yuru server for 4K content</span>
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="aspect-video w-full bg-black/50 rounded-2xl overflow-hidden border border-foreground/10 shadow-2xl"
              >
                <iframe
                  ref={iframeRef}
                  src={`https://player.videasy.net/movie/${id}?color=ffffff&server=yuru`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="fullscreen"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-4"
            >
              <div className="p-6 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-xl">
                <p className="text-lg font-medium text-red-500">
                  Unable to load movie details. Please try again later.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 