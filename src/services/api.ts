import {
  Service, PortfolioProject, TeamMember, Inquiry, Appointment,
  Client, Project, FreelancerApplication, Freelancer,
  ContactMessage, AppNotification, SiteSettings, AdminUser, DashboardStats, ClientReview
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('vw_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/site-settings`);
  return handleResponse<SiteSettings>(res);
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/site-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(settings)
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------
export async function fetchServices(includeInactive = false): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services${includeInactive ? '?all=true' : ''}`);
  return handleResponse<Service[]>(res);
}

export async function createService(serviceData: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(serviceData)
  });
  return handleResponse(res);
}

export async function updateService(id: string, serviceData: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(serviceData)
  });
  return handleResponse(res);
}

export async function deleteService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// PORTFOLIO
// -------------------------------------------------------------
export async function fetchPortfolio(includeUnpublished = false): Promise<PortfolioProject[]> {
  const res = await fetch(`${API_BASE}/portfolio${includeUnpublished ? '?all=true' : ''}`);
  return handleResponse<PortfolioProject[]>(res);
}

export async function createPortfolioProject(projectData: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(projectData)
  });
  return handleResponse(res);
}

export async function updatePortfolioProject(id: string, projectData: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(projectData)
  });
  return handleResponse(res);
}

export async function deletePortfolioProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/portfolio/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// TEAM
// -------------------------------------------------------------
export async function fetchTeam(includeInactive = false): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE}/team${includeInactive ? '?all=true' : ''}`);
  return handleResponse<TeamMember[]>(res);
}

export async function createTeamMember(memberData: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(memberData)
  });
  return handleResponse(res);
}

export async function updateTeamMember(id: string, memberData: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(memberData)
  });
  return handleResponse(res);
}

export async function deleteTeamMember(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/team/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// INQUIRIES & APPOINTMENTS
// -------------------------------------------------------------
export async function submitInquiry(inquiryData: {
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
}): Promise<{ success: boolean; referenceId: string; message: string }> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData)
  });
  return handleResponse(res);
}

export async function fetchInquiries(status?: string): Promise<Inquiry[]> {
  const url = `${API_BASE}/inquiries${status ? `?status=${status}` : ''}`;
  const res = await fetch(url, { headers: getAuthHeader() });
  return handleResponse<Inquiry[]>(res);
}

export async function updateInquiry(id: string, data: { status: string; internalNotes?: string; clientId?: string }): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/inquiries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function convertInquiryToProject(id: string): Promise<{ success: boolean; clientId: string; projectId: string }> {
  const res = await fetch(`${API_BASE}/inquiries/${id}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function fetchAppointments(status?: string): Promise<Appointment[]> {
  const url = `${API_BASE}/appointments${status ? `?status=${status}` : ''}`;
  const res = await fetch(url, { headers: getAuthHeader() });
  return handleResponse<Appointment[]>(res);
}

export async function createAppointment(data: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateAppointment(id: string, data: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteAppointment(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/appointments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// FREELANCERS & APPLICATIONS
// -------------------------------------------------------------
export async function submitFreelancerApplication(appData: any): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/freelancers/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appData)
  });
  return handleResponse(res);
}

export async function fetchFreelancerApplications(filters?: { status?: string; skill?: string; search?: string }): Promise<FreelancerApplication[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.skill) params.append('skill', filters.skill);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE}/freelancers/applications?${params.toString()}`, {
    headers: getAuthHeader()
  });
  return handleResponse<FreelancerApplication[]>(res);
}

export async function updateFreelancerApplication(id: string, data: { status: string; internalNotes?: string }): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/freelancers/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function fetchFreelancers(): Promise<Freelancer[]> {
  const res = await fetch(`${API_BASE}/freelancers`, { headers: getAuthHeader() });
  return handleResponse<Freelancer[]>(res);
}

export async function updateFreelancer(id: string, data: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/freelancers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// CLIENTS
// -------------------------------------------------------------
export async function fetchClients(): Promise<Client[]> {
  const res = await fetch(`${API_BASE}/clients`, { headers: getAuthHeader() });
  return handleResponse<Client[]>(res);
}

export async function createClient(data: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateClient(id: string, data: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteClient(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// PROJECTS & TASKS
// -------------------------------------------------------------
export async function fetchProjects(status?: string, clientId?: string): Promise<Project[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (clientId) params.append('clientId', clientId);

  const res = await fetch(`${API_BASE}/projects?${params.toString()}`, { headers: getAuthHeader() });
  return handleResponse<Project[]>(res);
}

export async function createProject(data: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateProject(id: string, data: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

export async function createProjectTask(projectId: string, taskData: any): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(taskData)
  });
  return handleResponse(res);
}

export async function toggleTaskCompleted(taskId: string, isCompleted: boolean): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ isCompleted })
  });
  return handleResponse(res);
}

export async function deleteTask(taskId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// CONTACT
// -------------------------------------------------------------
export async function submitContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function fetchContactMessages(status?: string, search?: string): Promise<ContactMessage[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/contact?${params.toString()}`, { headers: getAuthHeader() });
  return handleResponse<ContactMessage[]>(res);
}

export async function updateContactMessage(id: string, data: any): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// STATS & DASHBOARD
// -------------------------------------------------------------
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeader() });
  return handleResponse<DashboardStats>(res);
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeader() });
  return handleResponse<AppNotification[]>(res);
}

export async function markNotificationRead(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

export async function fetchActivityLogs(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/activity-logs`, { headers: getAuthHeader() });
  return handleResponse<any[]>(res);
}

// -------------------------------------------------------------
// REVIEWS (CLIENT REVIEWS & TESTIMONIALS)
// -------------------------------------------------------------
export async function fetchReviews(includeUnpublished = false): Promise<ClientReview[]> {
  const res = await fetch(`${API_BASE}/reviews${includeUnpublished ? '?all=true' : ''}`);
  return handleResponse<ClientReview[]>(res);
}

export async function createReview(reviewData: Partial<ClientReview>): Promise<{ id: string; success: boolean }> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(res);
}

export async function updateReview(id: string, reviewData: Partial<ClientReview>): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(res);
}

export async function deleteReview(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleResponse(res);
}

// -------------------------------------------------------------
// AUTH
// -------------------------------------------------------------
export async function loginAdmin(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await handleResponse<{ token: string; user: AdminUser }>(res);
  localStorage.setItem('vw_auth_token', data.token);
  localStorage.setItem('vw_admin_user', JSON.stringify(data.user));
  return data;
}

export async function fetchCurrentUser(): Promise<AdminUser | null> {
  const token = localStorage.getItem('vw_auth_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeader() });
    return await handleResponse<AdminUser>(res);
  } catch {
    localStorage.removeItem('vw_auth_token');
    localStorage.removeItem('vw_admin_user');
    return null;
  }
}

export function logoutAdmin() {
  localStorage.removeItem('vw_auth_token');
  localStorage.removeItem('vw_admin_user');
}
