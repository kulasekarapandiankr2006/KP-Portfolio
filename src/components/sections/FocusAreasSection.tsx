import React, { useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { TechBadge } from '../common/TechBadge';
import { Bot, Cpu, Cog, Activity } from 'lucide-react';

interface FocusCardProps {
  children: React.ReactNode;
  delay: number;
}

const FocusCard: React.FC<FocusCardProps> = ({ children, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease';
    el.style.transform = '';
    el.style.boxShadow = '';
  }, []);

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        el.style.transition = 'transform 0.12s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-4px) scale(1.02)`;
        el.style.boxShadow = '0 20px 40px -8px rgba(0,0,0,0.55), 0 2px 12px -2px rgba(6,182,212,0.12)';
      });
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', reset, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, prefersReduced, reset]);

  return (
    <div
      ref={ref}
      className="reveal-fade-scale h-full"
      style={{ transitionDelay: `${delay}ms`, willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

const getDomainIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'bot':      return <Bot      className="w-6 h-6 text-cyan-400" />;
    case 'cpu':      return <Cpu      className="w-6 h-6 text-sky-400"  />;
    case 'cog':      return <Cog      className="w-6 h-6 text-amber-400"/>;
    case 'activity': return <Activity className="w-6 h-6 text-emerald-400" />;
    default:         return <Cpu      className="w-6 h-6 text-cyan-400" />;
  }
};

export const FocusAreasSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { focusAreas } = data;

  return (
    <section ref={sectionRef} id="focus" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Specializations"
          badgeVariant="cyan"
          title="Mechatronics Focus Domains"
          subtitle="Deep multi-disciplinary engineering across hardware mechanics, microcontrollers, and autonomous robotics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, idx) => (
            <FocusCard key={area.id} delay={idx * 80}>
              <Card
                padding="lg"
                variant="interactive"
                className="flex flex-col justify-between h-full group border-slate-800 hover:border-engineering-blue/50"
                style={{ transform: 'none' } as React.CSSProperties}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800
                    flex items-center justify-center mb-5
                    group-hover:border-engineering-cyan/60 group-hover:shadow-tech-cyan
                    transition-all duration-300">
                    {getDomainIcon(area.icon)}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors duration-200">
                    {area.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/80 mb-3">{area.subtitle}</div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{area.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
                    Technologies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {area.tags.map((tag, ti) => (
                      <TechBadge key={ti} name={tag} size="xs" />
                    ))}
                  </div>
                </div>
              </Card>
            </FocusCard>
          ))}
        </div>
      </div>
    </section>
  );
};
