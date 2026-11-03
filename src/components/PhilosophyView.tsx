import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { ArrowRight } from 'lucide-react';

export const PhilosophyView: React.FC = () => {
  const { setCurrentView, philosophySettings } = useAtlas();

  const handleBackToMap = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="w-full pt-28 sm:pt-36 pb-24 flex-grow bg-[#fbfbf9]">
      {/* 1. Hero Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-6 pb-14 sm:pb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f0eb] border border-[#e4e4dd] text-[11px] font-bold tracking-[0.18em] text-[#707068] uppercase mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
          {philosophySettings.badge}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] text-[#111110] leading-[1.1] max-w-3xl mx-auto mb-5 sm:mb-6 whitespace-pre-line">
          {philosophySettings.heroTitle}
        </h1>

        <p className="text-base sm:text-xl text-[#62625b] font-normal tracking-[-0.01em] max-w-xl mx-auto">
          {philosophySettings.heroSubtitle}
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-12 text-[#c4c4be]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
        </div>
      </section>

      {/* 2. Manifesto Section */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-10 text-[17px] sm:text-[20px] leading-[1.75] text-[#2c2c28] font-normal text-left">
          {philosophySettings.manifestoParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="w-12 h-[1px] bg-[#d8d8d0] mx-auto mt-12 sm:mt-16"></div>
      </section>

      {/* 3. Principles Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#8e8e86] uppercase block">
            Editorial Tenets
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141412] mt-2">
            How We Work
          </h2>
        </div>

        <div className="border-t border-[#e2e2da]">
          {philosophySettings.principles.map((pr) => (
            <div
              key={pr.id}
              className="py-6 sm:py-8 border-b border-[#e2e2da] flex flex-col md:flex-row md:items-baseline justify-between gap-2 sm:gap-3 group"
            >
              <div className="text-lg sm:text-2xl font-bold tracking-tight text-[#141412] flex items-baseline gap-3 sm:gap-4">
                <span className="text-xs font-mono font-semibold text-[#e60023] tracking-widest flex-shrink-0">
                  {pr.num}
                </span>
                <span>{pr.title}</span>
              </div>
              <div className="text-xs sm:text-base text-[#686860] md:max-w-md font-normal leading-relaxed pl-7 sm:pl-0">
                {pr.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Full-Bleed Landscape Photograph Interlude */}
      <section className="w-full my-8 sm:my-12 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[45vh] sm:h-[65vh] min-h-[360px] sm:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
            <img
              src={philosophySettings.interludeImageUrl}
              alt="High-altitude Himalayan valley and mountains at dawn"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

            {/* Subtle corner tag */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-mono tracking-wider max-w-[85%] truncate">
              {philosophySettings.interludeTag}
            </div>

            {/* Bottom Caption Fragment */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 right-4 sm:right-6 flex items-baseline justify-between text-white/90">
              <div className="text-xs sm:text-base font-normal tracking-wide text-white/95 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e60023] flex-shrink-0"></span>
                <span>{philosophySettings.interludeLocation}</span>
              </div>
              <div className="hidden md:block text-xs font-mono text-white/70">
                {philosophySettings.interludeFilmNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pull-Quote Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-24 text-center">
        <div className="py-4 sm:py-6">
          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.035em] text-[#111110] leading-[1.25] max-w-2xl mx-auto font-serif italic">
            {philosophySettings.pullQuote}
          </blockquote>
        </div>
        <div className="w-8 h-[2px] bg-[#e60023] mx-auto mt-4 sm:mt-6"></div>
      </section>

      {/* 6. Closing Section */}
      <section id="closing" className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[#111110] tracking-tight mb-2">
          {philosophySettings.closingHeadline}
        </h3>
        <p className="text-sm sm:text-base text-[#62625b] font-normal mb-8 max-w-md mx-auto">
          {philosophySettings.closingSubtext}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleBackToMap}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-white border border-[#dadad3] text-[#1a1a18] hover:bg-[#f6f6f2] text-xs sm:text-sm font-semibold rounded-full shadow-sm transition cursor-pointer"
          >
            <span>Back to the Map</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#e60023] hover:bg-[#cc001f] text-white text-xs sm:text-sm font-semibold rounded-full shadow hover:shadow-lg transition cursor-pointer"
          >
            <span>Travel with us</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
