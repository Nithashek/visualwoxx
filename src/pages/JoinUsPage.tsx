import React, { useState } from 'react';
import {
  Send, CheckCircle2, AlertCircle, Briefcase,
  Globe, FileText, MapPin
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '../components/SocialIcons';
import confetti from 'canvas-confetti';
import { submitFreelancerApplication } from '../services/api';

export const JoinUsPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [primarySkill, setPrimarySkill] = useState('Graphic Designer');
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('3-5 years');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [workingStyle, setWorkingStyle] = useState('Hybrid');
  const [availability, setAvailability] = useState('Project-based');
  const [introduction, setIntroduction] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const skillOptions = [
    'Graphic Designer',
    'Video Editor',
    'Photographer',
    'Videographer',
    'Motion Graphics Designer',
    'UI/UX Designer',
    'Social Media Manager',
    'Content Writer',
    'Copywriter',
    'Web Developer',
    'Illustrator',
    'Other'
  ];

  const toggleAdditionalSkill = (skill: string) => {
    setAdditionalSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      await submitFreelancerApplication({
        fullName,
        email,
        phone,
        location,
        primarySkill,
        additionalSkills,
        experienceLevel,
        portfolioUrl,
        instagramUrl,
        linkedinUrl,
        workingStyle,
        availability,
        introduction,
        resumeUrl
      });

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a78bfa', '#ffffff']
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setPortfolioUrl('');
    setInstagramUrl('');
    setLinkedinUrl('');
    setIntroduction('');
    setResumeUrl('');
    setAdditionalSkills([]);
    setError(null);
  };

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Hero Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Creative Network
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          YOUR CREATIVITY HAS A PLACE HERE.
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          We're building a team of creative minds who love turning ideas into reality. If you have the skills, passion, and creativity to create something meaningful, we'd love to hear from you.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-violet-400">01 / PROJECTS</span>
          <h4 className="text-sm font-bold text-white">Commercial & Festival Productions</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Collaborate on large-scale event shoots, brand identity packages, and cinematic edits.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-violet-400">02 / WORKFLOW</span>
          <h4 className="text-sm font-bold text-white">Clear Scope & Prompt Terms</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Defined project briefs, respectful compensation, and organized milestones.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
          <span className="text-xs font-mono text-violet-400">03 / NETWORK</span>
          <h4 className="text-sm font-bold text-white">Creative Collective</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">Connect with directors, motion designers, and cinema crew across regional hubs.</p>
        </div>
      </div>

      {/* Application Form Card */}
      <div className="relative z-10 max-w-3xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl">
        {submitted ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Application Submitted Successfully
              </h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Visual Woxx. Our recruitment team reviews candidate portfolios and responds to shortlisted applicants.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-mono text-[10px]">
                  New Application (Under Review)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Primary Skill:</span>
                <span className="text-zinc-200 font-medium">{primarySkill}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="btn-electric px-6 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider"
            >
              Submit Another Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block border-b border-white/[0.08] pb-1.5">
                01. Personal Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Varma"
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
                    placeholder="jordan@visuals.com"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Phone / WhatsApp <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Current Location / City <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kochi, Bangalore, Mumbai, Remote"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block border-b border-white/[0.08] pb-1.5">
                02. Creative Disciplines & Experience
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Primary Creative Discipline <span className="text-violet-400">*</span>
                  </label>
                  <select
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
                  >
                    {skillOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Experience Level <span className="text-violet-400">*</span>
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
                  >
                    <option value="1-2 years">1-2 years (Junior / Emerging)</option>
                    <option value="3-5 years">3-5 years (Mid-Level Professional)</option>
                    <option value="5-8 years">5-8 years (Senior Specialist)</option>
                    <option value="8+ years">8+ years (Lead / Creative Director)</option>
                  </select>
                </div>
              </div>

              {/* Additional Skills Chips */}
              <div>
                <label className="block text-zinc-400 font-medium mb-2 font-mono text-[10px] uppercase">
                  Additional Skills (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.filter((s) => s !== primarySkill).map((skill) => {
                    const isSelected = additionalSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleAdditionalSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-violet-600 border-violet-500 text-white'
                            : 'bg-zinc-950 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Links & Portfolio */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block border-b border-white/[0.08] pb-1.5">
                03. Portfolio & Social Links
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Portfolio / Website URL <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://behance.net/yourprofile or yoursite.com"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Instagram Handle / URL <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Resume / CV Link (Google Drive, Dropbox)
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-cv-link"
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Working Style & Bio */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block border-b border-white/[0.08] pb-1.5">
                04. Availability & Introduction
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Preferred Working Style
                  </label>
                  <select
                    value={workingStyle}
                    onChange={(e) => setWorkingStyle(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site (Kerala / Regional)">On-site (Kerala / Regional)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Project-based">Project-based (Freelance gigs)</option>
                    <option value="Part-time">Part-time (10-20 hrs/week)</option>
                    <option value="Full-time retainer">Full-time retainer</option>
                    <option value="Weekends only">Weekends / Event shoots only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Short Introduction & Creative Passion <span className="text-violet-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Share your creative background, recent projects, tools you love (DaVinci, Figma, Sony cameras, etc.), and what excites you..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-electric flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Freelancer Application</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-zinc-500 text-center mt-2 font-mono">
                Candidate data remains private and is reviewed only by Visual Woxx recruitment leads.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
