import React, { useState } from 'react';
import { X, Play, Calendar, User, Film, ArrowUpRight, Check, Image as ImageIcon } from 'lucide-react';
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
    { type: 'image', url: project.coverImage, caption: 'Cover Shot' },
    ...(project.gallery?.map((g) => ({ type: g.media_type, url: g.media_url, caption: g.caption || '' })) || [])
  ];

  const currentMedia = allMedia[activeMediaIndex] || allMedia[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-6 text-zinc-100 max-h-[94vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 inline-block mb-1">
              {project.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Media Showcase */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-white/10 shadow-lg flex items-center justify-center">
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
              <div className="w-full h-full relative group">
                <img
                  src={currentMedia.url}
                  alt={currentMedia.caption || project.title}
                  className="w-full h-full object-cover"
                />

                {project.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-violet-600/90 hover:bg-violet-600 flex items-center justify-center text-white transition-transform hover:scale-105"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>
                )}

                {currentMedia.caption && (
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded text-xs text-zinc-300 border border-white/10">
                    {currentMedia.caption}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {allMedia.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allMedia.map((media, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowVideo(false);
                    setActiveMediaIndex(idx);
                  }}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border transition-all ${
                    activeMediaIndex === idx && !showVideo
                      ? 'border-violet-500 scale-105 ring-1 ring-violet-500'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={media.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {project.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border flex flex-col items-center justify-center text-xs text-zinc-300 transition-all ${
                    showVideo
                      ? 'border-violet-500 scale-105 ring-1 ring-violet-500'
                      : 'border-white/10 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4 text-violet-400 mb-0.5" />
                  <span className="text-[10px] font-mono">Video</span>
                </button>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs">
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Client / Partner</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-violet-400" />
                {project.clientName || 'Studio Project'}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Production Date</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-violet-400" />
                {project.projectDate}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Category</span>
              <span className="font-semibold text-white mt-0.5 block">{project.category}</span>
            </div>

            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Deliverables</span>
              <span className="font-semibold text-white mt-0.5 block">
                {project.servicesProvided ? `${project.servicesProvided.length} Services` : 'Full Scope'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Project Overview
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Services Provided */}
          {project.servicesProvided && project.servicesProvided.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Services & Disciplines Provided
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.servicesProvided.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-zinc-800 border border-white/10 text-xs text-zinc-200 flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-violet-400" />
                    <span>{service}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Credits */}
          {project.credits && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs space-y-1">
              <span className="font-mono text-zinc-400 text-[10px] uppercase block">Creative Credits</span>
              <p className="text-zinc-300">{project.credits}</p>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-400 text-center sm:text-left">
            Inspired by this project? Commission a similar visual package.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenBooking(project.category);
              }}
              className="w-full sm:w-auto btn-electric px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5"
            >
              <span>Book Similar Service</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
