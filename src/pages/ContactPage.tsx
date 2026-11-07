import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Globe, Send, CheckCircle2, AlertCircle
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
        colors: ['#7c3aed', '#a78bfa', '#ffffff']
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
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Studio Communication
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Let’s Discuss Your Next Creative Move
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          Have an upcoming campaign, festival production, brand redesign, or general inquiry? Reach out to our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl p-7 sm:p-8 bg-zinc-900 border border-white/10 space-y-6">
            <h3 className="text-lg font-bold font-display text-white border-b border-white/[0.08] pb-3">
              Studio Details
            </h3>

            <div className="space-y-5 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase block">Official Email</span>
                  <a
                    href={`mailto:${settings?.contact_email || 'contact@visualwoxx.in'}`}
                    className="text-sm font-semibold text-white hover:text-violet-300 transition-colors"
                  >
                    {settings?.contact_email || 'contact@visualwoxx.in'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase block">Phone / WhatsApp</span>
                  <a
                    href={`tel:${settings?.contact_phone || '+919847012345'}`}
                    className="text-sm font-semibold text-white hover:text-violet-300 transition-colors"
                  >
                    {settings?.contact_phone || '+91 98470 12345'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase block">Studio Address</span>
                  <span className="text-sm text-zinc-300 font-medium leading-relaxed block">
                    {settings?.contact_address || 'Kerala, India'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Accounts */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <span className="text-zinc-500 font-mono text-[10px] uppercase block">Studio Feeds & Portfolios</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={settings?.instagram_url || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.linkedin_url || 'https://linkedin.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.youtube_url || 'https://youtube.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.twitter_url || 'https://twitter.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings?.behance_url || 'https://behance.net'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  aria-label="Behance"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Consultation Box */}
          <div className="rounded-2xl p-6 bg-zinc-900 border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white">Need an Appointment Consultation?</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If you have specific shoot dates and need a director consultation, use our dedicated booking system.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full btn-electric py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white"
            >
              Open Booking System
            </button>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl p-7 sm:p-10 bg-zinc-900 border border-white/10 shadow-xl">
            {success ? (
              <div className="text-center py-12 space-y-5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your transmission has been logged into our studio inbox and our team will respond shortly.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="btn-electric px-6 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-white font-display">
                    Send an Inbound Message
                  </h2>
                  <p className="text-xs text-zinc-400">
                    We typically respond to new correspondence within one business day.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                      Your Name <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Ross"
                      className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                      Email Address <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david@company.com"
                      className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                      Subject <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Brand Collaboration / Event Videography"
                      className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Your Message <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can Visual Woxx support your upcoming creative vision?"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-electric flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
