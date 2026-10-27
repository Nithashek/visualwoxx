import React, { useState, useEffect } from 'react';
import {
  Inbox, Search, Filter, Phone, Mail, Calendar, Clock,
  DollarSign, Check, X, ArrowUpRight, FolderPlus, Sparkles, AlertCircle
} from 'lucide-react';
import { Inquiry } from '../../types';
import { fetchInquiries, updateInquiry, convertInquiryToProject } from '../../services/api';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchInquiries(statusFilter)
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleOpenDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setInternalNotes(inq.internalNotes || '');
    setActionSuccess(null);
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!selectedInquiry) return;
    try {
      await updateInquiry(selectedInquiry.id, {
        status: newStatus,
        internalNotes
      });
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus, internalNotes } : null));
      setActionSuccess(`Status updated to ${newStatus.replace('_', ' ')}`);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      await updateInquiry(selectedInquiry.id, {
        status: selectedInquiry.status,
        internalNotes
      });
      setActionSuccess('Internal notes saved successfully');
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to save notes');
    }
  };

  const handleConvertToProject = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await convertInquiryToProject(selectedInquiry.id);
      setActionSuccess(`Inquiry converted into Client and Project ID: ${res.projectId}!`);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to convert inquiry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-brand-neon" />
          <h2 className="text-base font-bold text-white font-display">
            Project Inquiries & Booking Requests
          </h2>
          <span className="text-xs bg-purple-950 text-cyan-300 px-2 py-0.5 rounded-full border border-purple-800/40">
            {inquiries.length} Inquiries
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-violet"
          >
            <option value="all">All Statuses</option>
            <option value="new_inquiry">New Inquiry</option>
            <option value="under_review">Under Review</option>
            <option value="awaiting_client_response">Awaiting Client</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table / Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table List */}
        <div className={`${selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
              No project inquiries match the current filter.
            </div>
          ) : (
            inquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => handleOpenDetail(inq)}
                  className={`p-4 rounded-2xl bg-dark-900 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-violet shadow-glow-subtle bg-purple-950/20'
                      : 'border-purple-900/30 hover:border-purple-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{inq.fullName}</span>
                        {inq.organization && (
                          <span className="text-[11px] text-slate-400 font-medium">({inq.organization})</span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-brand-neon mt-0.5">{inq.projectTitle}</h4>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                      inq.status === 'new_inquiry'
                        ? 'bg-purple-950 text-cyan-300 border border-purple-800/40'
                        : inq.status === 'confirmed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : inq.status === 'cancelled'
                        ? 'bg-red-950 text-red-300 border border-red-800/40'
                        : 'bg-yellow-950 text-yellow-300 border border-yellow-800/40'
                    }`}>
                      {inq.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {inq.projectDescription}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-purple-900/20">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Appt: {inq.preferredAppointmentDate || 'Flexible'} {inq.preferredAppointmentTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{inq.budgetRange}</span>
                      <span>via {inq.preferredContactMethod}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Inquiry Detail Drawer */}
        {selectedInquiry && (
          <div className="lg:col-span-5 bg-dark-900 border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-5 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-neon font-mono">
                  {selectedInquiry.id}
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  Inquiry Review & Actions
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-7 h-7 rounded-full bg-dark-950 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Client Info Grid */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/30 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Client:</span>
                  <span className="text-white font-bold">{selectedInquiry.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-brand-electric hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-slate-200">
                    {selectedInquiry.phone}
                  </a>
                </div>
                {selectedInquiry.organization && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Brand:</span>
                    <span className="text-white">{selectedInquiry.organization}</span>
                  </div>
                )}
              </div>

              {/* Scope & Deliverables */}
              <div className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/30 space-y-2">
                <span className="text-slate-400 block font-semibold text-[11px] uppercase">
                  Requested Services
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInquiry.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-purple-950 text-cyan-300 text-[10px] font-semibold border border-purple-800/40"
                    >
                      {srv}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block font-semibold text-[11px] uppercase">
                    Project Scope
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed mt-1">
                    {selectedInquiry.projectDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Change */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold text-xs">
                Update Status
              </label>
              <select
                value={selectedInquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-violet"
              >
                <option value="new_inquiry">New Inquiry</option>
                <option value="under_review">Under Review</option>
                <option value="awaiting_client_response">Awaiting Client Response</option>
                <option value="confirmed">Confirmed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold text-xs">
                Internal Administrative Notes
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log call summary, preliminary quote, or crew assignment notes..."
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
              />
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-semibold"
              >
                Save Notes
              </button>
            </div>

            {/* Convert to Project Action */}
            <div className="pt-3 border-t border-purple-900/30">
              <button
                onClick={handleConvertToProject}
                className="w-full btn-electric py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-glow-subtle"
              >
                <FolderPlus className="w-4 h-4 text-cyan-300" />
                <span>Convert to Active Project & Client</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
