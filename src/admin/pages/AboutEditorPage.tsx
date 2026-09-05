import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { FocusArea } from '../../types/portfolio';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const AboutEditorPage: React.FC = () => {
  const { data, updateFocusAreas } = usePortfolioData();
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(() => [...data.focusAreas]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof FocusArea, val: any) => {
    const updated = [...focusAreas];
    updated[index] = { ...updated[index], [field]: val };
    setFocusAreas(updated);
  };

  const addFocusArea = () => {
    setFocusAreas([
      ...focusAreas,
      {
        id: `focus-${Date.now()}`,
        title: 'New Engineering Domain',
        subtitle: 'Domain Subtitle',
        description: 'Description of technologies and methodologies in this domain...',
        icon: 'Cpu',
        tags: ['Tech1', 'Tech2'],
      }
    ]);
  };

  const removeFocusArea = (index: number) => {
    setFocusAreas(focusAreas.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFocusAreas(focusAreas);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Focus Areas & Engineering Domains
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage the core Mechatronics pillars showcased in the Domains and About sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addFocusArea}
          >
            Add Domain
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Focus Domains
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Engineering domains saved successfully!</span>
        </div>
      )}

      {/* Focus Domains Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {focusAreas.map((area, idx) => (
          <Card key={area.id || idx} padding="lg" className="space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                Domain #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeFocusArea(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete Domain"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Domain Title</label>
                <input
                  type="text"
                  required
                  value={area.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Subtitle / Tag</label>
                <input
                  type="text"
                  required
                  value={area.subtitle}
                  onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Icon Identifier</label>
                <select
                  value={area.icon}
                  onChange={(e) => handleFieldChange(idx, 'icon', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                >
                  <option value="Bot">Bot (Robotics)</option>
                  <option value="Cpu">Cpu (Embedded / Firmware)</option>
                  <option value="Cog">Cog (Mechanical / CAD)</option>
                  <option value="Activity">Activity (Control / Dynamics)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Description</label>
                <textarea
                  rows={3}
                  required
                  value={area.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <TagInput
                label="Domain Stack Tags"
                tags={area.tags}
                onChange={(tags) => handleFieldChange(idx, 'tags', tags)}
                variant="cyan"
              />
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
