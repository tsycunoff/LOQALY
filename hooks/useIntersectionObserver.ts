import { useState, useEffect, RefObject } from 'react';

export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  { threshold = 0.1, root = null, rootMargin = '0%' }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Optional: unobserve after it's visible once
          // observer.unobserve(element);
        } else {
            // Optional: set to false if you want animation to re-trigger
            // setIsIntersecting(false);
        }
      },
      { threshold, root, rootMargin }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, threshold, root, rootMargin]);

  return isIntersecting;
};
