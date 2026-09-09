import React, { useEffect, useState, useRef } from 'react';

interface CounterProps {
  value: string;
  duration?: number; // ms
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({ value, duration = 1800, className = '' }) => {
  // Extract number and suffix from string e.g. "18+" -> num=18, suffix="+"
  const match = value.match(/^([~><]?\s*)(\d+)(\S*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseInt(match[2], 10) : NaN;
  const suffix = match ? match[3] : '';

  const [displayValue, setDisplayValue] = useState<number | string>(() => isNaN(targetNum) ? value : 0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (isNaN(targetNum)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetNum);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * targetNum);
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(targetNum);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, targetNum, duration]);

  if (isNaN(targetNum)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
