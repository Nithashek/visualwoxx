import React, { useState } from 'react';
import {
  ArrowUpRight, Palette, Camera, Video,
  Film, Smartphone, BookOpen, Layers, Package, Share2, Cpu,
  Check
} from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
  initialSelectedService?: string;
  onOpenBooking: (serviceName?: string) => void;
  onNavigate: (page: string) => void;
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

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  initialSelectedService,
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSelectedService || 'all');

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter((s) => s.slug === activeTab);

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
          Creative Capabilities
        </span>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Complete Creative Digital Solutions
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
          From full-edition publications to multi-camera festival cinematography, explore our twelve creative verticals. Custom scopes and transparent deliverables tailored to your goals.
        </p>

        {/* Quick Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            All 12 Disciplines
          </button>
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setActiveTab(srv.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === srv.slug
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {srv.title}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const IconComp = iconMap[service.icon_name] || Film;
            return (
              <div
                key={service.id}
                id={service.slug}
                className="group rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 card-hover-lift flex flex-col justify-between"
              >
                {/* Visual Cover Preview */}
                <div className="relative aspect-[16/8] overflow-hidden bg-black">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-white bg-black/75 px-3 py-1 rounded-full border border-white/10">
                      Service #{String(service.display_order).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold font-display text-white group-hover:text-violet-300 transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {service.full_desc || service.short_desc}
                    </p>

                    {/* Deliverables List */}
                    <div className="pt-2">
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 block">
                        Included Deliverables
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/50 border border-white/[0.06] text-zinc-300 text-xs flex items-center gap-2"
                          >
                            <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Packages / Custom Quote */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 block">
                          Scope & Options
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.packages.map((pkg, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center font-bold text-white">
                                <span>{pkg.name}</span>
                                <span className="text-violet-400 text-xs">{pkg.price || 'Custom Quote'}</span>
                              </div>
                              <p className="text-xs text-zinc-400">{pkg.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                    <span className="text-xs text-zinc-400">
                      Pricing: Contact us for a custom quote
                    </span>
                    <button
                      onClick={() => onOpenBooking(service.title)}
                      className="btn-electric flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shrink-0"
                    >
                      <span>Book This Service</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-Service Package Banner */}
      <section className="rounded-3xl p-10 bg-zinc-900 border border-white/10 text-center space-y-5">
        <h3 className="text-2xl font-bold font-display text-white">
          Need a Custom Multi-Service Package?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Combining event photography, highlight films, promotional posters, and social Reels? We assemble tailored bundles with integrated crew management.
        </p>
        <button
          onClick={() => onOpenBooking('Custom Creative Solutions')}
          className="btn-electric px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-2"
        >
          <span>Request Custom Package Quote</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
