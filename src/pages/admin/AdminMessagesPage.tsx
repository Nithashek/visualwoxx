import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Search, Filter, Check, Clock, Eye, AlertCircle } from 'lucide-react';
import { ContactMessage } from '../../types';
import { fetchContactMessages, updateContactMessage } from '../../services/api';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchContactMessages(statusFilter, search)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  const handleSelect = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setInternalNotes(msg.internalNotes || '');
    setResponseNotes(msg.responseNotes || '');
    setSaveSuccess(null);

    if (!msg.isRead) {
      await updateContactMessage(msg.id, { isRead: true });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
    }
  };

  const handleSaveNotes = async (newStatus?: string) => {
    if (!selectedMsg) return;
    try {
      const statusToSet = newStatus || selectedMsg.status;
      await updateContactMessage(selectedMsg.id, {
        status: statusToSet,
        internalNotes,
        responseNotes
      });
      setSaveSuccess('Message status & notes saved.');
      loadData();
      setSelectedMsg((prev) => prev ? { ...prev, status: statusToSet as any, internalNotes, responseNotes } : null);
    } catch (e: any) {
      alert(e.message || 'Failed to update message');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Website Inquiries & Contact Inbox</h2>
            <span className="text-xs text-slate-400">Review visitor inquiries, log internal replies, and record communication history</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-violet"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className={`${selectedMsg ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
              No messages found.
            </div>
          ) : (
            messages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`p-4 rounded-2xl bg-dark-900 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-violet shadow-glow-subtle bg-purple-950/20'
                      : !msg.isRead
                      ? 'border-purple-700/50 bg-dark-900/90'
                      : 'border-purple-900/30 hover:border-purple-700/40 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-[11px] text-slate-400">&lt;{msg.email}&gt;</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      msg.status === 'new'
                        ? 'bg-purple-950 text-cyan-300'
                        : msg.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-yellow-950 text-yellow-300'
                    }`}>
                      {msg.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-brand-neon mb-1">{msg.subject}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{msg.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/20 text-[10px] text-slate-500 mt-2 font-mono">
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    {msg.phone && <span>Tel: {msg.phone}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail Drawer */}
        {selectedMsg && (
          <div className="lg:col-span-5 bg-dark-900 border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-4 h-fit sticky top-24 text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{selectedMsg.id}</span>
                <h3 className="text-base font-bold text-white font-display">Inquiry Details</h3>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {saveSuccess && (
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 flex items-center gap-1.5 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/30 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span className="text-white font-bold">{selectedMsg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <a href={`mailto:${selectedMsg.email}`} className="text-brand-electric hover:underline">{selectedMsg.email}</a>
              </div>
              {selectedMsg.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-200">{selectedMsg.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-brand-neon">Subject</span>
              <p className="font-semibold text-white">{selectedMsg.subject}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Message Body</span>
              <p className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/20 text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMsg.message}
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold text-[11px]">Internal Response / Notes</label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log reply date, quote shared, or follow up tasks..."
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
              />
            </div>

            {/* Status Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-900/30">
              <button
                onClick={() => handleSaveNotes('new')}
                className={`py-1.5 rounded-xl font-bold uppercase text-[10px] ${
                  selectedMsg.status === 'new' ? 'bg-purple-900 text-white' : 'bg-dark-950 text-slate-400'
                }`}
              >
                New
              </button>
              <button
                onClick={() => handleSaveNotes('in_progress')}
                className={`py-1.5 rounded-xl font-bold uppercase text-[10px] ${
                  selectedMsg.status === 'in_progress' ? 'bg-yellow-900 text-white' : 'bg-dark-950 text-slate-400'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleSaveNotes('resolved')}
                className={`py-1.5 rounded-xl font-bold uppercase text-[10px] ${
                  selectedMsg.status === 'resolved' ? 'bg-emerald-900 text-white' : 'bg-dark-950 text-slate-400'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
