import React, { useEffect, useState } from 'react';
import type { Project } from '../../types/project';
import { runtimeService } from '../../services/runtimeService';
import { Badge } from './Badge';
import { TechBadge } from './TechBadge';
import { Button } from './Button';
import { GithubIcon, YoutubeIcon } from './Icons';
import { X, Play, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProjectQuickViewModalProps {
  project: Project | null;
  onClose: () => void;
  onViewFullDetails: (slug: string) => void;
}

export const ProjectQuickViewModal: React.FC<ProjectQuickViewModalProps> = ({
  project,
  onClose,
  onViewFullDetails,
}) => {
  const [activeThumbnail, setActiveThumbnail] = useState<string>('');
  const selectedImage = activeThumbnail || project?.thumbnail || '';

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const handleRun = () => {
    const url = runtimeService.getProjectRuntimeUrl(project.slug, project.entryPoint || 'index.html');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const images = [project.thumbnail, ...(project.gallery || [])].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#08111e] border border-cyan-400/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.15)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#08111e]/95 backdrop-blur-lg border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Badge variant="blue" size="sm">
              {project.category}
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              YEAR {project.year} // {project.duration}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Visual Showcase */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={selectedImage || project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08111e] via-transparent to-transparent opacity-60" />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumbnail(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border transition-all ${
                      selectedImage === img
                        ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)] scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm font-mono text-cyan-400 mt-1">{project.tagline}</p>
          </div>

          {/* Overview */}
          <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>

          {/* Key Achievements / Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Core Engineering Innovations:
              </div>
              <ul className="space-y-2">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Badges */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Technology Stack:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <TechBadge key={i} name={tech} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#08111e]/95 backdrop-blur-lg border-t border-slate-800">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                title="View GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {project.youtubeUrl && (
              <a
                href={project.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                title="Watch Demonstration"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            {project.hasZip && (
              <Button
                variant="cyan"
                size="sm"
                icon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={handleRun}
              >
                Run Simulator
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => {
                onClose();
                onViewFullDetails(project.slug);
              }}
            >
              Full Case Study
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
