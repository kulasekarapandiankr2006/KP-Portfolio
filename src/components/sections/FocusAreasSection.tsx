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
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        el.style.transition = 'transform 0.1s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = `perspective(900px) rotateX(${-dy * 4.5}deg) rotateY(${dx * 4.5}deg) translateY(-6px) scale(1.02)`;
        el.style.boxShadow = '0 24px 48px -10px rgba(0,0,0,0.65), 0 0 25px rgba(6,182,212,0.18)';
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
    case 'bot':
      return <Bot className="w-6 h-6 text-cyan-400" />;
    case 'cpu':
      return <Cpu className="w-6 h-6 text-sky-400" />;
    case 'cog':
      return <Cog className="w-6 h-6 text-amber-400" />;
    case 'activity':
      return <Activity className="w-6 h-6 text-emerald-400" />;
    default:
      return <Cpu className="w-6 h-6 text-cyan-400" />;
  }
};

export const FocusAreasSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { focusAreas } = data;

  return (
    <section ref={sectionRef} id="focus" className="py-28 relative border-t border-cyan-500/10 bg-[#020713]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Engineering Verticals"
          badgeVariant="cyan"
          title="Mechatronics Focus Domains"
          subtitle="Deep cross-disciplinary competency bridging physical kinematics, deterministic embedded firmware, and autonomous robotics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, idx) => (
            <FocusCard key={area.id} delay={idx * 80}>
              <Card
                padding="lg"
                variant="interactive"
                className="flex flex-col justify-between h-full group border-cyan-500/20 bg-[#061120]/80 backdrop-blur-md hover:border-cyan-400/60 relative overflow-hidden"
                style={{ transform: 'none' } as React.CSSProperties}
              >
                {/* Index Watermark */}
                <div className="absolute top-4 right-5 text-2xl font-mono font-bold text-slate-800/80 group-hover:text-cyan-400/20 transition-colors pointer-events-none">
                  0{idx + 1}
                </div>

                <div>
                  <div className="w-13 h-13 rounded-2xl bg-slate-900/90 border border-slate-800 p-3
                    flex items-center justify-center mb-5
                    group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110
                    transition-all duration-300">
                    {getDomainIcon(area.icon)}
                  </div>

                  <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors duration-200">
                    {area.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 mt-1 mb-3">{area.subtitle}</div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">{area.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    Core Technologies:
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
