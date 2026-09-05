import React, { useEffect } from 'react';

/**
 * Minimal engineering-style scroll progress bar.
 * Updates via rAF — zero React state on scroll events.
 */
export const ScrollProgress: React.FC = () => {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { bar.style.display = 'none'; return; }

    let ticking = false;
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
      bar.style.width = `${pct}%`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
};
