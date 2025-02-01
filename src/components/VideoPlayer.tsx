import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { useRef } from 'react';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  tmdbId: string;
  season?: number;
  episode?: number;
}

export function VideoPlayer({ type, tmdbId, season, episode }: VideoPlayerProps) {
  const streamingUrl = api.getStreamingUrl(type, tmdbId, season, episode);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <iframe
        ref={iframeRef}
        src={streamingUrl}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </motion.div>
  );
} 