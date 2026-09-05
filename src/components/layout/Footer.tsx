import React, { useEffect } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { GithubIcon, LinkedinIcon, YoutubeIcon, GrabCadIcon } from '../common/Icons';
import { 
  Cpu, 
  Lock, 
  ArrowUp,
  Mail,
  MapPin,
  Box 
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

  return (
    <footer className="bg-background-secondary border-t border-slate-800 text-slate-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-cad-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-engineering-blue/40 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-engineering-cyanGlow" />
              </div>
              <span className="font-display font-bold text-white text-base">
                {data.profile.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {data.profile.subtitle}
            </p>
            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-engineering-cyan" />
                <span>{data.profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-engineering-cyan" />
                <a href={`mailto:${data.profile.email}`} className="hover:text-white transition-colors">
                  {data.profile.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Engineering Showcase Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Engineering Showcases
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Robotics & Firmware Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('mechanical')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Mechanical & CAD Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('focus')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Mechatronics Focus Domains
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('publications')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Research & Publications
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
                <button
                  onClick={() => scrollToSection('experience')}
                  className="hover:text-white transition-colors"
                >
                  Engineering Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('education')}
                  className="hover:text-white transition-colors"
                >
                  Academic Background & Honours
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('skills')}
                  className="hover:text-white transition-colors"
                >
                  Technical Skills Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('certifications')}
                  className="hover:text-white transition-colors"
                >
                  Professional Certifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('competitions')}
                  className="hover:text-white transition-colors"
                >
                  Competitions & Hackathons
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-800/80">
                <button
                  onClick={() => navigateToPage('/admin/login')}
                  className="text-slate-400 hover:text-engineering-cyan transition-colors flex items-center gap-1.5 text-xs font-mono"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin CMS Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect & Repositories */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-200 tracking-wider mb-4">
              Connect & Repositories
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-engineering-cyan hover:shadow-tech-cyan transition-all"
                  title={soc.platform}
                >
                  {getSocialIcon(soc.platform)}
                </a>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white py-1.5 px-3 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {data.profile.name}. All rights reserved.</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono">Mechatronics Engineering Portfolio</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[11px] font-mono text-slate-500">
              Admin: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">A</kbd>
            </span>
            <button
              onClick={() => navigateToPage('/admin/login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-engineering-cyan/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all shadow-sm group"
              title="Private Admin CMS Portal"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
