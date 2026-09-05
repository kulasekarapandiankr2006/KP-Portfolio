import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  FolderKanban, 
  Cog, 
  Award, 
  Trophy, 
  BookOpen, 
  Flag, 
  Languages as LangIcon, 
  Share2, 
  FileCode, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/projects', label: 'Projects Manager', icon: FolderKanban, highlight: true },
  { path: '/admin/mechanical', label: 'Mechanical CAD', icon: Cog, highlight: true },
  { path: '/admin/profile', label: 'Profile & Hero', icon: User },
  { path: '/admin/about', label: 'About & Focus', icon: FileText },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/skills', label: 'Skills Matrix', icon: Cpu },
  { path: '/admin/certifications', label: 'Certifications', icon: Award },
  { path: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { path: '/admin/publications', label: 'Publications', icon: BookOpen },
  { path: '/admin/competitions', label: 'Competitions', icon: Flag },
  { path: '/admin/languages', label: 'Languages', icon: LangIcon },
  { path: '/admin/socials', label: 'Social Media', icon: Share2 },
  { path: '/admin/resume', label: 'Resume & Assets', icon: FileCode },
  { path: '/admin/settings', label: 'CMS Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirect directly to Public Portfolio Home Page
    navigate('/', { replace: true });
  };

  const getPageTitle = () => {
    const current = ADMIN_NAV_ITEMS.find(item => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));
    return current ? current.label : 'CMS Management';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white font-display">
            Mechatronics CMS
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 border border-engineering-blue/40 flex items-center justify-center text-cyan-400 shadow-tech-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                Control Console
              </div>
              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LOCAL CMS v1.0</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-semibold">
            Core Modules
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-engineering-blue/20 text-white font-semibold border border-engineering-blue/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${item.highlight ? 'relative' : ''}`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="truncate">{user?.username || 'Administrator'}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-1 p-2 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="View Public Site"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1 p-2 rounded-lg bg-rose-950/40 text-[11px] font-mono text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 transition-colors"
              title="Logout to Home"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Admin Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Admin Session Active
            </span>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors border border-slate-700"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-mono transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
