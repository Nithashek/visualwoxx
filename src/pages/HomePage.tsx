import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight, ChevronRight, Star
} from 'lucide-react';
import { SiteSettings, ClientReview } from '../types';
import { fetchReviews } from '../services/api';

interface HomePageProps {
  settings: SiteSettings | null;
  onNavigate: (page: string, params?: any) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
}) => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(console.error);
  }, []);

  const defaultReviews = [
    {
      id: 'rev_1',
      clientName: 'Maya Patel',
      designation: 'Event Director',
      quote: 'The team captured our event beautifully and delivered polished edits ahead of schedule.',
      rating: 5
    },
    {
      id: 'rev_2',
      clientName: 'Daniel Reyes',
      designation: 'Brand Manager',
      quote: 'They brought our visual identity to life with thoughtful, consistent design across every touchpoint.',
      rating: 5
    },
    {
      id: 'rev_3',
      clientName: 'Sofia Chen',
      designation: 'Marketing Lead',
      quote: 'Professional from the first brief to final delivery. The campaign visuals felt cohesive and memorable.',
      rating: 5
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="relative pt-24 pb-16">
      {/* =========================================================
          HERO SECTION
         ========================================================= */}
      <section className="relative min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-6 pb-16">
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

          {/* Client Reviews */}
          <div className="pt-6 max-w-6xl mx-auto space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">What Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {displayReviews.map((review) => {
                const starCount = review.rating || 5;
                return (
                  <article key={review.id} className="rounded-2xl p-5 bg-zinc-900/70 border border-white/10 space-y-4">
                    <div className="flex items-center gap-1 text-[#ea00ff]" aria-label={`${starCount} out of 5 stars`}>
                      {Array.from({ length: starCount }, (_, index) => (
                        <Star key={index} className="w-4 h-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300">“{review.quote}”</p>
                    <div className="pt-3 border-t border-white/[0.08]">
                      <p className="font-semibold text-white">{review.clientName}</p>
                      <p className="text-xs text-zinc-400">{review.designation}</p>
                    </div>
                  </article>
                );
              })}
            </div>
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
