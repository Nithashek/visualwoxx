import React from 'react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings | null;
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate, onOpenBooking }) => {
  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* =========================================================
          HERO & STUDIO STORY
         ========================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          About Visual Woxx
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Where Creative Vision Meets Cinematic Precision
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
          Visual Woxx is a creative digital solutions team that combines graphic design, media production, and digital creativity to deliver complete visual solutions for events, brands, businesses, and creators.
        </p>

        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          We believe impactful storytelling requires both artistic fearlessness and disciplined execution. By uniting designers, directors, editors, and photographers under one roof, we eliminate creative friction and deliver cohesive visual identity.
        </p>
      </section>

      {/* =========================================================
          MISSION & VISION
         ========================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Mission Card */}
        <div className="rounded-2xl p-8 sm:p-10 bg-zinc-900 border border-white/10 space-y-4">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            01 / PURPOSE
          </span>

          <h2 className="text-2xl font-bold font-display text-white">
            Our Mission
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed">
            "{settings?.mission ||
              'Our mission is to transform ideas into impactful visual experiences by delivering innovative, high-quality, and accessible creative digital solutions. We aim to simplify the creative process for our clients by bringing diverse creative services together under one roof.'}"
          </p>
        </div>

        {/* Vision Card */}
        <div className="rounded-2xl p-8 sm:p-10 bg-zinc-900 border border-white/10 space-y-4">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            02 / HORIZON
          </span>

          <h2 className="text-2xl font-bold font-display text-white">
            Our Vision
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed">
            "{settings?.vision ||
              'Our vision is to become a trusted creative digital solutions brand known for innovation, quality, and originality, empowering businesses, individuals, and organizations to communicate their stories and build stronger visual identities.'}"
          </p>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="text-center pt-8">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-white/10 max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white font-display">
            Collaborate With Our Creative Team
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            Schedule an appointment directly with our creative directors to discuss your upcoming project or event.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="btn-electric px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('join-us')}
              className="px-6 py-2.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Join Our Freelancer Roster
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
