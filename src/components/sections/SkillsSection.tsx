import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Cpu, Bot, Cog, Code2, Zap } from 'lucide-react';

const getCategoryIcon = (icon: string) => {
  switch (icon.toLowerCase()) {
    case 'cpu':   return <Cpu   className="w-5 h-5 text-sky-400"     />;
    case 'bot':   return <Bot   className="w-5 h-5 text-cyan-400"    />;
    case 'cog':   return <Cog   className="w-5 h-5 text-amber-400"   />;
    case 'code2': return <Code2 className="w-5 h-5 text-emerald-400" />;
    default:      return <Zap   className="w-5 h-5 text-sky-400"     />;
  }
};

const getLevelStyle = (level?: string) => {
  switch (level) {
    case 'Expert':       return 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30';
    case 'Advanced':     return 'bg-sky-500/12 text-sky-300 border-sky-500/30';
    case 'Intermediate': return 'bg-slate-800 text-slate-300 border-slate-700';
    default:             return 'bg-slate-800/60 text-slate-400 border-slate-700/60';
  }
};

export const SkillsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { skillGroups } = data;

  return (
    <section ref={sectionRef} id="skills" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Technical Competence"
          badgeVariant="emerald"
          title="Engineering Skills Matrix"
          subtitle="Hardware platforms, microcontrollers, control theory, CAD toolchains, and programming languages."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-stagger="90">
          {skillGroups.map((group, idx) => (
            <Card
              key={group.id}
              padding="lg"
              className="space-y-5 border-slate-800 hover:border-slate-700/80 reveal-slide-left card-hover-lift"
              style={{ transitionDelay: `${idx * 90}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800
                  transition-all duration-250 group-hover:border-engineering-blue/30">
                  {getCategoryIcon(group.icon)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{group.category}</h3>
                  <p className="text-xs text-slate-400 font-mono">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.skills.map((skill, si) => (
                  <div
                    key={si}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between
                      transition-all duration-200
                      ${skill.highlighted
                        ? 'bg-slate-900/90 border-slate-700/90 hover:border-slate-600'
                        : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${skill.highlighted ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.7)]' : 'bg-slate-600'}`} />
                      <span className="text-slate-200 font-medium">{skill.name}</span>
                    </div>
                    {skill.level && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${getLevelStyle(skill.level)}`}>
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
