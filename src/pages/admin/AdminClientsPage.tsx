import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, Building, FolderKanban, Check, X, Search } from 'lucide-react';
import { Client } from '../../types';
import { fetchClients, createClient, updateClient } from '../../services/api';

export const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [servicesRequested, setServicesRequested] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchClients()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setServicesRequested('');
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone || '');
    setOrganization(c.organization || '');
    setServicesRequested(c.services_requested || '');
    setNotes(c.notes || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await updateClient(editingClient.id, {
          name, email, phone, organization, servicesRequested, notes, status: editingClient.status
        });
      } else {
        await createClient({
          name, email, phone, organization, servicesRequested, notes, status: 'active'
        });
      }
      setModalOpen(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to save client');
    }
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.organization && c.organization.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Client Accounts Directory</h2>
            <span className="text-xs text-slate-400">Manage client organizations, service history, and communication records</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
          />
          <button
            onClick={handleOpenCreate}
            className="btn-electric flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-dark-900 border border-purple-900/30 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-dark-950 border-b border-purple-900/30 uppercase text-[10px] tracking-wider text-slate-400 font-semibold">
            <tr>
              <th className="p-4">Client Name</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Services Requested</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading clients...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No clients match your criteria.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="p-4 font-bold text-white">{c.name}</td>
                  <td className="p-4 text-slate-300">{c.organization || '—'}</td>
                  <td className="p-4">
                    <a href={`mailto:${c.email}`} className="text-brand-electric hover:underline">{c.email}</a>
                  </td>
                  <td className="p-4 text-slate-400">{c.phone || '—'}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{c.services_requested || '—'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="text-cyan-400 hover:text-white font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-dark-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-slate-100 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingClient ? 'Edit Client Record' : 'Add New Client'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Services Requested</label>
                <input
                  type="text"
                  value={servicesRequested}
                  onChange={(e) => setServicesRequested(e.target.value)}
                  placeholder="e.g. Videography, Event Posters"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
