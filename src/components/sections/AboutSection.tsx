import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { 
  Compass, 
  Cpu, 
  Cog, 
  Layers, 
  MapPin, 
  Languages as LangIcon, 
  CheckCircle2 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolioData();
  const { profile, languages } = data;
  const sectionRef = useScrollReveal<HTMLElement>();

  const corePillars = [
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: "End-to-End Integration",
      description: "Seamlessly architecting mechanical enclosures, PCB layouts, low-level microcontroller drivers, and high-level autonomous planners."
    },
    {
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
      title: "Deterministic Control",
      description: "Implementing real-time FreeRTOS tasks, high-frequency Field-Oriented Control (FOC), and Model Predictive Control algorithms."
    },
    {
      icon: <Cog className="w-5 h-5 text-amber-400" />,
      title: "Design for Manufacturing (DFM)",
      description: "Designing precision machined components, sheet metal chassis, and injection/3D printed parts verified through structural FEA."
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-20 relative border-t border-slate-800/80 bg-background-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Profile & Philosophy"
          badgeVariant="blue"
          title="Engineering Background & Methodology"
          subtitle="Combining classical mechanical principles with modern embedded firmware and autonomous robotics control."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6 reveal-on-scroll">
            <Card padding="lg" className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-engineering-cyan" />
                <span>About Me</span>
              </h3>

              {profile.bio.map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                  Engineering Philosophy
                </div>
                <blockquote className="border-l-2 border-engineering-blue pl-4 py-1 text-sm text-slate-200 italic">
                  "{profile.engineeringPhilosophy}"
                </blockquote>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card padding="sm" className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Base Location</div>
                  <div className="text-xs font-semibold text-white">{profile.location}</div>
                </div>
              </Card>

              <Card padding="sm" className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
                  <LangIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Communication</div>
                  <div className="text-xs font-semibold text-white flex gap-1.5 flex-wrap">
                    {languages.map(l => (
                      <span key={l.id}>{l.name} ({l.proficiency.split(' ')[0]})</span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 reveal-on-scroll delay-100">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Core Engineering Principles</span>
            </h3>

            <div className="space-y-3">
              {corePillars.map((pillar, idx) => (
                <Card key={idx} padding="md" variant="interactive" className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {pillar.icon}
                    </div>
                    <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-1">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
