import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight, ChevronRight, ChevronLeft, Star, Quote, CheckCircle2
} from 'lucide-react';
import { SiteSettings, ClientReview } from '../types';
import { fetchReviews } from '../services/api';

interface HomePageProps {
  settings: SiteSettings | null;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: (serviceName?: string) => void;
}

interface ReviewWithBg extends ClientReview {
  bgImage: string;
}

const defaultReviews: ReviewWithBg[] = [
  {
    id: 'rev-1',
    clientName: 'Maya Patel',
    designation: 'Festival Director',
    company: 'Odyssey Events',
    quote: 'Visual Woxx captured our annual festival with cinematic brilliance. Turnaround was incredibly fast and cinema-grade.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    displayOrder: 1,
    createdAt: ''
  },
  {
    id: 'rev-2',
    clientName: 'Daniel Reyes',
    designation: 'Brand Manager',
    company: 'Aura Labs',
    quote: 'They brought our visual identity to life with thoughtful, consistent design across every touchpoint and marketing campaign.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    displayOrder: 2,
    createdAt: ''
  },
  {
    id: 'rev-3',
    clientName: 'Sofia Chen',
    designation: 'Marketing Lead',
    company: 'Apex Automotive',
    quote: 'Professional from the very first brief to final delivery. The campaign visuals felt remarkably cohesive, sharp, and memorable.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    displayOrder: 3,
    createdAt: ''
  },
  {
    id: 'rev-4',
    clientName: 'Aarav Sharma',
    designation: 'Founder & Director',
    company: 'Sunsplash Global',
    quote: 'Their multicam concert coverage and high-energy aftermovie exceeded every expectation. An absolute powerhouse team.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    displayOrder: 4,
    createdAt: ''
  },
  {
    id: 'rev-5',
    clientName: 'Pooja Nair',
    designation: 'Creative Lead',
    company: 'Zeno Brands',
    quote: 'Product commercial videos drove 3x engagement across all our Meta and OTT ad campaigns. Highly recommended.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    displayOrder: 5,
    createdAt: ''
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
}) => {
  const [reviews, setReviews] = useState<ReviewWithBg[]>(defaultReviews);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const touchStartX = useRef<number | null>(null);

  // Fetch reviews dynamically from API
  useEffect(() => {
    fetchReviews()
      .then((data) => {
        if (data && data.length > 0) {
          const bgPool = [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
          ];
          const enriched: ReviewWithBg[] = data.map((r, i) => ({
            ...r,
            bgImage: bgPool[i % bgPool.length]
          }));

          // If less than 4, append default reviews to ensure coverflow effect works smoothly
          if (enriched.length < 4) {
            setReviews([...enriched, ...defaultReviews.slice(enriched.length)]);
          } else {
            setReviews(enriched);
          }
        }
      })
      .catch(() => {
        // Fallback already preset
      });
  }, []);

  // Window resize listener for responsive 3D spacing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay slider every 5s unless hovered
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reviews.length]);

  // Compute 3D Coverflow positioning
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getCardStyle = (index: number): React.CSSProperties => {
    const N = reviews.length;
    let diff = (index - activeIndex + N) % N;
    if (diff > N / 2) diff -= N;

    // Spacing offsets
    const step = isMobile ? 115 : isTablet ? 190 : 250;

    if (diff === 0) {
      return {
        transform: `translateX(0px) scale(${isMobile ? 1.05 : 1.18})`,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
        pointerEvents: 'auto'
      };
    } else if (Math.abs(diff) === 1) {
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${dir * step}px) scale(${isMobile ? 0.85 : 0.9})`,
        zIndex: 20,
        opacity: isMobile ? 0.6 : 0.8,
        filter: 'brightness(0.72)',
        pointerEvents: 'auto'
      };
    } else if (Math.abs(diff) === 2 && !isMobile) {
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${dir * step * 1.75}px) scale(0.76)`,
        zIndex: 10,
        opacity: 0.4,
        filter: 'brightness(0.5)',
        pointerEvents: 'auto'
      };
    } else {
      const dir = diff > 0 ? 1 : -1;
      return {
        transform: `translateX(${dir * (step * 2.2)}px) scale(0.6)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none'
      };
    }
  };

  return (
    <div className="relative pt-24 pb-16">
      {/* =========================================================
          HERO SECTION
         ========================================================= */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-6xl mx-auto text-left space-y-8 relative z-10">
          {/* Main Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08] max-w-5xl">
            {settings?.hero_headline || 'WE TURN IDEAS INTO VISUAL EXPERIENCES.'}
          </h1>

          {/* Supporting Narrative */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-normal">
            {settings?.hero_description ||
              'Visual Woxx is your creative partner for design, photography, videography, branding, and complete digital solutions. From the first idea to the final frame, we bring your vision to life.'}
          </p>

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ea00ff] hover:bg-[#d000e6] text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/25 transition-all"
            >
              <span>Explore Our Work</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Studio Stats */}
          <div className="pt-10 max-w-5xl mx-auto text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-[#ea00ff]">5+</p>
                <p className="text-sm text-zinc-300">Happy Customers</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-[#ea00ff]">10+</p>
                <p className="text-sm text-zinc-300">Completed Projects</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-[#ea00ff]">100+</p>
                <p className="text-sm text-zinc-300">Freelancers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CLIENT REVIEWS COVERFLOW CAROUSEL (3D Active Card Scaled)
         ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest block">
            03 / CLIENT TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            What Clients Say
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Scroll through genuine testimonials from leaders, directors, and brands who trust our productions.
          </p>
        </div>

        {/* 3D Coverflow Container */}
        <div
          className="relative w-full max-w-5xl mx-auto h-[480px] sm:h-[530px] flex items-center justify-center overflow-hidden select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient radial lighting behind active card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-purple/20 blur-3xl rounded-full pointer-events-none" />

          {/* Cards Track */}
          <div className="relative w-full h-full flex items-center justify-center">
            {reviews.map((review, index) => {
              const style = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={review.id}
                  onClick={() => setActiveIndex(index)}
                  style={style}
                  className={`absolute w-[275px] sm:w-[325px] md:w-[360px] h-[390px] sm:h-[440px] rounded-3xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                    isActive
                      ? 'border-2 border-purple-500/80 shadow-[0_20px_60px_rgba(168,85,247,0.35)] ring-1 ring-brand-neon/40'
                      : 'border border-white/10 hover:border-white/30 shadow-2xl'
                  }`}
                >
                  {/* Background Image with Cinematic Overlay */}
                  <img
                    src={review.bgImage}
                    alt={review.clientName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/85 to-black/40 backdrop-blur-[1px]" />

                  {/* Card Content */}
                  <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between">
                    {/* Top Row: Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: review.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current drop-shadow-sm" />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 rounded-full ml-1">
                          5.0
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-neon">
                        <Quote className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Middle: Testimonial Quote */}
                    <div className="space-y-2 my-auto">
                      <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed italic line-clamp-5">
                        “{review.quote}”
                      </p>
                    </div>

                    {/* Bottom: Client Profile */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={review.clientName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-purple-400/60 shadow-md shrink-0"
                        />
                        <div className="truncate flex-1">
                          <h4 className="font-bold text-sm text-white font-display leading-tight truncate">
                            {review.clientName}
                          </h4>
                          <p className="text-xs text-brand-neon font-medium leading-tight truncate">
                            {review.designation}
                          </p>
                          {review.company && (
                            <p className="text-[10px] text-zinc-400 font-mono leading-tight truncate mt-0.5">
                              {review.company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Verified Client
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Production Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous Review"
            className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-dark-900/80 hover:bg-brand-purple border border-purple-500/30 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Review"
            className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-dark-900/80 hover:bg-brand-purple border border-purple-500/30 text-white backdrop-blur-md flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Pagination & Counter */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-2 transition-all rounded-full ${
                  idx === activeIndex
                    ? 'w-8 bg-brand-neon shadow-glow-subtle'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
            {String(activeIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
          </span>
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
