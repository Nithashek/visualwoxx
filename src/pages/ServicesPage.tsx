import React, { useState } from 'react';
import {
  Sparkles, CheckCircle, ArrowUpRight, Palette, Camera, Video,
  Film, Smartphone, BookOpen, Layers, Package, Share2, Cpu,
  Calendar, Layers3, ChevronRight, DollarSign
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

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  initialSelectedService,
  onOpenBooking,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSelectedService || 'all');

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter((s) => s.slug === activeTab);

  return (
    <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Ambient background glows */}
      <div className="orb-purple top-20 left-10" />
      <div className="orb-cyan top-96 right-10" />

      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-purple-800/40 text-brand-neon text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Creative Capabilities</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-tight">
          Comprehensive Creative Digital Solutions
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
          From full-edition magazine publication to multi-camera festival cinematography, explore our end-to-end creative disciplines. Custom quotes tailored to your exact scope.
        </p>

        {/* Quick Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-purple text-white shadow-glow-purple border border-brand-violet'
                : 'bg-dark-900 text-slate-400 hover:text-white border border-purple-900/30'
            }`}
          >
            All 12 Services
          </button>
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setActiveTab(srv.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === srv.slug
                  ? 'bg-brand-purple text-white shadow-glow-purple border border-brand-violet'
                  : 'bg-dark-900 text-slate-400 hover:text-white border border-purple-900/30'
              }`}
            >
              {srv.title}
            </button>
          ))}
        </div>
      </section>

      {/* Services Cards / Detailed Breakdown */}
      <section className="space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const IconComp = iconMap[service.icon_name] || Sparkles;
            return (
              <div
                key={service.id}
                id={service.slug}
                className="group relative rounded-3xl overflow-hidden bg-dark-900/80 border border-purple-800/30 card-hover-lift flex flex-col justify-between"
              >
                {/* Visual Cover Preview */}
                <div className="relative aspect-[16/8] overflow-hidden bg-dark-950">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-dark-950/90 backdrop-blur-md border border-purple-700/50 flex items-center justify-center text-brand-neon">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-dark-950/80 px-3 py-1 rounded-full border border-purple-800/40">
                      Service #{service.display_order}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold font-display text-white group-hover:text-brand-neon transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {service.full_desc || service.short_desc}
                    </p>

                    {/* Deliverables List */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                        <span>Included Deliverables</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-dark-950/60 border border-purple-900/20 text-slate-300 text-xs flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-violet shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Packages / Custom Quote */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>Package Options</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.packages.map((pkg, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center font-bold text-white">
                                <span>{pkg.name}</span>
                                <span className="text-brand-neon text-[11px]">{pkg.price || 'Custom Quote'}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{pkg.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 italic">
                      Pricing: Contact us for a custom quote
                    </span>
                    <button
                      onClick={() => onOpenBooking(service.title)}
                      className="btn-electric flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
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
      <section className="relative rounded-3xl p-10 bg-gradient-to-r from-purple-950/80 via-dark-900 to-dark-950 border border-purple-600/40 text-center space-y-5">
        <h3 className="text-2xl font-bold font-display text-white">
          Need a Custom Hybrid Package?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Combining live event photography, highlight films, promotional posters, and social Reels? We assemble tailored bundles with integrated multi-crew management.
        </p>
        <button
          onClick={() => onOpenBooking('Custom Creative Solutions')}
          className="btn-electric px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-2 shadow-glow-purple"
        >
          <span>Request Custom Package Quote</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
