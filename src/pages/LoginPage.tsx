import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Lock, 
  Key, 
  User, 
  ArrowLeft, 
  AlertCircle,
  RefreshCw,
  ShieldCheck 
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Initial state MUST be completely empty
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrator ID and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(username.trim(), password);
      setLoading(false);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message || 'Invalid administrator username or password.');
        setPassword(''); // Clear password field for security
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
      setPassword(''); // Clear password field for security
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-cad-pattern opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Return to Portfolio
          </Button>

          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local Admin Auth</span>
          </span>
        </div>

        <Card padding="lg" className="border-slate-800 shadow-2xl space-y-6 tech-corner-accent">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-engineering-blue/40 text-cyan-400 flex items-center justify-center mx-auto shadow-tech-cyan">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">
              Admin CMS Console
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Mechatronics Content & Project Pipeline
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-xs font-mono text-rose-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Administrator ID</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter administrator username"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-engineering-cyan font-mono placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Access Key / Password</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-engineering-cyan font-mono placeholder:text-slate-600"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full justify-center mt-2"
              icon={loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : undefined}
            >
              {loading ? 'Authenticating Session...' : 'Sign In to Control Console'}
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] font-mono text-slate-500">
              Admin credentials are authenticated locally. You can modify credentials inside Settings after login.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
