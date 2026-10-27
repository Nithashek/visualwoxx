import React, { useState } from 'react';
import { ArrowUpRight, Mail, Phone, MapPin, Globe, Lock, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenBooking }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const servicesList = [
    { title: 'Graphic Design', slug: 'graphic-design' },
    { title: 'Event Posters & Branding', slug: 'event-posters-and-branding' },
    { title: 'Photography', slug: 'photography' },
    { title: 'Videography', slug: 'videography' },
    { title: 'Highlight Videos', slug: 'highlight-videos' },
    { title: 'Reels & Short Videos', slug: 'reels-and-short-videos' },
    { title: 'Brochures & Publications', slug: 'brochures-and-digital-publications' },
    { title: 'Magazine Design', slug: 'magazine-design' },
    { title: 'Product Shoots', slug: 'product-shoots' },
    { title: 'Packaging Design', slug: 'packaging-design' },
    { title: 'Social Media Content', slug: 'social-media-content' },
    { title: 'Custom Creative Solutions', slug: 'custom-creative-solutions' },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-purple-900/20 text-slate-300 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-purple/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/20">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-electric p-0.5 shadow-glow-subtle">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
                    <path d="M22 28L42 76L52 50L38 28H22Z" fill="#8b5cf6" />
                    <path d="M48 28L68 76L88 28H72L62 54L56 28H48Z" fill="#c084fc" />
                    <circle cx="62" cy="54" r="5" fill="#06b6d4" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider text-white font-display">
                  VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-neon">WOXX</span>
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-slate-400 uppercase -mt-0.5">
                  Creative Digital Solutions
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {settings?.company_description ||
                'Visual Woxx is your unified creative team for high-end design, commercial photography, cinematic videography, and comprehensive digital branding.'}
            </p>

            <div className="p-3.5 rounded-xl bg-dark-900/70 border border-purple-900/30 max-w-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-neon block mb-1">
                Tagline
              </span>
              <p className="text-sm font-medium text-white italic">
                "{settings?.tagline || 'Your Vision. Our Visuals.'}"
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/30 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.linkedin_url || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/30 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.youtube_url || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/30 transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.twitter_url || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/30 transition-all"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={settings?.behance_url || 'https://behance.net'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-purple/40 border border-purple-900/30 transition-all"
                aria-label="Behance"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white font-display border-b border-purple-900/40 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-brand-neon transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-brand-neon transition-colors">
                  About the Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-brand-neon transition-colors">
                  Creative Solutions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-brand-neon transition-colors">
                  Portfolio & Showcases
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-brand-neon transition-colors">
                  Book an Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-us')} className="hover:text-brand-neon transition-colors flex items-center gap-1.5 text-brand-electric font-semibold">
                  <span>Join Our Team</span>
                  <span className="text-[10px] bg-brand-purple/30 px-1.5 py-0.5 rounded text-cyan-300">HIRING</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-brand-neon transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Creative Services List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white font-display border-b border-purple-900/40 pb-2">
              Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              {servicesList.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => onNavigate('services', { service: s.slug })}
                    className="hover:text-brand-neon transition-colors text-slate-400 hover:underline"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-brand-electric hover:text-white font-semibold flex items-center gap-1 mt-1"
                >
                  <span>+ View All 12 Services</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white font-display border-b border-purple-900/40 pb-2">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase">Email</span>
                  <a href={`mailto:${settings?.contact_email || 'hello@visualwoxx.com'}`} className="hover:text-white font-medium break-all">
                    {settings?.contact_email || 'hello@visualwoxx.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase">Phone / WhatsApp</span>
                  <a href={`tel:${settings?.contact_phone || '+919847012345'}`} className="hover:text-white font-medium">
                    {settings?.contact_phone || '+91 98470 12345'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase">Studio Location</span>
                  <span className="text-slate-300">
                    {settings?.contact_address || 'Skyline Creative Quarter, Kochi, Kerala, India'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking()}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-white border border-purple-700/40 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Custom Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal, and Admin Portal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>{settings?.footer_text || '© 2026 Visual Woxx. All rights reserved.'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-brand-neon bg-dark-900/80 hover:bg-dark-800 px-3 py-1 rounded-full border border-purple-900/30 transition-all"
            >
              <Lock className="w-3 h-3 text-brand-electric" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Policy Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-neon" />
                <span>{legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}</span>
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-md bg-white/5"
              >
                ✕ Close
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto pr-2">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    Visual Woxx respects your privacy. All information submitted via our project inquiry forms, appointment requests, contact channels, and freelancer applications is held with strict confidentiality.
                  </p>
                  <p>
                    We collect personal identifiers (such as name, email address, phone number, and portfolio links) exclusively to assess project scopes, coordinate video and photography schedules, and evaluate creative collaborations.
                  </p>
                  <p>
                    We do not sell, rent, or distribute client or applicant data to third parties. Private files, dielines, project footage, and resumes are stored securely.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All creative assets, video highlights, cinematography, graphic designs, and publication layouts produced by Visual Woxx remain protected under copyright laws until full final settlement and contractual licensing transfer.
                  </p>
                  <p>
                    Appointment bookings submitted online represent scheduling inquiries subject to confirmation by our operations lead based on crew availability.
                  </p>
                  <p>
                    Custom quotes are estimated based on project deliverables, shooting hours, equipment needs, and revision parameters mutually agreed upon in the signed project charter.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
