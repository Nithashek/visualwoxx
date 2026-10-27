import React from 'react';
import {
  Sparkles, Compass, Target, Eye, Workflow, CheckCircle2,
  ArrowRight, Globe, Users, Shield
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '../components/SocialIcons';
import { TeamMember, SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings | null;
  team: TeamMember[];
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, team, onNavigate, onOpenBooking }) => {
  const workflowSteps = [
    {
      num: '01',
      title: "Understand the Client's Vision",
      desc: "We begin by deep-diving into your brand essence, event objectives, aesthetic preferences, and communication goals through focused discovery."
    },
    {
      num: '02',
      title: "Plan the Creative Approach",
      desc: "Our directors architect shot lists, visual moodboards, typography schemes, lighting design, and production schedules tailored to your scope."
    },
    {
      num: '03',
      title: "Develop Concepts and Ideas",
      desc: "We draft rapid concepts, test vector layouts, sample color palettes, and storyboard video sequences for collaborative alignment."
    },
    {
      num: '04',
      title: "Execute the Project Collaboratively",
      desc: "Our on-ground cinema crew, photographers, and motion artists execute the shoot and design sprints with state-of-the-art gear and precision."
    },
    {
      num: '05',
      title: "Review and Refine the Work",
      desc: "We present watermarked drafts for client review, incorporating feedback into DaVinci color grades, audio mixing, and dieline adjustments."
    },
    {
      num: '06',
      title: "Deliver the Final Output",
      desc: "We export broadcast-grade 4K masters, print-ready CMYK PDFs, and optimized vertical social cuts packaged in private cloud archives."
    }
  ];

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* Background ambient light */}
      <div className="orb-purple top-20 right-10" />
      <div className="orb-cyan top-96 left-0" />

      {/* =========================================================
          HERO & STUDIO STORY
         ========================================================= */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>About Visual Woxx</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Where Creative Vision Meets Cinematic Precision
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Visual Woxx is a premier creative digital solutions team that combines design, media production, and digital creativity to deliver complete visual solutions for events, brands, businesses, and visionary creators.
        </p>

        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We believe high-impact storytelling requires both artistic fearlessness and disciplined execution. By uniting designers, directors, editors, and photographers under one roof, we eliminate creative friction and deliver cohesive visual legacy.
        </p>
      </section>

      {/* =========================================================
          MISSION & VISION
         ========================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Mission Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 border border-purple-700/30 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-600/40 flex items-center justify-center text-brand-neon shadow-glow-subtle">
            <Target className="w-6 h-6" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 block">
            Our Purpose
          </span>

          <h2 className="text-2xl font-bold font-display text-white">
            Our Mission
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            "{settings?.mission ||
              'Our mission is to transform ideas into impactful visual experiences by delivering innovative, high-quality, and accessible creative digital solutions. We aim to simplify the creative process for our clients by bringing diverse creative services together under one roof.'}"
          </p>
        </div>

        {/* Vision Card */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 border border-purple-700/30 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-600/40 flex items-center justify-center text-cyan-300 shadow-glow-subtle">
            <Eye className="w-6 h-6" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-brand-neon block">
            Our Horizon
          </span>

          <h2 className="text-2xl font-bold font-display text-white">
            Our Vision
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            "{settings?.vision ||
              'Our vision is to become a trusted creative digital solutions brand known for innovation, quality, and originality, empowering businesses, individuals, and organizations to communicate their stories and build stronger visual identities.'}"
          </p>
        </div>
      </section>

      {/* =========================================================
          OUR 6-STEP APPROACH
         ========================================================= */}
      <section className="space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5 text-cyan-300" />
            <span>Proven Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Our 6-Step Creative Approach
          </h2>
          <p className="text-sm text-slate-400">
            A structured, collaborative pathway from initial spark to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="p-7 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-cyan-400">
                    {step.num}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand-neon" />
                </div>

                <h3 className="text-lg font-bold text-white font-display mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>Phase {step.num}</span>
                <ArrowRight className="w-3 h-3 text-brand-neon" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          CORE TEAM AND LEADERSHIP (DYNAMIC FROM DB/ADMIN)
         ========================================================= */}
      <section className="space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-cyan-300" />
            <span>Leadership & Core Committee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Meet the Minds Behind Visual Woxx
          </h2>
          <p className="text-sm text-slate-400">
            A dedicated collective of directors, designers, cinematographers, and strategists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="group relative rounded-3xl overflow-hidden bg-dark-900/70 border border-purple-800/30 card-hover-lift flex flex-col justify-between"
            >
              <div>
                {/* Photo Container */}
                <div className="relative aspect-square overflow-hidden bg-dark-950">
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-dark-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-800/40">
                      {member.department}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-neon transition-colors">
                    {member.fullName}
                  </h3>
                  <span className="block text-xs font-semibold text-brand-electric">
                    {member.position}
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Social Links Footer */}
              <div className="p-5 pt-0 border-t border-purple-900/20 flex items-center justify-between text-slate-400">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Connect</span>
                <div className="flex items-center gap-2">
                  {member.socialLinks?.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socialLinks?.behance && (
                    <a
                      href={member.socialLinks.behance}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="Behance"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.socialLinks?.youtube && (
                    <a
                      href={member.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      <YoutubeIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="text-center pt-8">
        <div className="p-8 rounded-3xl bg-dark-900/40 border border-purple-900/30 max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white font-display">
            Want to Collaborate With Our Leadership Team?
          </h3>
          <p className="text-xs text-slate-300">
            Schedule an appointment directly with our creative directors to discuss your upcoming project or festival.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="btn-electric px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('join-us')}
              className="px-6 py-2.5 rounded-full bg-dark-950 text-slate-300 hover:text-white border border-purple-800/40 text-xs font-bold uppercase tracking-wider"
            >
              Join Our Freelancer Roster
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
