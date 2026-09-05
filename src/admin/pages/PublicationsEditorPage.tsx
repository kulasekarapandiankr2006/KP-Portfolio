import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { Publication } from '../../types/portfolio';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const PublicationsEditorPage: React.FC = () => {
  const { publications, updatePublications } = usePortfolioData();
  const [items, setItems] = useState<Publication[]>(() => [...publications]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof Publication, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const addPublication = () => {
    setItems([
      ...items,
      {
        id: `pub-${Date.now()}`,
        title: 'New Research Paper Title',
        authors: ['Kulasekara Pandian K R'],
        conferenceOrJournal: 'IEEE Conference',
        date: '2024-05',
        doi: '10.1109/EXAMPLE.2024',
        abstract: 'Paper abstract and summary of technical findings...',
        paperUrl: '',
        tags: ['Robotics', 'Control'],
      }
    ]);
  };

  const removePublication = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePublications(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Research & Publications Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage peer-reviewed publications, DOI identifiers, journal records, and author lists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addPublication}
          >
            Add Publication
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Publications
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Publications saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {items.map((pub, idx) => (
          <Card key={pub.id || idx} padding="lg" className="space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-purple-400">
                Paper #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removePublication(idx)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-mono text-slate-300">Publication Title</label>
                <input
                  type="text"
                  required
                  value={pub.title}
                  onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Conference / Journal</label>
                <input
                  type="text"
                  required
                  value={pub.conferenceOrJournal}
                  onChange={(e) => handleFieldChange(idx, 'conferenceOrJournal', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-purple-300 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Date</label>
                <input
                  type="text"
                  value={pub.date}
                  onChange={(e) => handleFieldChange(idx, 'date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">DOI / Document Identifier</label>
                <input
                  type="text"
                  value={pub.doi || ''}
                  onChange={(e) => handleFieldChange(idx, 'doi', e.target.value)}
                  placeholder="10.1109/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Paper IEEE/Publisher URL</label>
                <input
                  type="url"
                  value={pub.paperUrl || ''}
                  onChange={(e) => handleFieldChange(idx, 'paperUrl', e.target.value)}
                  placeholder="https://ieeexplore.ieee.org/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Authors List"
                  tags={pub.authors}
                  onChange={(authors) => handleFieldChange(idx, 'authors', authors)}
                  variant="blue"
                  placeholder="Add author..."
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-mono text-slate-300">Abstract</label>
                <textarea
                  rows={3}
                  value={pub.abstract}
                  onChange={(e) => handleFieldChange(idx, 'abstract', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <TagInput
                  label="Research Tags"
                  tags={pub.tags}
                  onChange={(tags) => handleFieldChange(idx, 'tags', tags)}
                  variant="cyan"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
