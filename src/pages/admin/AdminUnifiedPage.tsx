import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, FolderKanban, Users, UserCheck,
  UserPlus, Star, Image as ImageIcon, Plus, Edit, Trash2,
  Search, Filter, CheckCircle2, XCircle, Clock, ExternalLink,
  LogOut, Sparkles, Eye, EyeOff, Save, Check, AlertCircle,
  ChevronRight, ChevronLeft, Phone, Mail, MapPin, Globe,
  Shield, Play, DollarSign, Briefcase, FileText, CheckSquare,
  MessageSquare, Video, ArrowUpRight
} from 'lucide-react';
import {
  AdminUser, DashboardStats, FreelancerApplication, Freelancer,
  PortfolioProject, ClientReview, Inquiry, Appointment, Project,
  Client, TeamMember
} from '../../types';
import {
  fetchDashboardStats, fetchAppointments, createAppointment,
  updateAppointment, deleteAppointment, fetchProjects, createProject,
  updateProject, deleteProject, fetchClients, createClient,
  updateClient, deleteClient, fetchFreelancerApplications,
  updateFreelancerApplication, fetchFreelancers, updateFreelancer,
  fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  fetchReviews, createReview, updateReview, deleteReview,
  fetchPortfolio, createPortfolioProject, updatePortfolioProject,
  deletePortfolioProject
} from '../../services/api';

interface AdminUnifiedPageProps {
  user: AdminUser;
  onLogout: () => void;
  onBackToSite: () => void;
}

type TabType = 'dashboard' | 'appointments' | 'projects' | 'clients' | 'freelancers' | 'team' | 'reviews' | 'portfolio';

