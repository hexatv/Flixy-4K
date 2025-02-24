import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '@/stores/favorites';
import { ContentCard } from '@/components/ContentCard';
import { HeartIcon } from '@heroicons/react/24/outline';

export function MyListPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent rotate-12 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-primary/5 via-secondary/5 to-transparent -rotate-12 blur-3xl" />
      </div>

      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-[100px] opacity-30" />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <div className="relative inline-flex items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl opacity-50" />
                  <HeartIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary/90" />
                </motion.div>
              </div>

              <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">
                  My List
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Your curated collection of favorite movies, all in one place
              </motion.p>
            </motion.div>
          </motion.div>

          {favorites.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto p-8 rounded-2xl bg-foreground/[0.03] backdrop-blur-xl border border-foreground/10">
                <div className="mb-6">
                  <HeartIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-foreground/90">
                  Your List is Empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start adding your favorite movies by clicking the heart icon on any movie card.
                </p>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary/90 text-primary-foreground 
                    hover:bg-primary transition-colors duration-200 font-medium shadow-lg shadow-primary/20"
                >
                  Browse Movies
                </motion.a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >              
              <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                  {favorites.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <ContentCard {...item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 