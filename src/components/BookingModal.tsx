import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, AlertCircle } from 'lucide-react';
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
    fetchServices().then((data) => {
      setServicesList(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedService) {
      setError('Please select a service.');
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
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setSelectedService('');
    setFullName('');
    setEmail('');
    setPhone('');
    setEventDate('');
    setEventLocation('');
    setAdditionalDetails('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-6 p-6 sm:p-8 text-zinc-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {successData ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center text-white">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display text-white">
                Appointment Request Submitted
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Reference Code:</span>
                <span className="font-mono text-violet-400 font-bold">{successData.referenceId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-mono">Current Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 font-mono text-[10px]">
                  Pending Approval
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              Our team will review your request and confirm your appointment shortly.
            </p>

            <button
              onClick={handleResetAndClose}
              className="btn-electric px-6 py-2.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block mb-1">
                Book an Appointment
              </span>
              <h2 className="text-2xl font-bold text-white font-display">
                Request a Service
              </h2>
              <p className="text-xs text-zinc-400">
                Fill in your details and we'll get back to you to confirm your appointment.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-700/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
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
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Email */}
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
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Contact Number */}
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
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Service Required - Dropdown */}
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Service Required <span className="text-violet-400">*</span>
                </label>
                <select
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="" disabled>Select a service</option>
                  {servicesList.map((srv) => (
                    <option key={srv.id} value={srv.title}>
                      {srv.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Event Location
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Kochi, Kerala"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-zinc-400 font-medium mb-1 font-mono text-[10px] uppercase">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Tell us more about your requirements, vision, or any specific preferences..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-electric flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
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
                <p className="text-[10px] text-zinc-500 text-center mt-2">
                  We review requests within 24 hours. Appointments are confirmed based on availability.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
