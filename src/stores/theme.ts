import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: prefersDark,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark: boolean) => set({ isDark })
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
          useThemeStore.getState().setTheme(e.matches)
        }
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    }
  )
) 