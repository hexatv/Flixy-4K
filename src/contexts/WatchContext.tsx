import { createContext, useContext, useEffect, useState } from 'react';

type WatchState = 'watching' | 'completed' | 'none';

interface WatchItem {
  id: string;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  watchState: WatchState;
  timestamp: number;
}

interface WatchContextType {
  watchStates: Record<string, WatchItem>;
  updateWatchState: (item: Omit<WatchItem, 'timestamp' | 'watchState'>) => void;
  getWatchState: (id: string) => WatchState;
  removeWatchState: (id: string) => void;
}

const WatchContext = createContext<WatchContextType | null>(null);

export function WatchProvider({ children }: { children: React.ReactNode }) {
  const [watchStates, setWatchStates] = useState<Record<string, WatchItem>>(() => {
    const saved = localStorage.getItem('watchStates');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('watchStates', JSON.stringify(watchStates));
  }, [watchStates]);

  const updateWatchState = (item: Omit<WatchItem, 'timestamp' | 'watchState'>) => {
    setWatchStates(prev => {
      const currentState = prev[item.id]?.watchState || 'none';
      const newState: WatchState = 
        currentState === 'none' ? 'watching' :
        currentState === 'watching' ? 'completed' : 'none';

      if (newState === 'none') {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [item.id]: {
          ...item,
          watchState: newState,
          timestamp: Date.now()
        }
      };
    });
  };

  const getWatchState = (id: string): WatchState => {
    return watchStates[id]?.watchState || 'none';
  };

  const removeWatchState = (id: string) => {
    setWatchStates(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <WatchContext.Provider value={{ 
      watchStates, 
      updateWatchState, 
      getWatchState,
      removeWatchState 
    }}>
      {children}
    </WatchContext.Provider>
  );
}

export const useWatch = () => {
  const context = useContext(WatchContext);
  if (!context) {
    throw new Error('useWatch must be used within a WatchProvider');
  }
  return context;
}; 