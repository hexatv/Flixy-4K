import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface RandomMovieModalProps {
  movie: {
    id: number;
    title: string;
    backdrop_with_title: string;
    overview: string;
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-background/95 backdrop-blur-xl 
              shadow-2xl border border-foreground/10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/20 
                text-white/70 hover:bg-black/30 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Movie backdrop */}
            <div className="relative aspect-video">
              <img
                src={movie.backdrop_with_title}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              
              <p className="text-sm text-foreground/70">
                {movie.overview.length > 200 
                  ? movie.overview.slice(0, 200) + '...' 
                  : movie.overview}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWatch}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary/20 text-primary 
                    border border-primary/30 hover:bg-primary/30 transition-colors"
                >
                  Watch Now
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-foreground/10 
                    border border-foreground/20 hover:bg-foreground/20 transition-colors"
                >
                  Next Movie
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 