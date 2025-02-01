import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/theme'
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

const navLinks = [
  { 
    name: '4K Content', 
    href: '/', 
    icon: SparklesIcon 
  },
  {
    name: 'My List',
    href: '/my-list',
    icon: HeartIcon
  },
  {
    name: 'My Corner',
    href: '/my-corner',
    icon: SparklesIcon
  }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isDark, toggleTheme } = useThemeStore()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-1 sm:py-2' : 'py-2 sm:py-3'
        }`}
      >
        {/* Enhanced Background effect for both themes */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/[0.08]" />
        </div>

        {/* Main navigation */}
        <nav className="relative max-w-[1440px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-8">
            {/* Logo Section */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="relative -my-6 sm:-my-8"
            >
              <Link to="/" className="relative flex items-center">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center"
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 blur-xl opacity-50 dark:opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 via-foreground/30 to-foreground/20 dark:from-white/20 dark:via-white/30 dark:to-white/20 rounded-full transform scale-110" />
                    </div>
                    
                    {/* Logo image */}
                    <img 
                      src="/logo.png" 
                      alt="Flixy Logo" 
                      className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain 
                        transition-all duration-300 hover:brightness-110" 
                    />
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent 
                      rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-foreground/[0.03] border border-foreground/[0.08]">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative px-4 py-2 rounded-full group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-2 relative z-10 transition-colors duration-200 ${
                        location.pathname === link.href 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </motion.div>
                    {location.pathname === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Theme and GitHub buttons container */}
            <div className="flex items-center gap-2">
              {/* GitHub Button */}
              <motion.a
                href="https://github.com/hexacode/flixy"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-2 rounded-full hover:bg-foreground/[0.08] 
                  transition-colors duration-200 border border-foreground/[0.08]
                  group"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <GitHubLogoIcon className="w-5 h-5 text-foreground/80 transition-colors duration-200
                  group-hover:text-foreground" />
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                  bg-gradient-to-tr from-foreground/5 via-foreground/10 to-foreground/5
                  blur-sm transition-opacity duration-300" />
              </motion.a>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="relative p-2 rounded-full hover:bg-foreground/[0.08] 
                  transition-colors duration-200 border border-foreground/[0.08]"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SunIcon className="w-5 h-5 text-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, opacity: 0, rotate: 180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: -180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoonIcon className="w-5 h-5 text-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-foreground/[0.08]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 
                  ${location.pathname === link.href 
                    ? 'text-primary bg-foreground/[0.08]' 
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                  }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Add subtle gradient overlay */}
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
    </>
  )
} 