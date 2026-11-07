import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Service } from '../../types';
import { fetchServices, createService, updateService, deleteService } from '../../services/api';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [imageUrl, setImageUrl] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetchServices(true)
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setTitle('');
    setShortDesc('');
    setFullDesc('');
    setIconName('Sparkles');
    setImageUrl('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80');
    setDeliverablesText('Deliverable 1, Deliverable 2');
    setDisplayOrder(services.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setShortDesc(s.short_desc);
    setFullDesc(s.full_desc);
    setIconName(s.icon_name);
    setImageUrl(s.image_url);
    setDeliverablesText(s.deliverables?.join(', ') || '');
    setDisplayOrder(s.display_order);
    setIsActive(s.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) return;

    const deliverables = deliverablesText.split(',').map((d) => d.trim()).filter(Boolean);

    try {
      if (editingService) {
        await updateService(editingService.id, {
          title,
          shortDesc,
          fullDesc: fullDesc || shortDesc,
          iconName,
          imageUrl,
          deliverables,
          displayOrder,
          isActive
        });
      } else {
        await createService({
          title,
          shortDesc,
          fullDesc: fullDesc || shortDesc,
          iconName,
          imageUrl,
          deliverables,
          displayOrder
        });
      }
      setModalOpen(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string, srvTitle: string) => {
    if (confirm(`Delete service "${srvTitle}"?`)) {
      await deleteService(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-neon" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Creative Services Management</h2>
            <span className="text-xs text-slate-400">Configure offerings, deliverables, package quotes, and display ordering</span>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-electric flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500 text-xs">Loading services...</div>
        ) : (
          services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 card-hover-lift flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-cyan-400 font-bold text-[11px]">Order: #{srv.display_order}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    srv.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {srv.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{srv.title}</h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{srv.short_desc}</p>

                <div className="mt-3 pt-2 border-t border-purple-900/20 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">Deliverables ({srv.deliverables?.length || 0}):</span>
                  <div className="truncate mt-0.5">{srv.deliverables?.join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/20">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg bg-dark-950 hover:bg-dark-800 text-cyan-300"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.title)}
                  className="p-1.5 rounded-lg bg-dark-950 hover:bg-red-950/50 text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-dark-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-100 shadow-2xl space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingService ? 'Edit Creative Service' : 'Add Creative Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Icon Name</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  >
                    <option value="Palette">Palette (Design)</option>
                    <option value="Camera">Camera (Photography)</option>
                    <option value="Video">Video (Videography)</option>
                    <option value="Film">Film (Highlights)</option>
                    <option value="Smartphone">Smartphone (Reels)</option>
                    <option value="BookOpen">BookOpen (Brochures)</option>
                    <option value="Layers">Layers (Magazine)</option>
                    <option value="Package">Package (Packaging)</option>
                    <option value="Share2">Share2 (Social Media)</option>
                    <option value="Sparkles">Sparkles (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverables List (comma separated)</label>
                <input
                  type="text"
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="Master files, Print PDF, Color grading"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  id="srvActive"
                  className="accent-purple-500 rounded"
                />
                <label htmlFor="srvActive" className="text-white font-semibold cursor-pointer">
                  Active (Displayed on public website)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-purple-900/30">
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
