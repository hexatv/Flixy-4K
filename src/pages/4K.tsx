import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'; 
import { MagnifyingGlassIcon, ArrowUpIcon, AdjustmentsHorizontalIcon, FilmIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ContentCard } from '@/components/ContentCard';
import { RandomMovieModal } from '@/components/RandomMovieModal';

declare global {
  interface Window {
    scrollY: number;
    scrollTo(options: { top: number; behavior: 'auto' | 'smooth' }): void;
  }
}

interface MediaItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  backdrop_with_title: string;
  genres: Array<{ id: number; name: string; }>;
  status: string;
  tagline: string;
  streamingUrl: string;
  quality: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ApiResponse {
  success: boolean;
  movies: MediaItem[];
  total: number;
}

const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'rating-high', name: 'Highest Rated' },
  { id: 'rating-low', name: 'Lowest Rated' },
  { id: 'title-az', name: 'Title A-Z' },
  { id: 'title-za', name: 'Title Z-A' },
  { id: 'runtime-long', name: 'Longest Runtime' },
  { id: 'runtime-short', name: 'Shortest Runtime' },
] as const;

const GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const CACHE_TIME = 1000 * 60 * 60 * 24;
const STALE_TIME = 1000 * 60 * 60;

export function FourKPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]['id']>('newest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [randomMovie, setRandomMovie] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMovies = async (): Promise<MediaItem[]> => {
    try {
      const cachedData = localStorage.getItem('4k-movies');
      const cachedTimestamp = localStorage.getItem('4k-movies-timestamp');
      const cachedTotal = localStorage.getItem('4k-movies-total');
  
      if (cachedData && cachedTimestamp && cachedTotal) {
        const isStale = Date.now() - parseInt(cachedTimestamp) > STALE_TIME;
        
        const checkResponse = await fetch('https://fishstick.hexa.watch/api/4k');
        const checkData = await checkResponse.json() as ApiResponse;
        
        if (!isStale && parseInt(cachedTotal) === checkData.total) {
          const parsed = JSON.parse(cachedData) as MediaItem[];
          if (parsed.length === checkData.total) {
            console.log(`Using cached data with ${cachedTotal} movies`);
            return parsed;
          }
        }
      }

      let allMovies: MediaItem[] = [];
      let page = 1;
      let totalMovies = 0;
      
      do {
        const response = await fetch(`https://fishstick.hexa.watch/api/4k?page=${page}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json() as ApiResponse;
        
        if (!data.success || !Array.isArray(data.movies)) {
          throw new Error('Invalid data format received from API');
        }

        allMovies = [...allMovies, ...data.movies];
        totalMovies = data.total;
        
        console.log(`Fetched page ${page}: ${data.movies.length} movies (Total: ${allMovies.length}/${totalMovies})`);
        
        if (data.movies.length === 0) break;
        page++;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } while (allMovies.length < totalMovies);

      console.log(`Successfully fetched all ${allMovies.length} movies`);
      
      localStorage.setItem('4k-movies', JSON.stringify(allMovies));
      localStorage.setItem('4k-movies-timestamp', Date.now().toString());
      localStorage.setItem('4k-movies-total', totalMovies.toString());
      
      return allMovies;
    } catch (error) {
      console.error('Error fetching movies:', error);
      const cachedData = localStorage.getItem('4k-movies');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as MediaItem[];
          if (Array.isArray(parsed)) {
            console.warn('Using cached data due to fetch error');
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing cached data:', e);
        }
      }
      return [];
    }
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['4k-movies'],
    queryFn: fetchMovies,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: () => {
      const cachedData = localStorage.getItem('4k-movies');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as MediaItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing cached data:', e);
        }
      }
      return [];
    }
  });

  useEffect(() => {
    if (items?.length === 0 && !isLoading) {
      console.log('No items found in response');
    } else if (items?.length > 0) {
      console.log('Items loaded:', items.length);
    }
  }, [items, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sortFunctions = useMemo(() => ({
    newest: (a: MediaItem, b: MediaItem) => 
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
    oldest: (a: MediaItem, b: MediaItem) => 
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
    'rating-high': (a: MediaItem, b: MediaItem) => 
      (b.vote_average || 0) - (a.vote_average || 0),
    'rating-low': (a: MediaItem, b: MediaItem) => 
      (a.vote_average || 0) - (b.vote_average || 0),
    'title-az': (a: MediaItem, b: MediaItem) => 
      a.title.localeCompare(b.title),
    'title-za': (a: MediaItem, b: MediaItem) => 
      b.title.localeCompare(a.title),
    'runtime-long': (a: MediaItem, b: MediaItem) => 
      (b.runtime || 0) - (a.runtime || 0),
    'runtime-short': (a: MediaItem, b: MediaItem) => 
      (a.runtime || 0) - (b.runtime || 0),
  }), []);

  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    return items.filter((item: MediaItem) => {
      const matchesSearch = !debouncedSearch || 
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.overview.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.every(selectedGenre => 
          item.genres?.some(genre => genre.id === selectedGenre)
        );

      return matchesSearch && matchesGenres;
    });
  }, [items, debouncedSearch, selectedGenres]);

  const sortedItems = useMemo(() => {
    const sortFn = sortFunctions[sortBy];
    return sortFn ? [...filteredItems].sort(sortFn) : filteredItems;
  }, [filteredItems, sortBy, sortFunctions]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPageLoading = isLoading;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSortBy('newest');
  };

  const pickRandomMovie = () => {
    if (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      setRandomMovie(items[randomIndex]);
      setIsModalOpen(true);
    }
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
          </div>
          <p className="text-lg font-medium text-foreground/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background pb-20">
      <div className="relative isolate">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-16 text-center pt-8"
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
                <FilmIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary/90" />
              </motion.div>
            </div>

            <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">
                4K Movies
              </span>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Explore our collection of high-quality 4K content
            </motion.p>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3), 0 0 20px -5px var(--primary)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={pickRandomMovie}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground/[0.03] 
                border border-foreground/10 hover:bg-foreground/[0.05] transition-colors
                shadow-lg shadow-black/5 backdrop-blur-xl relative group mx-auto"
            >
              <SparklesIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-lg font-medium">Discover Random Movie</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <RandomMovieModal
        movie={randomMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={pickRandomMovie}
      />

      <div className="w-full max-w-[1420px] mx-auto py-8 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-8 mb-12">
            <div className="flex flex-col gap-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value || '')}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08] 
                    focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 
                    placeholder:text-foreground/40 text-foreground backdrop-blur-xl text-lg"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 blur-xl opacity-0 group-focus-within:opacity-50 transition-opacity duration-300" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  bg-foreground/[0.03] hover:bg-foreground/[0.05] border border-foreground/[0.08] 
                  hover:border-foreground/[0.15] transition-all duration-200 backdrop-blur-xl w-fit"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Filters
                <motion.span
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="ml-1 origin-center"
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground/70">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {GENRES.map(genre => (
                          <motion.button
                            key={genre.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedGenres(prev =>
                                prev.includes(genre.id)
                                  ? prev.filter(id => id !== genre.id)
                                  : [...prev, genre.id]
                              );
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                              selectedGenres.includes(genre.id)
                                ? 'bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                                : 'bg-foreground/[0.02] hover:bg-foreground/[0.04] border border-foreground/[0.08] hover:border-foreground/[0.15]'
                            }`}
                          >
                            {genre.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground/70">Sort By</h3>
                      <div className="flex flex-wrap gap-3">
                        {SORT_OPTIONS.map(option => (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSortBy(option.id)}
                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              sortBy === option.id
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary/20'
                                : 'bg-foreground/[0.03] hover:bg-foreground/[0.05] border border-foreground/[0.08] hover:border-foreground/[0.15]'
                            }`}
                          >
                            {option.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between px-1"
            >
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary font-medium text-sm">
                  {sortedItems.length}
                </span>
                <p className="text-sm text-foreground/60">
                  of {items.length} movies
                </p>
              </div>
              {(searchQuery || selectedGenres.length > 0) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors px-4 py-1.5 rounded-xl
                    hover:bg-primary/5 border border-transparent hover:border-primary/10"
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          </div>

          <LayoutGroup>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <AnimatePresence mode="wait">
                {sortedItems.map((item: MediaItem) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      duration: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 25
                    }}
                  >
                    <ContentCard {...item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </motion.div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-24 right-6 z-50 p-3 rounded-2xl 
                bg-background/80 backdrop-blur-xl border border-foreground/[0.08]
                shadow-lg hover:shadow-xl transition-all duration-300 group
                hover:border-foreground/[0.12] hover:bg-foreground/[0.03]"
              whileHover={{ 
                y: -5,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <ArrowUpIcon className="w-6 h-6 text-foreground/70 transition-transform duration-300 
                  group-hover:text-foreground group-hover:translate-y-[-2px]" />
                
                <div className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-t from-primary/20 via-primary/10 to-transparent
                  blur-md transition-opacity duration-300" />
                  
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0
                  transition-opacity duration-300" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 