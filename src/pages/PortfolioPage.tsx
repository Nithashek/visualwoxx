import React, { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Play, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioProject } from '../types';
import { Footer } from '../components/Footer';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('heroEase', '0.22, 1, 0.36, 1');

interface PortfolioPageProps {
  portfolio: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  onOpenBooking: () => void;
  settings?: any;
  onNavigate?: (page: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  portfolio,
  onSelectProject,
  onOpenBooking,
  settings,
  onNavigate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplayProgress, setAutoplayProgress] = useState(0);

  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);

  // GSAP animation refs
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const activeBgRef        = useRef<HTMLDivElement>(null);
  const incomingBgRef      = useRef<HTMLDivElement>(null);
  const textContentRef     = useRef<HTMLDivElement>(null);
  const flyingCardRef      = useRef<HTMLDivElement>(null);   // shared-element overlay
  const progressIntervalRef = useRef<any>(null);

  // Per-card DOM refs for getBoundingClientRect
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ─── Fallback project data ───────────────────────────────────────────────
  const displayProjects: PortfolioProject[] = portfolio.length > 0 ? portfolio : [
    {
      id: 'port_1',
      title: 'Neon Odyssey: Electronic Music Festival',
      slug: 'neon-odyssey-music-festival',
      category: 'Event Coverage',
      clientName: 'Odyssey Events & Live Nation',
      projectDate: 'February 2026',
      description: 'Complete 360° visual coverage and live media command for a 3-day electronic music festival attended by over 25,000 festival-goers. Delivered 4K multi-cam concert coverage, hourly social Reels, and a cinematic master aftermovie.',
      servicesProvided: ['Event Photography', 'Cinematic Videography', 'Highlight Videos', 'Instagram Reels'],
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isFeatured: true, displayOrder: 1, isPublished: true,
      credits: { 'Creative Direction': 'Aravind Menon', 'Lead DP': 'Rohit Balakrishnan' }, gallery: []
    },
    {
      id: 'port_2',
      title: 'Aura Botanicals: Luxury Skincare Packaging',
      slug: 'aura-botanicals-packaging',
      category: 'Packaging Design',
      clientName: 'Aura Skincare Labs',
      projectDate: 'January 2026',
      description: 'Engineered an ultra-minimalist packaging architecture and tactile unboxing experience for an organic luxury skincare line. Utilized custom frosted glass bottle dielines, debossed metallic foil stamping, and photorealistic 3D renders.',
      servicesProvided: ['Packaging Design', 'Graphic Design', 'Product Shoots', 'Branding'],
      coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=85',
      videoUrl: '', isFeatured: true, displayOrder: 2, isPublished: true,
      credits: { 'Design Lead': 'Devanand K' }, gallery: []
    },
    {
      id: 'port_3',
      title: 'Apex Mobility: Autonomous EV Launch Campaign',
      slug: 'apex-mobility-ev-launch',
      category: 'Videography',
      clientName: 'Apex NextGen Automotive',
      projectDate: 'December 2025',
      description: "A cinematic commercial campaign unveiling Apex's flagship electric vehicle. Featuring high-speed precision tracking car shots, anamorphic lens flares, dynamic kinetic UI animations, and immersive sound design.",
      servicesProvided: ['Videography', 'Highlight Videos', 'Custom Creative Solutions'],
      coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isFeatured: true, displayOrder: 3, isPublished: true,
      credits: { 'Director': 'Aravind Menon' }, gallery: []
    },
    {
      id: 'port_4',
      title: 'Vogue Chroma: International Design & Art Annual Zine',
      slug: 'vogue-chroma-magazine',
      category: 'Graphic Design',
      clientName: 'Chroma Visual Publishing',
      projectDate: 'November 2025',
      description: 'Art direction and complete 128-page magazine editorial layout celebrating experimental typography, contemporary photography, and generative media art. Prepress certified for luxury Swiss matte stock printing.',
      servicesProvided: ['Magazine Design', 'Brochures and Digital Publications', 'Graphic Design'],
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=85',
      videoUrl: '', isFeatured: true, displayOrder: 4, isPublished: true,
      credits: { 'Art Director': 'Devanand K' }, gallery: []
    },
    {
      id: 'port_5',
      title: 'Kinetix Watches: Micro-Macro Horology Studio',
      slug: 'kinetix-luxury-watch-shoot',
      category: 'Product Shoots',
      clientName: 'Kinetix Horology Geneva',
      projectDate: 'October 2025',
      description: 'Precision studio product photography showcasing hand-assembled tourbillon mechanisms. Utilized focus-stacking macro optics, motorized light painting, and zero-gravity reflection staging.',
      servicesProvided: ['Product Shoots', 'Commercial Photography', 'Digital Retouching'],
      coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
      videoUrl: '', isFeatured: false, displayOrder: 5, isPublished: true,
      credits: { 'Photographer': 'Siddharth Varma' }, gallery: []
    },
    {
      id: 'port_6',
      title: 'Global Tech Confluence: 2025 Identity & Stage Visuals',
      slug: 'global-tech-confluence-branding',
      category: 'Event Coverage',
      clientName: 'GTC Ventures',
      projectDate: 'September 2025',
      description: 'Comprehensive identity architecture, multi-format event posters, and 4K ultra-wide curved LED stage backdrops for a premier artificial intelligence conference attended by 5,000 delegates.',
      servicesProvided: ['Event Posters and Branding', 'Graphic Design', 'Highlight Videos'],
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=85',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isFeatured: false, displayOrder: 6, isPublished: true,
      credits: { 'Creative Director': 'Aravind Menon' }, gallery: []
    }
  ];

  const activeProjects = displayProjects;
  const safeIndex     = activeProjects.length > 0 ? currentIndex % activeProjects.length : 0;
  const currentProject = activeProjects[safeIndex];

  const activeProjectsRef = useRef(activeProjects);
  useEffect(() => { activeProjectsRef.current = activeProjects; }, [activeProjects]);

  // Keep cardRefs array sized correctly
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, activeProjects.length);
  }, [activeProjects.length]);

  // ─── Title helper ────────────────────────────────────────────────────────
  const getSplitTitle = (title: string) => {
    const parts = title.split(':');
    if (parts.length > 1) return { line1: parts[0].trim().toUpperCase(), line2: parts.slice(1).join(':').trim().toUpperCase() };
    const words = title.split(' ');
    if (words.length <= 2) return { line1: words[0]?.toUpperCase() || '', line2: words[1]?.toUpperCase() || '' };
    const mid = Math.ceil(words.length / 2);
    return { line1: words.slice(0, mid).join(' ').toUpperCase(), line2: words.slice(mid).join(' ').toUpperCase() };
  };

  // ─── Coordinated upward text entrance animation ─────────────────────────
  const animateTextIn = () => {
    if (!textContentRef.current) return;
    gsap.fromTo(
      textContentRef.current.children,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.62,
        stagger: 0.025,
        ease: 'heroEase',
        delay: 0.04
      }
    );
  };

  const transitionText = (normalizedIndex: number) => {
    if (!textContentRef.current) {
      flushSync(() => {
        setCurrentIndex(normalizedIndex);
      });
      return;
    }

    gsap.killTweensOf(textContentRef.current.children);
    gsap.to(textContentRef.current.children, {
      y: -24,
      opacity: 0,
      duration: 0.16,
      stagger: 0.015,
      ease: 'power2.in',
      onComplete: () => {
        flushSync(() => {
          setCurrentIndex(normalizedIndex);
        });
        animateTextIn();
      }
    });
  };

  // ─── Standard slide transition (arrows / autoplay) ───────────────────────
  const goToSlide = useCallback((nextIndex: number, direction: 'next' | 'prev' = 'next') => {
    const list = activeProjectsRef.current;
    if (list.length === 0) return;
    const normalizedIndex = ((nextIndex % list.length) + list.length) % list.length;
    if (normalizedIndex === currentIndexRef.current || isTransitioningRef.current) return;

    setIsTransitioning(true);
    setAutoplayProgress(0);

    const nextProject = list[normalizedIndex];

    if (incomingBgRef.current && activeBgRef.current) {
      gsap.killTweensOf([incomingBgRef.current, activeBgRef.current]);

      gsap.set(incomingBgRef.current, {
        backgroundImage: `url(${nextProject.coverImage})`,
        opacity: 0,
        zIndex: 10
      });

      // 1. Trigger synchronized text animation immediately at t = 0
      transitionText(normalizedIndex);

      // 2. Trigger concurrent background zoom transition
      gsap.to(incomingBgRef.current, {
        opacity: 1,
        duration: 0.95,
        ease: 'heroEase',
        onComplete: () => {
          if (activeBgRef.current) {
            activeBgRef.current.style.backgroundImage = `url(${nextProject.coverImage})`;
          }
          gsap.set(incomingBgRef.current, { opacity: 0 });
          setIsTransitioning(false);
        }
      });
    } else {
      flushSync(() => {
        setCurrentIndex(normalizedIndex);
      });
      setIsTransitioning(false);
    }
  }, []);

  // ─── Card click ──────────────────────────────────────────────────────────
  const goToSlideFromCard = useCallback((nextIndex: number, cardEl: HTMLDivElement | null) => {
    const list = activeProjectsRef.current;
    if (list.length === 0) return;
    const normalizedIndex = ((nextIndex % list.length) + list.length) % list.length;
    if (normalizedIndex === currentIndexRef.current || isTransitioningRef.current) return;

    goToSlide(normalizedIndex);
  }, [goToSlide]);

  // ─── Arrow handlers ──────────────────────────────────────────────────────
  const handleNext = () => {
    if (isTransitioningRef.current) return;
    const list = activeProjectsRef.current;
    goToSlide((currentIndexRef.current + 1) % list.length, 'next');
  };

  const handlePrev = () => {
    if (isTransitioningRef.current) return;
    const list = activeProjectsRef.current;
    goToSlide((currentIndexRef.current - 1 + list.length) % list.length, 'prev');
  };

  // ─── Autoplay loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const intervalTime  = 50;
    const totalDuration = 6000;
    const increment     = (intervalTime / totalDuration) * 100;

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      setAutoplayProgress((prev) => {
        if (prev >= 100) {
          if (!isTransitioningRef.current) {
            const list = activeProjectsRef.current;
            if (list.length > 0) goToSlide((currentIndexRef.current + 1) % list.length, 'next');
          }
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [goToSlide]);

  const splitTitle = getSplitTitle(currentProject.title);

  return (
    <div className="relative text-white bg-dark-950 select-none">

      {/* ================================================================ */}
      {/* INTERACTIVE SHOWCASE                                              */}
      {/* ================================================================ */}
      <div
        ref={sliderContainerRef}
        className="relative w-full h-screen min-h-[750px] overflow-hidden flex flex-col justify-between"
      >
        {/* ── Flying card overlay (shared-element) ── */}
        <div
          ref={flyingCardRef}
          className="pointer-events-none"
          style={{ display: 'none', position: 'fixed', zIndex: 60, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Active fullscreen background */}
        <div
          ref={activeBgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentProject.coverImage})` }}
        />

        {/* Incoming transition background (arrow / autoplay) */}
        <div
          ref={incomingBgRef}
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-0"
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/75 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-dark-950/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(234,0,255,0.22)_0%,transparent_65%)] pointer-events-none z-10" />

        {/* ── Main text block ── */}
        <div
          ref={textContentRef}
          className="relative z-20 max-w-2xl px-6 sm:px-16 pt-32 sm:pt-36 space-y-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-[3px] rounded-full bg-brand-neon shadow-glow-purple shrink-0" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-brand-neon font-bold truncate">
              {currentProject.category} • {currentProject.clientName || 'Visual Woxx Exclusive'}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08] drop-shadow-2xl">
              {splitTitle.line1}
            </h1>
            {splitTitle.line2 && (
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white/85 leading-[1.12] drop-shadow-xl">
                {splitTitle.line2}
              </h2>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-lg pt-1 line-clamp-3 sm:line-clamp-4 backdrop-blur-[1px]">
            {currentProject.description}
          </p>

          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => onSelectProject(currentProject)}
              className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-brand-neon hover:border-brand-neon text-white border border-white/20 backdrop-blur-xl transition-all shadow-lg hover:shadow-glow-purple flex items-center gap-2 group"
            >
              <span>View Case Study</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            {currentProject.videoUrl && (
              <button
                onClick={() => onSelectProject(currentProject)}
                className="w-11 h-11 rounded-full bg-brand-neon/20 hover:bg-brand-neon border border-brand-neon/50 text-white flex items-center justify-center transition-all shadow-glow-purple"
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Preview Cards — right half, vertically centered ── */}
        <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 z-20 flex items-center gap-3 pl-4 pr-6 sm:pr-10 overflow-hidden pointer-events-auto">
          {activeProjects.map((project, idx) => {
            const isActive   = idx === currentIndex;
            const splitPTitle = getSplitTitle(project.title);
            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onClick={() => goToSlideFromCard(idx, cardRefs.current[idx])}
                className={`relative shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out group ${
                  isActive
                    ? 'w-40 sm:w-44 h-56 sm:h-60 shadow-glow-purple'
                    : 'w-28 sm:w-32 h-40 sm:h-44 opacity-60 hover:opacity-90'
                }`}
                style={
                  isActive
                    ? {
                        border: '2px solid transparent',
                        backgroundImage: `url(${project.coverImage}), linear-gradient(135deg,#ea00ff,#7c3aed,#ea00ff)`,
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                      }
                    : { border: '2px solid rgba(255,255,255,0.12)' }
                }
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <p className="text-xs font-bold font-display text-white line-clamp-2 group-hover:text-brand-neon transition-colors leading-tight">
                    {splitPTitle.line1}
                  </p>
                  <p className="text-[10px] text-zinc-300 font-sans line-clamp-1 opacity-80 mt-0.5">
                    {project.clientName || 'Visual Woxx'}
                  </p>
                </div>

                {/* Neon autoplay progress bar on active card */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-brand-neon shadow-glow-purple transition-all duration-100 ease-linear"
                      style={{ width: `${autoplayProgress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom navigation ── */}
        <div className="relative z-20 w-full px-6 sm:px-16 pb-10 flex items-end pointer-events-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full border border-white/20 bg-dark-900/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-neon hover:border-brand-neon transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full border border-white/20 bg-dark-900/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-neon hover:border-brand-neon transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 sm:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-neon shadow-glow-purple transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / activeProjects.length) * 100}%` }}
                />
              </div>
              <div className="text-sm font-mono tracking-widest text-zinc-400">
                <span className="text-white font-bold text-base">0{currentIndex + 1}</span>
                <span className="mx-1 text-white/30">/</span>
                <span>0{activeProjects.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={onNavigate || (() => {})}
        onOpenBooking={onOpenBooking}
      />
    </div>
  );
};
