import React, { useState } from 'react';
import { Lock, User, Key, Shield, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../../services/api';
import { AdminUser } from '../../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickSwitch = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="orb-purple top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="orb-cyan bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-electric p-0.5 shadow-glow-purple mx-auto">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-brand-neon" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Visual Woxx Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Secure administrative portal & internal management system
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-dark-900/85 border border-purple-800/40 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-electric" />
                <span>Username or Email</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-electric flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate & Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-4 border-t border-purple-900/30 space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick Role Testing Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => quickSwitch('admin', 'admin123')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'admin'
                    ? 'bg-purple-900/40 border-brand-violet text-white'
                    : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Super Admin</span>
                <span className="text-[10px] text-slate-400">admin / admin123</span>
              </button>

              <button
                type="button"
                onClick={() => quickSwitch('operations', 'ops123')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'operations'
                    ? 'bg-purple-900/40 border-brand-violet text-white'
                    : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Operations</span>
                <span className="text-[10px] text-slate-400">operations / ops123</span>
              </button>

              <button
                type="button"
                onClick={() => quickSwitch('creative', 'creative123')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'creative'
                    ? 'bg-purple-900/40 border-brand-violet text-white'
                    : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Creative Lead</span>
                <span className="text-[10px] text-slate-400">creative / creative123</span>
              </button>

              <button
                type="button"
                onClick={() => quickSwitch('recruiter', 'recruiter123')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'recruiter'
                    ? 'bg-purple-900/40 border-brand-violet text-white'
                    : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Recruitment</span>
                <span className="text-[10px] text-slate-400">recruiter / recruiter123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-white transition-colors underline"
          >
            ← Return to Visual Woxx Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
