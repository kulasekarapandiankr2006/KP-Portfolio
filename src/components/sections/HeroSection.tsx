import React, { useEffect, useRef } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useNavigation } from '../../hooks/useNavigation';
import { GithubIcon, LinkedinIcon, GrabCadIcon } from '../common/Icons';
import { Badge } from '../common/Badge';
import { ArrowRight, Bot, Box, Cpu, Medal, Play } from 'lucide-react';

const statIcons = [<Bot />, <Box />, <Cpu />, <Medal />];

export const HeroSection: React.FC = () => {
  const { data } = usePortfolioData();
  const { scrollToSection } = useNavigation();
  const { profile } = data;
  const heroRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none)').matches;
    if (reduce || touch || !portraitRef.current) return;

    const portrait = portraitRef.current;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = portrait.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        portrait.style.transform = `perspective(1200px) rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 4.5).toFixed(2)}deg) translateZ(0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      portrait.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
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
      className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#020914] pt-20 pb-6 md:pt-24 md:pb-8"
    >
      {/* Cinematic engineering artwork — extracted from the approved reference composition. */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[42%] min-w-[360px] max-w-[620px] pointer-events-none opacity-70"
        style={{
          backgroundImage: "linear-gradient(90deg, #020914 0%, rgba(2,9,20,.82) 16%, rgba(2,9,20,.15) 58%, rgba(2,9,20,.05) 100%), url('/hero-engineering-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 100%)',
        }}
        aria-hidden="true"
      />

      {/* Fine technical grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(38,121,170,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(38,121,170,.13) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,.65) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,.65) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute left-0 top-0 w-[58%] h-[58%] bg-cyan-500/[0.035] blur-[110px] pointer-events-none" aria-hidden="true" />
      <div className="absolute right-[18%] bottom-[8%] w-80 h-80 bg-sky-500/[0.08] blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1420px] px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* Top identity line */}
        <div className="mb-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.32em] text-cyan-400/70 hero-seq-1">
          <span className="h-px w-10 bg-cyan-400/60" />
          <span>MECHATRONICS ENGINEER</span>
          <span className="hidden sm:inline text-slate-600">//</span>
          <span className="hidden sm:inline">PRECISION • SYSTEMS • AUTOMATION</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(380px,450px)_minmax(460px,1fr)] xl:grid-cols-[470px_minmax(520px,1fr)] gap-6 xl:gap-9 items-center">
          {/* LEFT — large circular identity */}
          <div className="relative flex justify-center lg:justify-start hero-seq-2">
            <div className="relative w-[min(68vw,430px)] aspect-square">
              <div className="absolute inset-[-7%] rounded-full border border-cyan-400/15" />
              <div className="absolute inset-[-13%] rounded-full border border-cyan-400/10 border-dashed" style={{ animation: 'spin 55s linear infinite' }} />
              <div className="absolute inset-[-19%] rounded-full border border-sky-400/[0.06]" />
              <div className="absolute inset-[-24%] rounded-full border border-cyan-300/[0.04] border-dotted" style={{ animation: 'spin 80s linear infinite reverse' }} />

              <div className="absolute -top-2 left-[20%] w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute bottom-[9%] right-[-9%] w-20 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
              <div className="absolute top-[31%] -left-[17%] text-[9px] font-mono tracking-[0.24em] text-cyan-400/55 [writing-mode:vertical-rl]">
                IDENTITY // KP-KR
              </div>

              <div
                ref={portraitRef}
                className="relative h-full w-full rounded-full p-[5px] transition-transform duration-500 ease-out will-change-transform"
                style={{
                  background: 'conic-gradient(from 215deg, #06364e 0deg, #18d8ff 38deg, #eef9ff 57deg, #0b7ca8 88deg, #04253a 160deg, #18d8ff 255deg, #062338 330deg)',
                  boxShadow: '0 0 25px rgba(0,190,255,.35), 0 0 90px rgba(0,150,255,.18), inset 0 0 20px rgba(255,255,255,.08)',
                }}
              >
                <div className="h-full w-full rounded-full bg-[#03101c] p-2 shadow-[inset_0_0_45px_rgba(0,0,0,.75)]">
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-cyan-300/30 bg-[#020914]">
                    <img
                      src="/logo.png"
                      alt={`${profile.name} engineering logo`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,.12),transparent_24%,transparent_60%,rgba(0,0,0,.32))] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-[8%] left-[12%] flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500">
                <span>ENGINEER PROFILE</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>
          </div>

          {/* CENTER — identity / headline */}
          <div className="relative max-w-[720px] hero-seq-3">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge variant="cyan" dot size="md">{profile.statusBadge}</Badge>
              <div className="flex items-center gap-5 rounded-full border border-slate-800/80 bg-[#06111f]/80 px-5 py-2 text-xs text-slate-400 backdrop-blur-sm">
                <span>Robotics</span><span>Embedded</span><span>CAD</span><span>Simulation</span>
              </div>
            </div>

            <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.94] text-[clamp(3rem,5.3vw,6.15rem)] text-white">
              <span className="block">{profile.name.split(' ').slice(0, 1).join(' ') || 'Kulasekara'}</span>
              <span className="block bg-gradient-to-r from-[#3fdcff] via-[#62cfff] to-[#e8fbff] bg-clip-text text-transparent">
                {profile.name.split(' ').slice(1).join(' ') || 'Pandian K R'}
              </span>
            </h1>

            <div className="mt-5 flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.42em] text-slate-300 uppercase">
              <span>{profile.title}</span>
              <span className="text-cyan-400">•</span>
              <span>Robotics</span>
            </div>

            <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300/90">
              {profile.bio[0]}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 hero-seq-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-micro group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.25)] hover:shadow-[0_0_38px_rgba(34,211,238,.4)]"
              >
                Explore My Work <ArrowRight className="btn-icon-right h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection('mechanical')}
                className="btn-micro group inline-flex items-center gap-3 rounded-xl border border-cyan-500/50 bg-[#061321]/85 px-6 py-3.5 text-sm font-semibold text-slate-100 hover:border-cyan-300 hover:bg-cyan-400/10"
              >
                <Cpu className="h-4 w-4 text-cyan-300" /> View CAD Projects
              </button>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-micro group inline-flex items-center gap-3 rounded-xl border border-slate-700 bg-[#06101d]/80 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:border-cyan-400/50"
              >
                <Play className="h-4 w-4 text-cyan-300" />
                <span>View Profile</span>
                <span className="hidden sm:block text-[10px] font-mono text-slate-500">RESUME</span>
              </a>
            </div>

            {/* Small technical metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">
              <span>ARM CORTEX-M4</span><span className="text-cyan-500">/</span>
              <span>ROS 2</span><span className="text-cyan-500">/</span>
              <span>SolidWorks</span><span className="text-cyan-500">/</span>
              <span>STM32</span>
            </div>
          </div>
        </div>

        {/* Bottom stat rail */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 hero-seq-5">
          {profile.stats.slice(0, 4).map((stat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#03111f]/85 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_16px_45px_-22px_rgba(0,207,255,.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/[0.06] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.12)]">
                  {React.cloneElement(statIcons[i], { className: 'h-5 w-5' })}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-2xl font-bold leading-none text-white">{stat.value}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-200">{stat.label}</div>
                  {stat.subtext && <div className="mt-0.5 text-[11px] text-slate-500">{stat.subtext}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer rail */}
        <div className="mt-5 flex flex-col gap-3 border-t border-cyan-500/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/70">FIND ME ON</span>
            <span className="h-4 w-px bg-slate-700" />
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors"><GithubIcon className="h-4 w-4" /> GitHub</a>
            <span className="h-4 w-px bg-slate-700" />
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"><LinkedinIcon className="h-4 w-4" /> LinkedIn</a>
            {profile.cadPortfolioUrl && <><span className="h-4 w-px bg-slate-700" /><a href={profile.cadPortfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"><GrabCadIcon className="h-4 w-4" /> GrabCAD</a></>}
          </div>

        </div>
      </div>
    </section>
  );
};
