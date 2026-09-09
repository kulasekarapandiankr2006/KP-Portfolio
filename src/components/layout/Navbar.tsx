import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Button } from '../common/Button';
import { Magnetic } from '../common/Magnetic';
import {
  Menu, X, FileText, ExternalLink, ChevronRight, Lock, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about',        label: 'About'     },
  { id: 'focus',        label: 'Domains'   },
  { id: 'experience',   label: 'Experience'},
  { id: 'projects',     label: 'Projects'  },
  { id: 'mechanical',   label: 'Mech CAD'  },
  { id: 'skills',       label: 'Skills'    },
  { id: 'education',    label: 'Education' },
  { id: 'publications', label: 'Research'  },
  { id: 'contact',      label: 'Contact'   },
];

const SECTION_IDS = ['hero', ...NAV_ITEMS.map(i => i.id)];

export const Navbar: React.FC = () => {
  const { scrollToSection, navigateToPage, isHomePage } = useNavigation();
  const activeSection = useScrollSpy(SECTION_IDS);
  const { data } = usePortfolioData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Sliding indicator refs
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Update scroll value & scroll direction detection
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrollY(currentY);

        // Hide on scroll down after 120px, reveal on scroll up
        if (currentY > 140 && currentY > lastScrollY.current + 6) {
          setVisible(false);
        } else if (currentY < lastScrollY.current - 6 || currentY <= 140) {
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isScrolled = scrollY > 20;

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

  const bgOpacity = Math.min(0.94, 0.60 + (scrollY / 300) * 0.34);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        background: isScrolled ? `rgba(8, 14, 25, ${bgOpacity})` : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(56, 189, 248, 0.12)' : 'none',
        boxShadow: isScrolled ? '0 12px 35px -12px rgba(0,0,0,0.7), 0 0 20px -8px rgba(6,182,212,0.15)' : 'none',
        paddingTop: isScrolled ? '8px' : '14px',
        paddingBottom: isScrolled ? '8px' : '14px',
      }}
    >
      <div className="max-w-[1540px] mx-auto px-5 sm:px-7 lg:px-10 flex items-center justify-between gap-5">

        {/* Brand */}
        <Magnetic strength={0.2}>
          <button
            onClick={() => isHomePage ? scrollToSection('hero') : navigateToPage('/')}
            className="flex items-center gap-3.5 group focus:outline-none shrink-0"
            data-cursor="pointer"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0
                border border-cyan-400/35 bg-slate-950/80
                shadow-[0_0_22px_-6px_rgba(6,182,212,0.65)]
                transition-all duration-300 ease-out
                group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]
                group-hover:scale-105"
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
                <span className="relative flex h-2 w-2" title="Systems Active & Available">
                  <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-[0.18em] uppercase">
                <span>MECHATRONICS</span>
                <span className="text-cyan-500">•</span>
                <span>ROBOTICS</span>
              </div>
            </div>
          </button>
        </Magnetic>

        {/* Desktop nav with sliding indicator */}
        <div
          ref={navRef}
          className="hidden xl:flex items-center relative bg-[#091322]/80 border border-cyan-500/20
            px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
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
                className={`relative px-3.5 py-1.5 rounded-[12px] text-[12px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
                data-cursor="pointer"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Telemetry live status tag */}
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-cyan-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>SYS ACTIVE // 60FPS</span>
          </div>

          <Magnetic strength={0.25}>
            <Button
              variant="outline"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => handleNavClick('contact')}
              className="border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Get in Touch
            </Button>
          </Magnetic>

          <Magnetic strength={0.25}>
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-xl
                bg-sky-500/15 text-sky-300 border border-sky-400/40
                hover:bg-sky-500/25 hover:border-sky-300 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]
                transition-all duration-200"
              data-cursor="pointer"
            >
              <span>Resume</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Magnetic>

          <Magnetic strength={0.25}>
            <button
              onClick={() => navigateToPage('/admin/login')}
              title="Admin CMS Portal"
              className="group inline-flex items-center justify-center w-9 h-9 rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-400/25 hover:text-white hover:shadow-[0_0_22px_rgba(34,211,238,0.3)]"
              data-cursor="pointer"
            >
              <Lock className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
            </button>
          </Magnetic>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="flex xl:hidden p-2.5 text-slate-300 hover:text-white rounded-xl
            bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-colors shadow-sm"
          aria-label="Toggle menu"
          data-cursor="pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="xl:hidden mobile-menu-enter
          bg-[#060c18]/98 backdrop-blur-2xl border-b border-cyan-500/30
          px-5 pt-4 pb-7 mt-2 shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
        >
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item, i) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item flex items-center justify-between px-4 py-3 rounded-xl
                    text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="tracking-wide">{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-cyan-500/30"
              onClick={() => handleNavClick('contact')}
            >
              Contact Me
            </Button>
            <a
              href={data.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold
                rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-950"
            >
              <span>Resume PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
