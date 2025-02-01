import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MediaItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_with_title: string;
  quality: string;
}

interface FavoritesStore {
  favorites: MediaItem[];
  toggleFavorite: (item: MediaItem) => void;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (item) =>
        set((state) => {
          const exists = state.favorites.some((fav) => fav.id === item.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((fav) => fav.id !== item.id),
            };
          }
          return {
            favorites: [...state.favorites, item],
          };
        }),
    }),
    {
      name: 'favorites-storage',
    }
  )
); 