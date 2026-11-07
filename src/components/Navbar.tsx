import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'join-us', label: 'Freelance' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.08] py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center p-2 text-white">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <path d="M22 28L42 76L52 50L38 28H22Z" fill="#ffffff" />
                <path d="M48 28L68 76L88 28H72L62 54L56 28H48Z" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white font-display">
                VISUAL WOXX
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase -mt-0.5">
                CREATIVE STUDIO
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Admin Shortcut */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              title="Admin Portal"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-[#ea00ff] hover:bg-[#d000e6] text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Book an Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-200 hover:text-white border border-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] bg-zinc-950/98 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  currentPage === link.id
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </button>
            ))}

          </div>
        </div>
      )}
    </header>
  );
};
