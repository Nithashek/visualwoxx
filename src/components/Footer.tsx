import React, { useState } from 'react';
import { ArrowUpRight, Mail, Phone, MapPin, Globe, Lock, ShieldCheck } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenBooking }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="relative bg-black border-t border-white/[0.08] text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center p-1.5 text-white">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  <path d="M22 28L42 76L52 50L38 28H22Z" fill="#ffffff" />
                  <path d="M48 28L68 76L88 28H72L62 54L56 28H48Z" fill="#ffffff" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white font-display">
                  VISUAL WOXX
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5">
                  {settings?.tagline || 'Your Vision. Our Visuals.'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              {settings?.company_description ||
                'We turn imagination into visuals that make an impact. From creative concepts to captivating content, Visual Woxx brings design, media, and storytelling together to make every vision impossible to ignore.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={settings?.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings?.linkedin_url || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings?.youtube_url || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings?.twitter_url || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings?.behance_url || 'https://behance.net'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors"
                aria-label="Behance"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.08] pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About the Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors">
                  Portfolio Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('book')} className="hover:text-white transition-colors">
                  Book an Appointment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-us')} className="hover:text-white transition-colors flex items-center gap-1.5 text-violet-400 font-medium">
                  <span>Join Our Team</span>
                  <span className="text-[9px] font-mono bg-violet-950 px-1.5 py-0.5 rounded text-violet-300">OPEN</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white border-b border-white/[0.08] pb-2">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-500 text-[10px] uppercase font-mono">Email</span>
                  <a href={`mailto:${settings?.contact_email || 'contact@visualwoxx.in'}`} className="hover:text-white font-medium break-all">
                    {settings?.contact_email || 'contact@visualwoxx.in'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-500 text-[10px] uppercase font-mono">Phone / WhatsApp</span>
                  <a href={`tel:${settings?.contact_phone || '+91949639827'}`} className="hover:text-white font-medium">
                    {settings?.contact_phone || '+91 949639827'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-500 text-[10px] uppercase font-mono">Studio Location</span>
                  <span className="text-zinc-400">
                    {settings?.contact_address || 'Kerala, India'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal, and Admin Portal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>{settings?.footer_text || '© 2026 Visual Woxx. All rights reserved.'}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-zinc-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1 rounded-full border border-white/10 transition-colors"
            >
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Policy Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 text-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>{legalModal === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}</span>
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                ✕ Close
              </button>
            </div>

            <div className="text-xs text-zinc-300 space-y-3 max-h-72 overflow-y-auto pr-2">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    Visual Woxx respects your privacy. All information submitted via our project inquiry forms, appointment requests, contact channels, and freelancer applications is held with strict confidentiality.
                  </p>
                  <p>
                    We collect personal identifiers exclusively to assess project scopes, coordinate video and photography schedules, and evaluate creative collaborations.
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
                className="btn-electric px-4 py-2 rounded-lg text-xs font-bold text-white"
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
