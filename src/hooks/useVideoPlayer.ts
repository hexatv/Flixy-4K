import { useRef } from 'react';

export function useVideoPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  return iframeRef;
} 