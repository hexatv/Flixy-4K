import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme';
import { QueryProvider } from '@/providers/query';
import Navbar from '@/components/Navbar';
import { FourKPage } from '@/pages/4K'
import { MovieDetails } from '@/pages/MovieDetails';
import { MyListPage } from '@/pages/MyList';
import { WatchProvider } from '@/contexts/WatchContext';
import { MyCorner } from '@/pages/MyCorner';
import { useState, useEffect } from 'react';
import { FirstTimeGuide } from '@/components/FirstTimeGuide';

export default function App() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('has-seen-guide');
    if (!hasSeenGuide) {
      // Add a small delay to ensure components are mounted
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <WatchProvider>
      <QueryProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <div className="relative">
              <Navbar />
              <main className="pt-28 md:pt-32 pb-24 md:pb-8">
                <Routes>
                  <Route path="/" element={<FourKPage />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/my-list" element={<MyListPage />} />
                  <Route path="/my-corner" element={<MyCorner />} />
                </Routes>
              </main>
            </div>
            <FirstTimeGuide 
              isOpen={showGuide} 
              onClose={() => setShowGuide(false)} 
            />
          </div>
        </ThemeProvider>
      </QueryProvider>
    </WatchProvider>
  );
} 