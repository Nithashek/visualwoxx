import React, { useState } from 'react';
import { X, Play, Calendar, User, Sparkles, Film, ArrowUpRight, Check, Image as ImageIcon } from 'lucide-react';
import { PortfolioProject } from '../types';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onOpenBooking }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  if (!project) return null;

  const allMedia = [
    { type: 'image', url: project.coverImage, caption: 'Hero Cover Shot' },
    ...(project.gallery?.map((g) => ({ type: g.media_type, url: g.media_url, caption: g.caption || '' })) || [])
  ];

  const currentMedia = allMedia[activeMediaIndex] || allMedia[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-purple-800/40 rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-100 max-h-[94vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-purple-900/30 flex items-center justify-between bg-dark-950/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-neon bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40 inline-block mb-1">
              {project.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-dark-800 hover:bg-dark-750 flex items-center justify-center text-slate-400 hover:text-white border border-purple-900/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Media Showcase */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-purple-900/30 shadow-2xl flex items-center justify-center">
            {showVideo && project.videoUrl ? (
              <div className="w-full h-full relative">
                <iframe
                  src={
                    project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')
                      ? project.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1'
                      : project.videoUrl
                  }
                  title={project.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <>
                <img
                  src={currentMedia.url}
                  alt={currentMedia.caption || project.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {project.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-brand-purple/90 hover:bg-brand-violet text-white flex items-center justify-center shadow-glow-purple transition-all duration-300 hover:scale-110 group"
                  >
                    <Play className="w-7 h-7 fill-white ml-1 group-hover:scale-105 transition-transform" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Media Thumbnails Carousel/Grid */}
          {allMedia.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allMedia.map((media, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMediaIndex(idx);
                    setShowVideo(false);
                  }}
                  className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeMediaIndex === idx && !showVideo
                      ? 'border-brand-violet shadow-glow-subtle scale-105'
                      : 'border-purple-900/40 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={media.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {project.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 bg-dark-950 flex flex-col items-center justify-center text-xs font-semibold gap-1 transition-all ${
                    showVideo
                      ? 'border-brand-neon text-brand-neon'
                      : 'border-purple-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span className="text-[10px]">Watch Cut</span>
                </button>
              )}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Description & Overview */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">
                Project Overview & Execution
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              {/* Services Provided */}
              {project.servicesProvided && project.servicesProvided.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Services Delivered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.servicesProvided.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-slate-200 flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{srv}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata & Credits Sidebar */}
            <div className="space-y-4 p-5 rounded-2xl bg-dark-950/70 border border-purple-900/30">
              <div className="space-y-3 pb-3 border-b border-purple-900/30 text-xs">
                {project.clientName && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Client / Brand</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-brand-electric" />
                      <span>{project.clientName}</span>
                    </span>
                  </div>
                )}

                {project.projectDate && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Project Date</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{project.projectDate}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Creative Credits */}
              {project.credits && Object.keys(project.credits).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-neon block">
                    Creative Credits
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(project.credits).map(([role, name]) => (
                      <div key={role} className="flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">{role}:</span>
                        <span className="text-white font-medium text-right text-[11px]">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking(project.category);
                  }}
                  className="w-full btn-electric flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-glow-subtle"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Request Similar Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
