export interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  full_desc: string;
  icon_name: string;
  deliverables: string[];
  packages: Array<{ name: string; details: string; price: string }>;
  image_url: string;
  display_order: number;
  isActive: boolean;
}

export interface PortfolioMedia {
  id: string;
  portfolio_project_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  caption?: string;
  display_order: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  clientName?: string;
  projectDate?: string;
  description: string;
  servicesProvided: string[];
  coverImage: string;
  videoUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
  credits: Record<string, string>;
  gallery: PortfolioMedia[];
}

export interface TeamMember {
  id: string;
  fullName: string;
  position: string;
  department: string;
  bio: string;
  photoUrl: string;
  email?: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    behance?: string;
    vimeo?: string;
  };
  joiningDate?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface TeamPosition {
  id: string;
  title: string;
  department: string;
  description?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  services: string[];
  projectTitle: string;
  projectDescription: string;
  eventDate?: string;
  preferredAppointmentDate?: string;
  preferredAppointmentTime?: string;
  budgetRange?: string;
  preferredContactMethod: string;
  status: 'new_inquiry' | 'under_review' | 'awaiting_client_response' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  clientId?: string;
  internalNotes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  inquiryId?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName?: string;
  appointmentDate: string;
  appointmentTime: string;
  location?: string;
  purpose?: string;
  status: 'new_inquiry' | 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | string;
  notes?: string;
  meetingNotes?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  activeProject?: string;
  services_requested?: string;
  project_history?: string;
  notes?: string;
  status: 'active' | 'archived';
  created_at: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface ProjectUpdate {
  id: string;
  type: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
}

export interface Project {
  id: string;
  projectName: string;
  projectType?: string;
  totalCost?: number;
  clientId?: string;
  clientName: string;
  description?: string;
  services: string[];
  assignedTeam: string[];
  assignedFreelancers: string[];
  startDate?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'inquiry_received' | 'planning' | 'in_progress' | 'client_review' | 'revisions' | 'completed' | 'on_hold' | 'cancelled';
  progressStage?: 'meeting' | 'event_deadline_completed' | 'payment_pending' | 'completed' | string;
  progressPct: number;
  internalNotes?: string;
  deliverables: Array<{ title: string; url: string }>;
  tasks: ProjectTask[];
  updates: ProjectUpdate[];
}

export interface FreelancerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  primarySkill: string;
  additionalSkills: string[];
  experienceLevel: string;
  portfolioUrl: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  workingStyle: string;
  availability: string;
  introduction: string;
  resumeUrl?: string;
  status: 'new_application' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected' | 'on_hold';
  internalNotes?: string;
  createdAt: string;
}

export interface Freelancer {
  id: string;
  applicationId?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  primarySkill: string;
  skills: string[];
  experienceLevel?: string;
  portfolioUrl?: string;
  availabilityStatus: 'available' | 'busy' | 'on_leave';
  rating: number;
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  isRead: boolean;
  internalNotes?: string;
  responseNotes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  hero_headline: string;
  hero_description: string;
  company_description: string;
  mission: string;
  vision: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  twitter_url: string;
  behance_url: string;
  footer_text: string;
  [key: string]: string;
}

export interface ClientReview {
  id: string;
  clientName: string;
  designation: string;
  company?: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalClients: number;
  newInquiries: number;
  activeProjects: number;
  completedProjects: number;
  pendingTasks: number;
  upcomingAppointments: number;
  totalFreelancers: number;
  newApplications: number;
  unreadMessages: number;
  totalPortfolio?: number;
  totalReviews?: number;
  recentActivity: Array<{
    id: string;
    action_type: string;
    description: string;
    user_name: string;
    entity_type?: string;
    entity_id?: string;
    created_at: string;
  }>;
  recentInquiries: Array<{
    id: string;
    full_name: string;
    email: string;
    project_title: string;
    status: string;
    created_at: string;
  }>;
  upcomingAppointmentsList: Array<{
    id: string;
    client_name: string;
    client_email: string;
    service_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
  }>;
}
