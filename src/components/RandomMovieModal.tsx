import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlayCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface RandomMovieModalProps {
  movie: {
    id: number;
    title: string;
    backdrop_with_title: string;
    overview: string;
    release_date: string;
    vote_average: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export function RandomMovieModal({ movie, isOpen, onClose, onNext }: RandomMovieModalProps) {
  const navigate = useNavigate();
  
  if (!movie) return null;

  const handleWatch = () => {
    navigate(`/movie/${movie.id}?provider=videasy`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background/95 backdrop-blur-xl 
              shadow-2xl border border-foreground/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 
                text-white/70 hover:bg-black/30 transition-colors backdrop-blur-sm
                hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </motion.button>

            <div className="relative aspect-video group">
              <img
                src={movie.backdrop_with_title}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWatch}
                  className="p-4 rounded-full bg-primary/20 text-primary hover:bg-primary/30 
                    transition-colors backdrop-blur-xl ring-2 ring-primary/20"
                >
                  <PlayCircleIcon className="w-12 h-12" />
                </motion.button>
              </motion.div>
            </div>

            <div className="relative p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold"
                  >
                    {movie.title}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 text-sm text-foreground/60"
                  >
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    {movie.vote_average > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-foreground/70 line-clamp-3"
              >
                {movie.overview}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWatch}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground
                    hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20
                    flex items-center justify-center gap-2 font-medium"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Watch Now
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-foreground/10 
                    hover:bg-foreground/20 transition-colors backdrop-blur-xl
                    flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Try Another
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 