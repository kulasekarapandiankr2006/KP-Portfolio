import React, { useEffect, useRef } from 'react';

/**
 * Subtle engineering cursor glow — desktop only, GPU-friendly.
 * Uses direct DOM style manipulation — zero React re-renders.
 */
export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const el = glowRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let targetX = -500, targetY = -500;
    let currentX = -500, currentY = -500;

    // Smooth lerp follow — feels premium
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.10);
      currentY = lerp(currentY, targetY, 0.10);
      el.style.left = `${currentX}px`;
      el.style.top  = `${currentY}px`;
      rafId = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
};
