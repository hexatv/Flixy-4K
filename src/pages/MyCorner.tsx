import { motion, AnimatePresence } from 'framer-motion';
import { useWatch } from '@/contexts/WatchContext';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '@/components/ContentCard';
import { SparklesIcon, PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
    const response = await fetch('https://fishstick.hexa.watch/api/4k');
    const data = (await response.json()) as { movies: MediaItem[] };
    return data.movies;
  };

  const { data: allMovies = [] } = useQuery({
    queryKey: ['4k-movies'],
    queryFn: fetchMovieDetails,
    staleTime: 1000 * 60 * 60,
  });

  const getEnrichedItems = (watchItems: typeof items) => {
    return watchItems.map(item => {
      const movieDetails = allMovies.find(movie => movie.id.toString() === item.id);
      return movieDetails ? { ...movieDetails, watchState: item.watchState } : null;
    }).filter(Boolean);
  };

  const enrichedWatching = getEnrichedItems(watching);
  const enrichedCompleted = getEnrichedItems(completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-[100px] opacity-30" />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl opacity-50" />
                  <SparklesIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary/90" />
                </motion.div>
              </div>

              <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">
                  My Corner
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Track your watching progress and completed content
              </motion.p>
            </motion.div>
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto p-8 rounded-2xl bg-foreground/[0.03] backdrop-blur-xl border border-foreground/10">
                <div className="mb-6">
                  <SparklesIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-foreground/90">
                  Your Corner is Empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start tracking your watching progress by using the watch state buttons on movie cards.
                </p>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary/90 text-primary-foreground 
                    hover:bg-primary transition-colors duration-200 font-medium shadow-lg shadow-primary/20"
                >
                  Browse Movies
                </motion.a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {enrichedWatching.length > 0 && (
                <section className="relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <PlayCircleIcon className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-semibold">Currently Watching</h2>
                      <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                        {enrichedWatching.length}
                      </span>
                    </div>
                    <p className="text-muted-foreground">Movies you're currently enjoying</p>
                  </motion.div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                      {enrichedWatching.map((item: any, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 20 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                        >
                          <ContentCard 
                            {...item} 
                            showWatchState={true}
                            isCornerPage={true}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {enrichedCompleted.length > 0 && (
                <section className="relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircleIcon className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-semibold">Completed</h2>
                      <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                        {enrichedCompleted.length}
                      </span>
                    </div>
                    <p className="text-muted-foreground">Movies you've finished watching</p>
                  </motion.div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                      {enrichedCompleted.map((item: any, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 20 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                        >
                          <ContentCard 
                            {...item} 
                            showWatchState={true}
                            isCornerPage={true}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 