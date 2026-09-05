import React, { useRef, useCallback, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useNavigation } from '../../hooks/useNavigation';
import { cadFilesystemService } from '../../services/cadFilesystemService';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Box, Ruler, ArrowUpRight } from 'lucide-react';

interface CadCard3DProps {
  children: React.ReactNode;
  staggerIndex: number;
}

const CadCard3D: React.FC<CadCard3DProps> = ({ children, staggerIndex }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lightRef   = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);
  const rafRef     = useRef<number | null>(null);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resetCard = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)';
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
    el.style.boxShadow = '';
    if (imgRef.current) {
      imgRef.current.style.transform = 'scale(1)';
      imgRef.current.style.filter = '';
    }
  }, []);

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    const el = wrapperRef.current;
    const light = lightRef.current;
    if (!el) return;

    // Find the image inside once
    imgRef.current = el.querySelector('img');

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        // Stronger tilt for CAD — mechanical feel
        const rotY =  dx * 5.5;
        const rotX = -dy * 3.5;

        el.style.transition = 'transform 0.1s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.012)`;
        el.style.boxShadow = `
          0 32px 64px -12px rgba(0,0,0,0.7),
          0 4px 24px -4px rgba(245,158,11,0.2),
          ${dx * -5}px ${dy * -5}px 30px -8px rgba(245,158,11,0.1)
        `;

        // Image subtly moves counter to card rotation — parallax depth feel
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(1.07) translate(${dx * -3}px, ${dy * -3}px)`;
          imgRef.current.style.filter = 'brightness(1.10) contrast(1.04) saturate(1.05)';
        }

        if (light) {
          const mx = ((e.clientX - rect.left) / rect.width)  * 100;
          const my = ((e.clientY - rect.top)  / rect.height) * 100;
          light.style.setProperty('--mx', `${mx}%`);
          light.style.setProperty('--my', `${my}%`);
        }
      });
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resetCard();
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, prefersReduced, resetCard]);

  return (
    <div
      ref={wrapperRef}
      className="reveal-depth rounded-xl"
      style={{
        transitionDelay: `${staggerIndex * 100}ms`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative rounded-xl overflow-hidden">
        <div ref={lightRef} className="card-mouse-light card-mouse-light-amber" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
};

export const MechanicalSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { mechanicalDesigns } = usePortfolioData();
  const { navigateToPage } = useNavigation();

  return (
    <section ref={sectionRef} id="mechanical"
      className="py-24 relative border-t border-slate-800/80"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.4) 50%, transparent 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="CAD & DFM"
          badgeVariant="amber"
          title="Mechanical & CAD Engineering Showroom"
          subtitle="High-torque gearboxes, structural monocoques, and precision mechanisms engineered for CNC, 3D printing, and sheet-metal."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mechanicalDesigns.map((mech, idx) => (
            <CadCard3D key={mech.id} staggerIndex={idx}>
              <Card
                padding="none"
                variant="interactive"
                className="flex flex-col group border-slate-800 hover:border-amber-500/50 h-full overflow-hidden"
                style={{ transform: 'none' } as React.CSSProperties}
              >
                {/* CAD image */}
                <div className="relative h-60 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={cadFilesystemService.getThumbnailUrl(mech.slug)}
                    alt={mech.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    style={{ transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease, opacity 0.4s ease' }}
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== mech.thumbnail) img.src = mech.thumbnail;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-card via-background-card/30 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="amber" size="sm">{mech.category}</Badge>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40 backdrop-blur-sm">
                      {mech.cadSoftware[0]}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-amber-400" />
                      {mech.dimensions}
                    </span>
                    <span>Mass: {mech.weight}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors duration-200">
                      {mech.title}
                    </h3>
                    <p className="text-xs font-mono text-amber-400/90 mt-1 mb-3">{mech.tagline}</p>
                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">{mech.description}</p>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Material:</span>
                        <span className="text-slate-200 truncate block">{mech.materials[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Process:</span>
                        <span className="text-slate-200 truncate block">{mech.manufacturingMethods[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {mech.cadSoftware.map((sw, si) => (
                        <span key={si} className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30">
                          {sw}
                        </span>
                      ))}
                      {mech.simulationSoftware?.map((sim, si) => (
                        <span key={si} className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30">
                          {sim}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Box className="w-3.5 h-3.5 text-amber-400" />
                      <span>{mech.cadFiles.length} CAD Files</span>
                      {mech.drawings.length > 0 && <span>· {mech.drawings.length} Drawings</span>}
                    </div>
                    <Button
                      variant="amber"
                      size="sm"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                      onClick={() => navigateToPage(`/mechanical/${mech.slug}`)}
                    >
                      Inspect CAD
                    </Button>
                  </div>
                </div>
              </Card>
            </CadCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};
