import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

interface FirstTimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirstTimeGuide({ isOpen, onClose }: FirstTimeGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [randomMovieId, setRandomMovieId] = useState<string | null>(null);

  const { data: movies } = useQuery({
    queryKey: ['4k-movies'],
    queryFn: async () => {
      const cachedData = localStorage.getItem('4k-movies');
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return [];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen && movies?.length > 0 && !randomMovieId) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setRandomMovieId(randomMovie.id.toString());
    }
  }, [isOpen, movies]);

  const handleClose = () => {
    localStorage.setItem('has-seen-guide', 'true');
    onClose();
  };

  const getStepText = (step: number) => {
    switch (step) {
      case 1:
        return "Start by playing the movie";
      case 2:
        return "Click the server selection menu";
      case 3:
        return "Select the Yuru server for 4K quality";
      case 4:
        return (
          <div className="space-y-3">
            <p>Click the heart to save Yuru as default</p>
            <div className="mt-4 p-3 rounded-lg bg-foreground/[0.03] border border-foreground/10">
              <p className="text-sm text-foreground/70">
                💡 <span className="font-medium">Pro tip:</span> For the best ad-free experience, 
                we recommend installing{' '}
                <a 
                  href="https://ublockorigin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  uBlock Origin
                </a>
              </p>
            </div>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        >
          <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full lg:w-[900px] overflow-hidden rounded-xl sm:rounded-2xl 
                bg-background/95 backdrop-blur-xl shadow-2xl border border-foreground/10"
            >
              <div className="relative w-full bg-black/50">
                <div className="aspect-video lg:h-[600px]">
                  {randomMovieId ? (
                    <iframe
                      key={randomMovieId}
                      src={`https://player.videasy.net/movie/${randomMovieId}?color=ffffff`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="fullscreen"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full lg:w-[900px]"
            >
              <button
                onClick={handleClose}
                className="absolute -top-2 right-0 z-10 p-2 rounded-full 
                  bg-background/50 backdrop-blur-sm border border-foreground/10
                  text-foreground/70 hover:bg-foreground/10 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="bg-background/95 backdrop-blur-xl rounded-xl sm:rounded-2xl 
                border border-foreground/10 shadow-2xl overflow-hidden
                min-h-[350px] lg:h-[600px] flex flex-col"
              >
                <div className="flex-1 p-6 sm:p-8 space-y-6 lg:space-y-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Welcome to Flixy! 🎬</h2>
                  <p className="text-base sm:text-lg lg:text-xl text-foreground/70 text-center">
                    Let's set up your viewing experience for the best quality in 4 easy steps.
                  </p>

                  <div className="flex justify-center gap-3 pt-4 lg:pt-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-colors duration-300 ${
                          step === currentStep ? 'bg-primary' : 'bg-foreground/20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 lg:mt-8 p-4 lg:p-8 rounded-xl bg-foreground/[0.02] border border-foreground/10">
                    <div className="text-lg sm:text-xl lg:text-2xl font-medium text-center">
                      Step {currentStep}: {getStepText(currentStep)}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => currentStep < 4 ? setCurrentStep(currentStep + 1) : handleClose()}
                    className="w-full px-6 py-3 lg:py-4 rounded-xl bg-primary/20 text-primary 
                      border border-primary/30 hover:bg-primary/30 transition-colors mt-8 lg:mt-auto
                      text-base sm:text-lg lg:text-xl font-medium"
                  >
                    {currentStep < 4 ? 'Next Step' : 'Finish Setup'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 