export const AdminUnifiedPage: React.FC<AdminUnifiedPageProps> = ({
  user,
  onLogout,
  onBackToSite
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Shared Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  // -------------------------------------------------------------
  // Data Fetching
  // -------------------------------------------------------------
  const loadAllData = () => {
    setLoading(true);
    Promise.all([
      fetchDashboardStats().catch(() => null),
      fetchAppointments().catch(() => []),
      fetchProjects().catch(() => []),
      fetchClients().catch(() => []),
      fetchFreelancerApplications().catch(() => []),
      fetchFreelancers().catch(() => []),
      fetchTeam(true).catch(() => []),
      fetchReviews(true).catch(() => []),
      fetchPortfolio(true).catch(() => [])
    ]).then(([s, apts, prjs, cls, fApps, fls, tm, revs, port]) => {
      if (s) setStats(s);
      setAppointments(apts);
      setProjects(prjs);
      setClients(cls);
      setApplications(fApps);
      setFreelancers(fls);
      setTeamMembers(tm);
      setReviews(revs);
      setPortfolioProjects(port);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // -------------------------------------------------------------
  // 1. DASHBOARD CALENDAR & STATE
  // -------------------------------------------------------------
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // -------------------------------------------------------------
  // 2. APPOINTMENT MODAL & STATE
  // -------------------------------------------------------------
  const [aptModalOpen, setAptModalOpen] = useState(false);
  const [aptFilter, setAptFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [aptClientName, setAptClientName] = useState('');
  const [aptDate, setAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [aptTime, setAptTime] = useState('11:00');
  const [aptLocation, setAptLocation] = useState('Visual Woxx Studio / Google Meet');
  const [aptPurpose, setAptPurpose] = useState('Event Pre-production Meeting');
  const [aptNotes, setAptNotes] = useState('');
  const [activeMeetingNotesApt, setActiveMeetingNotesApt] = useState<Appointment | null>(null);
  const [liveMeetingNotes, setLiveMeetingNotes] = useState('');

  // -------------------------------------------------------------
  // 3. PROJECT MODAL & STATE
  // -------------------------------------------------------------
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pName, setPName] = useState('');
  const [pType, setPType] = useState('Event');
  const [pClientName, setPClientName] = useState('');
  const [pTotalCost, setPTotalCost] = useState<number | ''>(50000);
  const [pProgressStage, setPProgressStage] = useState<string>('meeting');
  const [pProgressPct, setPProgressPct] = useState<number>(20);
  const [pStartDate, setPStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [pDeadline, setPDeadline] = useState('');
  const [pDesc, setPDesc] = useState('');

  // -------------------------------------------------------------
  // 4. CLIENT MODAL & STATE
  // -------------------------------------------------------------
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cOrganization, setCOrganization] = useState('');
  const [cActiveProject, setCActiveProject] = useState('');

  // -------------------------------------------------------------
  // 5. FREELANCER FILTER & STATE
  // -------------------------------------------------------------
  const [flFilterSkill, setFlFilterSkill] = useState<string>('all');
  const [flFilterAvailability, setFlFilterAvailability] = useState<string>('all');
  const [flFilterExp, setFlFilterExp] = useState<string>('all');
  const [flSearch, setFlSearch] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<FreelancerApplication | null>(null);
  const [flSubTab, setFlSubTab] = useState<'roster' | 'applications'>('roster');

  // -------------------------------------------------------------
  // 6. CORE TEAM MODAL & STATE
  // -------------------------------------------------------------
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [tmName, setTmName] = useState('');
  const [tmPosition, setTmPosition] = useState('');
  const [tmDepartment, setTmDepartment] = useState('Production');
  const [tmBio, setTmBio] = useState('');
  const [tmPhoto, setTmPhoto] = useState('');
  const [tmEmail, setTmEmail] = useState('');

  // -------------------------------------------------------------
  // 7. REVIEW MODAL & STATE
  // -------------------------------------------------------------
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ClientReview | null>(null);
  const [revClientName, setRevClientName] = useState('');
  const [revDesignation, setRevDesignation] = useState('');
  const [revCompany, setRevCompany] = useState('');
  const [revQuote, setRevQuote] = useState('');
  const [revRating, setRevRating] = useState<number>(5);
  const [revPublished, setRevPublished] = useState<boolean>(true);

  // -------------------------------------------------------------
  // 8. PORTFOLIO MODAL & STATE
  // -------------------------------------------------------------
  const [portModalOpen, setPortModalOpen] = useState(false);
  const [editingPort, setEditingPort] = useState<PortfolioProject | null>(null);
  const [portTitle, setPortTitle] = useState('');
  const [portCategory, setPortCategory] = useState('Event Coverage');
  const [portClient, setPortClient] = useState('');
  const [portDate, setPortDate] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portCover, setPortCover] = useState('');
  const [portVideo, setPortVideo] = useState('');
  const [portServices, setPortServices] = useState('Photography, Videography');
  const [portFeatured, setPortFeatured] = useState(false);
  const [portPublished, setPortPublished] = useState(true);

  // -------------------------------------------------------------
  // HANDLERS: APPOINTMENTS
  // -------------------------------------------------------------
  const handleScheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptClientName || !aptDate || !aptTime) return;

    try {
      await createAppointment({
        clientName: aptClientName,
        appointmentDate: aptDate,
        appointmentTime: aptTime,
        location: aptLocation,
        purpose: aptPurpose,
        notes: aptNotes,
        status: 'pending'
      });
      showNotification('Appointment scheduled successfully');
      setAptModalOpen(false);
      setAptClientName('');
      setAptNotes('');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to schedule appointment', 'error');
    }
  };

  const handleUpdateAptStatus = async (id: string, status: string) => {
    try {
      await updateAppointment(id, { status });
      showNotification(`Meeting marked as ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update appointment', 'error');
    }
  };

  const handleSaveLiveMeetingNotes = async () => {
    if (!activeMeetingNotesApt) return;
    try {
      await updateAppointment(activeMeetingNotesApt.id, {
        meetingNotes: liveMeetingNotes
      });
      showNotification('Meeting notes saved securely');
      setActiveMeetingNotesApt(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save meeting notes', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: PROJECTS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setPName('');
    setPType('Event');
    setPClientName('');
    setPTotalCost(50000);
    setPProgressStage('meeting');
    setPProgressPct(25);
    setPStartDate(new Date().toISOString().split('T')[0]);
    setPDeadline('');
    setPDesc('');
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setPName(p.projectName);
    setPType(p.projectType || 'Event');
    setPClientName(p.clientName);
    setPTotalCost(p.totalCost || 50000);
    setPProgressStage(p.progressStage || 'meeting');
    setPProgressPct(p.progressPct || 0);
    setPStartDate(p.startDate || '');
    setPDeadline(p.deadline || '');
    setPDesc(p.description || '');
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pClientName) return;

    const computedStatus =
      pProgressStage === 'completed'
        ? 'completed'
        : pProgressStage === 'payment_pending'
        ? 'client_review'
        : 'in_progress';

    try {
      if (editingProject) {
        await updateProject(editingProject.id, {
          projectName: pName,
          projectType: pType,
          clientName: pClientName,
          totalCost: Number(pTotalCost) || 0,
          progressStage: pProgressStage,
          progressPct: pProgressPct,
          status: computedStatus,
          startDate: pStartDate,
          deadline: pDeadline,
          description: pDesc
        });
        showNotification('Project updated successfully');
      } else {
        await createProject({
          projectName: pName,
          projectType: pType,
          clientName: pClientName,
          totalCost: Number(pTotalCost) || 0,
          progressStage: pProgressStage,
          progressPct: pProgressPct,
          status: computedStatus,
          startDate: pStartDate,
          deadline: pDeadline,
          description: pDesc
        });
        showNotification('New project added successfully');
      }
      setProjectModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save project', 'error');
    }
  };

  const handleQuickProgressChange = async (p: Project, stage: string) => {
    let pct = 25;
    let st = 'in_progress';
    if (stage === 'meeting') pct = 25;
    if (stage === 'event_deadline_completed') pct = 75;
    if (stage === 'payment_pending') { pct = 90; st = 'client_review'; }
    if (stage === 'completed') { pct = 100; st = 'completed'; }

    try {
      await updateProject(p.id, {
        progressStage: stage,
        progressPct: pct,
        status: st
      });
      showNotification(`Project milestone updated to ${stage.replace(/_/g, ' ').toUpperCase()}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update progress', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: CLIENTS
  // -------------------------------------------------------------
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cEmail) return;

    try {
      await createClient({
        name: cName,
        email: cEmail,
        phone: cPhone,
        organization: cOrganization,
        activeProject: cActiveProject,
        status: 'active'
      });
      showNotification('Client added successfully');
      setClientModalOpen(false);
      setCName('');
      setCEmail('');
      setCPhone('');
      setCOrganization('');
      setCActiveProject('');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to add client', 'error');
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!window.confirm(`Delete client record for "${name}"?`)) return;
    try {
      await deleteClient(id);
      showNotification('Client deleted');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete client', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: FREELANCER EVALUATION
  // -------------------------------------------------------------
  const handleUpdateApplicantStatus = async (appId: string, status: string) => {
    try {
      await updateFreelancerApplication(appId, { status });
      showNotification(`Applicant marked as ${status.replace('_', ' ').toUpperCase()}`);
      setSelectedApp(null);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update applicant', 'error');
    }
  };

  const handleUpdateRosterRating = async (id: string, rating: number) => {
    try {
      await updateFreelancer(id, { rating });
      showNotification(`Roster rating updated to ${rating} stars`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update rating', 'error');
    }
  };

  const handleUpdateRosterAvailability = async (id: string, availabilityStatus: string) => {
    try {
      await updateFreelancer(id, { availabilityStatus });
      showNotification(`Availability set to ${availabilityStatus}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update availability', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: CORE TEAM
  // -------------------------------------------------------------
  const handleOpenAddTeam = () => {
    setEditingMember(null);
    setTmName('');
    setTmPosition('');
    setTmDepartment('Production');
    setTmBio('');
    setTmPhoto('');
    setTmEmail('');
    setTeamModalOpen(true);
  };

  const handleOpenEditTeam = (m: TeamMember) => {
    setEditingMember(m);
    setTmName(m.fullName);
    setTmPosition(m.position);
    setTmDepartment(m.department);
    setTmBio(m.bio);
    setTmPhoto(m.photoUrl);
    setTmEmail(m.email || '');
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmName || !tmPosition) return;

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, {
          fullName: tmName,
          position: tmPosition,
          department: tmDepartment,
          bio: tmBio,
          photoUrl: tmPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          email: tmEmail
        });
        showNotification('Team member updated');
      } else {
        await createTeamMember({
          fullName: tmName,
          position: tmPosition,
          department: tmDepartment,
          bio: tmBio,
          photoUrl: tmPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          email: tmEmail
        });
        showNotification('New core team member added');
      }
      setTeamModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save team member', 'error');
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from Core Team?`)) return;
    try {
      await deleteTeamMember(id);
      showNotification('Team member removed');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete team member', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: REVIEWS
  // -------------------------------------------------------------
  const handleOpenAddReview = () => {
    setEditingReview(null);
    setRevClientName('');
    setRevDesignation('Client');
    setRevCompany('');
    setRevQuote('');
    setRevRating(5);
    setRevPublished(true);
    setReviewModalOpen(true);
  };

  const handleOpenEditReview = (r: ClientReview) => {
    setEditingReview(r);
    setRevClientName(r.clientName);
    setRevDesignation(r.designation);
    setRevCompany(r.company || '');
    setRevQuote(r.quote);
    setRevRating(r.rating || 5);
    setRevPublished(r.isPublished);
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revClientName || !revQuote) return;

    try {
      if (editingReview) {
        await updateReview(editingReview.id, {
          clientName: revClientName,
          designation: revDesignation,
          company: revCompany,
          quote: revQuote,
          rating: revRating,
          isPublished: revPublished
        });
        showNotification('Review updated (homepage synced)');
      } else {
        await createReview({
          clientName: revClientName,
          designation: revDesignation,
          company: revCompany,
          quote: revQuote,
          rating: revRating,
          isPublished: revPublished
        });
        showNotification('New review published to homepage');
      }
      setReviewModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save review', 'error');
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await deleteReview(id);
      showNotification('Review deleted');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete review', 'error');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: PORTFOLIO
  // -------------------------------------------------------------
  const handleOpenAddPort = () => {
    setEditingPort(null);
    setPortTitle('');
    setPortCategory('Event Coverage');
    setPortClient('');
    setPortDate('');
    setPortDesc('');
    setPortCover('');
    setPortVideo('');
    setPortServices('Event Photography, Cinematic Videography');
    setPortFeatured(false);
    setPortPublished(true);
    setPortModalOpen(true);
  };

  const handleOpenEditPort = (p: PortfolioProject) => {
    setEditingPort(p);
    setPortTitle(p.title);
    setPortCategory(p.category);
    setPortClient(p.clientName || '');
    setPortDate(p.projectDate || '');
    setPortDesc(p.description);
    setPortCover(p.coverImage);
    setPortVideo(p.videoUrl || '');
    setPortServices(p.servicesProvided?.join(', ') || '');
    setPortFeatured(p.isFeatured);
    setPortPublished(p.isPublished);
    setPortModalOpen(true);
  };

  const handleSavePort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portCover || !portDesc) return;

    const servicesProvided = portServices.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingPort) {
        await updatePortfolioProject(editingPort.id, {
          title: portTitle,
          category: portCategory,
          clientName: portClient,
          projectDate: portDate,
          description: portDesc,
          coverImage: portCover,
          videoUrl: portVideo,
          servicesProvided,
          isFeatured: portFeatured,
          isPublished: portPublished
        });
        showNotification('Portfolio work updated');
      } else {
        await createPortfolioProject({
          title: portTitle,
          category: portCategory,
          clientName: portClient,
          projectDate: portDate,
          description: portDesc,
          coverImage: portCover,
          videoUrl: portVideo,
          servicesProvided,
          isFeatured: portFeatured,
          isPublished: portPublished
        });
        showNotification('New work published to main website portfolio');
      }
      setPortModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save portfolio work', 'error');
    }
  };

  const handleDeletePort = async (id: string, title: string) => {
    if (!window.confirm(`Delete portfolio project "${title}"?`)) return;
    try {
      await deletePortfolioProject(id);
      showNotification('Portfolio work deleted');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete portfolio project', 'error');
    }
  };

  // -------------------------------------------------------------
  // Filtered Lists
  // -------------------------------------------------------------
  const filteredAppointments = appointments.filter((apt) => {
    if (aptFilter === 'pending') return apt.status === 'pending' || apt.status === 'new_inquiry';
    if (aptFilter === 'completed') return apt.status === 'completed';
    return true;
  });

  const activeProjectsList = projects.filter((p) => p.status !== 'completed');
  const completedProjectsList = projects.filter((p) => p.status === 'completed');
  const pendingProjectsList = projects.filter((p) => p.progressStage === 'meeting' || p.status === 'planning');

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'pending') return p.progressStage === 'meeting' || p.status === 'planning';
    if (projectFilter === 'active') return p.status !== 'completed';
    if (projectFilter === 'completed') return p.status === 'completed';
    return true;
  });

  const filteredFreelancers = freelancers.filter((fl) => {
    if (flFilterSkill !== 'all' && fl.primarySkill !== flFilterSkill) return false;
    if (flFilterAvailability !== 'all' && fl.availabilityStatus !== flFilterAvailability) return false;
    if (flFilterExp !== 'all' && fl.experienceLevel !== flFilterExp) return false;
    if (flSearch) {
      const q = flSearch.toLowerCase();
      return (
        fl.fullName.toLowerCase().includes(q) ||
        fl.primarySkill.toLowerCase().includes(q) ||
        fl.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calendar Helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const eventsOnSelectedDate = [
    ...appointments
      .filter((a) => a.appointmentDate === selectedCalendarDate)
      .map((a) => ({
        type: 'Appointment',
        title: `${a.clientName} - ${a.purpose || 'Meeting'}`,
        time: a.appointmentTime,
        location: a.location,
        status: a.status
      })),
    ...projects
      .filter((p) => p.deadline === selectedCalendarDate)
      .map((p) => ({
        type: 'Project Deadline',
        title: `${p.projectName} (${p.clientName})`,
        time: 'EOD Deadline',
        location: 'Delivery Due',
        status: p.status
      }))
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-purple/40 selection:text-white">
      {/* Toast Alert */}
      {alertMsg && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold backdrop-blur-md animate-fade-in ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200'
              : 'bg-red-950/90 border-red-600/50 text-red-200'
          }`}
        >
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-dark-900/90 border-b border-purple-900/30 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-electric p-0.5 shadow-glow-subtle flex items-center justify-center">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-neon" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base tracking-wider text-white">
                VISUAL <span className="text-brand-neon">WOXX</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded bg-purple-950 text-brand-neon border border-purple-700/50">
                Admin Center
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              Integrated Operations, Production, Roster & Public CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-950 border border-purple-900/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-200">{user.fullName || 'Admin'}</span>
          </div>

          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-semibold text-red-300 hover:text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 8-Tab Navigation Bar */}
      <div className="bg-dark-900/60 border-b border-purple-900/20 px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appointments'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>2. Appointment</span>
            {appointments.filter((a) => a.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-400 text-dark-950 font-black">
                {appointments.filter((a) => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-brand-neon" />
            <span>3. Project</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-dark-950 text-zinc-400 font-mono">
              {activeProjectsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'clients'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>4. Client</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-dark-950 text-zinc-400 font-mono">
              {clients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('freelancers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'freelancers'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4 text-pink-400" />
            <span>5. Freelancers</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-dark-950 text-zinc-400 font-mono">
              {freelancers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'team'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>6. Core Team</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>7. Review</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-dark-950 text-amber-300 font-mono">
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-brand-purple text-white shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-300" />
            <span>8. Portfolio</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-dark-950 text-zinc-400 font-mono">
              {portfolioProjects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab View Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* ===================================================================
            PAGE 1: DASHBOARD
            1. Count of Active project, Completed Project, No of clients, No of freelancers
            2. Calendar - To see schedule of appointment, meeting, project deadline
            3. Active project Status
           =================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Four Core Counts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => { setActiveTab('projects'); setProjectFilter('active'); }}
                className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 hover:border-purple-600/50 cursor-pointer transition-all card-hover-lift space-y-2"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Projects</span>
                  <FolderKanban className="w-5 h-5 text-brand-neon" />
                </div>
                <div className="text-3xl font-black text-white font-display">
                  {activeProjectsList.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  In progress & review
                </div>
              </div>

              <div
                onClick={() => { setActiveTab('projects'); setProjectFilter('completed'); }}
                className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 hover:border-purple-600/50 cursor-pointer transition-all card-hover-lift space-y-2"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Completed Projects</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white font-display">
                  {completedProjectsList.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Delivered successfully
                </div>
              </div>

              <div
                onClick={() => setActiveTab('clients')}
                className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 hover:border-purple-600/50 cursor-pointer transition-all card-hover-lift space-y-2"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">No. of Clients</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white font-display">
                  {clients.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Brands & organizations
                </div>
              </div>

              <div
                onClick={() => setActiveTab('freelancers')}
                className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 hover:border-purple-600/50 cursor-pointer transition-all card-hover-lift space-y-2"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">No. of Freelancers</span>
                  <UserCheck className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-3xl font-black text-white font-display">
                  {freelancers.length}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Active roster talent
                </div>
              </div>
            </div>

            {/* 2. Interactive Schedule Calendar */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Production & Meeting Calendar
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Track appointments, client meetings, and project delivery deadlines
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                    className="p-1.5 rounded-lg bg-dark-950 border border-purple-900/30 text-zinc-300 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-lg bg-dark-950 border border-purple-900/30">
                    {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                    className="p-1.5 rounded-lg bg-dark-950 border border-purple-900/30 text-zinc-300 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Month Grid */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-bold text-zinc-400 mb-2">
                    <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-16 rounded-xl bg-dark-950/20" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const dayApts = appointments.filter((a) => a.appointmentDate === dateStr);
                      const dayPrjs = projects.filter((p) => p.deadline === dateStr);
                      const isSelected = selectedCalendarDate === dateStr;

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setSelectedCalendarDate(dateStr)}
                          className={`h-16 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-purple-950/60 border-brand-neon shadow-glow-subtle'
                              : 'bg-dark-950/60 border-purple-900/20 hover:border-purple-600/40'
                          }`}
                        >
                          <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-brand-neon' : 'text-zinc-300'}`}>
                            {dayNum}
                          </span>
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            {dayApts.length > 0 && (
                              <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 truncate">
                                📅 {dayApts.length} mtg
                              </span>
                            )}
                            {dayPrjs.length > 0 && (
                              <span className="text-[9px] px-1 rounded bg-pink-950 text-pink-300 truncate">
                                🎯 {dayPrjs.length} due
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Schedule Sidebar */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-purple-900/30 space-y-3">
                  <div className="border-b border-purple-900/30 pb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Schedule for</span>
                    <h4 className="text-sm font-bold text-white font-mono">
                      {selectedCalendarDate}
                    </h4>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {eventsOnSelectedDate.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-8 text-center">
                        No appointments or deadlines on this date.
                      </p>
                    ) : (
                      eventsOnSelectedDate.map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-dark-900 border border-purple-900/30 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                              ev.type === 'Appointment' ? 'bg-cyan-950 text-cyan-300' : 'bg-pink-950 text-pink-300'
                            }`}>
                              {ev.type}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">{ev.time}</span>
                          </div>
                          <p className="font-semibold text-white">{ev.title}</p>
                          {ev.location && (
                            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-500" />
                              {ev.location}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Active Project Status List */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-purple-900/30 space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-brand-neon" />
                  <h3 className="text-base font-bold text-white font-display">
                    Active Project Status Overview ({activeProjectsList.length})
                  </h3>
                </div>
                <button
                  onClick={() => { setActiveTab('projects'); setProjectFilter('active'); }}
                  className="text-xs text-brand-neon hover:underline flex items-center gap-1"
                >
                  <span>Manage All Projects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProjectsList.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-dark-950 border border-purple-900/30 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                          {p.projectType || 'Event'}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1 line-clamp-1">{p.projectName}</h4>
                        <p className="text-xs text-zinc-400">Client: {p.clientName}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ₹{Number(p.totalCost || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar & Milestone */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                        <span className="capitalize">{p.progressStage ? p.progressStage.replace(/_/g, ' ') : 'In Progress'}</span>
                        <span>{p.progressPct || 0}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-brand-purple to-cyan-400 rounded-full transition-all"
                          style={{ width: `${p.progressPct || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-white/5">
                      <span>Deadline: {p.deadline || 'Flexible'}</span>
                      <button
                        onClick={() => { setActiveTab('projects'); handleOpenEditProject(p); }}
                        className="text-brand-neon hover:underline font-semibold"
                      >
                        Update Progress →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 2: APPOINTMENT
            1. Schedule appointment manually (client name, date, time, location, purpose)
            2. Show the pending and completed meetings
            3. Set an option to add notes from meeting while in meeting
           =================================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Discovery & Production Appointments</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Manually schedule discovery meetings, track pending/completed consultations, and log live notes
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-dark-950 p-1 rounded-xl border border-purple-900/30 text-xs">
                  <button
                    onClick={() => setAptFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${aptFilter === 'all' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    All ({appointments.length})
                  </button>
                  <button
                    onClick={() => setAptFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${aptFilter === 'pending' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    Pending ({appointments.filter((a) => a.status === 'pending' || a.status === 'new_inquiry').length})
                  </button>
                  <button
                    onClick={() => setAptFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${aptFilter === 'completed' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    Completed ({appointments.filter((a) => a.status === 'completed').length})
                  </button>
                </div>

                <button
                  onClick={() => setAptModalOpen(true)}
                  className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-subtle"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Manually</span>
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          apt.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                        }`}>
                          {apt.status}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1.5">{apt.clientName}</h4>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-brand-neon block">{apt.appointmentDate}</span>
                        <span className="text-[10px] text-zinc-400">{apt.appointmentTime}</span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-300 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-semibold text-white">{apt.purpose || apt.serviceName || 'General Meeting'}</span>
                      </p>
                      {apt.location && (
                        <p className="flex items-center gap-1.5 text-zinc-400">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{apt.location}</span>
                        </p>
                      )}
                    </div>

                    {apt.meetingNotes && (
                      <div className="p-2.5 rounded-xl bg-dark-950 border border-purple-900/20 text-[11px] text-zinc-300">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Meeting Notes:</span>
                        <p className="line-clamp-2">{apt.meetingNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveMeetingNotesApt(apt);
                        setLiveMeetingNotes(apt.meetingNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{apt.meetingNotes ? 'Edit Notes' : '+ Add Live Notes'}</span>
                    </button>

                    {apt.status !== 'completed' ? (
                      <button
                        onClick={() => handleUpdateAptStatus(apt.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/40 text-xs font-semibold text-emerald-200"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateAptStatus(apt.id, 'pending')}
                        className="px-2.5 py-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-xs text-zinc-400"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 3: PROJECT
            1. Add project (Project Name, type: Event, Product shoot, wedding, branding etc, client name, Project total cost)
            2. Option to edit progress (meeting, event or deadline completed, payment pending, completed)
            3. Showcase pending, active, completed projects
           =================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-brand-neon" />
                  <span>Production Projects & Financials</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Add commissions, track production types, manage milestone progress, and monitor total project values
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-dark-950 p-1 rounded-xl border border-purple-900/30 text-xs">
                  <button
                    onClick={() => setProjectFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${projectFilter === 'all' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    All ({projects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${projectFilter === 'pending' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    Pending ({pendingProjectsList.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('active')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${projectFilter === 'active' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    Active ({activeProjectsList.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg font-semibold ${projectFilter === 'completed' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                  >
                    Completed ({completedProjectsList.length})
                  </button>
                </div>

                <button
                  onClick={handleOpenAddProject}
                  className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-subtle"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                        {p.projectType || 'Event'}
                      </span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        ₹{Number(p.totalCost || 0).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-white">{p.projectName}</h4>
                      <p className="text-xs text-zinc-400">Client: <span className="text-zinc-200 font-semibold">{p.clientName}</span></p>
                    </div>

                    {/* Progress Milestone Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block">Milestone Progress</label>
                      <select
                        value={p.progressStage || 'meeting'}
                        onChange={(e) => handleQuickProgressChange(p, e.target.value)}
                        className="w-full bg-dark-950 border border-purple-900/40 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-neon"
                      >
                        <option value="meeting">1. Initial Meeting (25%)</option>
                        <option value="event_deadline_completed">2. Event / Shoot Completed (75%)</option>
                        <option value="payment_pending">3. Payment Pending (90%)</option>
                        <option value="completed">4. Project Completed (100%)</option>
                      </select>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-dark-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-cyan-400 rounded-full"
                        style={{ width: `${p.progressPct || 25}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>Due: {p.deadline || 'TBD'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProject(p)}
                        className="p-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-purple-900/30"
                        title="Edit Project Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete project "${p.projectName}"?`)) {
                            await deleteProject(p.id);
                            showNotification('Project deleted');
                            loadAllData();
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/40"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 4: CLIENT
            1. Add client (Name, Email, Phone No, Business Name/organization, Active project)
            2. Directory of clients
           =================================================================== */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Client Directory & Brand Accounts</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Manage commercial clients, business organizations, and assigned active commissions
                </p>
              </div>

              <button
                onClick={() => setClientModalOpen(true)}
                className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-subtle self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-base text-white">{c.name}</h4>
                      {c.organization && (
                        <p className="text-xs font-semibold text-brand-neon">{c.organization}</p>
                      )}
                    </div>

                    <div className="text-xs text-zinc-300 space-y-1">
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{c.email}</span>
                      </p>
                      {c.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{c.phone}</span>
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-dark-950 border border-purple-900/30 space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Project</span>
                      <p className="text-xs font-semibold text-cyan-300">
                        {c.activeProject || 'No active project assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteClient(c.id, c.name)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/40"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 5: FREELANCER
            1. Functional filter system (skill, availability, exp, keyword)
            2. Candidate applications pipeline & Active roster
           =================================================================== */}
        {activeTab === 'freelancers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-pink-400" />
                  <span>Freelancer Talent Pool & Recruitment</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Comprehensive filtering system, applicant evaluation pipeline, and active talent ratings
                </p>
              </div>

              <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-purple-900/30 text-xs">
                <button
                  onClick={() => setFlSubTab('roster')}
                  className={`px-3 py-1.5 rounded-lg font-semibold ${flSubTab === 'roster' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                >
                  Active Roster ({freelancers.length})
                </button>
                <button
                  onClick={() => setFlSubTab('applications')}
                  className={`px-3 py-1.5 rounded-lg font-semibold ${flSubTab === 'applications' ? 'bg-brand-purple text-white' : 'text-zinc-400'}`}
                >
                  Applicant Pipeline ({applications.length})
                </button>
              </div>
            </div>

            {/* Functional Multi-Filter System */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Filter className="w-3.5 h-3.5 text-brand-neon" />
                <span>Freelancer Filter System</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, location..."
                    value={flSearch}
                    onChange={(e) => setFlSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-950 border border-purple-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <select
                  value={flFilterSkill}
                  onChange={(e) => setFlFilterSkill(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-dark-950 border border-purple-900/40 text-zinc-200 focus:outline-none focus:border-brand-neon"
                >
                  <option value="all">All Disciplines / Skills</option>
                  <option value="Motion Graphics Designer">Motion Graphics Designer</option>
                  <option value="Videographer">Videographer</option>
                  <option value="Cinematographer">Cinematographer</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Video Editor">Video Editor</option>
                </select>

                <select
                  value={flFilterAvailability}
                  onChange={(e) => setFlFilterAvailability(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-dark-950 border border-purple-900/40 text-zinc-200 focus:outline-none focus:border-brand-neon"
                >
                  <option value="all">All Availability Statuses</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="on_assignment">On Assignment</option>
                </select>

                <select
                  value={flFilterExp}
                  onChange={(e) => setFlFilterExp(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-dark-950 border border-purple-900/40 text-zinc-200 focus:outline-none focus:border-brand-neon"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </div>

            {/* Roster View */}
            {flSubTab === 'roster' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFreelancers.map((fl) => (
                  <div
                    key={fl.id}
                    className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base text-white">{fl.fullName}</h4>
                          <span className="text-xs font-semibold text-brand-neon">{fl.primarySkill}</span>
                          <span className="block text-[11px] text-zinc-500">{fl.location} • {fl.experienceLevel}</span>
                        </div>

                        <select
                          value={fl.availabilityStatus}
                          onChange={(e) => handleUpdateRosterAvailability(fl.id, e.target.value)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                            fl.availabilityStatus === 'available'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="on_assignment">On Assignment</option>
                        </select>
                      </div>

                      {/* Interactive Rating */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                        <span className="text-zinc-400">Roster Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleUpdateRosterRating(fl.id, s)}
                              className={`p-0.5 hover:scale-125 transition-transform ${
                                s <= Math.round(fl.rating || 5) ? 'text-amber-400 fill-current' : 'text-zinc-600'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                          ))}
                          <span className="ml-1 text-[11px] font-mono font-bold text-zinc-300">
                            {fl.rating || 5}.0
                          </span>
                        </div>
                      </div>

                      {fl.portfolioUrl && (
                        <a
                          href={fl.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-cyan-400 hover:underline flex items-center gap-1 pt-1"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>View Portfolio Showcase</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Applications Pipeline View */}
            {flSubTab === 'applications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base text-white">{app.fullName}</h4>
                          <span className="text-xs text-cyan-300">{app.primarySkill} ({app.experienceLevel})</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-950 text-cyan-300 border border-purple-800/40">
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 italic line-clamp-2">
                        “{app.introduction}”
                      </p>

                      <div className="flex items-center gap-3 text-xs">
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-neon hover:underline flex items-center gap-1"
                          >
                            <span>Portfolio</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleUpdateApplicantStatus(app.id, 'approved')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/40 text-xs font-semibold text-emerald-200"
                      >
                        Approve to Roster
                      </button>
                      <button
                        onClick={() => handleUpdateApplicantStatus(app.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/40 text-xs font-semibold text-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PAGE 6: CORE TEAM
            Manage team members displayed dynamically on public website
           =================================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <span>Core Leadership & Creative Leads</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Manage leadership and production committee members displayed in real time on the public About page
                </p>
              </div>

              <button
                onClick={handleOpenAddTeam}
                className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-subtle self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-purple-900/30 space-y-4 hover:border-purple-600/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.photoUrl}
                        alt={m.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-purple-800/40"
                      />
                      <div>
                        <h4 className="font-bold text-base text-white">{m.fullName}</h4>
                        <p className="text-xs font-semibold text-brand-neon">{m.position}</p>
                        <span className="text-[10px] text-zinc-500 font-mono">{m.department}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                      {m.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditTeam(m)}
                      className="p-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-zinc-300 hover:text-white"
                      title="Edit Member"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(m.id, m.fullName)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 7: REVIEW
            Add/edit client reviews that take immediate effect on the main web page
           =================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Client Reviews & Testimonials</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Update client reviews and star ratings which take effect directly on the main website's "What Clients Say" section
                </p>
              </div>

              <button
                onClick={handleOpenAddReview}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-bold flex items-center gap-2 shadow-glow-subtle self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl bg-dark-900 border flex flex-col justify-between transition-all ${
                    r.isPublished ? 'border-purple-900/40' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.isPublished
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {r.isPublished ? 'Live on Homepage' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-200 italic leading-relaxed">
                      “{r.quote}”
                    </p>

                    <div className="pt-2 border-t border-white/5">
                      <h4 className="font-bold text-sm text-white">{r.clientName}</h4>
                      <p className="text-xs text-zinc-400">{r.designation} {r.company && `• ${r.company}`}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditReview(r)}
                      className="px-3 py-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r.id, r.clientName)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 8: PORTFOLIO
            Option to add work into main page
           =================================================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-purple-900/30">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-300" />
                  <span>Main Page Portfolio Case Studies</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Add, feature, and edit creative case studies displayed directly on the public showcase and homepage
                </p>
              </div>

              <button
                onClick={handleOpenAddPort}
                className="btn-electric px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-subtle self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Work to Main Page</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolioProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-dark-900 border border-purple-900/30 overflow-hidden flex flex-col justify-between hover:border-purple-600/50 transition-all card-hover-lift"
                >
                  <div>
                    <div className="relative aspect-video w-full bg-dark-950 overflow-hidden">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-dark-950/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
                          {p.category}
                        </span>
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-purple text-white backdrop-blur-md">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{p.description}</p>
                      {p.clientName && (
                        <p className="text-[11px] text-zinc-500">Client: {p.clientName}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between mt-3 pt-3">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {p.servicesProvided?.join(', ') || 'Custom'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditPort(p)}
                        className="p-1.5 rounded-lg bg-dark-950 hover:bg-zinc-800 border border-purple-900/30 text-zinc-300 hover:text-white"
                        title="Edit Work"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePort(p.id, p.title)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white"
                        title="Delete Work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================
          MODAL: SCHEDULE APPOINTMENT MANUALLY
         =================================================================== */}
      {aptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Schedule Appointment Manually
              </h3>
              <button onClick={() => setAptModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleScheduleAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={aptClientName}
                  onChange={(e) => setAptClientName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={aptLocation}
                  onChange={(e) => setAptLocation(e.target.value)}
                  placeholder="Studio / Client Office / Google Meet"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Purpose</label>
                <input
                  type="text"
                  value={aptPurpose}
                  onChange={(e) => setAptPurpose(e.target.value)}
                  placeholder="e.g. Wedding Shoot Brief / Branding Discovery"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Preliminary Notes</label>
                <textarea
                  rows={2}
                  value={aptNotes}
                  onChange={(e) => setAptNotes(e.target.value)}
                  placeholder="Optional agenda or preparation points..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: LIVE MEETING NOTES WHILE IN MEETING
         =================================================================== */}
      {activeMeetingNotesApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Live Meeting Notes
                </h3>
                <p className="text-xs text-brand-neon font-mono">
                  {activeMeetingNotesApt.clientName} • {activeMeetingNotesApt.appointmentDate} ({activeMeetingNotesApt.appointmentTime})
                </p>
              </div>
              <button onClick={() => setActiveMeetingNotesApt(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2">
              <label className="block text-zinc-400 font-mono text-[10px] uppercase">
                Meeting Takeaways, Requirements & Action Items
              </label>
              <textarea
                rows={8}
                value={liveMeetingNotes}
                onChange={(e) => setLiveMeetingNotes(e.target.value)}
                placeholder="Log discussion points, deliverables agreed upon, gear requirements, pricing discussed..."
                className="w-full p-3.5 rounded-xl bg-dark-950 border border-purple-900/40 text-white text-xs leading-relaxed focus:outline-none focus:border-brand-neon"
              />
            </div>

            <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">
                Auto-saves to database record
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMeetingNotesApt(null)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLiveMeetingNotes}
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Meeting Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD / EDIT PROJECT
         =================================================================== */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h3>
              <button onClick={() => setProjectModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Prism Annual Gala"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Type *</label>
                  <select
                    value={pType}
                    onChange={(e) => setPType(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  >
                    <option value="Event">Event</option>
                    <option value="Product Shoot">Product Shoot</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Branding">Branding</option>
                    <option value="Videography">Videography</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Reels & Social">Reels & Social</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={pClientName}
                    onChange={(e) => setPClientName(e.target.value)}
                    placeholder="e.g. Odyssey Events"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Total Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={pTotalCost}
                    onChange={(e) => setPTotalCost(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="50000"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Progress Milestone</label>
                  <select
                    value={pProgressStage}
                    onChange={(e) => setPProgressStage(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  >
                    <option value="meeting">1. Initial Meeting</option>
                    <option value="event_deadline_completed">2. Event / Shoot Completed</option>
                    <option value="payment_pending">3. Payment Pending</option>
                    <option value="completed">4. Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Deadline</label>
                  <input
                    type="date"
                    value={pDeadline}
                    onChange={(e) => setPDeadline(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Scope of work and deliverables..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD CLIENT
         =================================================================== */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">Add New Client</h3>
              <button onClick={() => setClientModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g. Daniel Reyes"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                  placeholder="daniel@auralabs.com"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    placeholder="+91 98470 11223"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Business / Organization</label>
                  <input
                    type="text"
                    value={cOrganization}
                    onChange={(e) => setCOrganization(e.target.value)}
                    placeholder="Aura Skincare Labs"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Active Project Title</label>
                <input
                  type="text"
                  value={cActiveProject}
                  onChange={(e) => setCActiveProject(e.target.value)}
                  placeholder="e.g. Luxury Skincare Packaging & Campaign"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD / EDIT CORE TEAM MEMBER
         =================================================================== */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setTeamModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={tmName}
                  onChange={(e) => setTmName(e.target.value)}
                  placeholder="e.g. Aravind Menon"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Position / Role *</label>
                  <input
                    type="text"
                    required
                    value={tmPosition}
                    onChange={(e) => setTmPosition(e.target.value)}
                    placeholder="e.g. Founder & Creative Director"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={tmDepartment}
                    onChange={(e) => setTmDepartment(e.target.value)}
                    placeholder="Executive / Production / Creative"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Photo URL</label>
                <input
                  type="url"
                  value={tmPhoto}
                  onChange={(e) => setTmPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={tmBio}
                  onChange={(e) => setTmBio(e.target.value)}
                  placeholder="Bio summary for the public About page..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD / EDIT CLIENT REVIEW
         =================================================================== */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingReview ? 'Edit Client Review' : 'Add Client Review'}
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={revClientName}
                  onChange={(e) => setRevClientName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={revDesignation}
                    onChange={(e) => setRevDesignation(e.target.value)}
                    placeholder="e.g. Event Director"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={revCompany}
                    onChange={(e) => setRevCompany(e.target.value)}
                    placeholder="e.g. Odyssey Events"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Star Rating (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRevRating(s)}
                      className={`p-1 hover:scale-125 transition-transform ${
                        s <= revRating ? 'text-amber-400' : 'text-zinc-600'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="font-mono text-zinc-300 ml-2 font-bold">{revRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Review Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={revQuote}
                  onChange={(e) => setRevQuote(e.target.value)}
                  placeholder="Testimonial quote that will be displayed on the public homepage..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={revPublished}
                    onChange={(e) => setRevPublished(e.target.checked)}
                    className="rounded bg-dark-950 border-purple-900/40 text-brand-neon"
                  />
                  <span className="text-zinc-300">Publish Directly to Homepage "What Clients Say"</span>
                </label>
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: ADD WORK TO MAIN PAGE PORTFOLIO
         =================================================================== */}
      {portModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 border border-purple-800/40 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingPort ? 'Edit Portfolio Work' : 'Add Work to Main Page'}
              </h3>
              <button onClick={() => setPortModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSavePort} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={portTitle}
                    onChange={(e) => setPortTitle(e.target.value)}
                    placeholder="e.g. Neon Odyssey Music Festival"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Category *</label>
                  <select
                    value={portCategory}
                    onChange={(e) => setPortCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  >
                    <option value="Event Coverage">Event Coverage</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Highlight Videos">Highlight Videos</option>
                    <option value="Reels">Reels</option>
                    <option value="Packaging Design">Packaging Design</option>
                    <option value="Product Shoots">Product Shoots</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    value={portClient}
                    onChange={(e) => setPortClient(e.target.value)}
                    placeholder="e.g. Odyssey Events"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Project Date</label>
                  <input
                    type="text"
                    value={portDate}
                    onChange={(e) => setPortDate(e.target.value)}
                    placeholder="e.g. February 2026"
                    className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={portCover}
                  onChange={(e) => setPortCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">4K Video URL (YouTube / Vimeo)</label>
                <input
                  type="text"
                  value={portVideo}
                  onChange={(e) => setPortVideo(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={portDesc}
                  onChange={(e) => setPortDesc(e.target.value)}
                  placeholder="Detailed narrative of project objectives and visual execution..."
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Services Provided (comma-separated)</label>
                <input
                  type="text"
                  value={portServices}
                  onChange={(e) => setPortServices(e.target.value)}
                  placeholder="Event Photography, Cinematic Videography, Highlight Videos"
                  className="w-full bg-dark-950 border border-purple-900/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-neon"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portFeatured}
                    onChange={(e) => setPortFeatured(e.target.checked)}
                    className="rounded bg-dark-950 border-purple-900/40 text-brand-neon"
                  />
                  <span className="text-zinc-300">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portPublished}
                    onChange={(e) => setPortPublished(e.target.checked)}
                    className="rounded bg-dark-950 border-purple-900/40 text-brand-neon"
                  />
                  <span className="text-zinc-300">Published (Visible Publicly)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPortModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-zinc-800 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-electric px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-subtle"
                >
                  {editingPort ? 'Save Changes' : 'Publish to Main Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
