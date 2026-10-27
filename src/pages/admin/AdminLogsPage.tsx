import React, { useState, useEffect } from 'react';
import { Shield, Activity, Lock, Key, ShieldCheck, Clock } from 'lucide-react';
import { fetchActivityLogs } from '../../services/api';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const rolesMatrix = [
    {
      role: 'Super Admin',
      key: 'super_admin',
      desc: 'Complete unfettered administrative authority across all databases, user accounts, and security settings.',
      access: ['Client Operations', 'Kanban Management', 'Freelancer Recruitment', 'Portfolio & CMS', 'System Logs & Settings']
    },
    {
      role: 'Operations Admin',
      key: 'operations_admin',
      desc: 'Manages client bookings, project milestones, task checklists, appointments, and client deliverables.',
      access: ['Inquiries Management', 'Appointment Scheduler', 'Project Kanban & Subtasks', 'Clients Directory']
    },
    {
      role: 'Creative Team Admin',
      key: 'creative_admin',
      desc: 'Controls portfolio showcase case studies, media galleries, 12 creative services, and team member bios.',
      access: ['Portfolio Case Studies', 'Services Management', 'Team Leadership Profiles']
    },
    {
      role: 'Recruitment Admin',
      key: 'recruitment_admin',
      desc: 'Reviews freelancer creator applications, manages candidate stages, conducts evaluations, and approves roster.',
      access: ['Freelancer Applications Pipeline', 'Approved Freelancer Pool', 'Candidate Evaluations']
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 rounded-2xl border border-purple-900/30">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-brand-neon" />
          <div>
            <h2 className="text-base font-bold text-white font-display">System Security & Activity Audit Trail</h2>
            <span className="text-xs text-slate-400">Review real-time administrative actions and RBAC role permission schemas</span>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Role-Based Permissions Schema</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesMatrix.map((r) => (
            <div key={r.key} className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{r.role}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                  {r.key}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{r.desc}</p>
              <div className="pt-2 border-t border-purple-900/20">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1.5">Permitted Modules:</span>
                <div className="flex flex-wrap gap-1.5">
                  {r.access.map((mod, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-dark-950 border border-purple-900/20 text-slate-300 text-[10px]">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-neon" />
          <span>System Activity Audit Logs</span>
        </h3>

        <div className="rounded-2xl bg-dark-900 border border-purple-900/30 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 border-b border-purple-900/30 uppercase text-[10px] tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading audit trail...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No activity recorded yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-white">{log.description}</td>
                    <td className="p-3.5 text-slate-400">{log.user_name}</td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">{log.entity_type || '—'}</td>
                    <td className="p-3.5 text-right font-mono text-slate-500 text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
