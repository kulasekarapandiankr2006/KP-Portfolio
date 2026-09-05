import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { Competition } from '../../types/portfolio';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const CompetitionsEditorPage: React.FC = () => {
  const { competitions, updateCompetitions } = usePortfolioData();
  const [items, setItems] = useState<Competition[]>(() => [...competitions]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof Competition, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const addCompetition = () => {
    setItems([
      ...items,
      {
        id: `comp-${Date.now()}`,
        title: 'New Robotics Challenge',
        organizer: 'Competition Board',
        date: '2024-03',
        award: '1st Place Winner',
        rank: 'Champion',
        description: 'Challenge specifications, team responsibilities, and achievements...',
        technologies: ['ROS 2', 'C++', 'Computer Vision'],
      }
    ]);
  };

  const removeCompetition = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompetitions(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Engineering Competitions & Hackathons
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage international robotics challenges, rovers, rankings, and award distinctions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addCompetition}
          >
            Add Competition
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Competitions
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Competitions and hackathons saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((comp, idx) => (
          <Card key={comp.id || idx} padding="lg" className="space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400">
                Competition #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeCompetition(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-mono text-slate-300">Competition Name</label>
                <input
                  type="text"
                  required
                  value={comp.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Organizer / Host</label>
                <input
                  type="text"
                  required
                  value={comp.organizer}
                  onChange={(e) => handleFieldChange(idx, 'organizer', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Date / Year</label>
                <input
                  type="text"
                  value={comp.date}
                  onChange={(e) => handleFieldChange(idx, 'date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Award Title</label>
                <input
                  type="text"
                  value={comp.award}
                  onChange={(e) => handleFieldChange(idx, 'award', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Standing / Rank</label>
                <input
                  type="text"
                  value={comp.rank || ''}
                  onChange={(e) => handleFieldChange(idx, 'rank', e.target.value)}
                  placeholder="e.g. 1st Place / Finalist"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-mono text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={comp.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Technologies Utilized"
                  tags={comp.technologies}
                  onChange={(tags) => handleFieldChange(idx, 'technologies', tags)}
                  variant="amber"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
