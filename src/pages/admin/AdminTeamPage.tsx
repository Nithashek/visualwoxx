import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { TeamMember } from '../../types';
import { fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/api';

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Creative');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetchTeam(true) // include inactive
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFullName('');
    setPosition('');
    setDepartment('Creative');
    setBio('');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
    setEmail('');
    setInstagram('https://instagram.com');
    setLinkedin('https://linkedin.com');
    setDisplayOrder(team.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFullName(m.fullName);
    setPosition(m.position);
    setDepartment(m.department);
    setBio(m.bio);
    setPhotoUrl(m.photoUrl);
    setEmail(m.email || '');
    setInstagram(m.socialLinks?.instagram || '');
    setLinkedin(m.socialLinks?.linkedin || '');
    setDisplayOrder(m.displayOrder);
    setIsActive(m.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !position) return;

    const socialLinks = { instagram, linkedin };

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, {
          fullName, position, department, bio, photoUrl,
          email, socialLinks, displayOrder, isActive
        });
      } else {
        await createTeamMember({
          fullName, position, department, bio, photoUrl,
          email, socialLinks, displayOrder
        });
      }
      setModalOpen(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to save team member');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove ${name} from core committee?`)) {
      await deleteTeamMember(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-brand-neon" />
          <div>
            <h2 className="text-base font-bold text-white font-display">Core Committee & Leadership CMS</h2>
            <span className="text-xs text-slate-400">Configure team roster, positions, and display order shown on the public About page</span>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-electric flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center py-12 text-slate-500 text-xs">Loading team roster...</div>
        ) : (
          team.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-dark-900 border border-purple-900/30 card-hover-lift flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-dark-950 mb-3">
                  <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-dark-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-300">
                      {member.department}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      member.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {member.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-sm">{member.fullName}</h3>
                  <span className="font-mono text-[10px] text-slate-500">#{member.displayOrder}</span>
                </div>
                <span className="text-xs text-brand-neon font-semibold block">{member.position}</span>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{member.bio}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/20">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 rounded-lg bg-dark-950 hover:bg-dark-800 text-cyan-300"
                  title="Edit Profile"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.fullName)}
                  className="p-1.5 rounded-lg bg-dark-950 hover:bg-red-950/50 text-red-400"
                  title="Remove"
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
                {editingMember ? 'Edit Leadership Profile' : 'Add Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Creative Director"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Operations">Operations</option>
                    <option value="Creative">Creative / Design</option>
                    <option value="Production">Cinematography / Photo</option>
                    <option value="Post-Production">Post-Production / FX</option>
                    <option value="Marketing">Marketing & Comms</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Profile Photo URL *</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    id="teamActive"
                    className="accent-purple-500 rounded"
                  />
                  <label htmlFor="teamActive" className="text-white font-semibold cursor-pointer">
                    Active on About Page
                  </label>
                </div>
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
