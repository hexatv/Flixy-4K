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

export function ContentCard(item: ContentCardProps & { showWatchState?: boolean; isCornerPage?: boolean }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === item.id);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/movie/${item.id}?provider=videasy`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 30 }
      }}
      onClick={handleCardClick}
      className="group cursor-pointer relative isolate"
    >
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-foreground/[0.02] backdrop-blur-xl 
        border border-foreground/[0.08] shadow-md group-hover:shadow-xl
        transition-all duration-500 ease-out transform-gpu"
      >
        <div className="relative aspect-[16/9]">
          <img
            src={item.backdrop_with_title}
            className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-105 group-hover:rotate-1 will-change-transform"
            loading="eager"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 
            opacity-60 group-hover:opacity-90 transition-opacity duration-500" 
          />

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full z-10
              backdrop-blur-md transition-colors duration-200
              ${isFavorite 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-black/20 text-white/70 hover:bg-black/30'
              }`}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </motion.button>

          {/* Info Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-medium text-white/90">
              {new Date(item.release_date).getFullYear()}
            </span>
            
            {item.vote_average > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star}
                      className={`text-xs ${
                        star <= Math.round(item.vote_average / 2)
                          ? 'text-yellow-400'
                          : 'text-white/20'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-white/90">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Watch State Button */}
          {item.showWatchState && (
            <div className="absolute top-2 left-2 z-10">
              <WatchStateButton
                id={item.id.toString()}
                poster_path={item.backdrop_with_title}
                title={item.title}
                media_type="movie"
                className={item.isCornerPage ? "!py-1 !px-2.5 sm:!px-4 sm:!py-2" : ""}
                showTextOnMobile={!item.isCornerPage}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 