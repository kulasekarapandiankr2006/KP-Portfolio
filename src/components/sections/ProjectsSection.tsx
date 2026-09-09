import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Project } from '../../types/project';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useNavigation } from '../../hooks/useNavigation';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { TechBadge } from '../common/TechBadge';
import { Button } from '../common/Button';
import { GithubIcon } from '../common/Icons';
import { runtimeService } from '../../services/runtimeService';
import { ProjectQuickViewModal } from '../common/ProjectQuickViewModal';
import { ArrowUpRight, Play, Clock, CheckCircle2, Eye } from 'lucide-react';

interface Project3DCardProps {
  children: React.ReactNode;
  staggerIndex: number;
  onCardClick?: () => void;
}

const Project3DCard: React.FC<Project3DCardProps> = ({ children, staggerIndex, onCardClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resetCard = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s cubic-bezier(0.22,1,0.36,1)';
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
    el.style.boxShadow = '';
  }, []);

  useEffect(() => {
    if (isTouch || prefersReduced) return;
    const el = wrapperRef.current;
    const light = lightRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const rotY = dx * 4.5;
        const rotX = -dy * 3.0;

        el.style.transition = 'transform 0.10s cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.015)`;
        el.style.boxShadow = `
          0 28px 56px -10px rgba(0,0,0,0.7),
          0 4px 20px -4px rgba(2,132,199,0.25),
          ${dx * -4}px ${dy * -4}px 30px -8px rgba(2,132,199,0.12)
        `;

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
        transitionDelay: `${staggerIndex * 85}ms`,
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
      onClick={onCardClick}
      data-cursor="project"
      data-cursor-label="VIEW"
    >
      <div className="relative rounded-2xl overflow-hidden h-full flex flex-col border border-cyan-500/20 bg-[#061120]/85 backdrop-blur-md hover:border-cyan-400/60 transition-colors">
        {/* Specular mouse light overlay */}
        <div ref={lightRef} className="card-mouse-light" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { projects } = usePortfolioData();
  const { navigateToPage } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Robotics', 'Embedded Systems', 'Computer Vision'];
  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section ref={sectionRef} id="projects" className="py-28 relative border-t border-cyan-500/10 bg-[#020713]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Production-Grade Work"
          badgeVariant="blue"
          title="Robotics & Embedded Systems Engineering"
          subtitle="Autonomous mobile robots, deterministic high-rate firmware, and hardware-in-the-loop control systems."
        />

        {/* Category filter strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 reveal-fade-up">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.45)] scale-105'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat} ({cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>

        {/* 3D Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((project, idx) => (
            <Project3DCard
              key={project.id}
              staggerIndex={idx}
              onCardClick={() => setModalProject(project)}
            >
              <div className="flex flex-col h-full justify-between group">
                {/* Thumbnail & Image Banner */}
                <div className="relative h-60 sm:h-72 w-full bg-slate-950 thumb-zoom-wrap overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 thumb-zoom-img"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061120] via-[#061120]/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Badge variant="blue" size="sm" className="shadow-lg backdrop-blur-md">
                      {project.category}
                    </Badge>
                    {project.hasZip && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md shadow-md">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Interactive Sim
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-[11px] text-cyan-400 font-bold tracking-widest">
                      PROJECT // 0{idx + 1}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {project.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/90 mt-1 mb-3">{project.tagline}</p>
                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">{project.description}</p>

                    <div className="space-y-1.5 mb-4">
                      {project.features.slice(0, 2).map((feat, fi) => (
                        <div key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 5).map((tech, ti) => (
                        <TechBadge key={ti} name={tech} size="xs" />
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="View Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalProject(project);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                        title="Quick View Case Study"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Quick Look</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {project.hasZip && (
                        <Button
                          variant="cyan"
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5 fill-current" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = runtimeService.getProjectRuntimeUrl(
                              project.slug,
                              project.entryPoint || 'index.html'
                            );
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          Run
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPage(`/projects/${project.slug}`);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Project3DCard>
          ))}
        </div>
      </div>

      {/* Project Quick View Modal */}
      <ProjectQuickViewModal
        project={modalProject}
        onClose={() => setModalProject(null)}
        onViewFullDetails={(slug) => {
          setModalProject(null);
          navigateToPage(`/projects/${slug}`);
        }}
      />
    </section>
  );
};
