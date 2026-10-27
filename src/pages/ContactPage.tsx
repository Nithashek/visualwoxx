import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Globe, Send, CheckCircle2, AlertCircle, Sparkles, MessageSquare
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from '../components/SocialIcons';
import confetti from 'canvas-confetti';
import { submitContactMessage } from '../services/api';
import { SiteSettings } from '../types';

interface ContactPageProps {
  settings: SiteSettings | null;
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      await submitContactMessage({
        name,
        email,
        phone,
        subject,
        message
      });

      setSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#06b6d4']
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setError(null);
  };

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Ambient background glows */}
      <div className="orb-purple top-20 right-10" />
      <div className="orb-cyan top-96 left-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
          <span>Connect With Our Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Let’s Discuss Your Next Creative Move
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Whether you have a specific commercial brief, a multi-day festival inquiry, or an experimental brand concept, our team is ready to respond.
        </p>
      </div>

      {/* Grid: Contact Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left: Official Studio Information */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-3xl bg-dark-900/80 border border-purple-800/30 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold font-display text-white">
              Visual Woxx Studio Headquarters
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-brand-neon shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Official Email</span>
                  <a href={`mailto:${settings?.contact_email || 'hello@visualwoxx.com'}`} className="hover:text-white font-medium text-sm">
                    {settings?.contact_email || 'hello@visualwoxx.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Phone / WhatsApp</span>
                  <a href={`tel:${settings?.contact_phone || '+919847012345'}`} className="hover:text-white font-medium text-sm">
                    {settings?.contact_phone || '+91 98470 12345'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-brand-violet shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Production Studio</span>
                  <span className="text-slate-200 text-sm">
                    {settings?.contact_address || 'Skyline Creative Quarter, Kochi, Kerala, India'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-purple-900/30">
              <span className="block text-slate-400 text-xs font-semibold mb-3">
                Follow Visual Woxx On Social Channels
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={settings?.instagram_url || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/40 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.linkedin_url || 'https://linkedin.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/40 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.youtube_url || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/40 transition-all"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.twitter_url || 'https://twitter.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/40 transition-all"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Ready to Schedule a Shoot?</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Skip standard messaging and book an appointment with our directors directly.
              </p>
              <button
                onClick={() => onOpenBooking()}
                className="btn-electric w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white text-center mt-2"
              >
                Open Appointment Scheduler
              </button>
            </div>
          </div>
        </div>

        {/* Right: Working Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-dark-900/80 border border-purple-800/40 shadow-2xl backdrop-blur-md">
            {success ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-electric flex items-center justify-center text-white shadow-glow-purple">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, {name}. Your message has been routed to our admin inbox. Our communications lead will reply to {email} shortly.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="btn-electric px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below and we will get back to you within 24 hours.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Your Name <span className="text-brand-neon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sunil Nambiar"
                      className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Email Address <span className="text-brand-neon">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sunil@brand.com"
                      className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Phone Number <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98471 00000"
                      className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Subject <span className="text-brand-neon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Commercial Shoot Partnership"
                      className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Message <span className="text-brand-neon">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you have in mind..."
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-electric flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50"
                >
                  {loading ? (
                    <span>Dispatching Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Visual Woxx</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
