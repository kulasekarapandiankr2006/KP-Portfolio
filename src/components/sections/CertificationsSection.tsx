import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  ShieldCheck 
} from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { certifications, achievements } = usePortfolioData();

  return (
    <section ref={sectionRef} id="certifications" className="py-20 relative border-t border-slate-800/80 bg-background-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Credentials & Recognition"
          badgeVariant="emerald"
          title="Certifications & Engineering Awards"
          subtitle="Industry certifications in CAD modeling, ROS2 robotics, and national competition awards."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Industry Certifications</span>
            </h3>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <Card key={cert.id} padding="md" className={`space-y-3 border-slate-800 hover:border-emerald-500/30 reveal-on-scroll${idx % 2 === 1 ? ' delay-100' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {cert.title}
                      </h4>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">
                        Issuer: {cert.issuer}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 self-start">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{cert.issueDate}</span>
                    </div>
                  </div>

                  {cert.credentialId && (
                    <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-1">
                      <span>ID: <span className="text-slate-200">{cert.credentialId}</span></span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-engineering-cyan hover:underline flex items-center gap-1 text-xs"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Honors & Key Achievements</span>
            </h3>

            <div className="space-y-4">
              {achievements.map((ach, idx) => (
                <Card key={ach.id} padding="md" className={`space-y-2 border-slate-800 hover:border-amber-500/30 reveal-on-scroll${idx % 2 === 1 ? ' delay-100' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    {ach.awardLevel && (
                      <Badge variant="amber" size="sm">
                        {ach.awardLevel}
                      </Badge>
                    )}
                    <span className="text-xs font-mono text-slate-400">{ach.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {ach.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400">
                    {ach.organization}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {ach.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
