import { useRef, useCallback, useEffect } from 'react';

interface Tilt3DOptions {
  maxDeg?: number;      // max rotation in degrees (default 2)
  perspective?: number; // CSS perspective px (default 900)
  scale?: number;       // hover scale (default 1.008)
  transitionMs?: number;
  liftPx?: number;
}

/**
 * Lightweight mouse-position-based 3D tilt for engineering cards.
 * - Max 2deg rotation (extremely subtle)
 * - GPU-friendly: only transforms/opacity
 * - Auto-disabled on touch devices
 * - Cleans up event listeners
 */
export function use3DTilt<T extends HTMLElement = HTMLDivElement>(
  opts: Tilt3DOptions = {}
) {
  const {
    maxDeg = 2,
    perspective = 900,
    scale = 1.008,
    transitionMs = 300,
    liftPx = 4,
  } = opts;

  const ref = useRef<T>(null);
  const rafRef = useRef<number | null>(null);

  // Check once for reduced motion and touch
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const applyTransform = useCallback(
    (rotX: number, rotY: number, lift: number, sc: number, transition: string) => {
      const el = ref.current;
      if (!el) return;
      el.style.transition = transition;
      el.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-${lift}px) scale(${sc})`;
    },
    [perspective]
  );

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
        const rotY = dx * maxDeg;
        const rotX = -dy * (maxDeg * 0.6);
        applyTransform(rotX, rotY, liftPx, scale, `transform ${transitionMs * 0.4}ms cubic-bezier(0.22, 1, 0.36, 1)`);
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      applyTransform(0, 0, 0, 1, `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransform, isTouch, liftPx, maxDeg, prefersReduced, scale, transitionMs]);

  return ref;
}
