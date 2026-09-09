import React, { useEffect } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Magnetic } from '../common/Magnetic';
import { GithubIcon, LinkedinIcon, YoutubeIcon, GrabCadIcon } from '../common/Icons';
import { 
  Cpu, 
  Lock, 
  ArrowUp,
  Mail,
  MapPin,
  Box,
  Activity
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { scrollToSection, navigateToPage } = useNavigation();
  const { data } = usePortfolioData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateToPage('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToPage]);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <GithubIcon className="w-4 h-4" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4" />;
      case 'youtube': return <YoutubeIcon className="w-4 h-4" />;
      case 'grabcad': return <GrabCadIcon className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020712] border-t border-cyan-500/15 text-slate-400 relative overflow-hidden">
      {/* Background CAD grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(38,121,170,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(38,121,170,.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.3)]">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                {data.profile.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {data.profile.subtitle}
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{data.profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a href={`mailto:${data.profile.email}`} className="hover:text-cyan-300 transition-colors">
                  {data.profile.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Engineering Showcases */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider mb-4">
              Engineering Showcases
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Robotics & Firmware Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('mechanical')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Mechanical & CAD Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('focus')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Mechatronics Focus Domains
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('skills')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Technical Skills Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('publications')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Peer-Reviewed Research
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Background & Credentials */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Credentials & Profile
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => scrollToSection('experience')} className="hover:text-white transition-colors">
                  Engineering Experience
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('education')} className="hover:text-white transition-colors">
                  Academic Background & Honors
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('certifications')} className="hover:text-white transition-colors">
                  Professional Certifications
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('competitions')} className="hover:text-white transition-colors">
                  Robotics Competitions & Sprints
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => navigateToPage('/admin/login')}
                  className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2 text-xs font-mono"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin CMS Login Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Channels & Telemetry */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Channels & Telemetry
            </h4>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {data.socialLinks.map((soc) => (
                <Magnetic key={soc.id} strength={0.3}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all inline-block"
                    title={soc.platform}
                  >
                    {getSocialIcon(soc.platform)}
                  </a>
                </Magnetic>
              ))}
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-[11px] font-mono text-cyan-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <span>SYSTEM STATUS: 100% OPERATIONAL</span>
              </div>

              <Magnetic strength={0.25}>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 transition-all shadow-sm"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Back to top</span>
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {new Date().getFullYear()} {data.profile.name}.</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">Mechatronics & Robotics Portfolio</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[10px] text-slate-500">
              Admin Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">A</kbd>
            </span>
            <button
              onClick={() => navigateToPage('/admin/login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all text-xs"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
