import React, { useState } from 'react';
import {
  Sparkles, Send, CheckCircle2, AlertCircle, Briefcase,
  Globe, FileText, MapPin, Users, HeartHandshake, ShieldCheck
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
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#06b6d4', '#ec4899']
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
      {/* Ambient background glows */}
      <div className="orb-purple top-20 right-10" />
      <div className="orb-cyan top-96 left-10" />

      {/* Hero Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5 text-cyan-300" />
          <span>Creator Network & Opportunities</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          YOUR CREATIVITY HAS A PLACE HERE.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          We're building a team of creative minds who love turning ideas into reality. If you have the skills, passion, and creativity to create something meaningful, we'd love to hear from you.
        </p>
      </div>

      {/* Perks / Why Join Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-dark-900/60 border border-purple-900/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">High-Profile Work</span>
          <h4 className="text-sm font-bold text-white">Major Festivals & Luxury Brands</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Work on national scale music events, cinema gear, and commercial campaigns.</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900/60 border border-purple-900/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-neon">Reliable Workflow</span>
          <h4 className="text-sm font-bold text-white">Prompt Payments & Contracts</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Clear project charters, verified deadlines, and respectful compensation.</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900/60 border border-purple-900/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Creative Community</span>
          <h4 className="text-sm font-bold text-white">Peer Learning & Gear Access</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Collaborate with experienced directors and expand your creative horizons.</p>
        </div>
      </div>

      {/* Application Form */}
      <div className="relative z-10 max-w-3xl mx-auto bg-dark-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {submitted ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-electric flex items-center justify-center text-white shadow-glow-purple">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Application Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying to Visual Woxx. Our recruitment committee will review your portfolio and reach out for an introductory discussion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-950/80 border border-purple-800/30 max-w-sm mx-auto text-xs text-slate-300 space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Primary Skill:</span>
                <span className="font-semibold text-white">{primarySkill}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-semibold text-[11px] border border-cyan-800/40">
                  New Application (Under Review)
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="btn-electric px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="border-b border-purple-900/30 pb-4">
              <h3 className="text-xl font-bold text-white font-display">
                Freelancer Collaboration Application
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                All fields marked with <span className="text-brand-neon">*</span> are required. Your portfolio link is essential.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-brand-neon">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Farhan Akhtar"
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
                  placeholder="name@gmail.com"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Phone Number <span className="text-brand-neon">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  City / Location <span className="text-brand-neon">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kochi, Bengaluru, Remote"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Primary Creative Discipline <span className="text-brand-neon">*</span>
                  </label>
                  <select
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-brand-violet"
                  >
                    {skillOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Experience Level <span className="text-brand-neon">*</span>
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-brand-violet"
                  >
                    <option value="1-3 years">1-3 years (Junior / Mid)</option>
                    <option value="3-5 years">3-5 years (Experienced)</option>
                    <option value="5+ years">5+ years (Senior / Lead)</option>
                    <option value="10+ years">10+ years (Master / Specialist)</option>
                  </select>
                </div>
              </div>

              {/* Additional Skills Multi-Select */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Additional Skills & Tools (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.filter((s) => s !== primarySkill).map((skill) => {
                    const isSelected = additionalSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleAdditionalSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-purple-900/40 border-brand-violet text-white shadow-glow-subtle'
                            : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Portfolio & Social Profiles */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Portfolio / Showreel URL <span className="text-brand-neon">*</span></span>
                </label>
                <input
                  type="url"
                  required
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://behance.net/yourprofile or https://vimeo.com/showreel"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram Profile URL <span className="text-slate-500">(Optional)</span></span>
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>LinkedIn Profile URL <span className="text-slate-500">(Optional)</span></span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>
            </div>

            {/* Working Style & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Preferred Working Style <span className="text-brand-neon">*</span>
                </label>
                <select
                  value={workingStyle}
                  onChange={(e) => setWorkingStyle(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-brand-violet"
                >
                  <option value="Remote">Remote / Cloud Collaboration</option>
                  <option value="On-site / Event-based">On-site / Live Event Crew</option>
                  <option value="Hybrid">Hybrid (Studio + Remote)</option>
                  <option value="Project Sprint">Project Sprint Based</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Availability <span className="text-brand-neon">*</span>
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-brand-violet"
                >
                  <option value="Full-time">Full-time Available</option>
                  <option value="Part-time (20 hrs/week)">Part-time (20 hrs/week)</option>
                  <option value="Project-based">Project / Contract Basis</option>
                  <option value="Weekends only">Weekends / Festival Dates Only</option>
                </select>
              </div>
            </div>

            {/* Introduction & Resume URL */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Short Introduction & Creative Philosophy <span className="text-brand-neon">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Introduce yourself, your signature creative style, key equipment/software you master, and why you want to collaborate with Visual Woxx..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-neon" />
                  <span>Resume / CV Link <span className="text-slate-500">(Google Drive, Dropbox, Notion, etc.)</span></span>
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/your-resume.pdf"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-electric flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50"
              >
                {loading ? (
                  <span>Transmitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Freelancer Application</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-neon" />
                <span>Your application is stored privately and delivered directly to the Visual Woxx recruitment portal.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
