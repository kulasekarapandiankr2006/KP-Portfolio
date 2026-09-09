import React, { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Cpu, Bot, Cog, Code2, Zap, Search } from 'lucide-react';

const getCategoryIcon = (icon: string) => {
  switch (icon.toLowerCase()) {
    case 'cpu':
      return <Cpu className="w-5 h-5 text-sky-400" />;
    case 'bot':
      return <Bot className="w-5 h-5 text-cyan-400" />;
    case 'cog':
      return <Cog className="w-5 h-5 text-amber-400" />;
    case 'code2':
      return <Code2 className="w-5 h-5 text-emerald-400" />;
    default:
      return <Zap className="w-5 h-5 text-sky-400" />;
  }
};

const getLevelStyle = (level?: string) => {
  switch (level) {
    case 'Expert':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.25)]';
    case 'Advanced':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]';
    case 'Intermediate':
      return 'bg-slate-800 text-slate-300 border-slate-700';
    default:
      return 'bg-slate-800/60 text-slate-400 border-slate-700/60';
  }
};

export const SkillsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { skillGroups } = data;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...skillGroups.map((g) => g.category)];

  const filteredGroups = skillGroups
    .filter((g) => activeCategory === 'All' || g.category === activeCategory)
    .map((g) => {
      if (!searchQuery.trim()) return g;
      const filteredSkills = g.skills.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...g, skills: filteredSkills };
    })
    .filter((g) => g.skills.length > 0);

  return (
    <section ref={sectionRef} id="skills" className="py-28 relative border-t border-cyan-500/10 bg-[#020713]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Technical Competence Matrix"
          badgeVariant="emerald"
          title="Engineering & Robotics Skills Architecture"
          subtitle="Microcontroller firmware architectures, real-time control theory, 3D CAD/FEA packages, and programming stacks."
        />

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 reveal-fade-up">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_18px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-stagger="90">
          {filteredGroups.map((group, idx) => (
            <Card
              key={group.id}
              padding="lg"
              className="space-y-6 border-cyan-500/20 bg-[#061120]/85 backdrop-blur-md hover:border-cyan-400/50 reveal-slide-left card-hover-lift"
              style={{ transitionDelay: `${idx * 90}ms` } as React.CSSProperties}
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 group-hover:border-cyan-400/40 transition-all">
                    {getCategoryIcon(group.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">{group.category}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{group.description}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-cyan-400/80 px-2 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30">
                  {group.skills.length} SKILLS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.skills.map((skill, si) => (
                  <div
                    key={si}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all duration-200 group/skill ${
                      skill.highlighted
                        ? 'bg-gradient-to-r from-slate-900 to-[#07192f] border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-950/50 border-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-transform group-hover/skill:scale-125 ${
                          skill.highlighted
                            ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]'
                            : 'bg-slate-600'
                        }`}
                      />
                      <span className="text-slate-200 font-medium truncate group-hover/skill:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>

                    {skill.level && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-semibold shrink-0 ml-2 ${getLevelStyle(
                          skill.level
                        )}`}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            No engineering skills matching <span className="text-cyan-400">"{searchQuery}"</span>.
          </div>
        )}
      </div>
    </section>
  );
};
