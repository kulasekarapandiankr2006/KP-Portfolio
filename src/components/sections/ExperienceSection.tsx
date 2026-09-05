import React, { useRef, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TechBadge } from '../common/TechBadge';
import { Calendar, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { experiences } = data;

  // Animated timeline line
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = timelineLineRef.current;
    if (!line) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (prefersReduced) {
          line.style.height = '100%';
        } else {
          line.classList.add('is-visible');
        }
        obs.disconnect();
      }
    }, { threshold: 0.1 });

    obs.observe(line.parentElement!);
    return () => obs.disconnect();
  }, []);

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Full-time':    return 'emerald';
      case 'Internship':   return 'blue';
      case 'Student Team': return 'amber';
      case 'Research':     return 'purple';
      default:             return 'slate';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 relative border-t border-slate-800/80"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.3) 50%, transparent 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Work History"
          badgeVariant="blue"
          title="Engineering Experience"
          subtitle="Track record in autonomous systems, embedded firmware, and hardware prototyping."
        />

        <div className="relative ml-4 sm:ml-8">
          {/* Animated vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800/80" />
          <div
            ref={timelineLineRef}
            className="timeline-line"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className="relative pl-8 sm:pl-12 reveal-slide-left"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {/* Timeline node */}
                <div
                  className="timeline-node absolute -left-[9px] top-5 w-[18px] h-[18px] rounded-full bg-background-card border-2 border-engineering-blue flex items-center justify-center z-10"
                  style={{ transitionDelay: `${idx * 80 + 200}ms` }}
                >
                  {exp.current ? (
                    <span className="relative flex h-2 w-2">
                      <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-sky-400" />
                  )}
                </div>

                <Card
                  padding="lg"
                  className="space-y-4 hover:border-slate-700/80 card-lift-sm border-slate-800/90"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white">{exp.role}</h3>
                        <Badge variant={getTypeBadgeVariant(exp.type) as 'emerald' | 'blue' | 'amber' | 'purple' | 'slate'} size="sm">
                          {exp.type}
                        </Badge>
                        {exp.current && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                        {exp.organizationUrl ? (
                          <a href={exp.organizationUrl} target="_blank" rel="noopener noreferrer"
                            className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
                            <span>{exp.organization}</span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : <span>{exp.organization}</span>}
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400
                      bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{exp.summary}</p>

                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                      Key Contributions:
                    </div>
                    <ul className="space-y-2">
                      {exp.achievements.map((ach, ai) => (
                        <li key={ai} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">Stack:</span>
                    {exp.technologies.map((tech, ti) => (
                      <TechBadge key={ti} name={tech} size="xs" />
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
