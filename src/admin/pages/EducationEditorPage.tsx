import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { Education } from '../../types/portfolio';
import { 
  GraduationCap, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const EducationEditorPage: React.FC = () => {
  const { education, updateEducation } = usePortfolioData();
  const [items, setItems] = useState<Education[]>(() => [...education]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof Education, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleHighlightChange = (eduIndex: number, hlIndex: number, val: string) => {
    const updated = [...items];
    const hls = [...updated[eduIndex].highlights];
    hls[hlIndex] = val;
    updated[eduIndex] = { ...updated[eduIndex], highlights: hls };
    setItems(updated);
  };

  const addHighlight = (eduIndex: number) => {
    const updated = [...items];
    updated[eduIndex] = {
      ...updated[eduIndex],
      highlights: [...updated[eduIndex].highlights, '']
    };
    setItems(updated);
  };

  const removeHighlight = (eduIndex: number, hlIndex: number) => {
    const updated = [...items];
    updated[eduIndex] = {
      ...updated[eduIndex],
      highlights: updated[eduIndex].highlights.filter((_, idx) => idx !== hlIndex)
    };
    setItems(updated);
  };

  const addEducation = () => {
    setItems([
      ...items,
      {
        id: `edu-${Date.now()}`,
        degree: 'Master of Science in Robotics',
        major: 'Robotics Systems & Autonomous Dynamics',
        institution: 'University Name',
        location: 'Location',
        startDate: '2024',
        endDate: '2026',
        current: true,
        gpa: 'GPA: 3.90 / 4.00',
        honors: 'Research Fellowship',
        coursework: ['Advanced Dynamics', 'Optimal Control'],
        highlights: ['Published capstone research'],
      }
    ]);
  };

  const removeEducation = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEducation(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Academic Background & Education
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage engineering degrees, GPA, academic honors, and coursework.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addEducation}
          >
            Add Degree
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Education
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Academic background saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((edu, eduIdx) => (
          <Card key={edu.id || eduIdx} padding="lg" className="space-y-5 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Degree #{eduIdx + 1}: {edu.degree}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeEducation(eduIdx)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete Degree"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Degree Title</label>
                <input
                  type="text"
                  required
                  value={edu.degree}
                  onChange={(e) => handleFieldChange(eduIdx, 'degree', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Major / Engineering Discipline</label>
                <input
                  type="text"
                  required
                  value={edu.major}
                  onChange={(e) => handleFieldChange(eduIdx, 'major', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Institution / University</label>
                <input
                  type="text"
                  required
                  value={edu.institution}
                  onChange={(e) => handleFieldChange(eduIdx, 'institution', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleFieldChange(eduIdx, 'location', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">GPA / Standing</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleFieldChange(eduIdx, 'gpa', e.target.value)}
                  placeholder="e.g. First Class Honours (3.86 / 4.00)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Tenure Years</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleFieldChange(eduIdx, 'startDate', e.target.value)}
                    placeholder="2020"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  />
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleFieldChange(eduIdx, 'endDate', e.target.value)}
                    placeholder="2024"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-mono text-amber-300">Academic Honors & Awards</label>
                <input
                  type="text"
                  value={edu.honors || ''}
                  onChange={(e) => handleFieldChange(eduIdx, 'honors', e.target.value)}
                  placeholder="e.g. Dean's Honour List for 6 Consecutive Semesters | Best Capstone Award"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Coursework Tags */}
            <TagInput
              label="Advanced Modules & Relevant Coursework"
              tags={edu.coursework}
              onChange={(tags) => handleFieldChange(eduIdx, 'coursework', tags)}
              variant="cyan"
              placeholder="e.g. Robotics Kinematics, Modern Control, FEA..."
            />

            {/* Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  Activities, Leadership & Capstone:
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={() => addHighlight(eduIdx)}
                >
                  Add Highlight
                </Button>
              </div>

              {edu.highlights.map((hl, hlIdx) => (
                <div key={hlIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => handleHighlightChange(eduIdx, hlIdx, e.target.value)}
                    placeholder="Academic activity / capstone detail..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(eduIdx, hlIdx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
