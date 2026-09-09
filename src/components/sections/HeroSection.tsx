import React, { useEffect, useRef } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useNavigation } from '../../hooks/useNavigation';
import { GithubIcon, LinkedinIcon, GrabCadIcon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { Counter } from '../common/Counter';
import { Magnetic } from '../common/Magnetic';
import { ArrowRight, Bot, Box, Cpu, Medal, Play, ChevronDown } from 'lucide-react';

const statIcons = [<Bot key="bot" />, <Box key="box" />, <Cpu key="cpu" />, <Medal key="medal" />];

export const HeroSection: React.FC = () => {
  const { data } = usePortfolioData();
  const { scrollToSection } = useNavigation();
  const { profile } = data;
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const ringGroupRef = useRef<HTMLDivElement>(null);

  // Holographic 3D tilt tracking cursor on hero
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (reduce || touch || !portraitRef.current) return;

    const portrait = portraitRef.current;
    const ringGroup = ringGroupRef.current;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = portrait.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

        portrait.style.transform = `perspective(1200px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(12px)`;

        if (ringGroup) {
          ringGroup.style.transform = `perspective(1000px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translate3d(${(-x * 12).toFixed(1)}px, ${(-y * 12).toFixed(1)}px, 0)`;
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      portrait.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (ringGroup) {
        ringGroup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    portrait.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      portrait.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#020713] pt-24 pb-12 md:pt-28 md:pb-16 flex flex-col justify-between"
    >
      {/* Background CAD Blueprint Graphic & Atmospheric Glow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[46%] min-w-[360px] max-w-[680px] pointer-events-none opacity-60 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #020713 0%, rgba(2,7,19,.85) 15%, rgba(2,7,19,.15) 55%, rgba(2,7,19,.04) 100%), url('/hero-engineering-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 100%)',
        }}
        aria-hidden="true"
      />

      {/* Engineering Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(38,121,170,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(38,121,170,.14) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,.65) 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,.65) 75%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient glowing lasers */}
      <div className="absolute left-[-5%] top-[-10%] w-[60%] h-[60%] bg-cyan-500/[0.045] blur-[130px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute right-[12%] bottom-[5%] w-[420px] h-[420px] bg-sky-500/[0.08] blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute left-[35%] top-[40%] w-[300px] h-[300px] bg-amber-500/[0.035] blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-12 w-full">
        {/* Top telemetry identity bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 hero-seq-1 border-b border-cyan-500/10 pb-3">
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.32em] text-cyan-400/80">
            <span className="h-px w-8 bg-cyan-400/60" />
            <span>MECHATRONICS & ROBOTICS ARCHITECT</span>
            <span className="hidden md:inline text-slate-600">//</span>
            <span className="hidden md:inline text-slate-400">PRECISION • DYNAMICS • AUTONOMY</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>SYS STATUS: NOMINAL</span>
            <span className="text-cyan-400">•</span>
            <span>REAL-TIME ROS 2 HUMBLE</span>
          </div>
        </div>

        {/* Hero Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(380px,460px)_minmax(460px,1fr)] xl:grid-cols-[480px_minmax(520px,1fr)] gap-8 xl:gap-12 items-center">
          {/* LEFT: 3D Holographic Identity Ring System */}
          <div className="relative flex justify-center lg:justify-start hero-seq-2">
            <div className="relative w-[min(70vw,430px)] aspect-square" data-cursor="pointer">
              {/* Outer decorative telemetry radar rings */}
              <div ref={ringGroupRef} className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform">
                <div className="absolute inset-[-6%] rounded-full border border-cyan-400/20" />
                <div
                  className="absolute inset-[-12%] rounded-full border border-cyan-400/15 border-dashed"
                  style={{ animation: 'spin 50s linear infinite' }}
                />
                <div className="absolute inset-[-18%] rounded-full border border-sky-400/[0.08]" />
                <div
                  className="absolute inset-[-23%] rounded-full border border-cyan-300/[0.05] border-dotted"
                  style={{ animation: 'spin 75s linear infinite reverse' }}
                />

                {/* Radar tick marks and cardinal points */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-4 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-4 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />

                <div className="absolute top-[28%] -left-[16%] text-[9px] font-mono tracking-[0.25em] text-cyan-400/60 [writing-mode:vertical-rl]">
                  CORE // KP-KR
                </div>
              </div>

              {/* 3D Circular Portrait Card */}
              <div
                ref={portraitRef}
                className="relative h-full w-full rounded-full p-[6px] transition-transform duration-500 ease-out will-change-transform group cursor-pointer"
                style={{
                  background:
                    'conic-gradient(from 215deg, #06364e 0deg, #18d8ff 38deg, #eef9ff 57deg, #0b7ca8 88deg, #04253a 160deg, #18d8ff 255deg, #062338 330deg)',
                  boxShadow:
                    '0 0 30px rgba(0,190,255,.35), 0 0 95px rgba(0,150,255,.2), inset 0 0 25px rgba(255,255,255,.12)',
                }}
              >
                <div className="h-full w-full rounded-full bg-[#030f1b] p-2.5 shadow-[inset_0_0_50px_rgba(0,0,0,.85)]">
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-cyan-300/35 bg-[#020914]">
                    <img
                      src="/logo.png"
                      alt={`${profile.name} engineering logo`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                    />
                    {/* Holographic specular reflection */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.16),transparent_28%,transparent_65%,rgba(0,0,0,.4))] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bottom active telemetry badge */}
              <div className="absolute -bottom-[7%] left-[10%] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#071322]/90 border border-cyan-400/30 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300 shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                <span>PROFILE READY</span>
                <span className="text-cyan-400 font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Typography & Editorial Hero Content */}
          <div className="relative max-w-[760px] hero-seq-3 space-y-6">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="cyan" dot size="md" className="border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                {profile.statusBadge}
              </Badge>
              <div className="flex items-center gap-3.5 rounded-full border border-slate-800 bg-[#06111f]/90 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md font-mono">
                <span className="hover:text-cyan-300 transition-colors">Robotics</span>
                <span className="text-cyan-500/60">•</span>
                <span className="hover:text-sky-300 transition-colors">Embedded</span>
                <span className="text-cyan-500/60">•</span>
                <span className="hover:text-amber-300 transition-colors">CAD & FEA</span>
                <span className="text-cyan-500/60">•</span>
                <span className="hover:text-emerald-300 transition-colors">FOC Motors</span>
              </div>
            </div>

            {/* Oversized Masked Typography */}
            <div className="space-y-1">
              <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] text-[clamp(2.8rem,5.5vw,5.75rem)] text-white">
                <span className="block mask-text-reveal">
                  {profile.name.split(' ').slice(0, 1).join(' ') || 'Kulasekara'}
                </span>
                <span className="block bg-gradient-to-r from-[#38bdf8] via-[#67e8f9] to-[#ffffff] bg-clip-text text-transparent mask-text-reveal [animation-delay:120ms] text-glow-cyan">
                  {profile.name.split(' ').slice(1).join(' ') || 'Pandian K R'}
                </span>
              </h1>
            </div>

            {/* Subtitle & Focus */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.3em] text-cyan-300 uppercase">
              <span>{profile.title}</span>
              <span className="text-cyan-500">•</span>
              <span className="text-slate-300">SYSTEMS & DYNAMICS</span>
            </div>

            {/* Bio paragraph */}
            <p className="max-w-2xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-300/90 font-sans">
              {profile.bio[0]}
            </p>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 hero-seq-4">
              <Magnetic strength={0.25}>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,.35)] hover:shadow-[0_0_45px_rgba(34,211,238,.55)] transition-all duration-300 hover:scale-[1.02]"
                  data-cursor="pointer"
                >
                  <span>Explore Engineering Work</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Magnetic>

              <Magnetic strength={0.25}>
                <button
                  onClick={() => scrollToSection('mechanical')}
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-[#091523]/90 px-5 py-3.5 text-sm font-semibold text-amber-200 hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_25px_rgba(251,191,36,.25)] transition-all duration-300"
                  data-cursor="cad"
                  data-cursor-label="CAD"
                >
                  <Cpu className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span>CAD Showroom</span>
                </button>
              </Magnetic>

              <Magnetic strength={0.25}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#06101d]/85 px-4 py-3.5 text-sm font-semibold text-slate-200 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300"
                  data-cursor="pointer"
                >
                  <Play className="h-4 w-4 text-cyan-300" />
                  <span>CV Document</span>
                </a>
              </Magnetic>
            </div>

            {/* Architecture Stack Ticker */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 pt-1">
              <span className="text-cyan-400">HARDWARE STACK:</span>
              <span className="text-slate-200">ARM CORTEX-M4/M7</span>
              <span className="text-cyan-500">/</span>
              <span className="text-slate-200">STM32 FOC</span>
              <span className="text-cyan-500">/</span>
              <span className="text-slate-200">ROS 2 NAV2</span>
              <span className="text-cyan-500">/</span>
              <span className="text-slate-200">SOLIDWORKS CAD</span>
            </div>
          </div>
        </div>

        {/* Bottom Stat Rail with Animated Numerical Counters */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 hero-seq-5">
          {profile.stats.slice(0, 4).map((stat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#051120]/85 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/50 hover:shadow-[0_20px_45px_-15px_rgba(0,207,255,.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.18)] group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(statIcons[i], { className: 'h-6 w-6' })}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold leading-none text-white tracking-tight">
                    <Counter value={stat.value} duration={2000} />
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-200 truncate">{stat.label}</div>
                  {stat.subtext && <div className="mt-0.5 text-[11px] text-slate-400 truncate">{stat.subtext}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cinematic Scroll Down Indicator & Social Strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cyan-500/10 pt-5">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/80">REPOSITORIES & CHANNELS</span>
            <span className="h-4 w-px bg-slate-800" />
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
              data-cursor="pointer"
            >
              <GithubIcon className="h-4 w-4 text-cyan-400" /> GitHub
            </a>
            <span className="h-4 w-px bg-slate-800" />
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
              data-cursor="pointer"
            >
              <LinkedinIcon className="h-4 w-4 text-sky-400" /> LinkedIn
            </a>
            {profile.cadPortfolioUrl && (
              <>
                <span className="h-4 w-px bg-slate-800" />
                <a
                  href={profile.cadPortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
                  data-cursor="cad"
                >
                  <GrabCadIcon className="h-4 w-4 text-amber-400" /> GrabCAD
                </a>
              </>
            )}
          </div>

          <button
            onClick={() => scrollToSection('about')}
            className="group flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
            data-cursor="pointer"
          >
            <span>SCROLL TO EXPLORE</span>
            <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-cyan-400 group-hover:translate-y-0.5 transition-all">
              <ChevronDown className="w-3 h-3 text-cyan-400 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
