import { motion } from 'framer-motion';
import { useWatch } from '@/contexts/WatchContext';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeIconSolid, CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useThemeStore } from '@/stores/theme';


interface WatchStateButtonProps {
  id: string;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  className?: string;
  showTextOnMobile?: boolean;
}

export function WatchStateButton({ 
  id, 
  title, 
  poster_path, 
  media_type, 
  className = '',
  showTextOnMobile = true 
}: WatchStateButtonProps) {
  const { updateWatchState, getWatchState } = useWatch();
  const { isDark } = useThemeStore();
  const currentState = getWatchState(id);


  const getIcon = () => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5" + (currentState === 'none' ? ' opacity-70' : '');
    switch (currentState) {
      case 'watching':
        return <EyeIconSolid className={iconClass} />;
      case 'completed':
        return <CheckCircleIconSolid className={iconClass} />;
      default:
        return <EyeIcon className={iconClass} />;
    }
  };

  const getText = () => {
    switch (currentState) {
      case 'watching':
        return 'Watching';
      case 'completed':
        return 'Completed';
      default:
        return 'Track';
    }
  };

  const getStateStyles = () => {
    const darkBase = 'shadow-lg shadow-black/10';
    const lightBase = 'shadow-md shadow-black/5';
    const baseStyles = isDark ? darkBase : lightBase;

    switch (currentState) {
      case 'watching':
        return isDark
          ? `${baseStyles} bg-primary/20 text-primary border-primary/30 
             hover:bg-primary/30 hover:border-primary/40 hover:shadow-primary/20`
          : `${baseStyles} bg-primary/10 text-primary border-primary/20 
             hover:bg-primary/20 hover:border-primary/30 hover:shadow-primary/10`;
      
      case 'completed':
        return isDark
          ? `${baseStyles} bg-green-500/20 text-green-400 border-green-500/30 
             hover:bg-green-500/30 hover:border-green-500/40 hover:shadow-green-500/20`
          : `${baseStyles} bg-green-500/10 text-green-600 border-green-500/20 
             hover:bg-green-500/20 hover:border-green-500/30 hover:shadow-green-500/10`;
      
      default:
        return isDark
          ? `${baseStyles} bg-foreground/10 text-foreground/80 border-foreground/20 
             hover:bg-foreground/15 hover:text-foreground hover:border-foreground/30`
          : `${baseStyles} bg-foreground/[0.04] text-foreground/70 border-foreground/[0.15] 
             hover:bg-foreground/[0.08] hover:text-foreground/90 hover:border-foreground/25`;
    }
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onClick={() => updateWatchState({ id, title, poster_path, media_type })}
      className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-xl border 
        backdrop-blur-md transition-all duration-200 font-medium text-xs sm:text-sm
        ring-offset-background focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-primary focus-visible:ring-offset-2
        ${getStateStyles()} ${className}`}
    >
      {getIcon()}
      <span className={`tracking-wide ${!showTextOnMobile ? 'hidden sm:inline' : ''}`}>
        {getText()}
      </span>
    </motion.button>
  );
} 