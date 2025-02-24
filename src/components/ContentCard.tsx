import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/stores/favorites';
import { useNavigate } from 'react-router-dom';
import { WatchStateButton } from '@/components/WatchStateButton';

interface ContentCardProps {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_with_title: string;
  showWatchState?: boolean;
  isCornerPage?: boolean;
}

export function ContentCard({ 
  id, 
  title, 
  overview, 
  release_date, 
  vote_average, 
  backdrop_with_title, 
  showWatchState, 
  isCornerPage 
}: ContentCardProps) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === id);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as unknown as Element;
    if (!target.closest('button')) {
      navigate(`/movie/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({ id, title, overview, release_date, vote_average, backdrop_with_title, quality: '4K' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onClick={handleCardClick}
      className="group cursor-pointer relative isolate"
    >
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-foreground/[0.02] backdrop-blur-xl 
          border border-foreground/[0.08] shadow-lg transition-all duration-500 ease-out transform-gpu
          group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:border-foreground/[0.15]"
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35), 0 0 25px -5px var(--primary)"
        }}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={backdrop_with_title}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7 }}
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '16/9',
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent 
            opacity-60 group-hover:opacity-75 transition-opacity duration-500" 
          />

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2.5 rounded-xl z-10
              backdrop-blur-xl shadow-lg transition-all duration-300
              ${isFavorite 
                ? 'bg-primary/20 text-primary hover:bg-primary/30 scale-110 ring-2 ring-primary/20' 
                : 'bg-black/20 text-white/70 hover:bg-black/30'
              }`}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 drop-shadow" />
            ) : (
              <HeartIcon className="w-5 h-5 drop-shadow" />
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/10 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </motion.button>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm sm:text-base font-medium text-white/90 tracking-wide drop-shadow-lg"
                >
                  {new Date(release_date).getFullYear()}
                </motion.span>
                
                {vote_average > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          className={`text-sm sm:text-base transition-colors duration-300 drop-shadow-lg ${
                            star <= Math.round(vote_average / 2)
                              ? 'text-yellow-400 group-hover:text-yellow-300'
                              : 'text-white/20'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-white/90 drop-shadow-lg">
                      {vote_average.toFixed(1)}
                    </span>
                  </motion.div>
                )}
              </div>

              {showWatchState && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isCornerPage ? 'absolute bottom-16 right-4 z-10' : 'pt-2'}`}
                >
                  <WatchStateButton
                    id={id.toString()}
                    poster_path={backdrop_with_title}
                    title={title}
                    media_type="movie"
                    className={`${isCornerPage 
                      ? "!py-1.5 !px-3 sm:!px-4 sm:!py-2 !text-sm backdrop-blur-xl bg-black/20 hover:bg-black/30 border border-white/10" 
                      : ""} shadow-lg transition-transform duration-300 hover:scale-105
                      hover:shadow-xl hover:shadow-primary/10`}
                    showTextOnMobile={!isCornerPage}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 translate-x-full group-hover:translate-x-[-250%] 
              bg-gradient-to-r from-transparent via-white/10 to-transparent transform-gpu transition-transform 
              duration-[1.5s] ease-in-out" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 