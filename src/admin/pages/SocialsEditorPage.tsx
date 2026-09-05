import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import type { SocialLink } from '../../types/portfolio';
import { 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export const SocialsEditorPage: React.FC = () => {
  const { socialLinks, updateSocialLinks } = usePortfolioData();
  const [items, setItems] = useState<SocialLink[]>(() => [...socialLinks]);
  const [saved, setSaved] = useState(false);

  const handleFieldChange = (index: number, field: keyof SocialLink, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const addLink = () => {
    setItems([
      ...items,
      {
        id: `social-${Date.now()}`,
        platform: 'New Platform',
        url: 'https://',
        username: '@username',
        icon: 'Github',
      }
    ]);
  };

  const removeLink = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Social Media & Engineering Repositories
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage links to GitHub, LinkedIn, GrabCAD, YouTube, and Google Scholar profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addLink}
          >
            Add Profile Link
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Social Links
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Social links saved successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        {items.map((link, idx) => (
          <Card key={link.id || idx} padding="md" className="border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Platform</label>
                <input
                  type="text"
                  required
                  value={link.platform}
                  onChange={(e) => handleFieldChange(idx, 'platform', e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Profile URL</label>
                <input
                  type="url"
                  required
                  value={link.url}
                  onChange={(e) => handleFieldChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Display Handle</label>
                <input
                  type="text"
                  value={link.username}
                  onChange={(e) => handleFieldChange(idx, 'username', e.target.value)}
                  placeholder="@handle"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-5">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-cyan-300"
                  title="Open Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
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
