import React, { useState } from 'react';
import { Lock, User, Key, Shield, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative">
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mx-auto text-white">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Visual Woxx Operations Portal
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Internal Operations & CMS Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span>Username or Email</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-violet-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-electric flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Admin Credentials Helper */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div
              onClick={() => quickSwitch('admin', 'admin123')}
              className="p-3 rounded-xl bg-zinc-950 border border-white/10 hover:border-violet-500/40 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-semibold block text-white text-xs">Admin Access</span>
                <span className="text-[10px] text-zinc-400 font-mono">admin / admin123</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-violet-900/40 text-violet-300 border border-violet-700/40 font-mono">
                Click to Auto-fill
              </span>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-zinc-500 hover:text-white transition-colors underline font-mono"
          >
            ← Return to Visual Woxx Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
