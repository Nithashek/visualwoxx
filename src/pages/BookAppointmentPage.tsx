import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, DollarSign, Send, CheckCircle2,
  Sparkles, AlertCircle, Phone, Mail, MessageSquare, ShieldCheck, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitInquiry, fetchServices } from '../services/api';
import { Service } from '../types';

export const BookAppointmentPage: React.FC = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [preferredAppointmentDate, setPreferredAppointmentDate] = useState('');
  const [preferredAppointmentTime, setPreferredAppointmentTime] = useState('14:30');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,00,000');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceId: string; message: string } | null>(null);

  useEffect(() => {
    fetchServices().then(setServicesList).catch(console.error);
  }, []);

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedServices.length === 0) {
      setError('Please select at least one creative service required.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitInquiry({
        fullName,
        email,
        phone,
        organization,
        services: selectedServices,
        projectTitle,
        projectDescription,
        eventDate,
        preferredAppointmentDate,
        preferredAppointmentTime,
        budgetRange,
        preferredContactMethod
      });

      setSuccessData(res);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#06b6d4', '#ec4899']
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setProjectTitle('');
    setProjectDescription('');
    setEventDate('');
    setPreferredAppointmentDate('');
    setSelectedServices([]);
    setError(null);
  };

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Background ambient light */}
      <div className="orb-purple top-20 right-10" />
      <div className="orb-cyan top-96 left-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-cyan-300" />
          <span>Project Discovery & Scheduling</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
          Book an Appointment & Project Inquiry
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Tell us about your brand, event, or visual commission. Our creative directors will review your scope and confirm a dedicated consultation.
        </p>
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-3xl mx-auto bg-dark-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {successData ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-electric flex items-center justify-center text-white shadow-glow-purple">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Inquiry & Appointment Request Recorded!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-950/80 border border-purple-800/30 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Confirmation Reference:</span>
                <span className="font-mono text-brand-neon font-bold text-sm">{successData.referenceId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Initial Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-semibold text-[11px]">
                  Under Review by Operations Lead
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Response Mode:</span>
                <span className="text-white font-medium">{preferredContactMethod}</span>
              </div>
            </div>

            {/* Workflow Explainer */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 text-left text-xs text-slate-300 space-y-2 max-w-md mx-auto">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>What Happens Next?</span>
              </span>
              <p className="text-[11px] text-slate-400">
                1. Our creative director analyzes your project requirements.<br />
                2. We verify studio crew and camera availability for your dates.<br />
                3. You will receive an official confirmation and meeting link via {preferredContactMethod}.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="btn-electric px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Service Multi-Select */}
            <div>
              <label className="block text-slate-200 font-bold mb-2">
                1. Services Required <span className="text-brand-neon">*</span> (Select all required for your project)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {servicesList.map((srv) => {
                  const isSelected = selectedServices.includes(srv.title);
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => toggleService(srv.title)}
                      className={`p-3 rounded-xl text-left font-medium transition-all border ${
                        isSelected
                          ? 'bg-purple-900/40 border-brand-violet text-white shadow-glow-subtle'
                          : 'bg-dark-950/70 border-purple-900/20 text-slate-300 hover:border-purple-700/40 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{srv.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-slate-200 font-bold mb-2">
                2. Contact Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Full Name <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhika Sen"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Email Address <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Phone Number <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 00000"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Organization or Brand Name <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Aura Botanicals, Personal"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <label className="block text-slate-200 font-bold mb-2">
                3. Project Scope & Specifications
              </label>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Project / Event Title <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Neon Odyssey Festival Coverage or Autumn Collection Packaging"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Project Description & Deliverables <span className="text-brand-neon">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Please specify the project overview, key objectives, shooting location if on-site, deliverables (number of photos, reel duration, posters), and any visual references..."
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Appointment Details */}
            <div>
              <label className="block text-slate-200 font-bold mb-2">
                4. Scheduling & Appointment Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Event / Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-neon" />
                    <span>Preferred Discovery Date</span>
                  </label>
                  <input
                    type="date"
                    value={preferredAppointmentDate}
                    onChange={(e) => setPreferredAppointmentDate(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preferred Time Slot</span>
                  </label>
                  <input
                    type="time"
                    value={preferredAppointmentTime}
                    onChange={(e) => setPreferredAppointmentTime(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Preferred Contact Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Budget Range</span>
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-brand-violet"
                >
                  <option value="Under ₹50,000">Under ₹50,000 (Single Discipline / Quick Sprint)</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Targeted Commercial Shoot)</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Full Event / Brand Package)</option>
                  <option value="₹2,50,000 - ₹5,00,000+">₹2,50,000 - ₹5,00,000+ (Multi-Day Festival / Cinema Rig)</option>
                  <option value="Custom Quote Required">Custom Quote Required</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Preferred Contact Method <span className="text-brand-neon">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 pt-0.5">
                  {(['Email', 'Phone', 'WhatsApp'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPreferredContactMethod(method)}
                      className={`py-2 px-3 rounded-xl text-center font-semibold border transition-all ${
                        preferredContactMethod === method
                          ? 'bg-purple-900/40 border-brand-violet text-white shadow-glow-subtle'
                          : 'bg-dark-950 border-purple-900/30 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-electric flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50"
              >
                {loading ? (
                  <span>Recording Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Project Inquiry & Book Appointment</span>
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-neon" />
                <span>Your information is strictly protected. Real-time confirmation delivered directly to your inbox.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
