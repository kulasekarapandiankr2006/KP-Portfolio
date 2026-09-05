import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import type { Profile } from '../../types/portfolio';
import { 
  User, 
  Save, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const ProfileEditorPage: React.FC = () => {
  const { data, updateProfile } = usePortfolioData();
  const [profile, setProfile] = useState<Profile>(() => ({ ...data.profile }));
  const [saved, setSaved] = useState(false);

  const handleStatChange = (index: number, field: string, val: string) => {
    const updated = [...profile.stats];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, stats: updated });
  };

  const addStat = () => {
    setProfile({
      ...profile,
      stats: [...profile.stats, { label: 'New Metric', value: '10+', subtext: 'Subtext' }]
    });
  };

  const removeStat = (index: number) => {
    setProfile({
      ...profile,
      stats: profile.stats.filter((_, idx) => idx !== index)
    });
  };

  const handleBioChange = (index: number, val: string) => {
    const updated = [...profile.bio];
    updated[index] = val;
    setProfile({ ...profile, bio: updated });
  };

  const addBioParagraph = () => {
    setProfile({ ...profile, bio: [...profile.bio, ''] });
  };

  const removeBioParagraph = (index: number) => {
    setProfile({ ...profile, bio: profile.bio.filter((_, idx) => idx !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Profile, Hero & Bio Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Configure engineer headline, bio narrative, philosophy, stats, and contact coordinates.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
        >
          Save Profile Changes
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Profile configuration successfully saved to local persistent storage!</span>
        </div>
      )}

      {/* Main Identity & Hero */}
      <Card padding="lg" className="space-y-5 border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Core Engineering Identity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-engineering-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Preferred Name</label>
            <input
              type="text"
              value={profile.preferredName || ''}
              onChange={(e) => setProfile({ ...profile, preferredName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">Professional Engineering Title</label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">Hero Subtitle & Specializations</label>
            <input
              type="text"
              required
              value={profile.subtitle}
              onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Availability Status Badge</label>
            <input
              type="text"
              value={profile.statusBadge}
              onChange={(e) => setProfile({ ...profile, statusBadge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Resume PDF URL</label>
            <input
              type="text"
              value={profile.resumeUrl}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Hero Stats Matrix */}
      <Card padding="lg" className="space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Hero Engineering Metric Badges ({profile.stats.length})
          </div>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addStat}>
            Add Metric
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.stats.map((stat, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 18+)"
                  className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-sm font-bold font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={stat.label}
                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                placeholder="Metric Label"
                className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              />

              <input
                type="text"
                value={stat.subtext || ''}
                onChange={(e) => handleStatChange(idx, 'subtext', e.target.value)}
                placeholder="Subtext / Details"
                className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[11px] font-mono text-slate-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Bio & Philosophy Narrative */}
      <Card padding="lg" className="space-y-5 border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Bio Narrative & Philosophy</span>
          </div>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addBioParagraph}>
            Add Bio Paragraph
          </Button>
        </div>

        <div className="space-y-3">
          {profile.bio.map((para, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Paragraph #{idx + 1}</span>
                {profile.bio.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBioParagraph(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={para}
                onChange={(e) => handleBioChange(idx, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-engineering-cyan resize-none"
              />
            </div>
          ))}

          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            <label className="text-xs font-mono text-cyan-400 font-semibold">
              Engineering Philosophy Quote:
            </label>
            <textarea
              rows={2}
              value={profile.engineeringPhilosophy}
              onChange={(e) => setProfile({ ...profile, engineeringPhilosophy: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs italic focus:outline-none resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Contact Coordinates */}
      <Card padding="lg" className="space-y-5 border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Contact Coordinates & Links</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Base Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Primary Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </Card>
    </form>
  );
};
