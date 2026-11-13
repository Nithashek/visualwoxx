import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Inbox, Calendar, FolderKanban, Users,
  UserCheck, Image, Sparkles, UserPlus, MessageSquare,
  Globe, Shield, LogOut, ExternalLink, Bell, Menu, X, Check
} from 'lucide-react';
import { AdminUser, AppNotification } from '../../types';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';

interface AdminLayoutProps {
  user: AdminUser;
  currentSection: string;
  onNavigateSection: (section: string) => void;
  onLogout: () => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  currentSection,
  onNavigateSection,
  onLogout,
  onBackToSite,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  useEffect(() => {
    fetchNotifications().then(setNotifications).catch(console.error);
    const interval = setInterval(() => {
      fetchNotifications().then(setNotifications).catch(console.error);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Project Inquiries', icon: Inbox },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'projects', label: 'Projects & Kanban', icon: FolderKanban },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'freelancers', label: 'Freelancer Roster', icon: UserCheck },
    { id: 'portfolio', label: 'Portfolio CMS', icon: Image },
    { id: 'services', label: 'Services CMS', icon: Sparkles },
    { id: 'team', label: 'Core Team', icon: UserPlus },
    { id: 'messages', label: 'Message Inbox', icon: MessageSquare },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'logs', label: 'Activity Logs', icon: Shield },
  ];

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotifClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }
    if (notif.link) {
      const sec = notif.link.replace('/admin/', '');
      onNavigateSection(sec);
      setNotifDropdownOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-900 border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-dark-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-wider font-display">
            VISUAL WOXX <span className="text-brand-neon">ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg bg-dark-800 text-slate-300"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-neon text-dark-950 font-bold text-[10px] flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>
          <button
            onClick={onBackToSite}
            className="p-2 rounded-lg bg-dark-800 text-slate-400 hover:text-white"
            title="Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-900/95 border-r border-purple-900/30 backdrop-blur-xl z-40 flex flex-col justify-between p-4 overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-electric p-0.5 shadow-glow-subtle shrink-0">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-neon" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider text-white font-display">
                VISUAL <span className="text-brand-neon">WOXX</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-brand-electric uppercase">
                ADMIN PORTAL
              </span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3 rounded-2xl bg-dark-950/70 border border-purple-900/30 flex items-center gap-3">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user.fullName}
              className="w-9 h-9 rounded-xl object-cover border border-purple-700/40"
            />
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-white truncate">{user.fullName}</span>
              <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-900/40 text-white border border-brand-violet shadow-glow-subtle font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-neon' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-purple-900/30 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-slate-500">Live</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-dark-900/50 border-b border-purple-900/20 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-white capitalize font-display">
              {currentSection.replace('-', ' ')}
            </h2>
            <span className="text-xs text-slate-400">
              Visual Woxx Internal Platform & Content Engine
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl bg-dark-950 border border-purple-900/30 text-slate-300 hover:text-white transition-all hover:border-purple-600/40"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-neon text-dark-950 font-bold text-[10px] flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-dark-900 border border-purple-800/40 shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
                    <span className="font-bold text-white">Notifications</span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-brand-neon hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                            n.isRead
                              ? 'bg-dark-950/40 border-purple-900/20 text-slate-400'
                              : 'bg-purple-950/30 border-purple-700/50 text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-[11px]">{n.title}</span>
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                          </div>
                          <p className="text-[11px] line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-950 border border-purple-900/30 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
