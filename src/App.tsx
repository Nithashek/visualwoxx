import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { JoinUsPage } from './pages/JoinUsPage';
import { ContactPage } from './pages/ContactPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminUnifiedPage } from './pages/admin/AdminUnifiedPage';

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
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    try {
      const cached = localStorage.getItem('vw_site_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
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
    fetchSiteSettings().then((data) => {
      setSettings(data);
      if (data) {
        try {
          localStorage.setItem('vw_site_settings', JSON.stringify(data));
        } catch {}
      }
    }).catch(console.error);
    fetchPortfolio().then(setPortfolio).catch(console.error);
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
      <AdminUnifiedPage
        user={adminUser}
        onLogout={() => {
          reloadAllData();
          handleLogout();
        }}
        onBackToSite={() => {
          reloadAllData();
          handleNavigate('home');
        }}
      />
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
