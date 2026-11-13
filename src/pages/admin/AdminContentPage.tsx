import React, { useState, useEffect } from 'react';
import { Globe, Save, Check, Sparkles, RefreshCw } from 'lucide-react';
import { SiteSettings } from '../../types';
import { fetchSiteSettings, updateSiteSettings } from '../../services/api';

interface AdminContentPageProps {
  onSettingsUpdated: () => void;
}

export const AdminContentPage: React.FC<AdminContentPageProps> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSiteSettings(settings);
      setSavedSuccess(true);
      onSettingsUpdated();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 text-xs">Loading website content settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Website Content & Brand Identity CMS</h2>
            <span className="text-xs text-slate-400">Update global headlines, mission statements, and contact details without code editing</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-electric flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Website content saved successfully! All updates are immediately live on the public site.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-200">
        {/* Brand & Hero Narrative */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-neon font-display border-b border-purple-900/30 pb-2">
            1. Brand Identity & Hero Section
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Brand Name</label>
              <input
                type="text"
                value={settings.brand_name || ''}
                onChange={(e) => handleChange('brand_name', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Hero Headline</label>
            <input
              type="text"
              value={settings.hero_headline || ''}
              onChange={(e) => handleChange('hero_headline', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-brand-violet text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Hero Supporting Description</label>
            <textarea
              rows={2}
              value={settings.hero_description || ''}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Short Company Description (Advantage Section)</label>
            <textarea
              rows={3}
              value={settings.company_description || ''}
              onChange={(e) => handleChange('company_description', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 font-display border-b border-purple-900/30 pb-2">
            2. Mission & Vision Statements
          </h3>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Mission Statement</label>
            <textarea
              rows={3}
              value={settings.mission || ''}
              onChange={(e) => handleChange('mission', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Vision Statement</label>
            <textarea
              rows={3}
              value={settings.vision || ''}
              onChange={(e) => handleChange('vision', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 font-display border-b border-purple-900/30 pb-2">
            3. Contact Details & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Studio Physical Address</label>
            <input
              type="text"
              value={settings.contact_address || ''}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
            />
          </div>
        </div>

        {/* Social Links & Footer */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-pink-300 font-display border-b border-purple-900/30 pb-2">
            4. Social Media URLs & Footer Notice
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">YouTube URL</label>
              <input
                type="url"
                value={settings.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Twitter / X URL</label>
              <input
                type="url"
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Footer Copyright Text</label>
            <input
              type="text"
              value={settings.footer_text || ''}
              onChange={(e) => handleChange('footer_text', e.target.value)}
              className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-electric flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save All CMS Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
