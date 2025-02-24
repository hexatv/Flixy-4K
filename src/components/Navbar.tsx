import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/theme'
import {
  SunIcon,
  MoonIcon,
  SparklesIcon,
  HeartIcon,
  FilmIcon,
} from '@heroicons/react/24/outline'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { DiscordIcon } from '@/components/icons/DiscordIcon'

const navLinks = [
  { 
    name: '4K Content', 
    href: '/', 
    icon: FilmIcon 
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
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3 sm:py-4'
        }`}
      >
        <div className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
        </div>

        <nav className="relative max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="relative -my-6"
            >
              <Link to="/" className="relative block">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl opacity-50 dark:opacity-30 scale-150">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full transform scale-110" />
                  </div>
                  
                  <img 
                    src="/logo.png" 
                    alt="Flixy Logo" 
                    className="relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] object-contain 
                      transition-all duration-300 hover:brightness-110" 
                  />
                </div>
              </Link>
            </motion.div>

            <div className="hidden md:block flex-1 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-1 p-1.5 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08]">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative px-6 py-2.5 rounded-xl group flex-1 text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center gap-2 relative z-10 transition-colors duration-200 ${
                        location.pathname === link.href 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <link.icon className="w-5 h-5 sm:w-[1.35rem] sm:h-[1.35rem]" />
                      <span className="font-medium text-[0.95rem]">{link.name}</span>
                    </motion.div>
                    {location.pathname === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-foreground/[0.06] border border-foreground/[0.08]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.a
                href="https://hexa.watch/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2.5 rounded-xl hover:bg-foreground/[0.04] 
                  transition-colors duration-200 border border-foreground/[0.08]
                  group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src="/hexawatchlogo.png" 
                  alt="Hexa Watch" 
                  className="w-10 h-5 object-contain opacity-80 transition-opacity duration-200
                    group-hover:opacity-100" 
                />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-tr from-foreground/5 via-foreground/10 to-foreground/5
                  blur-sm transition-opacity duration-300" />
              </motion.a>

              <div className="flex items-center gap-2">
                {[
                  { 
                    href: 'https://discord.gg/yvwWjqvzjET',
                    icon: DiscordIcon,
                    label: 'Discord'
                  },
                  {
                    href: 'https://github.com/hexatv/Flixy-4K/',
                    icon: GitHubLogoIcon,
                    label: 'GitHub'
                  }
                ].map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-3 rounded-xl hover:bg-foreground/[0.04] 
                      transition-colors duration-200 border border-foreground/[0.08]
                      group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5 text-foreground/70 transition-colors duration-200
                      group-hover:text-foreground" />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                      bg-gradient-to-tr from-foreground/5 via-foreground/10 to-foreground/5
                      blur-sm transition-opacity duration-300" />
                  </motion.a>
                ))}

                <motion.button
                  onClick={toggleTheme}
                  className="relative p-3 rounded-xl hover:bg-foreground/[0.04] 
                    transition-colors duration-200 border border-foreground/[0.08]
                    group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SunIcon className="w-5 h-5 text-foreground/70 group-hover:text-foreground
                          transition-colors duration-200" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MoonIcon className="w-5 h-5 text-foreground/70 group-hover:text-foreground
                          transition-colors duration-200" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-tr from-foreground/5 via-foreground/10 to-foreground/5
                    blur-sm transition-opacity duration-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-foreground/[0.08]">
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 
                  ${location.pathname === link.href 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                  }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 
