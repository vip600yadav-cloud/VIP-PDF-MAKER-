// Vercel Speed Insights initialization
// This script initializes Vercel Speed Insights for performance monitoring
// Only runs on the client side (browser)

(function() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Initialize the Speed Insights queue if not already present
  if (!window.si) {
    window.si = function(...params) {
      if (!window.siq) {
        window.siq = [];
      }
      window.siq.push(params);
    };
  }

  // Import the injectSpeedInsights function from the @vercel/speed-insights package
  // Using dynamic import to ensure it loads after the page is ready
  Promise.resolve().then(() => {
    // For plain HTML sites, we can use the inject function via require-like behavior
    // The package provides an injectable script that can be loaded dynamically
    
    // Create and inject the Speed Insights script tag
    const script = document.createElement('script');
    script.src = '/_vercel/speed-insights/script.js';
    script.defer = true;
    script.dataset.sdkn = '@vercel/speed-insights';
    script.onerror = () => {
      console.log('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled.');
    };
    
    document.head.appendChild(script);
  });
})();
