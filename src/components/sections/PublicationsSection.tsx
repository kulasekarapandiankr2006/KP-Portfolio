import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  ExternalLink, 
  Calendar, 
  Users 
} from 'lucide-react';

export const PublicationsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { publications } = data;

  if (!publications || publications.length === 0) return null;

  return (
    <section ref={sectionRef} id="publications" className="py-20 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Research & Papers"
          badgeVariant="purple"
          title="Peer-Reviewed Publications"
          subtitle="Original research on robotics dynamics, cycloidal transmission mechanics, and real-time state estimation."
        />

        <div className="space-y-6">
          {publications.map((pub, idx) => (
            <Card key={pub.id} padding="lg" className={`space-y-4 border-slate-800 hover:border-purple-500/40 reveal-on-scroll${idx > 0 ? ' delay-100' : ''}`}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="purple" size="sm">
                      {pub.conferenceOrJournal}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {pub.date}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {pub.title}
                  </h3>

                  <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-engineering-cyan" />
                    <span>{pub.authors.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-start">
                  {pub.doi && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      DOI: {pub.doi}
                    </span>
                  )}
                  {pub.paperUrl && (
                    <a
                      href={pub.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-500/40 hover:bg-purple-900/50 transition-colors"
                    >
                      <span>IEEE Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Abstract:
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80">
                  {pub.abstract}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {pub.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
