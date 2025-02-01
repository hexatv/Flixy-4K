export const registerPWA = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { type: 'module' })
        .then(registration => {
          console.log('PWA registration successful with scope:', registration.scope);
        })
        .catch(error => {
          console.error('PWA registration failed:', error);
        });
    });
  }
}; 