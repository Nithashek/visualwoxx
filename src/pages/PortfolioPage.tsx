import React, { useState } from 'react';
import { Film, Play, ArrowUpRight, Calendar, User, Eye, Search } from 'lucide-react';
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
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Visual Archive
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Selected Works & Production Case Studies
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
          Explore our completed creative engagements across festival cinematography, packaging design, commercial automotive campaigns, and editorial publications.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4" />
            <input
              type="text"
              placeholder="Search projects by keyword, client, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-full pl-11 pr-5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
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
      </section>

      {/* Grid Showcase */}
      <section className="relative z-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-2xl bg-zinc-900 border border-white/10 max-w-md mx-auto">
            <Film className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-zinc-400">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                        Featured
                      </span>
                    )}
                  </div>

                  {project.videoUrl && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-600/90 backdrop-blur-md flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  )}

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full text-xs font-bold text-white bg-zinc-800 border border-white/20 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case Study</span>
                    </span>
                  </div>
                </div>

                {/* Information */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span className="flex items-center gap-1 truncate max-w-[65%]">
                        <User className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">{project.clientName || 'Studio Project'}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>{project.projectDate}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-display group-hover:text-violet-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Services Tags */}
                  {project.servicesProvided && project.servicesProvided.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                      {project.servicesProvided.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-black/60 border border-white/[0.06] text-zinc-400"
                        >
                          {s}
                        </span>
                      ))}
                      {project.servicesProvided.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-zinc-500">
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
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900 border border-white/10 max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold font-display text-white">
            Have a Project You’d Like to Add to Our Portfolio?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            From single-day commercial shoots to festival aftermovies and packaging lines, let's build something unforgettable.
          </p>
          <button
            onClick={() => onOpenBooking()}
            className="btn-electric px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-2"
          >
            <span>Start Your Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
