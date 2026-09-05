import { useEffect, useRef } from 'react';

/**
 * Enhanced scroll reveal with multiple animation styles.
 * 
 * CSS classes:
 *   .reveal-fade-up      — standard fade + lift (default)
 *   .reveal-fade-scale   — fade + scale from 0.92
 *   .reveal-slide-left   — slide from left
 *   .reveal-slide-right  — slide from right
 *   .reveal-depth        — depth reveal (heavier translateY + scale)
 * 
 * Add .is-visible to trigger. Delay via data-reveal-delay="200" or delay-* classes.
 * data-stagger="80" on container auto-assigns delays to children.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const root = ref.current;
    if (!root) return;

    const REVEAL_CLASSES = [
      '.reveal-fade-up',
      '.reveal-fade-scale',
      '.reveal-slide-left',
      '.reveal-slide-right',
      '.reveal-depth',
      '.reveal-on-scroll',
    ].join(', ');

    const targets = root.querySelectorAll<HTMLElement>(REVEAL_CLASSES);

    if (prefersReduced) {
      targets.forEach((el) => {
        el.classList.add('is-visible');
        el.style.transitionDelay = '0ms';
      });
      return;
    }

    // Handle data-stagger containers
    const staggerContainers = root.querySelectorAll<HTMLElement>('[data-stagger]');
    staggerContainers.forEach((container) => {
      const step = parseInt(container.dataset.stagger || '80', 10);
      const children = container.querySelectorAll<HTMLElement>(REVEAL_CLASSES);
      children.forEach((child, i) => {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${i * step}ms`;
        }
      });
    });

    // data-reveal-delay on individual elements
    targets.forEach((el) => {
      const delay = el.dataset.revealDelay;
      if (delay && !el.style.transitionDelay) {
        el.style.transitionDelay = `${delay}ms`;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -24px 0px',
        ...options,
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
