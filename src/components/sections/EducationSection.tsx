import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export const EducationSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data } = usePortfolioData();
  const { education } = data;

  return (
    <section ref={sectionRef} id="education" className="py-20 relative border-t border-slate-800/80 bg-background-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Academics"
          badgeVariant="purple"
          title="Education & Academic Honors"
          subtitle="Formal engineering education, advanced mathematics, dynamics, and undergraduate research credentials."
        />

        <div className="space-y-8">
          {education.map((edu, idx) => (
            <Card key={edu.id} padding="lg" className={`space-y-6 border-slate-800 reveal-on-scroll${idx > 0 ? ' delay-100' : ''}`}>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {edu.degree}
                    </h3>
                    <div className="text-sm font-semibold text-cyan-400 font-mono mt-0.5">
                      {edu.major}
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-2">
                      <span>{edu.institution}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {edu.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {edu.gpa && (
                    <Badge variant="emerald" size="md">
                      {edu.gpa}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{edu.startDate} — {edu.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Honors Callout */}
              {edu.honors && (
                <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center gap-3 text-xs sm:text-sm text-amber-200">
                  <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="font-medium">{edu.honors}</span>
                </div>
              )}

              {/* Key Coursework Grid */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-engineering-cyan" />
                  <span>Key Coursework & Advanced Modules:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {edu.coursework.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300"
                    >
                      {course}
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Highlights */}
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Academic Activities & Leadership:
                  </div>
                  <ul className="space-y-1.5">
                    {edu.highlights.map((h, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
