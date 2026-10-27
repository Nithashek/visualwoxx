import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, User, Phone, Mail,
  CheckCircle2, AlertCircle, XCircle, Filter, Sparkles, Check
} from 'lucide-react';
import { Appointment } from '../../types';
import { fetchAppointments, updateAppointment } from '../../services/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchAppointments(statusFilter)
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSelect = (apt: Appointment) => {
    setSelectedAppt(apt);
    setEditDate(apt.appointmentDate);
    setEditTime(apt.appointmentTime);
    setEditNotes(apt.notes || '');
    setActionMsg(null);
  };

  const handleUpdate = async (newStatus: string) => {
    if (!selectedAppt) return;
    try {
      await updateAppointment(selectedAppt.id, {
        status: newStatus,
        appointmentDate: editDate,
        appointmentTime: editTime,
        notes: editNotes
      });
      setActionMsg(`Appointment marked as ${newStatus.replace('_', ' ')}!`);
      loadData();
      setSelectedAppt((prev) => prev ? { ...prev, status: newStatus as any, appointmentDate: editDate, appointmentTime: editTime, notes: editNotes } : null);
    } catch (e: any) {
      alert(e.message || 'Failed to update appointment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white font-display">
            Discovery Appointments & Consultations
          </h2>
          <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/40">
            {appointments.length} Bookings
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-violet"
          >
            <option value="all">All Appointments</option>
            <option value="new_inquiry">New Request</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments List */}
        <div className={`${selectedAppt ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
              No appointments found for the selected filter.
            </div>
          ) : (
            appointments.map((apt) => {
              const isSelected = selectedAppt?.id === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => handleSelect(apt)}
                  className={`p-4 rounded-2xl bg-dark-900 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-violet shadow-glow-subtle bg-purple-950/20'
                      : 'border-purple-900/30 hover:border-purple-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{apt.clientName}</h4>
                      <span className="text-xs text-brand-electric">{apt.serviceName || 'General Consultation'}</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : apt.status === 'cancelled'
                        ? 'bg-red-950 text-red-300 border border-red-800/40'
                        : 'bg-purple-950 text-cyan-300 border border-purple-800/40'
                    }`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5 font-mono text-cyan-300 font-semibold">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{apt.appointmentDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-brand-neon">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{apt.appointmentTime}</span>
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      "{apt.notes}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected Appointment Management Drawer */}
        {selectedAppt && (
          <div className="lg:col-span-5 bg-dark-900 border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-5 h-fit sticky top-24 text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  {selectedAppt.id}
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Appointment Controls
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-7 h-7 rounded-full bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {actionMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>{actionMsg}</span>
              </div>
            )}

            {/* Client Info */}
            <div className="p-3.5 rounded-xl bg-dark-950/60 border border-purple-900/30 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="text-white font-bold">{selectedAppt.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <a href={`mailto:${selectedAppt.clientEmail}`} className="text-brand-electric hover:underline">
                  {selectedAppt.clientEmail}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-slate-200">{selectedAppt.clientPhone}</span>
              </div>
            </div>

            {/* Reschedule Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Meeting Link & Administrative Notes
              </label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Google Meet link, assigned creative director, discussion notes..."
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-purple-900/30">
              <button
                onClick={() => handleUpdate('confirmed')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Appointment</span>
              </button>

              <button
                onClick={() => handleUpdate('rescheduled')}
                className="w-full py-2.5 rounded-xl bg-dark-950 hover:bg-dark-800 text-yellow-300 border border-yellow-700/40 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Reschedule / Save Changes</span>
              </button>

              <button
                onClick={() => handleUpdate('cancelled')}
                className="w-full py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/30 text-xs font-semibold"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
