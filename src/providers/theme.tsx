import { ReactNode, useEffect } from 'react'
import { useThemeStore } from '@/stores/theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDark } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#000000' : '#ffffff')
    }
  }, [isDark])

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {children}
    </div>
  )
} 