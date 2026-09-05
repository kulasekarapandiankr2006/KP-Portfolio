import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import type { Language } from '../../types/portfolio';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const LanguagesEditorPage: React.FC = () => {
  const { languages, updateLanguages } = usePortfolioData();
  const [items, setItems] = useState<Language[]>(() => [...languages]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof Language, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const addLanguage = () => {
    setItems([
      ...items,
      {
        id: `lang-${Date.now()}`,
        name: 'Language Name',
        proficiency: 'Professional Working',
        notes: 'Technical documentation & reports',
      }
    ]);
  };

  const removeLanguage = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLanguages(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Communication & Spoken Languages
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage language proficiencies for technical collaboration and documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addLanguage}
          >
            Add Language
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Languages
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Languages updated successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        {items.map((lang, idx) => (
          <Card key={lang.id || idx} padding="md" className="border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Language</label>
                <input
                  type="text"
                  required
                  value={lang.name}
                  onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Proficiency Level</label>
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleFieldChange(idx, 'proficiency', e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Notes</label>
                <input
                  type="text"
                  value={lang.notes || ''}
                  onChange={(e) => handleFieldChange(idx, 'notes', e.target.value)}
                  placeholder="e.g. Technical writing"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end pt-5">
                <button
                  type="button"
                  onClick={() => removeLanguage(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
