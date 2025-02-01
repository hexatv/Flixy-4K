import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'; 
import { MagnifyingGlassIcon, ArrowUpIcon, AdjustmentsHorizontalIcon, FilmIcon } from '@heroicons/react/24/outline';
import { ContentCard } from '@/components/ContentCard';
import { RandomMovieModal } from '@/components/RandomMovieModal';

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

  const fetchMovies = async (): Promise<MediaItem[]> => {
    try {
      const cachedData = localStorage.getItem('4k-movies');
      const cachedTimestamp = localStorage.getItem('4k-movies-timestamp');
  
      if (cachedData && cachedTimestamp) {
        const isStale = Date.now() - parseInt(cachedTimestamp) > STALE_TIME;
        if (!isStale) {
          return JSON.parse(cachedData);
        }
      }

      const response = await fetch('https://sources.hexa.watch/4k', {
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
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success && Array.isArray(data.movies)) {
        localStorage.setItem('4k-movies', JSON.stringify(data.movies));
        localStorage.setItem('4k-movies-timestamp', Date.now().toString());
        
        return data.movies;
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      const cachedData = localStorage.getItem('4k-movies');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed)) {
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    console.log('Items loaded:', items?.length);
    if (items?.length === 0) {
      console.log('No items found in response');
    }
  }, [items]);

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

  const filteredAndSortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter((item: MediaItem) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item: MediaItem) =>
        selectedGenres.every((selectedGenre: number) =>
          item.genres?.some((genre: { id: number; name: string }) => genre.id === selectedGenre)
        )
      );
    }

    const sortFn = sortFunctions[sortBy as keyof typeof sortFunctions];
    return sortFn ? [...filtered].sort(sortFn) : filtered;
  }, [items, searchQuery, selectedGenres, sortBy, sortFunctions]);

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
    <div className="min-h-screen pb-20">
      <div className="flex flex-col items-center justify-center py-8 px-4 space-y-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={pickRandomMovie}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground/[0.05] 
            border border-foreground/10 hover:bg-foreground/10 transition-colors
            shadow-lg shadow-black/5"
        >
          <FilmIcon className="w-5 h-5" />
          <span>Pick Random Movie</span>
        </motion.button>
      </div>

      <RandomMovieModal
        movie={randomMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={pickRandomMovie}
      />

      <div className="w-full max-w-[1420px] mx-auto py-8 min-h-screen px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-8 mb-12">
            <div className="flex flex-col gap-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-foreground/40" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08] 
                    focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 
                    placeholder:text-foreground/40 text-foreground backdrop-blur-xl text-lg"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 blur-xl opacity-50" />
              </div>

              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  bg-foreground/[0.03] hover:bg-foreground/[0.05] border border-foreground/[0.08] 
                  hover:border-foreground/[0.15] transition-all duration-200"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Filters
                <motion.span
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  className="ml-1"
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
                    transition={{ duration: 0.2 }}
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
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium text-sm">
                  {filteredAndSortedItems.length}
                </span>
                <p className="text-sm text-foreground/60">
                  of {items.length} movies
                </p>
              </div>
              {(searchQuery || selectedGenres.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          </div>

          <LayoutGroup>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
              <AnimatePresence mode="wait">
                {filteredAndSortedItems.map((item: MediaItem) => (
                  <ContentCard key={item.id} {...item} />
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </motion.div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-24 right-6 z-50 p-2.5 rounded-xl 
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
                <ArrowUpIcon className="w-5 h-5 text-foreground/70 transition-transform duration-300 
                  group-hover:text-foreground group-hover:translate-y-[-2px]" />
                
                {/* Hover glow effect */}
                <div className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-t from-primary/20 via-primary/10 to-transparent
                  blur-md transition-opacity duration-300" />
                  
                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
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