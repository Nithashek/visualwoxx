import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, User, Phone, Mail,
  CheckCircle2, AlertCircle, XCircle, Filter, Sparkles, Check,
  MapPin, Briefcase, FileText, FolderPlus, ArrowUpRight
} from 'lucide-react';
import { Appointment } from '../../types';
import { fetchAppointments, updateAppointment, approveAppointmentProject } from '../../services/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
    setEditDate(apt.eventDate || apt.appointmentDate);
    setEditTime(apt.appointmentTime || '10:00');
    setEditNotes(apt.meetingNotes || apt.notes || '');
    setActionMsg(null);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      await updateAppointment(selectedAppt.id, {
        status: newStatus,
        appointmentDate: editDate,
        appointmentTime: editTime,
        notes: editNotes
      });
      const statusLabel = newStatus === 'confirmed' ? 'Approved' : newStatus === 'cancelled' ? 'Declined / Cancelled' : newStatus;
      setActionMsg({ text: `Request marked as ${statusLabel}!`, type: 'success' });
      loadData();
      setSelectedAppt((prev) => prev ? { ...prev, status: newStatus as any, appointmentDate: editDate, appointmentTime: editTime, notes: editNotes } : null);
    } catch (e: any) {
      setActionMsg({ text: e.message || 'Failed to update appointment', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAndCreateProject = async () => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      const res = await approveAppointmentProject(selectedAppt.id);
      setActionMsg({
        text: `Project Approved! Created active project (ID: ${res.projectId})`,
        type: 'success'
      });
      loadData();
      setSelectedAppt((prev) => prev ? { ...prev, status: 'confirmed' } : null);
    } catch (e: any) {
      setActionMsg({ text: e.message || 'Failed to approve project', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white font-display">
            Appointments & Project Requests
          </h2>
          <span className="text-xs bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800/40 font-mono">
            {appointments.length} Requests
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-violet"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Review / New</option>
            <option value="confirmed">Approved / Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Rejected / Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments List */}
        <div className={`${selectedAppt ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading requests...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
              No appointment requests found for this filter.
            </div>
          ) : (
            appointments.map((apt) => {
              const isSelected = selectedAppt?.id === apt.id;
              const isPending = apt.status === 'pending' || apt.status === 'new_inquiry';
              const isConfirmed = apt.status === 'confirmed';
              const isCancelled = apt.status === 'cancelled';

              return (
                <div
                  key={apt.id}
                  onClick={() => handleSelect(apt)}
                  className={`p-5 rounded-2xl bg-dark-900 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-violet shadow-glow-subtle bg-purple-950/20'
                      : 'border-purple-900/30 hover:border-purple-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{apt.clientName}</span>
                      </h4>
                      <span className="text-xs text-brand-electric font-semibold">
                        {apt.serviceName || 'Creative Service'}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isConfirmed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : isCancelled
                        ? 'bg-red-950 text-red-300 border border-red-800/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/40 animate-pulse'
                    }`}>
                      {isPending ? 'Pending Review' : isConfirmed ? 'Approved' : isCancelled ? 'Declined' : apt.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3 bg-dark-950/60 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                      <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{apt.eventDate || apt.appointmentDate || 'Date TBD'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-violet-400" />
                      <span className="truncate">{apt.eventLocation || apt.location || 'Location TBD'}</span>
                    </div>
                  </div>

                  {(apt.additionalDetails || apt.notes) && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic mb-2">
                      "{apt.additionalDetails || apt.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/20 text-[10px] text-slate-500">
                    <span>{apt.clientEmail}</span>
                    <span>{apt.clientPhone}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Appointment Management Drawer */}
        {selectedAppt && (
          <div className="lg:col-span-6 bg-dark-900 border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-5 h-fit sticky top-24 text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  {selectedAppt.id}
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Project & Appointment Decision
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
              <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                actionMsg.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-700/40 text-emerald-300'
                  : 'bg-red-950/60 border-red-700/40 text-red-300'
              }`}>
                {actionMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{actionMsg.text}</span>
              </div>
            )}

            {/* Client & Request Details Card */}
            <div className="p-4 rounded-2xl bg-dark-950/80 border border-purple-900/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400 uppercase font-mono text-[10px]">Client Name</span>
                <span className="text-white font-bold text-sm">{selectedAppt.clientName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Service Required:</span>
                <span className="text-brand-electric font-semibold">{selectedAppt.serviceName || 'General Consultation'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email Address:</span>
                <a href={`mailto:${selectedAppt.clientEmail}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{selectedAppt.clientEmail}</span>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <a href={`tel:${selectedAppt.clientPhone}`} className="text-slate-200 hover:text-white flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{selectedAppt.clientPhone}</span>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Event Date:</span>
                <span className="text-cyan-300 font-mono font-medium">{selectedAppt.eventDate || selectedAppt.appointmentDate || 'Not specified'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Event Location:</span>
                <span className="text-slate-200">{selectedAppt.eventLocation || selectedAppt.location || 'Not specified'}</span>
              </div>

              {(selectedAppt.additionalDetails || selectedAppt.notes) && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-slate-400 block mb-1 font-mono text-[10px] uppercase">Additional Details</span>
                  <div className="p-2.5 rounded-xl bg-dark-900 border border-white/5 text-slate-300 text-xs leading-relaxed">
                    {selectedAppt.additionalDetails || selectedAppt.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation Decision Box: Choose / Approve Project */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-dark-950 to-dark-950 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
                  Project Decision
                </span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  selectedAppt.status === 'confirmed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                    : selectedAppt.status === 'cancelled'
                    ? 'bg-red-950 text-red-300 border border-red-800/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                }`}>
                  {selectedAppt.status === 'confirmed' ? 'Approved' : selectedAppt.status === 'cancelled' ? 'Declined' : 'Awaiting Approval'}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Choose whether to approve this request and onboard it as an active project, or decline.
              </p>

              {/* Action Buttons: Approve vs Reject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Approve & Accept Project */}
                <button
                  type="button"
                  disabled={actionLoading || selectedAppt.status === 'confirmed'}
                  onClick={handleApproveAndCreateProject}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>{selectedAppt.status === 'confirmed' ? 'Project Approved' : 'Approve Project'}</span>
                </button>

                {/* Reject / Decline Project */}
                <button
                  type="button"
                  disabled={actionLoading || selectedAppt.status === 'cancelled'}
                  onClick={() => handleUpdateStatus('cancelled')}
                  className="py-3 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 disabled:opacity-50 text-red-200 border border-red-700/40 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline / Reject</span>
                </button>
              </div>

              {selectedAppt.status !== 'confirmed' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('confirmed')}
                  className="w-full py-2 rounded-xl bg-dark-900 hover:bg-dark-800 text-emerald-400 border border-emerald-800/40 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Confirmed (Appointment Only)</span>
                </button>
              )}
            </div>

            {/* Schedule & Notes Adjustments */}
            <div className="space-y-3 pt-2 border-t border-purple-900/30">
              <span className="font-semibold text-slate-300 block text-[11px]">
                Reschedule / Internal Meeting Notes
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1 font-mono text-[10px]">
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1 font-mono text-[10px]">
                    Meeting Time
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 font-mono text-[10px]">
                  Internal Notes & Google Meet Link
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Meeting links, crew assigned, discussion details..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('rescheduled')}
                className="w-full py-2 rounded-xl bg-dark-950 hover:bg-dark-800 text-yellow-300 border border-yellow-700/40 font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Save Schedule & Notes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
