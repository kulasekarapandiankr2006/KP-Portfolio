import React, { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { authService } from '../../services/authService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Settings, 
  Key, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  ShieldCheck 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { data, resetToDefaults, refreshData } = usePortfolioData();

  // Admin Credentials Form
  const creds = authService.getStoredCredentials();
  const [username, setUsername] = useState(creds.username || 'admin');
  const [password, setPassword] = useState(creds.password || 'password123');
  const [confirmPassword, setConfirmPassword] = useState(creds.password || 'password123');
  const [authMsg, setAuthMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Backup & Restore
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthMsg({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
    if (password.length < 6) {
      setAuthMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    const ok = authService.updateCredentials(username.trim(), password);
    if (ok) {
      setAuthMsg({ type: 'success', text: 'Administrator credentials updated successfully!' });
      setTimeout(() => setAuthMsg(null), 3000);
    } else {
      setAuthMsg({ type: 'error', text: 'Failed to save credentials.' });
    }
  };

  const handleExportDatabase = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mechatronics_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMsg({ type: 'success', text: 'Portfolio database exported and downloaded successfully.' });
      setTimeout(() => setBackupMsg(null), 3000);
    } catch (e: any) {
      setBackupMsg({ type: 'error', text: `Export failed: ${e.message}` });
    }
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
          localStorage.setItem('kp_mechatronics_portfolio_db_v1', JSON.stringify(parsed));
          refreshData();
          setBackupMsg({ type: 'success', text: 'Portfolio database restored successfully!' });
          setTimeout(() => setBackupMsg(null), 3000);
        } else {
          setBackupMsg({ type: 'error', text: 'Invalid portfolio backup file format.' });
        }
      } catch (err: any) {
        setBackupMsg({ type: 'error', text: `Failed to parse JSON file: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setConfirmResetOpen(false);
    setBackupMsg({ type: 'success', text: 'Database reset to original seed dataset.' });
    setTimeout(() => setBackupMsg(null), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold font-display text-white">
            CMS Settings & System Maintenance
          </h1>
        </div>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Configure admin credentials, download full JSON database backups, restore archives, or reset data.
        </p>
      </div>

      {/* Admin Authentication Security */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3">
          <Key className="w-4 h-4" />
          <span>Local Admin Credentials</span>
        </div>

        {authMsg && (
          <div className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            authMsg.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            {authMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{authMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Admin Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-engineering-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-engineering-cyan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-engineering-cyan"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Update Credentials
            </Button>
          </div>
        </form>
      </Card>

      {/* Database Backup & Disaster Recovery */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-3">
          <Database className="w-4 h-4" />
          <span>Database Persistence & Backup Management</span>
        </div>

        {backupMsg && (
          <div className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            backupMsg.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            {backupMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{backupMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Export */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export JSON Backup</span>
            </div>
            <p className="text-xs text-slate-400">
              Download your complete portfolio data as a structured JSON file.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportDatabase}
              className="w-full"
            >
              Download Backup
            </Button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore JSON Backup</span>
            </div>
            <p className="text-xs text-slate-400">
              Restore previously saved portfolio content from a JSON file.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Select Backup File
            </Button>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-950/60 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset to Seed Data</span>
            </div>
            <p className="text-xs text-slate-400">
              Reset database to original Mechatronics seed data.
            </p>
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => setConfirmResetOpen(true)}
              className="w-full"
            >
              Reset Database
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Portfolio Database to Seed Data"
        message="Are you sure you want to reset all portfolio data to defaults? All custom edits will be replaced with the initial Mechatronics dataset."
        confirmLabel="Reset to Defaults"
        variant="danger"
      />
    </div>
  );
};
