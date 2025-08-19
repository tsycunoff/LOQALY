import React, { useState, useEffect, useCallback } from 'react';

interface RouterResult {
  page: string;
  params: { [key: string]: string };
}

const parsePath = (path: string): RouterResult => {
  // Check for specific, known routes first.
  
  // Feature Detail Page: e.g., /features/qr-menu
  if (path.includes('/features/')) {
    const parts = path.split('/features/');
    if (parts[1]) {
      const featureId = parts[1].split('/')[0]; // Handle trailing slashes
      return { page: 'feature', params: { id: featureId } };
    }
  }

  // Pricing Page
  if (path.includes('/pricing')) {
    return { page: 'pricing', params: {} };
  }

  // Default to Home Page if no other route matches.
  // This is the most robust way to handle initial load in any environment,
  // as the root URL can be unpredictable (e.g., '/', '/index.html', '/some-hash/index.html').
  // This guarantees we never show a 404 on the initial load.
  return { page: 'home', params: {} };
};

export const useRouter = (): RouterResult => {
  const [route, setRoute] = useState<RouterResult>(parsePath(window.location.pathname));

  const handlePopState = useCallback(() => {
    setRoute(parsePath(window.location.pathname));
  }, []);

  useEffect(() => {
    // A custom event to handle pushState, since it doesn't trigger 'popstate'
    const handlePushState = () => {
        handlePopState();
    };
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pushstate', handlePushState);
    
    // Monkey-patch history.pushState to dispatch the custom event
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        window.dispatchEvent(new Event('pushstate'));
    };
    
    return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('pushstate', handlePushState);
        history.pushState = originalPushState; // Restore original
    };
  }, [handlePopState]);

  return route;
};

export const useNav = () => {
    return (path: string) => {
        const currentPath = window.location.pathname;
        if(currentPath === path && !path.includes('#')) return;
        window.history.pushState({}, '', path);
    }
}