import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { JoinUsPage } from './pages/JoinUsPage';
import { ContactPage } from './pages/ContactPage';

// Admin Portal Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminClientsPage } from './pages/admin/AdminClientsPage';
import { AdminFreelancersPage } from './pages/admin/AdminFreelancersPage';
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';

// Types & API
import { Service, PortfolioProject, TeamMember, SiteSettings, AdminUser } from './types';
import {
  fetchSiteSettings, fetchServices, fetchPortfolio,
  fetchTeam, fetchCurrentUser, logoutAdmin
} from './services/api';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Global Data
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalService, setBookingModalService] = useState<string | undefined>(undefined);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioProject | null>(null);

  // Admin Auth & Subsections
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminSection, setAdminSection] = useState<string>('dashboard');

  const reloadAllData = () => {
    fetchSiteSettings().then(setSettings).catch(console.error);
    fetchServices().then(setServices).catch(console.error);
    fetchPortfolio().then(setPortfolio).catch(console.error);
    fetchTeam().then(setTeam).catch(console.error);
  };

  useEffect(() => {
    reloadAllData();
    fetchCurrentUser().then(setAdminUser).catch(console.error);
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceName?: string) => {
    setBookingModalService(serviceName);
    setBookingModalOpen(true);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setAdminSection('dashboard');
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    setCurrentPage('home');
  };

  // If viewing admin portal
  if (currentPage === 'admin') {
    if (!adminUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        currentSection={adminSection}
        onNavigateSection={setAdminSection}
        onLogout={handleLogout}
        onBackToSite={() => handleNavigate('home')}
      >
        {adminSection === 'dashboard' && <AdminDashboardPage onNavigateSection={setAdminSection} />}
        {adminSection === 'inquiries' && <AdminInquiriesPage />}
        {adminSection === 'appointments' && <AdminAppointmentsPage />}
        {adminSection === 'projects' && <AdminProjectsPage />}
        {adminSection === 'clients' && <AdminClientsPage />}
        {adminSection === 'freelancers' && <AdminFreelancersPage />}
        {adminSection === 'portfolio' && <AdminPortfolioPage />}
        {adminSection === 'services' && <AdminServicesPage />}
        {adminSection === 'team' && <AdminTeamPage />}
        {adminSection === 'messages' && <AdminMessagesPage />}
        {adminSection === 'content' && <AdminContentPage onSettingsUpdated={reloadAllData} />}
        {adminSection === 'logs' && <AdminLogsPage />}
      </AdminLayout>
    );
  }

  // Otherwise, render Public Website
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-between selection:bg-brand-purple/40 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Public Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services}
            initialSelectedService={pageParams?.service}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'portfolio' && (
          <PortfolioPage
            portfolio={portfolio}
            onSelectProject={setSelectedPortfolioItem}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'book' && <BookAppointmentPage />}

        {currentPage === 'join-us' && <JoinUsPage />}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
            onOpenBooking={handleOpenBooking}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Global Interactive Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={bookingModalService}
      />

      <ProjectDetailModal
        project={selectedPortfolioItem}
        onClose={() => setSelectedPortfolioItem(null)}
        onOpenBooking={handleOpenBooking}
      />
    </div>
  );
};
