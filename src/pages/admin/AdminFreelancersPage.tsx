import React, { useState, useEffect } from 'react';
import {
  UserCheck, UserPlus, Search, Filter, Globe,
  FileText, CheckCircle2, XCircle, Clock,
  Sparkles, Star, Check, AlertCircle, Phone, Mail, MapPin
} from 'lucide-react';
import { FreelancerApplication, Freelancer } from '../../types';
import {
  fetchFreelancerApplications, updateFreelancerApplication,
  fetchFreelancers, updateFreelancer
} from '../../services/api';

export const AdminFreelancersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'roster'>('applications');
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');

  // Selected for review
  const [selectedApp, setSelectedApp] = useState<FreelancerApplication | null>(null);
  const [evalNotes, setEvalNotes] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchFreelancerApplications({ status: statusFilter, skill: skillFilter, search }),
      fetchFreelancers()
    ])
      .then(([apps, fls]) => {
        setApplications(apps);
        setFreelancers(fls);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, skillFilter, search]);

  const handleOpenReview = (app: FreelancerApplication) => {
    setSelectedApp(app);
    setEvalNotes(app.internalNotes || '');
    setActionMsg(null);
  };

  const handleUpdateStatus = async (newStatus: any) => {
    if (!selectedApp) return;
    try {
      await updateFreelancerApplication(selectedApp.id, {
        status: newStatus,
        internalNotes: evalNotes
      });
      setActionMsg(`Applicant marked as ${newStatus.replace('_', ' ').toUpperCase()}!`);
      loadData();
      setSelectedApp((prev) => prev ? { ...prev, status: newStatus, internalNotes: evalNotes } : null);
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    }
  };

  const handleUpdateAvailability = async (freelancerId: string, status: any) => {
    try {
      await updateFreelancer(freelancerId, { availabilityStatus: status });
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to update availability');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-brand-neon" />
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Freelancer Recruitment & Talent Pool
            </h2>
            <span className="text-xs text-slate-400">
              Manage applicant pipeline, evaluate portfolios, and maintain active crew roster
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-purple-900/30">
          <button
            onClick={() => setActiveTab('applications')}
            className={`p-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'applications'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Applications ({applications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`p-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'roster'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approved Roster ({freelancers.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'applications' ? (
        /* Applications Pipeline */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-dark-900/60 p-3 rounded-2xl border border-purple-900/20 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
              >
                <option value="all">All Application Statuses</option>
                <option value="new_application">New Application</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview / Discussion</option>
                <option value="accepted">Accepted (Promoted to Roster)</option>
                <option value="rejected">Rejected</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-violet"
              >
                <option value="all">All Disciplines</option>
                <option value="Graphic Designer">Graphic Designer</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Photographer">Photographer</option>
                <option value="Videographer">Videographer</option>
                <option value="Motion Graphics Designer">Motion Graphics</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Content Writer">Content Writer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className={`${selectedApp ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
              {loading ? (
                <div className="text-center py-12 text-slate-500 text-xs">Loading applicants...</div>
              ) : applications.length === 0 ? (
                <div className="p-12 text-center bg-dark-900/50 rounded-2xl border border-purple-900/30 text-slate-500 text-xs">
                  No applications match your filter.
                </div>
              ) : (
                applications.map((app) => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => handleOpenReview(app)}
                      className={`p-4 rounded-2xl bg-dark-900 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-violet shadow-glow-subtle bg-purple-950/20'
                          : 'border-purple-900/30 hover:border-purple-700/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-white">{app.fullName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-brand-neon font-semibold">{app.primarySkill}</span>
                            <span className="text-[10px] text-slate-500">• {app.experienceLevel}</span>
                            <span className="text-[10px] text-slate-500">• {app.location}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          app.status === 'accepted'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : app.status === 'shortlisted'
                            ? 'bg-purple-950 text-cyan-300 border border-purple-800/40'
                            : app.status === 'rejected'
                            ? 'bg-red-950 text-red-300 border border-red-800/40'
                            : 'bg-yellow-950 text-yellow-300 border border-yellow-800/40'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {app.introduction}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-purple-900/20 text-xs text-slate-400">
                        <span className="text-[11px] font-mono text-cyan-400">{app.workingStyle} ({app.availability})</span>
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-brand-electric hover:underline font-semibold text-[11px]"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Portfolio</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Review Drawer */}
            {selectedApp && (
              <div className="lg:col-span-5 bg-dark-900 border border-purple-800/40 rounded-3xl p-6 shadow-2xl space-y-5 h-fit sticky top-24 text-xs">
                <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-neon uppercase">
                      {selectedApp.id}
                    </span>
                    <h3 className="text-base font-bold text-white font-display">
                      Applicant Dossier
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
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

                {/* Candidate Info */}
                <div className="p-3.5 rounded-xl bg-dark-950/60 border border-purple-900/30 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white font-bold">{selectedApp.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <a href={`mailto:${selectedApp.email}`} className="text-brand-electric hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-200">{selectedApp.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white">{selectedApp.location}</span>
                  </div>
                </div>

                {/* Portfolios & Links */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Links & Verification</span>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-cyan-300 hover:text-white flex items-center justify-center gap-1.5 font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View Portfolio</span>
                    </a>

                    {selectedApp.resumeUrl ? (
                      <a
                        href={selectedApp.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-dark-950 border border-purple-900/40 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resume Document</span>
                      </a>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-dark-950 border border-purple-900/20 text-slate-500 text-center">
                        No Resume Attached
                      </div>
                    )}
                  </div>
                </div>

                {/* Introduction & Philosophy */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Candidate Introduction</span>
                  <p className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/20 text-slate-200 leading-relaxed">
                    "{selectedApp.introduction}"
                  </p>
                </div>

                {/* Internal Evaluation Notes */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">
                    Evaluation & Interview Notes
                  </label>
                  <textarea
                    rows={2}
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                    placeholder="Candidate strengths, equipment owned, rate per day..."
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-violet text-xs"
                  />
                </div>

                {/* Pipeline Actions */}
                <div className="space-y-2 pt-2 border-t border-purple-900/30">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus('shortlisted')}
                      className="py-2 rounded-xl bg-dark-950 border border-cyan-800/40 text-cyan-300 font-bold uppercase tracking-wider text-[11px]"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('interview')}
                      className="py-2 rounded-xl bg-dark-950 border border-brand-violet/40 text-brand-neon font-bold uppercase tracking-wider text-[11px]"
                    >
                      Schedule Interview
                    </button>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus('accepted')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Add to Official Roster</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    className="w-full py-1.5 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/50 text-[11px]"
                  >
                    Decline Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Approved Freelancers Roster */
        <div className="space-y-4">
          <div className="rounded-2xl bg-dark-900 border border-purple-900/30 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-dark-950 border-b border-purple-900/30 uppercase text-[10px] tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {freelancers.map((fl) => (
                  <tr key={fl.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-4 font-bold text-white">{fl.fullName}</td>
                    <td className="p-4 text-cyan-300 font-semibold">{fl.primarySkill}</td>
                    <td className="p-4 text-slate-400">{fl.location || 'Remote'}</td>
                    <td className="p-4 text-slate-400">{fl.experienceLevel || '3-5 years'}</td>
                    <td className="p-4">
                      <select
                        value={fl.availabilityStatus}
                        onChange={(e) => handleUpdateAvailability(fl.id, e.target.value)}
                        className={`bg-dark-950 border rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none ${
                          fl.availabilityStatus === 'available'
                            ? 'text-emerald-400 border-emerald-800/40'
                            : fl.availabilityStatus === 'busy'
                            ? 'text-amber-400 border-amber-800/40'
                            : 'text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy / On Project</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-mono font-bold text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        <span>{fl.rating.toFixed(1)}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {fl.portfolioUrl && (
                        <a
                          href={fl.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-electric hover:underline font-semibold"
                        >
                          View Link ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
