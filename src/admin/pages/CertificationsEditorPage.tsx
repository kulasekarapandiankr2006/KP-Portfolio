import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import type { Certification, Achievement } from '../../types/portfolio';
import { 
  Award, 
  Trophy, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const CertificationsEditorPage: React.FC = () => {
  const { certifications, achievements, updateCertifications, updateAchievements } = usePortfolioData();
  const [certs, setCerts] = useState<Certification[]>(() => [...certifications]);
  const [achs, setAchs] = useState<Achievement[]>(() => [...achievements]);
  const [saved, setSaved] = useState(false);

  // Certifications Handlers
  const handleCertChange = (index: number, field: keyof Certification, val: any) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], [field]: val };
    setCerts(updated);
  };

  const addCert = () => {
    setCerts([
      ...certs,
      {
        id: `cert-${Date.now()}`,
        title: 'New Engineering Certification',
        issuer: 'Certification Authority',
        issueDate: '2024-01',
        credentialId: 'CRED-ID-1234',
        credentialUrl: '',
        skills: ['SolidWorks', 'CAD'],
      }
    ]);
  };

  const removeCert = (index: number) => {
    setCerts(certs.filter((_, idx) => idx !== index));
  };

  // Achievements Handlers
  const handleAchChange = (index: number, field: keyof Achievement, val: any) => {
    const updated = [...achs];
    updated[index] = { ...updated[index], [field]: val };
    setAchs(updated);
  };

  const addAch = () => {
    setAchs([
      ...achs,
      {
        id: `ach-${Date.now()}`,
        title: '1st Place Award',
        organization: 'Engineering Institution',
        date: '2024-05',
        awardLevel: 'National Award',
        description: 'Award details and criteria...',
      }
    ]);
  };

  const removeAch = (index: number) => {
    setAchs(achs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCertifications(certs);
    updateAchievements(achs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Certifications & Honors Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage verified industry credentials, ID codes, verification URLs, and engineering honors.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
        >
          Save Certifications & Honors
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Certifications and achievements saved successfully!</span>
        </div>
      )}

      {/* Part 1: Industry Certifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase">
              Verified Industry Certifications ({certs.length})
            </h2>
          </div>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addCert}>
            Add Certification
          </Button>
        </div>

        <div className="space-y-4">
          {certs.map((cert, idx) => (
            <Card key={cert.id || idx} padding="lg" className="space-y-4 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-300">
                  Certification #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCert(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono text-slate-300">Certificate Title</label>
                  <input
                    type="text"
                    required
                    value={cert.title}
                    onChange={(e) => handleCertChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Issuing Body</label>
                  <input
                    type="text"
                    required
                    value={cert.issuer}
                    onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Issue Date</label>
                  <input
                    type="text"
                    value={cert.issueDate}
                    onChange={(e) => handleCertChange(idx, 'issueDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Credential ID</label>
                  <input
                    type="text"
                    value={cert.credentialId || ''}
                    onChange={(e) => handleCertChange(idx, 'credentialId', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Verification URL</label>
                  <input
                    type="url"
                    value={cert.credentialUrl || ''}
                    onChange={(e) => handleCertChange(idx, 'credentialUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <TagInput
                label="Associated Skills & Knowledge Domains"
                tags={cert.skills}
                onChange={(tags) => handleCertChange(idx, 'skills', tags)}
                variant="emerald"
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Part 2: Honors & Achievements */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase">
              Honors & Key Achievements ({achs.length})
            </h2>
          </div>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addAch}>
            Add Honor / Award
          </Button>
        </div>

        <div className="space-y-4">
          {achs.map((ach, idx) => (
            <Card key={ach.id || idx} padding="lg" className="space-y-4 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400">
                  Achievement #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeAch(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono text-slate-300">Award / Honor Title</label>
                  <input
                    type="text"
                    required
                    value={ach.title}
                    onChange={(e) => handleAchChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Awarding Organization</label>
                  <input
                    type="text"
                    required
                    value={ach.organization}
                    onChange={(e) => handleAchChange(idx, 'organization', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Date / Year</label>
                  <input
                    type="text"
                    value={ach.date}
                    onChange={(e) => handleAchChange(idx, 'date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Award Level / Standing</label>
                  <input
                    type="text"
                    value={ach.awardLevel || ''}
                    onChange={(e) => handleAchChange(idx, 'awardLevel', e.target.value)}
                    placeholder="e.g. National Champion, 1st Place"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-mono text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={ach.description}
                    onChange={(e) => handleAchChange(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </form>
  );
};
