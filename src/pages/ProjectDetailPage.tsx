import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useNavigation } from '../hooks/useNavigation';
import { runtimeService } from '../services/runtimeService';
import { Badge } from '../components/common/Badge';
import { TechBadge } from '../components/common/TechBadge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { GithubIcon, YoutubeIcon } from '../components/common/Icons';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Radio, 
  Wrench,
  ChevronRight
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProjectBySlug } = usePortfolioData();
  const { navigateToPage, scrollToSection } = useNavigation();

  const project = slug ? getProjectBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState<string>(project?.thumbnail || '');

  const handleRunProject = () => {
    if (!project) return;
    const url = runtimeService.getProjectRuntimeUrl(project.slug, project.entryPoint || 'index.html');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Card padding="lg" className="text-center max-w-md space-y-4">
          <div className="text-rose-400 font-mono text-xl font-bold">404 - Project Not Found</div>
          <p className="text-sm text-slate-300">
            The project specification for <code className="text-cyan-300 font-mono">{slug}</code> could not be located.
          </p>
          <Button variant="primary" onClick={() => navigateToPage('/')}>
            Return to Portfolio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background page-enter">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button onClick={() => navigateToPage('/')} className="hover:text-white transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">
            Projects
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400 font-semibold">{project.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Project Header Banner */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => scrollToSection('projects')}
            >
              Back to Projects
            </Button>
            <Badge variant="blue" size="md">
              {project.category}
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Year {project.year}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-cyan-400 font-mono">
              {project.tagline}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Role:</span>
              <span className="text-slate-200 font-semibold">{project.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Duration:</span>
              <span className="text-slate-200 font-semibold">{project.duration}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Organization:</span>
              <span className="text-slate-200 font-semibold">{project.organization || 'Independent'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Team:</span>
              <span className="text-slate-200 font-semibold">{project.team || 'Solo'}</span>
            </div>
          </div>

          {/* Action Buttons Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {(project.hasZip || project.runtimeUrl) && (
              <Button
                variant="primary"
                size="md"
                icon={<Play className="w-4 h-4 fill-current" />}
                onClick={handleRunProject}
                className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-lg shadow-emerald-950"
              >
                Run Project
              </Button>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 transition-colors text-sm font-medium"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}

            {project.youtubeUrl && (
              <a
                href={project.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 transition-colors text-sm font-medium"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>Video Demonstration</span>
              </a>
            )}

            {project.docsUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Documentation Wiki</span>
              </a>
            )}
          </div>
        </div>

        {/* Media & Gallery Showcase */}
        <div className="space-y-4">
          <div className="relative h-[340px] sm:h-[480px] w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
            <img
              src={activeImage || project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {project.gallery && project.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {project.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-engineering-cyan shadow-tech-cyan' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Engineering Methodology & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Story (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <Card padding="lg" className="space-y-4 border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-engineering-cyan" />
                <span>Executive Summary & Context</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                    The Engineering Challenge:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Core Objective:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.objective}
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="space-y-4 border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Technical Approach & System Architecture
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.approach}
              </p>
            </Card>

            <Card padding="lg" className="space-y-4 border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Engineered Capabilities & Subsystems
              </h3>
              <ul className="space-y-3">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-engineering-cyan flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card padding="lg" className="space-y-4 border-emerald-500/30 bg-emerald-950/10">
              <h3 className="text-lg font-bold text-emerald-300">
                Experimental Results & Performance Metrics
              </h3>
              <ul className="space-y-2.5">
                {project.results.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Technical Specifications Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card padding="md" className="space-y-3 border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Hardware & Computing</span>
              </div>
              <div className="space-y-1.5">
                {project.hardware.map((hw, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                    {hw}
                  </div>
                ))}
              </div>
            </Card>

            {project.sensors && project.sensors.length > 0 && (
              <Card padding="md" className="space-y-3 border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Sensors & Telemetry</span>
                </div>
                <div className="space-y-1.5">
                  {project.sensors.map((sens, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                      {sens}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {project.tools && project.tools.length > 0 && (
              <Card padding="md" className="space-y-3 border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Tools & Instruments</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <Card padding="md" className="space-y-3 border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Complete Technology Stack:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, idx) => (
                  <TechBadge key={idx} name={tech} size="sm" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
