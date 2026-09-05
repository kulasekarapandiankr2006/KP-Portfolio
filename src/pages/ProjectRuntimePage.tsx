import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useNavigation } from '../hooks/useNavigation';
import { runtimeService } from '../services/runtimeService';
import { Button } from '../components/common/Button';
import { 
  ArrowLeft, 
  RefreshCw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ProjectRuntimePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProjectBySlug } = usePortfolioData();
  const { navigateToPage } = useNavigation();

  const project = slug ? getProjectBySlug(slug) : undefined;
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [frameKey, setFrameKey] = useState(0);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [checkingServer, setCheckingServer] = useState(true);

  const cleanEntry = (project?.entryPoint || 'index.html').replace(/^\/+/, '');
  const runtimeUrl = project ? runtimeService.getProjectRuntimeUrl(project.slug, cleanEntry) : '';

  const checkAndPrepareRuntime = async () => {
    if (!project) return;
    setCheckingServer(true);
    try {
      const isOnline = await runtimeService.checkHealth();
      setServerOnline(isOnline);
      if (isOnline) {
        // Ensure project files are synced to Express
        await runtimeService.ensureProjectReady(project.slug);
      }
    } catch {
      setServerOnline(false);
    } finally {
      setCheckingServer(false);
    }
  };

  useEffect(() => {
    checkAndPrepareRuntime();
  }, [project?.slug]);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-rose-400 font-mono text-xl font-bold">404 - Project Not Found</div>
          <p className="text-xs text-slate-400">
            The requested project specification could not be located.
          </p>
          <Button variant="primary" onClick={() => navigateToPage('/')}>
            Return to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      {/* Runtime Control Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigateToPage(`/projects/${project.slug}`)}
          >
            Back to Specs
          </Button>

          <div className="hidden md:block h-6 w-px bg-slate-800" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                {project.title}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" />
                EXPRESS RUNTIME
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">
              Entry Point: <code className="text-cyan-300 font-semibold">{cleanEntry}</code>
            </div>
          </div>
        </div>

        {/* Device Switcher & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'desktop' ? 'bg-engineering-blue text-white' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'tablet' ? 'bg-engineering-blue text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'mobile' ? 'bg-engineering-blue text-white' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setFrameKey(k => k + 1)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Reload Preview Frame"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={runtimeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium border border-emerald-400/40 shadow-sm transition-all"
          >
            <span>Launch in Browser Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950/60 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <div className={`h-full ${getContainerWidth()} w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300`}>
          {/* Simulated Browser Bar */}
          <div className="h-9 bg-slate-950 border-b border-slate-800/80 px-3 flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex-1 max-w-md mx-auto bg-slate-900 rounded px-3 py-0.5 text-[11px] font-mono text-cyan-300 border border-slate-800/80 truncate text-center">
              {runtimeUrl}
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                {serverOnline ? 'RUNTIME LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* Runtime Sandbox Viewport */}
          <div className="flex-1 relative bg-slate-950 w-full h-full overflow-hidden flex flex-col">
            {checkingServer ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-8">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-xs font-mono text-slate-400">Connecting to Express Static Runtime...</p>
              </div>
            ) : serverOnline ? (
              <iframe
                key={frameKey}
                src={runtimeUrl}
                title={project.title}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-4 p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Runtime Server Unavailable</h3>
                    <p className="text-xs font-mono text-rose-300">
                      Could not connect to the portfolio runtime server.
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Please ensure the runtime backend is running and reachable, then retry the connection.
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      onClick={checkAndPrepareRuntime}
                    >
                      Retry Connection
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.open(runtimeUrl, '_blank')}
                    >
                      Open URL Directly
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
