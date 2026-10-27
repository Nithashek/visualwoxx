import React, { useState } from 'react';
import {
  ArrowUpRight, Play, Palette, Camera, Video,
  Film, Smartphone, BookOpen, Layers, Package, Share2,
  Cpu, ChevronRight, Check
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

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Palette,
  Camera,
  Video,
  Film,
  Smartphone,
  BookOpen,
  Layers,
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
    <div className="relative pt-24 pb-16">
      {/* =========================================================
          HERO SECTION
         ========================================================= */}
      <section className="relative min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium tracking-widest uppercase text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>{settings?.tagline || 'Your Vision. Our Visuals.'}</span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08] max-w-5xl mx-auto">
            {settings?.hero_headline || 'WE TURN IDEAS INTO VISUAL EXPERIENCES.'}
          </h1>

          {/* Supporting Narrative */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {settings?.hero_description ||
              'Visual Woxx is your creative partner for design, photography, videography, branding, and complete digital solutions. From the first idea to the final frame, we bring your vision to life.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto btn-electric flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/25 transition-all"
            >
              <span>Explore Our Work</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Studio Showcase Trio */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Event Coverage') || portfolio[0];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                  alt="Concert Cinematography"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block w-fit mb-1.5 border border-white/10">
                    Live Cinematography
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    Neon Odyssey Festival
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1">Multi-cam 4K concert coverage & aftermovie</p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Packaging Design') || portfolio[1];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                  alt="Packaging Design"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block w-fit mb-1.5 border border-white/10">
                    Packaging & 3D
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    Aura Botanicals
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1">Tactile luxury dielines & commercial shoots</p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => {
                  const item = portfolio.find((p) => p.category === 'Videography') || portfolio[2];
                  if (item) onSelectProject(item);
                }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10 cursor-pointer card-hover-lift"
              >
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                  alt="Automotive Commercial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block w-fit mb-1.5 border border-white/10">
                    Commercial Film
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    Apex NextGen EV Launch
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1">Anamorphic automotive film & sound design</p>
                </div>
              </div>
            </div>
          </div>

          {/* Studio Disciplines Strip */}
          <div className="pt-10 border-t border-white/[0.08] max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <span className="text-xs font-mono text-violet-400 block mb-1">01 / PRODUCTION</span>
                <span className="text-sm font-semibold text-white block">Commercial & Video</span>
                <span className="text-xs text-zinc-400 mt-0.5 block">Cinematic 4K edits, aftermovies & reels</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <span className="text-xs font-mono text-violet-400 block mb-1">02 / IDENTITY</span>
                <span className="text-sm font-semibold text-white block">Branding & Graphics</span>
                <span className="text-xs text-zinc-400 mt-0.5 block">Logos, visual systems & event promotions</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <span className="text-xs font-mono text-violet-400 block mb-1">03 / EDITORIAL</span>
                <span className="text-sm font-semibold text-white block">Publications & Print</span>
                <span className="text-xs text-zinc-400 mt-0.5 block">Magazines, brochures & digital invites</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <span className="text-xs font-mono text-violet-400 block mb-1">04 / COMMERCE</span>
                <span className="text-sm font-semibold text-white block">Product & Packaging</span>
                <span className="text-xs text-zinc-400 mt-0.5 block">Studio shoots & tactile packaging design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION C: SHORT COMPANY DESCRIPTION (ONE TEAM, COMPLETE VISION)
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-zinc-900/80 border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
                The Visual Woxx Approach
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-tight">
                All Your Creative Needs. Handled by One Cohesive Team.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {settings?.company_description ||
                  'Visual Woxx is a complete creative digital solutions team that helps brands, businesses, event organizers, and individuals communicate their ideas through impactful visual content.'}
              </p>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Instead of juggling separate freelance designers, disjointed video editors, and uncoordinated event photographers, Visual Woxx aligns your entire visual presence under one roof. Every deliverable—from printed promotional posters to vertical reels and cinematic edits—shares consistent art direction, tone, and quality.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-750 text-white border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
                >
                  <span>Learn About Our Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-violet-400">01</span>
                <h4 className="text-sm font-bold text-white">Consistent Art Direction</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero stylistic disconnect between your photography, video color grades, and graphic collateral.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-violet-400">02</span>
                <h4 className="text-sm font-bold text-white">Production Rigor</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Professional cinema cameras, prime optics, synchronized audio, and calibrated color workflows.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-violet-400">03</span>
                <h4 className="text-sm font-bold text-white">Rapid Turnaround</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Punctual delivery with accelerated post-production sprints for timely social and campaign launches.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <span className="text-xs font-mono text-violet-400">04</span>
                <h4 className="text-sm font-bold text-white">Direct Lead Access</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Clear communication with the creative directors and editors actively executing your project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION D: SERVICES OVERVIEW (12 CREATIVE SERVICES)
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Comprehensive Creative Services
          </h2>
          <p className="text-sm text-zinc-400">
            From strategic branding to immersive event coverage, explore our twelve creative disciplines.
          </p>
        </div>

        {/* 12 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Film;
            return (
              <div
                key={service.id}
                className="group rounded-2xl p-7 bg-zinc-900/70 border border-white/10 card-hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-violet-400 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      #{String(service.display_order).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-violet-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                    {service.short_desc}
                  </p>

                  {/* Sample Deliverables Preview */}
                  <div className="space-y-1.5 mb-6 pt-3 border-t border-white/[0.06]">
                    {service.deliverables.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onNavigate('services', { service: service.slug })}
                    className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium text-center transition-all"
                  >
                    Explore Service
                  </button>
                  <button
                    onClick={() => onOpenBooking(service.title)}
                    className="btn-electric py-2 px-3 rounded-lg text-xs font-bold text-white text-center flex items-center justify-center gap-1"
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
            className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
          >
            <span>View All Detailed Deliverables</span>
            <ChevronRight className="w-4 h-4 text-violet-400" />
          </button>
        </div>
      </section>

      {/* =========================================================
          SECTION E: FEATURED PORTFOLIO
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
              Selected Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Featured Projects
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Curated highlights across live event coverage, commercial video, packaging, and brand identity.
            </p>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="btn-electric self-start md:self-auto px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"
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
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
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
              className="group rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer card-hover-lift flex flex-col justify-between"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {project.category}
                  </span>
                </div>

                {project.videoUrl && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-600/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
                    <span>{project.clientName || 'Studio Project'}</span>
                    <span>{project.projectDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-white">
                  <span>View Project Case Study</span>
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
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            Why Visual Woxx
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Built for High-Standard Production
          </h2>
          <p className="text-sm text-zinc-400">
            Creative distinction, clear communication, and end-to-end execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">01</span>
            <h3 className="text-base font-bold text-white font-display">Complete Creative Solutions</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Everything from event promotions and photography to highlight videos and branding, managed by one creative team without communication gaps.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">02</span>
            <h3 className="text-base font-bold text-white font-display">Creativity That Stands Out</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unique concepts and visually engaging content tailored specifically to each individual event, campaign, and brand identity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">03</span>
            <h3 className="text-base font-bold text-white font-display">One Team, Multiple Skills</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A collaborative team of graphic designers, editors, photographers, videographers, and creative strategists working in unison.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">04</span>
            <h3 className="text-base font-bold text-white font-display">Professional Execution</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organized workflows, clear milestones, punctual delivery schedules, and rigorous attention to detail at every step of production.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">05</span>
            <h3 className="text-base font-bold text-white font-display">Solutions Tailored to You</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Creative services customized according to each client's specific requirements, event scale, and project budget.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 card-hover-lift space-y-3">
            <span className="text-xs font-mono text-violet-400">06</span>
            <h3 className="text-base font-bold text-white font-display">From Concept to Completion</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full support throughout the creative process, from initial discovery, planning, and production to final post-production delivery.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION G: CALL-TO-ACTION SECTION
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-10 sm:p-16 bg-zinc-900 border border-white/10 text-center space-y-6">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            Let's Collaborate
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-white max-w-3xl mx-auto leading-tight">
            LET'S CREATE SOMETHING EXTRAORDINARY.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Have an event, a brand, or an idea that deserves to stand out? Let's bring it to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto btn-electric px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
            >
              <span>Book an Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-white/10 transition-all"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
