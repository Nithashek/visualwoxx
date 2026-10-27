import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: (serviceName?: string) => void;
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
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'book', label: 'Book an Appointment' },
    { id: 'join-us', label: 'Join Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/85 backdrop-blur-md border-b border-purple-900/20 py-3 shadow-2xl'
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
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple via-brand-violet to-brand-electric p-0.5 shadow-glow-subtle group-hover:shadow-glow-purple transition-all duration-300">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
                  <path d="M22 28L42 76L52 50L38 28H22Z" fill="#8b5cf6" />
                  <path d="M48 28L68 76L88 28H72L62 54L56 28H48Z" fill="#c084fc" />
                  <circle cx="62" cy="54" r="5" fill="#06b6d4" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white font-display flex items-center gap-1.5">
                VISUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-neon">WOXX</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase -mt-0.5">
                Digital Solutions
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-full border border-purple-500/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple/40 to-brand-violet/40 text-white border border-brand-violet/40 shadow-glow-subtle'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Admin Shortcut */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              title="Admin Portal"
              className="p-2.5 rounded-xl bg-dark-900/80 hover:bg-dark-800 text-slate-400 hover:text-brand-electric border border-purple-900/20 transition-all hover:border-purple-500/40"
            >
              <Shield className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="btn-electric flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-lg bg-dark-900 text-slate-400 hover:text-white border border-purple-900/30"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-900 text-slate-200 hover:text-white border border-purple-900/30 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-dark-950/98 backdrop-blur-2xl border-b border-purple-900/30 p-6 shadow-2xl transition-all">
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
                    ? 'bg-purple-900/30 text-white border border-purple-500/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && <span className="w-2 h-2 rounded-full bg-brand-violet" />}
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-purple-900/20 flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-electric flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
