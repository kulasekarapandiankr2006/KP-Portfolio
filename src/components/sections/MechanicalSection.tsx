import React, { useRef, useCallback, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useNavigation } from '../../hooks/useNavigation';
import { cadFilesystemService } from '../../services/cadFilesystemService';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Box, Ruler, ArrowUpRight } from 'lucide-react';

interface CadCard3DProps {
  children: React.ReactNode;
  staggerIndex: number;
}

const CadCard3D: React.FC<CadCard3DProps> = ({ children, staggerIndex }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

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

    imgRef.current = el.querySelector('img');

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const rotY = dx * 5.5;
        const rotX = -dy * 3.5;

        el.style.transition = 'transform 0.1s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px) scale(1.015)`;
        el.style.boxShadow = `
          0 32px 64px -12px rgba(0,0,0,0.75),
          0 4px 24px -4px rgba(245,158,11,0.25),
          ${dx * -5}px ${dy * -5}px 30px -8px rgba(245,158,11,0.12)
        `;

        if (imgRef.current) {
          imgRef.current.style.transform = `scale(1.08) translate(${dx * -4}px, ${dy * -4}px)`;
          imgRef.current.style.filter = 'brightness(1.12) contrast(1.05) saturate(1.06)';
        }

        if (light) {
          const mx = ((e.clientX - rect.left) / rect.width) * 100;
          const my = ((e.clientY - rect.top) / rect.height) * 100;
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
      className="reveal-depth rounded-2xl h-full flex flex-col cursor-pointer"
      style={{
        transitionDelay: `${staggerIndex * 100}ms`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      data-cursor="cad"
      data-cursor-label="CAD"
    >
      <div className="relative rounded-2xl overflow-hidden h-full flex flex-col border border-amber-500/25 bg-[#070e1b]/90 backdrop-blur-md hover:border-amber-400/60 transition-colors">
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
    <section
      ref={sectionRef}
      id="mechanical"
      className="py-28 relative border-t border-amber-500/15 bg-[#020712] overflow-hidden"
    >
      {/* Background blueprint elements */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,158,11,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute right-[-5%] top-[10%] w-[500px] h-[500px] bg-amber-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badgeText="Precision CAD & DFM"
          badgeVariant="amber"
          title="Mechanical CAD & Actuator Showroom"
          subtitle="High-torque cycloidal gearboxes, structural monocoques, and precision mechanisms engineered for CNC, 3D printing, and sheet-metal fabrication."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {mechanicalDesigns.map((mech, idx) => (
            <CadCard3D key={mech.id} staggerIndex={idx}>
              <div
                className="flex flex-col h-full justify-between group"
                onClick={() => navigateToPage(`/mechanical/${mech.slug}`)}
              >
                {/* CAD Blueprint Image View */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={cadFilesystemService.getThumbnailUrl(mech.slug)}
                    alt={mech.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100"
                    loading="lazy"
                    style={{
                      transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease, opacity 0.4s ease',
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== mech.thumbnail) img.src = mech.thumbnail;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-[#070e1b]/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Badge variant="amber" size="sm" className="shadow-lg backdrop-blur-md">
                      {mech.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-950/85 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-md shadow-md">
                      {mech.cadSoftware[0]}
                    </span>
                  </div>

                  {/* Bottom Technical Spec strip */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      <Ruler className="w-3.5 h-3.5 text-amber-400" />
                      {mech.dimensions}
                    </span>
                    <span className="bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm text-amber-300">
                      Mass: {mech.weight}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors duration-200">
                      {mech.title}
                    </h3>
                    <p className="text-xs font-mono text-amber-400/90 mt-1 mb-3">{mech.tagline}</p>
                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">{mech.description}</p>

                    {/* Technical Manufacturing Specifications */}
                    <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Primary Alloy:</span>
                        <span className="text-slate-200 font-semibold truncate block">{mech.materials[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Fabrication:</span>
                        <span className="text-slate-200 font-semibold truncate block">{mech.manufacturingMethods[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {mech.cadSoftware.map((sw, si) => (
                        <span
                          key={si}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30"
                        >
                          {sw}
                        </span>
                      ))}
                      {mech.simulationSoftware?.map((sim, si) => (
                        <span
                          key={si}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/30"
                        >
                          {sim}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Box className="w-3.5 h-3.5 text-amber-400" />
                      <span>{mech.cadFiles.length} CAD Models</span>
                      {mech.drawings.length > 0 && <span>· {mech.drawings.length} Drawings</span>}
                    </div>

                    <Button
                      variant="amber"
                      size="sm"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPage(`/mechanical/${mech.slug}`);
                      }}
                    >
                      Inspect CAD
                    </Button>
                  </div>
                </div>
              </div>
            </CadCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};
