import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, Clock, DollarSign, Sparkles, Send, AlertCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitInquiry, fetchServices } from '../services/api';
import { Service } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialService }) => {
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
  const [preferredAppointmentTime, setPreferredAppointmentTime] = useState('14:00');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,00,000');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceId: string; message: string } | null>(null);

  useEffect(() => {
    fetchServices().then((data) => {
      setServicesList(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialService) {
      setSelectedServices((prev) => (prev.includes(initialService) ? prev : [...prev, initialService]));
    }
  }, [initialService]);

  if (!isOpen) return null;

  const toggleService = (srvTitle: string) => {
    setSelectedServices((prev) =>
      prev.includes(srvTitle) ? prev.filter((s) => s !== srvTitle) : [...prev, srvTitle]
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
        colors: ['#8b5cf6', '#a855f7', '#06b6d4', '#ec4899']
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-dark-900 border border-purple-800/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-dark-800 hover:bg-dark-750 flex items-center justify-center text-slate-400 hover:text-white border border-purple-900/30 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {successData ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-purple to-brand-electric flex items-center justify-center text-white shadow-glow-purple">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display text-white">
                Project Inquiry & Appointment Received!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-950/80 border border-purple-800/30 max-w-sm mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Reference ID:</span>
                <span className="font-mono text-brand-neon font-bold">{successData.referenceId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-semibold text-[11px]">
                  Under Review
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Preferred Contact:</span>
                <span className="text-slate-200 font-medium">{preferredContactMethod}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Note: Appointment slots are reviewed by our operations team and will be confirmed via {preferredContactMethod}.
            </p>

            <button
              onClick={handleResetAndClose}
              className="btn-electric px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-glow-subtle"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-700/40 text-brand-neon text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Project Inquiry & Booking</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-display">
                Let's Build Your Visual Experience
              </h2>
              <p className="text-xs text-slate-400">
                Tell us about your brand, upcoming event, or creative vision. Select multiple services if you need a cohesive package.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Service Multi-Select */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Creative Services Required <span className="text-brand-neon">*</span> (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {servicesList.map((srv) => {
                    const isSelected = selectedServices.includes(srv.title);
                    return (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => toggleService(srv.title)}
                        className={`p-2.5 rounded-xl text-left font-medium transition-all border ${
                          isSelected
                            ? 'bg-purple-900/40 border-brand-violet text-white shadow-glow-subtle'
                            : 'bg-dark-950/60 border-purple-900/20 text-slate-300 hover:border-purple-700/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] leading-tight">{srv.title}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Full Name <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhika Sen"
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
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
                    placeholder="name@company.com"
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
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
                    placeholder="+91 98470 00000"
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Brand / Organization <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Solstice Media, Personal"
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>

              {/* Project Title & Scope */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Project / Event Title <span className="text-brand-neon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Autumn Music Fest 2026 / Luxury Perfume Packaging"
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Project Description & Requirements <span className="text-brand-neon">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your vision, target audience, deliverables needed, shooting location, timeline, and any specific aesthetic inspirations..."
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>

              {/* Dates & Scheduling */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Event / Target Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-neon" />
                    <span>Appointment Date</span>
                  </label>
                  <input
                    type="date"
                    value={preferredAppointmentDate}
                    onChange={(e) => setPreferredAppointmentDate(e.target.value)}
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preferred Time</span>
                  </label>
                  <input
                    type="time"
                    value={preferredAppointmentTime}
                    onChange={(e) => setPreferredAppointmentTime(e.target.value)}
                    className="w-full bg-dark-950/70 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  />
                </div>
              </div>

              {/* Budget & Contact Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estimated Budget Range</span>
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
                  >
                    <option value="Under ₹50,000">Under ₹50,000 (Sprint / Single Asset)</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Targeted Shoot / Campaign)</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Full Event / Identity Suite)</option>
                    <option value="₹2,50,000 - ₹5,00,000+">₹2,50,000 - ₹5,00,000+ (Multi-day Production / 360°)</option>
                    <option value="Custom Quote Required">Custom Quote Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Preferred Contact Method <span className="text-brand-neon">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    {(['Email', 'Phone', 'WhatsApp'] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPreferredContactMethod(method)}
                        className={`py-2 px-2 rounded-xl text-center font-semibold border transition-all ${
                          preferredContactMethod === method
                            ? 'bg-purple-900/40 border-brand-violet text-white'
                            : 'bg-dark-950/60 border-purple-900/20 text-slate-400 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-electric flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry & Request Appointment</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  🔒 We respect your confidentiality. Our creative directors review inquiries within 24 hours.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
