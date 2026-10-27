import React, { useState, useEffect } from 'react';
import {
  Users, Inbox, FolderKanban, CheckCircle, Clock,
  Calendar, UserCheck, UserPlus, MessageSquare, ArrowUpRight,
  Sparkles, Activity, ShieldCheck, ChevronRight
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { fetchDashboardStats } from '../../services/api';

interface AdminDashboardPageProps {
  onNavigateSection: (section: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateSection }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <Sparkles className="w-5 h-5 text-brand-neon animate-spin" />
          <span>Loading Live Operations Data...</span>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-purple-400', link: 'clients' },
    { label: 'New Inquiries', value: stats.newInquiries, icon: Inbox, color: 'text-brand-neon', link: 'inquiries', highlight: true },
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'text-cyan-400', link: 'projects' },
    { label: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle, color: 'text-emerald-400', link: 'projects' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'text-yellow-400', link: 'projects' },
    { label: 'Upcoming Appointments', value: stats.upcomingAppointments, icon: Calendar, color: 'text-brand-electric', link: 'appointments' },
    { label: 'Total Freelancers', value: stats.totalFreelancers, icon: UserCheck, color: 'text-pink-400', link: 'freelancers' },
    { label: 'New Applications', value: stats.newApplications, icon: UserPlus, color: 'text-cyan-300', link: 'freelancers' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'text-amber-400', link: 'messages' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateSection(kpi.link)}
              className={`p-5 rounded-2xl bg-dark-900 border transition-all cursor-pointer card-hover-lift flex items-center justify-between ${
                kpi.highlight
                  ? 'border-brand-violet/50 shadow-glow-subtle bg-gradient-to-br from-purple-950/40 to-dark-900'
                  : 'border-purple-900/30'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                <div className="text-2xl font-black text-white font-display">
                  {kpi.value}
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-dark-950 border border-purple-800/30 flex items-center justify-center ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Inquiries & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries Card */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-800/30 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-brand-neon" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Recent Project Inquiries
              </h3>
            </div>
            <button
              onClick={() => onNavigateSection('inquiries')}
              className="text-xs text-brand-neon hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No inquiries recorded yet.</p>
            ) : (
              stats.recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => onNavigateSection('inquiries')}
                  className="p-3 rounded-xl bg-dark-950/70 border border-purple-900/20 hover:border-purple-700/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white block">{inq.full_name}</span>
                    <span className="text-[11px] text-slate-400 truncate block max-w-xs">{inq.project_title}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    inq.status === 'new_inquiry'
                      ? 'bg-purple-950 text-cyan-300 border border-purple-800/40'
                      : inq.status === 'confirmed'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-dark-800 text-slate-400'
                  }`}>
                    {inq.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments Card */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-purple-800/30 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Upcoming Discovery Appointments
              </h3>
            </div>
            <button
              onClick={() => onNavigateSection('appointments')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Schedule View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.upcomingAppointmentsList.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending appointments.</p>
            ) : (
              stats.upcomingAppointmentsList.map((apt, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateSection('appointments')}
                  className="p-3 rounded-xl bg-dark-950/70 border border-purple-900/20 hover:border-purple-700/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white block">{apt.client_name}</span>
                    <span className="text-[11px] text-slate-400">{apt.service_name || 'General Consultation'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-brand-neon block">
                      {apt.appointment_date}
                    </span>
                    <span className="text-[10px] text-slate-400">{apt.appointment_time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent System Activity Stream */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-purple-800/30 space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-electric" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Live System Activity Logs & Audit Trail
            </h3>
          </div>
          <button
            onClick={() => onNavigateSection('logs')}
            className="text-xs text-slate-400 hover:text-white"
          >
            Full Log Archive
          </button>
        </div>

        <div className="space-y-2.5">
          {stats.recentActivity.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-dark-950/60 border border-purple-900/20 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                  {log.action_type}
                </span>
                <span className="text-slate-200">{log.description}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span>By {log.user_name}</span>
                <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
