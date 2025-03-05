
import { useEffect, useState } from 'react';

// Intersection Observer hook for triggering animations on scroll
export function useInView(ref: React.RefObject<HTMLElement>, options = {}) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  
  return isInView;
}

// Get animation class based on element being in view
export function getAnimationClass(isInView: boolean, animation: string, delay = 0) {
  if (!isInView) return 'opacity-0';
  
  return `animate-${animation} ${delay ? `delay-${delay}` : ''}`;
}

// Stagger children animations
export function useStaggeredAnimation(count: number, baseDelay = 100) {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}
