import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Send, CheckCircle2,
  AlertCircle
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a78bfa', '#ffffff']
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
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Project Discovery & Scheduling
        </span>

        <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
          Book an Appointment & Project Inquiry
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Tell us about your brand, event, or visual commission. Our creative directors will review your scope and confirm a dedicated consultation.
        </p>
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-3xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl">
        {successData ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Inquiry & Appointment Request Recorded
              </h2>
              <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950 border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Confirmation Reference:</span>
                <span className="font-mono text-violet-400 font-bold">{successData.referenceId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Current Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-mono text-[10px]">
                  Under Review
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Preferred Contact:</span>
                <span className="text-zinc-200 font-medium">{preferredContactMethod}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Appointment time slots are reviewed against crew shooting schedules and will be confirmed via {preferredContactMethod}.
            </p>

            <button
              onClick={handleReset}
              className="btn-electric px-6 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Service Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-zinc-300 font-medium font-mono text-[11px] uppercase tracking-wider">
                  Services Required <span className="text-violet-400">*</span>
                </label>
                <span className="text-zinc-500 text-[10px] font-mono">
                  {selectedServices.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {servicesList.map((service) => {
                  const isSelected = selectedServices.includes(service.title);
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => toggleService(service.title)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-zinc-950 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs leading-tight font-medium">{service.title}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Full Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Chen"
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
                  placeholder="maya@brand.com"
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
                  Organization / Brand Name
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Zenith Apparel or Live Fest 2026"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Project Title <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Annual Brand Gala Coverage & Highlight Video"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Project Description & Requirements <span className="text-violet-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Tell us about the scope, deliverable formats, location, visual style, and timeline..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Dates & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Event / Production Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Preferred Consultation Date <span className="text-violet-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={preferredAppointmentDate}
                  onChange={(e) => setPreferredAppointmentDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Preferred Time Slot
                </label>
                <input
                  type="time"
                  value={preferredAppointmentTime}
                  onChange={(e) => setPreferredAppointmentTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Budget & Contact Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Estimated Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                  <option value="₹2,50,000 - ₹5,00,000+">₹2,50,000 - ₹5,00,000+</option>
                  <option value="Custom Quote Required">Custom Quote Required</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Preferred Contact Method <span className="text-violet-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Email', 'Phone', 'WhatsApp'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPreferredContactMethod(method)}
                      className={`py-2 px-3 rounded-lg text-center font-medium border transition-colors ${
                        preferredContactMethod === method
                          ? 'bg-zinc-800 border-white/20 text-white font-bold'
                          : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-electric flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Project Inquiry & Request Appointment</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-zinc-500 text-center mt-2 font-mono">
                Appointments are confirmed subject to director & crew availability.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
