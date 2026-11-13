import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, Play, Sparkles, Check, Globe, Eye, EyeOff } from 'lucide-react';
import { PortfolioProject } from '../../types';
import { fetchPortfolio, createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from '../../services/api';

export const AdminPortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Event Coverage');
  const [clientName, setClientName] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [servicesProvidedText, setServicesProvidedText] = useState('');
  const [galleryUrlsText, setGalleryUrlsText] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchPortfolio(true) // include unpublished
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Event Coverage');
    setClientName('');
    setProjectDate('');
    setDescription('');
    setCoverImage('');
    setVideoUrl('');
    setIsFeatured(false);
    setIsPublished(true);
    setServicesProvidedText('Event Photography, Videography');
    setGalleryUrlsText('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PortfolioProject) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setClientName(p.clientName || '');
    setProjectDate(p.projectDate || '');
    setDescription(p.description);
    setCoverImage(p.coverImage);
    setVideoUrl(p.videoUrl || '');
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setServicesProvidedText(p.servicesProvided?.join(', ') || '');
    setGalleryUrlsText(p.gallery?.map((g) => g.media_url).join('\n') || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !coverImage) return;

    const servicesProvided = servicesProvidedText.split(',').map((s) => s.trim()).filter(Boolean);
    const gallery = galleryUrlsText.split('\n').map((u) => u.trim()).filter(Boolean).map((u) => ({
      type: 'image',
      url: u
    }));

    try {
      if (editingProject) {
        await updatePortfolioProject(editingProject.id, {
          title, category, clientName, projectDate, description,
          coverImage, videoUrl, isFeatured, isPublished,
          servicesProvided, gallery
        });
      } else {
        await createPortfolioProject({
          title, category, clientName, projectDate, description,
          coverImage, videoUrl, isFeatured, isPublished,
          servicesProvided, gallery
        });
      }
      setModalOpen(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to save portfolio showcase');
    }
  };

  const handleDelete = async (id: string, projTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projTitle}"?`)) {
      await deletePortfolioProject(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-brand-electric" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Portfolio Case Studies CMS</h2>
            <span className="text-xs text-slate-400">Publish, feature, and manage public showcase entries and high-res media</span>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-electric flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Case Study</span>
        </button>
      </div>

      {/* Grid of Portfolio Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500 text-xs">Loading portfolio showcases...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-3 p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
            No portfolio entries yet. Click "New Project Case Study" to add one.
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 card-hover-lift flex flex-col justify-between space-y-4 text-xs"
            >
              <div>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-dark-950 mb-3">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="bg-dark-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-300">
                      {p.category}
                    </span>
                    {p.isFeatured && (
                      <span className="bg-yellow-950/80 text-yellow-300 px-2 py-0.5 rounded text-[10px] font-bold border border-yellow-700/40">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.isPublished ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-1">{p.title}</h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">{p.clientName || 'Commercial Partner'}</span>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-900/20">
                <span className="text-[10px] text-slate-500 font-mono">Gallery: {p.gallery?.length || 0} assets</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg bg-dark-950 hover:bg-dark-800 text-cyan-300"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 rounded-lg bg-dark-950 hover:bg-red-950/50 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-dark-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-slate-100 shadow-2xl space-y-4 text-xs max-h-[92vh] overflow-y-auto my-6">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingProject ? 'Edit Showcase Case Study' : 'Create Portfolio Entry'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Neon Odyssey Festival 2026"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  >
                    <option value="Event Coverage">Event Coverage</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Reels">Reels & Short Videos</option>
                    <option value="Branding">Branding</option>
                    <option value="Packaging Design">Packaging Design</option>
                    <option value="Product Shoots">Product Shoots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client / Brand</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Odyssey Events"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Date</label>
                  <input
                    type="text"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    placeholder="e.g. February 2026"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video Showreel URL (YouTube/Vimeo)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Study Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the creative approach, production challenges, and delivered impact..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Services Provided (comma separated)</label>
                <input
                  type="text"
                  value={servicesProvidedText}
                  onChange={(e) => setServicesProvidedText(e.target.value)}
                  placeholder="Event Photography, Cinematic Videography, Highlight Videos"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gallery Image URLs (one per line)</label>
                <textarea
                  rows={2}
                  value={galleryUrlsText}
                  onChange={(e) => setGalleryUrlsText(e.target.value)}
                  placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span className="font-semibold text-white">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span className="font-semibold text-white">Publish Immediately</span>
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
                  className="btn-electric px-6 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
                >
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
