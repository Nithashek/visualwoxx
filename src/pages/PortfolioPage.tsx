import React, { useState } from 'react';
import { Film, Play, Sparkles, Filter, ArrowUpRight, Calendar, User, Eye } from 'lucide-react';
import { PortfolioProject } from '../types';

interface PortfolioPageProps {
  portfolio: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  onOpenBooking: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  portfolio,
  onSelectProject,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Event Coverage',
    'Graphic Design',
    'Photography',
    'Videography',
    'Reels',
    'Branding',
    'Packaging Design',
    'Product Shoots'
  ];

  const filtered = portfolio.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Ambient background glows */}
      <div className="orb-purple top-20 right-10" />
      <div className="orb-cyan top-96 left-10" />

      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <Film className="w-3.5 h-3.5 text-cyan-300" />
          <span>Visual Archive</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Curated Works & Cinematic Case Studies
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Explore our completed productions across live music fests, luxury packaging, commercial films, and editorial publications.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search projects by keyword, client, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900/90 border border-purple-900/40 rounded-full px-5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-violet"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-purple text-white shadow-glow-purple border border-brand-violet'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-purple-900/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Showcase */}
      <section className="relative z-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-dark-900/50 border border-purple-900/30 max-w-md mx-auto">
            <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative rounded-3xl overflow-hidden bg-dark-900/80 border border-purple-800/30 cursor-pointer card-hover-lift flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-dark-950">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-dark-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-purple-700/40">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-300 bg-yellow-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-yellow-700/50 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {project.videoUrl && (
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-purple/90 backdrop-blur-md flex items-center justify-center text-white shadow-glow-purple">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  )}

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-brand-purple/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="btn-electric px-4 py-2 rounded-full text-xs font-bold text-white shadow-glow-purple flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case Study</span>
                    </span>
                  </div>
                </div>

                {/* Information */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[65%]">
                        <User className="w-3 h-3 text-brand-electric shrink-0" />
                        <span className="truncate">{project.clientName || 'Commercial Partner'}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{project.projectDate}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-display group-hover:text-brand-neon transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Services Tags */}
                  {project.servicesProvided && project.servicesProvided.length > 0 && (
                    <div className="pt-3 border-t border-purple-900/30 flex flex-wrap gap-1.5">
                      {project.servicesProvided.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-dark-950/70 border border-purple-900/30 text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                      {project.servicesProvided.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                          +{project.servicesProvided.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="text-center pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-900/50 border border-purple-900/40 max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold font-display text-white">
            Have a Project You’d Like to See in Our Portfolio?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            From single-day commercial shoots to national festival aftermovies, let's craft something unforgettable.
          </p>
          <button
            onClick={() => onOpenBooking()}
            className="btn-electric px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-2 shadow-glow-purple"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Start Your Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
