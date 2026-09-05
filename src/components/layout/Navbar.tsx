import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Button } from '../common/Button';
import {
  Menu, X, FileText, ExternalLink, ChevronRight, Lock
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about',       label: 'About'    },
  { id: 'focus',       label: 'Domains'  },
  { id: 'experience',  label: 'Experience' },
  { id: 'projects',    label: 'Projects' },
  { id: 'mechanical',  label: 'Mech CAD' },
  { id: 'skills',      label: 'Skills'   },
  { id: 'education',   label: 'Education' },
  { id: 'publications',label: 'Research' },
  { id: 'contact',     label: 'Contact'  },
];

const SECTION_IDS = ['hero', ...NAV_ITEMS.map(i => i.id)];

export const Navbar: React.FC = () => {
  const { scrollToSection, navigateToPage, isHomePage } = useNavigation();
  const activeSection = useScrollSpy(SECTION_IDS);
  const { data } = usePortfolioData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Sliding indicator refs
  const navRef    = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs  = useRef<Record<string, HTMLButtonElement | null>>({});

  // Update scroll value
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isScrolled = scrollY > 16;

  // Move sliding indicator to active nav item
  useEffect(() => {
    if (!isHomePage) return;
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    if (!indicator || !nav) return;

    const activeBtn = activeSection ? itemRefs.current[activeSection] : null;
    if (!activeBtn) {
      indicator.style.opacity = '0';
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    indicator.style.opacity = '1';
    indicator.style.left  = `${btnRect.left - navRect.left}px`;
    indicator.style.width = `${btnRect.width}px`;
  }, [activeSection, isHomePage]);

  const handleNavClick = useCallback((id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  }, [scrollToSection]);

  const bgOpacity = Math.min(0.96, 0.55 + (scrollY / 280) * 0.41);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        background: isScrolled
          ? `rgba(11, 15, 23, ${bgOpacity})`
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: 'none',
        boxShadow: isScrolled
          ? '0 10px 32px -16px rgba(0,0,0,0.7)'
          : 'none',
        paddingTop:    isScrolled ? '8px' : '14px',
        paddingBottom: isScrolled ? '8px' : '14px',
      }}
    >
      <div className="max-w-[1540px] mx-auto px-5 sm:px-7 lg:px-10 flex items-center justify-between gap-5">

        {/* Brand */}
        <button
          onClick={() => isHomePage ? scrollToSection('hero') : navigateToPage('/')}
          className="flex items-center gap-3 sm:gap-4 group focus:outline-none shrink-0"
        >
          <div
            className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full overflow-hidden shrink-0
              border border-cyan-400/30 bg-slate-950/80
              shadow-[0_0_22px_-8px_rgba(6,182,212,0.65)]
              transition-all duration-300 ease-out
              group-hover:border-cyan-300/70 group-hover:shadow-[0_0_28px_-6px_rgba(6,182,212,0.8)]
              group-hover:scale-[1.03]"
          >
            <img
              src="/logo.png"
              alt="Kulasekara Pandian"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-[15px] sm:text-base tracking-tight
                transition-colors duration-200 group-hover:text-cyan-300">
                {data.profile.name}
              </span>
              <span className="relative flex h-2 w-2" title="Available for roles">
                <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 tracking-[0.18em] uppercase block">
              Mechatronics · Robotics
            </span>
          </div>
        </button>

        {/* Desktop nav with sliding indicator */}
        <div
          ref={navRef}
          className="hidden xl:flex items-center relative bg-slate-900/70 border border-slate-800/90
            px-3 py-2 rounded-2xl backdrop-blur-sm"
        >
          {/* Sliding active indicator */}
          <div
            ref={indicatorRef}
            className="nav-indicator"
            style={{ opacity: 0 }}
            aria-hidden="true"
          />

          {NAV_ITEMS.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={el => { itemRefs.current[item.id] = el; }}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-[14px] text-[12px] font-medium transition-colors duration-200
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => handleNavClick('contact')}
          >
            Hire Me
          </Button>

          <a
            href={data.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-xl
              bg-sky-500/10 text-sky-300 border border-sky-500/30
              hover:bg-sky-500/20 hover:border-sky-400/60 hover:-translate-y-px
              transition-all duration-200"
          >
            <span>Resume</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => navigateToPage('/admin/login')}
            title="Admin CMS"
            className="group inline-flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.22)]">
            <Lock className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex xl:hidden p-2 text-slate-400 hover:text-white rounded-xl
            bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-5 h-5" />
            : <Menu className="w-5 h-5" />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="xl:hidden mobile-menu-enter
          bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800/80
          px-4 pt-3 pb-6 mt-2 shadow-2xl"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item flex items-center justify-between px-4 py-3 rounded-xl
                    text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-engineering-blue/15 text-cyan-300 border border-engineering-blue/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full justify-center"
              onClick={() => handleNavClick('contact')}>
              Contact Me
            </Button>
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold
                rounded-xl bg-engineering-blue text-white hover:bg-sky-600 transition-colors"
            >
              <span>Resume</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
