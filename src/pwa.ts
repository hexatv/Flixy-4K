export const registerPWA = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      (navigator as any).serviceWorker.register('/sw.js', { type: 'module' })
        .then((registration: ServiceWorkerRegistration) => {
          console.log('PWA registration successful with scope:', registration.scope);
        })
        .catch((error: Error) => {
          console.error('PWA registration failed:', error);
        });
    });
  }
}; 