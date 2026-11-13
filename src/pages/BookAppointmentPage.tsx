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
  const [selectedService, setSelectedService] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceId: string; message: string } | null>(null);

  useEffect(() => {
    fetchServices().then(setServicesList).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedService) {
      setError('Please select a service required.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitInquiry({
        fullName,
        email,
        phone,
        organization: '',
        services: [selectedService],
        projectTitle: selectedService,
        projectDescription: additionalDetails || 'No additional details provided.',
        eventDate,
        eventLocation,
        preferredAppointmentDate: eventDate,
        preferredAppointmentTime: '10:00',
        budgetRange: 'Contact for Quote',
        preferredContactMethod: 'Email'
      });

      setSuccessData(res);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a78bfa', '#ffffff']
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit appointment request. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setSelectedService('');
    setEventDate('');
    setEventLocation('');
    setAdditionalDetails('');
    setError(null);
  };

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Book an Appointment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Start a Creative Project
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Tell us about your upcoming event or creative requirements. Our team will review your request and confirm your appointment.
        </p>
      </div>

      <div className="rounded-3xl p-6 sm:p-10 bg-zinc-900/90 border border-white/10 shadow-2xl relative z-10">
        {successData ? (
          <div className="text-center py-10 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Appointment Request Submitted
              </h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                {successData.message}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono">Reference Code:</span>
                <span className="font-mono text-violet-400 font-bold">{successData.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-mono text-[10px]">
                  Pending Review
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="btn-electric px-8 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Full Name */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Full Name <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* 2. Email Address */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Email Address <span className="text-violet-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* 3. Contact Number */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Contact Number <span className="text-violet-400">*</span>
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

            {/* 4. Service Required - Dropdown */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Service Required <span className="text-violet-400">*</span>
              </label>
              <select
                required
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
              >
                <option value="" disabled>Select a service</option>
                {servicesList.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Event Date */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* 6. Event Location */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Event Location
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. Kochi, Kerala"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* 7. Additional Details */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                Additional Details
              </label>
              <textarea
                rows={3}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Describe your vision, deliverables, references, or specific requirements..."
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-electric flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Appointment Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
