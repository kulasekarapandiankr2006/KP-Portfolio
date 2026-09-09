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
  CheckCircle2,
  Sparkles,
  Quote
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolioData();
  const { profile, languages } = data;
  const sectionRef = useScrollReveal<HTMLElement>();

  const corePillars = [
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      accent: 'border-cyan-500/30 hover:border-cyan-400/60',
      tag: 'ARCHITECTURE',
      title: "End-to-End Cyber-Physical Integration",
      description: "Seamlessly bridging mechanical structural dynamics, multi-layer high-speed PCB layouts, real-time bare-metal microcontroller firmware, and autonomous high-level ROS 2 navigation."
    },
    {
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
      accent: 'border-sky-500/30 hover:border-sky-400/60',
      tag: 'REAL-TIME CONTROL',
      title: "Deterministic Embedded Control",
      description: "Implementing sub-millisecond FreeRTOS deterministic task scheduling, dual-loop Field-Oriented Control (FOC) at 20 kHz for BLDC actuators, and Model Predictive Control (MPC) trajectory optimizers."
    },
    {
      icon: <Cog className="w-5 h-5 text-amber-400" />,
      accent: 'border-amber-500/30 hover:border-amber-400/60',
      tag: 'MANUFACTURING',
      title: "Design for Manufacturing & FEA Verification",
      description: "Designing high-reduction zero-backlash cycloidal drives, CNC-machined aerospace aluminum chassis, and injection-molded/carbon composite assemblies validated via ANSYS stress & thermal FEA."
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-28 relative border-t border-cyan-500/10 bg-[#030915]/60 overflow-hidden"
    >
      {/* Background blueprint elements */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(38,121,170,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(38,121,170,.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute right-[-10%] top-[20%] w-[450px] h-[450px] bg-cyan-500/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badgeText="Engineering Mindset & Narrative"
          badgeVariant="blue"
          title="Profile & Engineering Methodology"
          subtitle="Synthesizing rigorous mechanical dynamics with real-time embedded firmware and intelligent autonomous robotic algorithms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Biography and Engineering Philosophy */}
          <div className="lg:col-span-7 space-y-6 reveal-on-scroll">
            <Card padding="lg" className="space-y-6 border-cyan-500/20 bg-[#061120]/80 backdrop-blur-md relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-3 font-display">
                  <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span>Engineer Profile & Narrative</span>
                </h3>

                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400/70">
                  SYSTEM // ARCHITECT
                </span>
              </div>

              <div className="space-y-4">
                {profile.bio.map((paragraph, idx) => (
                  <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlighted Engineering Philosophy Quote Block */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900/50 to-cyan-950/20 border border-cyan-500/30 shadow-inner">
                <Quote className="absolute top-3 right-4 w-10 h-10 text-cyan-400/10 pointer-events-none" />
                <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest mb-2 flex items-center gap-2 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Core Engineering Philosophy</span>
                </div>
                <blockquote className="text-sm sm:text-base text-slate-100 italic leading-relaxed pl-1 font-serif">
                  "{profile.engineeringPhilosophy}"
                </blockquote>
              </div>
            </Card>

            {/* Quick Context Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card padding="sm" className="flex items-center gap-4 border-slate-800 bg-[#050f1d]/90 hover:border-cyan-500/30 transition-all">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Base Operations</div>
                  <div className="text-xs font-semibold text-white mt-0.5">{profile.location}</div>
                </div>
              </Card>

              <Card padding="sm" className="flex items-center gap-4 border-slate-800 bg-[#050f1d]/90 hover:border-sky-500/30 transition-all">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sky-400">
                  <LangIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Linguistic Fluency</div>
                  <div className="text-xs font-semibold text-white flex gap-1.5 flex-wrap mt-0.5">
                    {languages.map(l => (
                      <span key={l.id} className="text-slate-200">
                        {l.name} <span className="text-slate-500 font-mono text-[10px]">({l.proficiency.split(' ')[0]})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Core Engineering Pillars */}
          <div className="lg:col-span-5 space-y-4 reveal-on-scroll delay-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Foundational Disciplines</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider">3 PILLARS</span>
            </div>

            <div className="space-y-4">
              {corePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl border ${pillar.accent} bg-[#061120]/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-8px_rgba(6,182,212,0.25)]`}
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                      {pillar.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 block uppercase">
                        {pillar.tag}
                      </span>
                      <h4 className="text-base font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
                        {pillar.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
