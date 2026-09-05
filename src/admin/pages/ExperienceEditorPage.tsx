import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { Experience } from '../../types/portfolio';
import { 
  Briefcase, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const ExperienceEditorPage: React.FC = () => {
  const { experiences, updateExperiences } = usePortfolioData();
  const [items, setItems] = useState<Experience[]>(() => [...experiences]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof Experience, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, val: string) => {
    const updated = [...items];
    const achs = [...updated[expIndex].achievements];
    achs[achIndex] = val;
    updated[expIndex] = { ...updated[expIndex], achievements: achs };
    setItems(updated);
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...items];
    updated[expIndex] = {
      ...updated[expIndex],
      achievements: [...updated[expIndex].achievements, '']
    };
    setItems(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...items];
    updated[expIndex] = {
      ...updated[expIndex],
      achievements: updated[expIndex].achievements.filter((_, idx) => idx !== achIndex)
    };
    setItems(updated);
  };

  const addExperience = () => {
    setItems([
      ...items,
      {
        id: `exp-${Date.now()}`,
        role: 'Robotics Engineer',
        organization: 'Engineering Company',
        organizationUrl: '',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        startDate: '2024-01',
        endDate: 'Present',
        current: true,
        summary: 'Overview of engineering responsibilities and projects...',
        achievements: ['Engineered key subsystem...'],
        technologies: ['C++', 'ROS 2', 'SolidWorks'],
      }
    ]);
  };

  const removeExperience = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExperiences(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Engineering Experience Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Add, update, or reorder engineering roles, achievements, and tech stacks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addExperience}
          >
            Add Experience
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Experience
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Work experience timeline saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((exp, expIdx) => (
          <Card key={exp.id || expIdx} padding="lg" className="space-y-5 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Role #{expIdx + 1}: {exp.role} @ {exp.organization}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeExperience(expIdx)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Job Title / Role</label>
                <input
                  type="text"
                  required
                  value={exp.role}
                  onChange={(e) => handleFieldChange(expIdx, 'role', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Organization Name</label>
                <input
                  type="text"
                  required
                  value={exp.organization}
                  onChange={(e) => handleFieldChange(expIdx, 'organization', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Employment Type</label>
                <select
                  value={exp.type}
                  onChange={(e) => handleFieldChange(expIdx, 'type', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Research">Research</option>
                  <option value="Student Team">Student Team</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleFieldChange(expIdx, 'location', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleFieldChange(expIdx, 'startDate', e.target.value)}
                  placeholder="2023-08"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300">End Date</label>
                  <label className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleFieldChange(expIdx, 'current', e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700"
                    />
                    <span>Present</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={exp.current}
                  value={exp.current ? 'Present' : exp.endDate}
                  onChange={(e) => handleFieldChange(expIdx, 'endDate', e.target.value)}
                  placeholder="2024-05"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Summary Overview</label>
              <textarea
                rows={2}
                value={exp.summary}
                onChange={(e) => handleFieldChange(expIdx, 'summary', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>

            {/* Achievements */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  Key Technical Achievements ({exp.achievements.length}):
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={() => addAchievement(expIdx)}
                >
                  Add Achievement
                </Button>
              </div>

              {exp.achievements.map((ach, achIdx) => (
                <div key={achIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => handleAchievementChange(expIdx, achIdx, e.target.value)}
                    placeholder="Achievement description..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(expIdx, achIdx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <TagInput
              label="Role Technology Stack"
              tags={exp.technologies}
              onChange={(tags) => handleFieldChange(expIdx, 'technologies', tags)}
              variant="blue"
            />
          </Card>
        ))}
      </div>
    </form>
  );
};
