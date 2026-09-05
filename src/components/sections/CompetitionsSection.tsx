import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { TechBadge } from '../common/TechBadge';
import { 
  Trophy, 
  Flag, 
  Calendar 
} from 'lucide-react';

export const CompetitionsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { competitions } = usePortfolioData();

  if (!competitions || competitions.length === 0) return null;

  return (
    <section ref={sectionRef} id="competitions" className="py-20 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Hackathons & Challenges"
          badgeVariant="amber"
          title="Engineering Competitions"
          subtitle="International and collegiate robotics design sprints, rovers, and rapid-prototyping competitions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp, idx) => (
            <Card key={comp.id} padding="lg" className={`space-y-4 border-slate-800 hover:border-amber-500/40 reveal-on-scroll${idx > 0 ? ' delay-100' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {comp.title}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {comp.organizer}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{comp.date}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  {comp.award}
                </span>
                {comp.rank && (
                  <Badge variant="amber" size="sm">
                    {comp.rank}
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {comp.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                {comp.technologies.map((tech, idx) => (
                  <TechBadge key={idx} name={tech} size="xs" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
