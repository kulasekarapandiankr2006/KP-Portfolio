import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  FileText, 
  Save, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const ResumeEditorPage: React.FC = () => {
  const { data, updateProfile } = usePortfolioData();
  const [resumeUrl, setResumeUrl] = useState(data.profile.resumeUrl);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ resumeUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Resume & Engineering CV Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Configure resume PDF document link, direct download links, and version identifiers.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
        >
          Save Resume Link
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Resume configuration saved successfully!</span>
        </div>
      )}

      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3">
          <FileText className="w-4 h-4" />
          <span>Active Resume Asset Configuration</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Resume Document URL / Direct PDF Link <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/... or /assets/resume.pdf"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-engineering-cyan"
            />
            <p className="text-[11px] font-mono text-slate-500">
              This link is wired to the "Download Resume" buttons on the Navbar, Hero, and Contact sections.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Current Active Resume Asset</div>
                <div className="text-xs font-mono text-slate-400 truncate max-w-md">
                  {resumeUrl || 'No resume link configured'}
                </div>
              </div>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-colors"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </form>
  );
};
