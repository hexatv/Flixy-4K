import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '@/stores/favorites';
import { ContentCard } from '@/components/ContentCard';

export function MyListPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Background Patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent rotate-12 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-primary/5 via-secondary/5 to-transparent -rotate-12 blur-3xl" />
      </div>

      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-[100px] opacity-30" />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">
                  My List
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xl text-muted-foreground"
              >
                Your favorite movies in one place
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Content Grid */}
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No favorites added yet. Start adding some movies to your list!
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Grid Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl -z-10" />
              
              <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:gap-8">
                <AnimatePresence mode="popLayout">
                  {favorites.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
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