import { motion, AnimatePresence } from 'framer-motion';
import { useWatch } from '@/contexts/WatchContext';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '@/components/ContentCard';

interface MediaItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  backdrop_with_title: string;
  genres: Array<{ id: number; name: string }>;
  status: string;
  tagline: string;
  streamingUrl: string;
  quality: string;
}

export function MyCorner() {
  const { watchStates } = useWatch();
  const items = Object.values(watchStates).sort((a, b) => b.timestamp - a.timestamp);

  const watching = items.filter(item => item.watchState === 'watching');
  const completed = items.filter(item => item.watchState === 'completed');

  const fetchMovieDetails = async (): Promise<MediaItem[]> => {
    const response = await fetch('https://sources.hexa.watch/4k');
    const data = await response.json();
    return data.movies;
  };

  const { data: allMovies = [] } = useQuery({
    queryKey: ['4k-movies'],
    queryFn: fetchMovieDetails,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Match watch states with movie details
  const getEnrichedItems = (watchItems: typeof items) => {
    return watchItems.map(item => {
      const movieDetails = allMovies.find(movie => movie.id.toString() === item.id);
      return movieDetails ? { ...movieDetails, watchState: item.watchState } : null;
    }).filter(Boolean);
  };

  const enrichedWatching = getEnrichedItems(watching);
  const enrichedCompleted = getEnrichedItems(completed);

  return (
    <div className="w-full max-w-[1420px] mx-auto py-8 min-h-screen px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent blur-3xl -z-10" />
          <div className="flex flex-col gap-3">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Corner
              </span>
            </motion.h1>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl">
              Track your watching progress and completed content
            </p>
          </div>
        </div>

        {/* Currently Watching Section */}
        {enrichedWatching.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Currently Watching</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {enrichedWatching.map((item: any) => (
                  <ContentCard 
                    key={item.id} 
                    {...item} 
                    showWatchState={true}
                    isCornerPage={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Completed Section */}
        {enrichedCompleted.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Completed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {enrichedCompleted.map((item: any) => (
                  <ContentCard 
                    key={item.id} 
                    {...item} 
                    showWatchState={true}
                    isCornerPage={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-foreground/60">
              You haven't started tracking any content yet.
            </p>
            <Link
              to="/"
              className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground 
                hover:bg-primary/90 transition-colors duration-200"
            >
              Browse 4K Content
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
} 