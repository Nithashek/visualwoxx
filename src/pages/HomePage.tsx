import React, { useState } from 'react';
import {
  ArrowUpRight, Sparkles, Play, Palette, Camera, Video,
  Film, Smartphone, BookOpen, Layers, Package, Share2,
  Cpu, CheckCircle2, ChevronRight, Star, ShieldCheck,
  Compass, Zap, Award, Users, Flame
} from 'lucide-react';
import { Service, PortfolioProject, SiteSettings } from '../types';

interface HomePageProps {
  settings: SiteSettings | null;
  services: Service[];
  portfolio: PortfolioProject[];
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: (serviceName?: string) => void;
  onSelectProject: (project: PortfolioProject) => void;
}

// Map icon strings to Lucide components
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Palette,
  Ticket: Sparkles,
  Camera,
  Video,
  Film,
  Smartphone,
  BookOpen,
  Layers,
  Sparkles,
  Package,
  Share2,
  Cpu,
};

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  services,
  portfolio,
  onNavigate,
  onOpenBooking,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Event Coverage',
    'Graphic Design',
    'Photography',
    'Videography',
    'Reels',
    'Packaging Design',
    'Product Shoots',
    'Branding'
  ];

  const filteredPortfolio = selectedCategory === 'All'
    ? portfolio.filter((p) => p.isFeatured || portfolio.indexOf(p) < 6)
    : portfolio.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="orb-purple top-12 left-1/4 -translate-x-1/2" />
      <div className="orb-cyan top-48 right-10" />

      {/* =========================================================
          HERO SECTION
         ========================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-purple-500/30 text-xs font-semibold tracking-wider uppercase text-brand-neon backdrop-blur-md shadow-glow-subtle animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{settings?.tagline || 'Your Vision. Our Visuals.'}</span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            {settings?.hero_headline || 'WE TURN IDEAS INTO VISUAL EXPERIENCES.'}
          </h1>

          {/* Supporting Narrative */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {settings?.hero_description ||
              'Visual Woxx is your creative partner for design, photography, videography, branding, and complete digital solutions. From the first idea to the final frame, we bring your vision to life.'}
          </p>

          {/* Two Prominent Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto btn-electric flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider text-white shadow-glow-purple"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-slate-200 bg-dark-900/90 hover:bg-dark-800 border border-purple-800/40 hover:border-brand-violet transition-all shadow-lg"
            >
              <span>Explore Our Work</span>
              <ChevronRight className="w-4 h-4 text-brand-electric" />
            </button>
          </div>

          {/* Interactive Cinema Showcase Collage Banner */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Festival & Event Cinematography */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Event Coverage') || portfolio[0];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark-900 border border-purple-800/30 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                  alt="Concert Cinematography"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-neon bg-purple-950/80 px-2.5 py-0.5 rounded-full inline-block w-fit mb-1 border border-purple-700/50">
                    Live Cinematography
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Neon Odyssey Festival
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">Multi-cam 4K concert coverage & aftermovie</p>
                </div>
              </div>

              {/* Card 2: Luxury Packaging & Identity */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Packaging Design') || portfolio[1];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark-900 border border-purple-800/30 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                  alt="Packaging Design"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full inline-block w-fit mb-1 border border-cyan-700/50">
                    Packaging & 3D
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Aura Botanicals
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">Tactile luxury dielines & commercial shoots</p>
                </div>
              </div>

              {/* Card 3: Commercial Automotive & Motion */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Videography') || portfolio[2];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark-900 border border-purple-800/30 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                  alt="Automotive Commercial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full inline-block w-fit mb-1 border border-purple-700/50">
                    Commercial Film
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Apex NextGen EV Launch
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">Anamorphic automotive film & sound design</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-purple-900/30 text-center">
            <div className="p-4 rounded-xl bg-dark-900/40 border border-purple-900/20">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">250+</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-wider">Projects Completed</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/40 border border-purple-900/20">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-neon font-display">12</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-wider">Creative Disciplines</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/40 border border-purple-900/20">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">4.2M+</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-wider">Reels & Media Reach</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/40 border border-purple-900/20">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">100%</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-wider">In-House Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION C: SHORT COMPANY DESCRIPTION (ONE TEAM, COMPLETE VISION)
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 border border-purple-700/30 shadow-2xl overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                <span>The Visual Woxx Advantage</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-tight">
                All Your Creative Needs. Handled by One World-Class Team.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {settings?.company_description ||
                  'Visual Woxx is a complete creative digital solutions team that helps brands, businesses, event organizers, and individuals communicate their ideas through impactful visual content.'}
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instead of managing fragmented freelancers, uncoordinated photographers, and disconnected design agencies, Visual Woxx unifies your visual identity across every touchpoint—from printed promotional posters to vertical viral reels and high-end cinema edits.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-white border border-purple-600/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>Learn About Our Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-neon" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-dark-950/80 border border-purple-900/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-900/40 flex items-center justify-center text-brand-neon">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Unified Aesthetic</h4>
                <p className="text-xs text-slate-400">Zero stylistic drift between photos, video grades, and posters.</p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950/80 border border-purple-900/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-900/40 flex items-center justify-center text-cyan-300">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Rapid Turnaround</h4>
                <p className="text-xs text-slate-400">Same-day sneak peeks and accelerated post-production sprints.</p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950/80 border border-purple-900/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-900/40 flex items-center justify-center text-brand-violet">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Cinema Optics</h4>
                <p className="text-xs text-slate-400">Shot on top-tier Sony FX and cinema prime lenses.</p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950/80 border border-purple-900/30 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-900/40 flex items-center justify-center text-brand-neon">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Collaborative Flow</h4>
                <p className="text-xs text-slate-400">Transparent milestone reviews with direct lead access.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION D: SERVICES OVERVIEW (12 CREATIVE SERVICES)
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Full Spectrum Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Comprehensive Creative Services
          </h2>
          <p className="text-sm text-slate-400">
            From strategic branding to immersive festival coverage, explore our twelve specialized creative verticals.
          </p>
        </div>

        {/* 12 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Sparkles;
            return (
              <div
                key={service.id}
                className="group relative rounded-3xl p-7 bg-dark-900/75 border border-purple-900/30 card-hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-800/40 flex items-center justify-center text-brand-neon group-hover:scale-110 group-hover:bg-brand-purple/30 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                      0{service.display_order}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display mb-2 group-hover:text-brand-neon transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {service.short_desc}
                  </p>

                  {/* Sample Deliverables Preview */}
                  <div className="space-y-1.5 mb-6 pt-3 border-t border-purple-900/20">
                    {service.deliverables.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onNavigate('services', { service: service.slug })}
                    className="flex-1 py-2 px-3 rounded-xl bg-dark-950/80 hover:bg-dark-800 text-slate-300 hover:text-white border border-purple-900/40 text-xs font-semibold text-center transition-all"
                  >
                    Explore Service
                  </button>
                  <button
                    onClick={() => onOpenBooking(service.title)}
                    className="btn-electric py-2 px-3 rounded-xl text-xs font-bold text-white text-center flex items-center justify-center gap-1 shadow-glow-subtle"
                  >
                    <span>Book Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('services')}
            className="px-6 py-3 rounded-full bg-dark-900 hover:bg-dark-850 text-white border border-purple-700/40 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
          >
            <span>View Detailed Deliverables & Packages</span>
            <ChevronRight className="w-4 h-4 text-brand-neon" />
          </button>
        </div>
      </section>

      {/* =========================================================
          SECTION E: FEATURED PORTFOLIO
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5 text-cyan-300" />
              <span>Selected Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Featured Case Studies
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Curated highlights showcasing our photographic, cinematic, and brand identity projects.
            </p>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="btn-electric self-start md:self-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 shadow-glow-subtle"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-purple text-white shadow-glow-purple border border-brand-violet'
                    : 'bg-dark-900/80 text-slate-400 hover:text-white border border-purple-900/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group relative rounded-3xl overflow-hidden bg-dark-900 border border-purple-800/30 cursor-pointer card-hover-lift flex flex-col justify-between"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-dark-950">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-dark-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-600/40">
                    {project.category}
                  </span>
                </div>

                {project.videoUrl && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-purple/90 backdrop-blur-md flex items-center justify-center text-white shadow-glow-subtle">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                    <span>{project.clientName || 'Commercial Partner'}</span>
                    <span>{project.projectDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-brand-neon transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between text-xs font-semibold text-brand-electric group-hover:text-white">
                  <span>View Project Details</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION F: WHY CHOOSE VISUAL WOXX? (6 PILLARS)
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>The Value We Deliver</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Why Visionary Clients Choose Us
          </h2>
          <p className="text-sm text-slate-400">
            Built on creative distinction, operational rigor, and seamless cross-disciplinary collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-brand-neon">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">1. Complete Creative Solutions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Everything from event promotions and photography to highlight videos and branding, managed by one creative team without communication gaps.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">2. Creativity That Stands Out</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unique concepts, bespoke color grades, and visually engaging content tailored specifically to elevate each individual brand.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-brand-violet">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">3. One Team, Multiple Skills</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A collaborative committee of designers, DaVinci editors, photographers, videographers, and copy strategists working in unison.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-brand-electric">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">4. Professional Execution</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Organized project pipelines, clear milestones, punctual delivery, and obsessively refined attention to detail at every step.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/40 flex items-center justify-center text-cyan-300">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">5. Solutions Tailored to You</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flexible scopes and creative arrangements adapted to client goals, specific event scales, and varying budgetary requirements.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-8 rounded-3xl bg-dark-900/60 border border-purple-900/30 card-hover-lift space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-brand-neon">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">6. From Concept to Completion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unwavering support across the entire creative lifecycle, from preliminary discovery and shoot logistics to final master distribution.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION G: CALL-TO-ACTION SECTION
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-purple-950/80 via-dark-900 to-dark-950 border border-purple-600/40 shadow-glow-purple text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-electric/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-bold tracking-widest uppercase text-cyan-300 bg-cyan-950/80 px-4 py-1.5 rounded-full border border-cyan-600/40 inline-block">
            Start Your Creative Transformation
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-white max-w-3xl mx-auto leading-tight">
            LET'S CREATE SOMETHING EXTRAORDINARY.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Have an event, a brand, or an idea that deserves to stand out? Let's bring it to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto btn-electric px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider text-white shadow-glow-purple flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Book an Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-slate-200 bg-dark-950/90 hover:bg-dark-900 border border-purple-700/40 hover:border-brand-neon transition-all"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
