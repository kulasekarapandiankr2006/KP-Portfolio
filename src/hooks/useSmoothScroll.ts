import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * High-performance smooth scrolling hook powered by Lenis.
 * Respects prefers-reduced-motion and provides an imperative reference to the Lenis instance.
 */
export const useSmoothScroll = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Honor reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Mobile / coarse pointer check — touch devices naturally scroll well,
    // but Lenis can provide momentum if desired. We use a gentle configuration.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
};
