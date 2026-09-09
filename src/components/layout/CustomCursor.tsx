import React, { useEffect, useRef, useState } from 'react';

/**
 * World-class interactive custom cursor:
 * - Ultra-responsive inner dot (instant track)
 * - Inertial outer follower ring (smooth lerp)
 * - Dynamic state machine: 'default' | 'pointer' | 'project' | 'cad' | 'drag' | 'text'
 * - Displays contextual text badges (e.g. "VIEW", "CAD", "RUN")
 * - 100% disabled on touch screens and prefers-reduced-motion
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'project' | 'cad' | 'drag' | 'hidden'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      ringX = lerp(ringX, targetX, 0.16);
      ringY = lerp(ringY, targetY, 0.16);

      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // State detection via event delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor') || 'pointer';
        const label = cursorTarget.getAttribute('data-cursor-label') || '';
        setCursorState(type as any);
        setCursorLabel(label);
        return;
      }

      const interactive = target.closest('button, a, input, textarea, select, [role="button"], .interactive-hover');
      if (interactive) {
        setCursorState('pointer');
        setCursorLabel('');
        return;
      }

      setCursorState('default');
      setCursorLabel('');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  const getRingClasses = () => {
    switch (cursorState) {
      case 'project':
        return 'w-20 h-20 -ml-10 -mt-10 bg-cyan-500/20 border-cyan-400/80 backdrop-blur-[2px] shadow-[0_0_25px_rgba(34,211,238,0.45)]';
      case 'cad':
        return 'w-20 h-20 -ml-10 -mt-10 bg-amber-500/20 border-amber-400/80 backdrop-blur-[2px] shadow-[0_0_25px_rgba(251,191,36,0.45)]';
      case 'pointer':
        return 'w-12 h-12 -ml-6 -mt-6 bg-sky-400/10 border-cyan-400/50 scale-110';
      case 'drag':
        return 'w-14 h-14 -ml-7 -mt-7 bg-purple-500/15 border-purple-400/60';
      default:
        return 'w-8 h-8 -ml-4 -mt-4 border-cyan-400/35 bg-transparent';
    }
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer physics ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-[width,height,margin,background-color,border-color,transform] duration-200 ease-out will-change-transform flex items-center justify-center ${getRingClasses()}`}
      >
        {cursorLabel && (
          <span
            ref={textRef}
            className="text-[9px] font-mono font-bold uppercase tracking-wider text-white select-none animate-fadeIn"
          >
            {cursorLabel}
          </span>
        )}
      </div>

      {/* Instant center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full will-change-transform transition-transform duration-75 ${
          cursorState === 'cad'
            ? 'bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
            : cursorState === 'project'
            ? 'bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]'
            : 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]'
        }`}
      />
    </div>
  );
};
