import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';
import { AtlasImage } from './AtlasImage';

export const PlaceJournalView: React.FC = () => {
  const {
    places,
    selectedPlace,
    setCurrentView,
    openPlaceJournal,
    isPlaceSaved,
    toggleSavePlace,
  } = useAtlas();

  const handleBackToMap = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Other places for "More from the map"
  const otherPlaces = places.filter((p) => p.id !== selectedPlace.id).slice(0, 4);

  return (
    <div className="w-full bg-[#fbfbf9] text-[#262622]">
      {/* 1. HERO SECTION: Full Bleed High-Altitude Landscape */}
      <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] overflow-hidden bg-[#161614]">
        {/* Background Image */}
        <AtlasImage
          src={selectedPlace.heroImage}
          placeId={selectedPlace.id}
          alt={selectedPlace.name}
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Subtle Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none"></div>

        {/* Top Left: Subtle Back Link */}
        <div className="absolute top-28 left-6 sm:left-14 z-20">
          <button
            onClick={handleBackToMap}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to the map</span>
          </button>
        </div>

        {/* Hero Content Overlay (Bottom Left) */}
        <div className="absolute bottom-12 sm:bottom-16 left-6 sm:left-14 right-6 sm:right-8 z-20 max-w-4xl">
          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-[11px] font-semibold text-white/90 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
            <span>Dispatch #{selectedPlace.dispatchNumber} • Expedition Record</span>
          </div>

          {/* Map Pin + Place + Country */}
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <svg
              className="w-6 h-6 text-[#e60023] flex-shrink-0 self-center"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
            </svg>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-none">
              {selectedPlace.name}
            </h1>
            <span className="text-2xl sm:text-3xl font-light text-white/75 tracking-tight">
              {selectedPlace.country}
            </span>
          </div>

          {/* One-line Fragment Caption & Coordinates */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-base sm:text-lg font-light font-serif-quote pt-1">
            <span>“{selectedPlace.oneLineFragment}”</span>
            <span className="text-white/40 text-xs font-sans">•</span>
            <span className="font-sans text-xs tracking-wider text-white/70 uppercase">
              {selectedPlace.coordinatesText} • {selectedPlace.subtitle || selectedPlace.category}
            </span>
          </div>
        </div>
      </section>

      {/* 2. FRAGMENT INTRO: Quiet Poetic Lines with Generous Whitespace */}
      <section className="max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-6">
          <span className="h-px w-8 bg-[#dadad3]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
          <span className="h-px w-8 bg-[#dadad3]"></span>
        </div>

        <div className="font-sans text-xl sm:text-2xl md:text-3xl leading-relaxed text-[#262622] font-normal tracking-wide space-y-2">
          {selectedPlace.introLines?.length ? (
            selectedPlace.introLines.map((line, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'text-[#262622]' : idx === 1 ? 'text-[#33332e]' : 'text-[#62625b]'}
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-[#33332e]">{selectedPlace.narrativeStory}</p>
          )}
        </div>

        <div className="mt-8 text-xs uppercase tracking-widest text-[#91918c] font-sans font-medium">
          Field Emulsion Notes • 120 Format Roll Film • Expedition Journal
        </div>
      </section>

      {/* 3. PHOTO ESSAY GRID: Staggered Masonry Collection */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-24 sm:pb-28">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#dadad3]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#262622]">
              Visual Essays & Photographic Log
            </h2>
          </div>
          <span className="text-xs text-[#91918c] font-medium">
            {selectedPlace.frames?.length || 0} medium-format frames
          </span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {selectedPlace.frames?.map((frame, index) => {
            // Determine column span pattern matching original design
            let colSpan = 'md:col-span-6';
            let aspectClass = 'aspect-[4/3]';

            if (index === 0) {
              colSpan = 'md:col-span-7';
              aspectClass = 'aspect-[4/3]';
            } else if (index === 1) {
              colSpan = 'md:col-span-5';
              aspectClass = 'aspect-[3/4]';
            } else if (index === 2) {
              colSpan = 'md:col-span-4';
              aspectClass = 'aspect-[3/4]';
            } else if (index === 3) {
              colSpan = 'md:col-span-8';
              aspectClass = 'aspect-[16/9]';
            } else if (index === 4) {
              colSpan = 'md:col-span-4';
              aspectClass = 'aspect-[3/4]';
            } else if (index === 5) {
              colSpan = 'md:col-span-5';
              aspectClass = 'aspect-[4/3]';
            } else if (index === 6) {
              colSpan = 'md:col-span-3';
              aspectClass = 'aspect-[3/4]';
            }

            return (
              <div key={frame.id} className={`${colSpan} group`}>
                <div
                  className={`relative bg-[#eeeee9] rounded-[24px] overflow-hidden ${aspectClass} shadow-sm border border-[#e5e5e0] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
                >
                  <AtlasImage
                    src={frame.url}
                    placeId={selectedPlace.id}
                    alt={frame.caption}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {frame.locationDetail && (
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white/90 text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
                      {frame.locationDetail}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white/80 font-mono text-[10px] px-2 py-0.5 rounded-full">
                    FRAME 0{index + 1}
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-[#62625b] pl-2 flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      index % 2 === 1 ? 'bg-[#e60023]' : 'bg-[#91918c]'
                    }`}
                  ></span>
                  <span className="font-serif-quote italic text-sm text-[#33332e]">
                    {frame.caption}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. STORY PARAGRAPH: Additional Narrative Dispatch */}
      {selectedPlace.narrativeStory && (
        <section className="max-w-3xl mx-auto px-6 py-12 sm:py-16 border-t border-[#dadad3]/60">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#8e8e86] uppercase block">
              Editorial Notes
            </span>
          </div>
          <div className="prose prose-stone mx-auto text-[#33332e] text-base sm:text-lg leading-relaxed whitespace-pre-line font-serif-quote italic text-center">
            {selectedPlace.narrativeStory}
          </div>
        </section>
      )}

      {/* 5. TRAVEL THIS ROUTE CALLOUT */}
      <section className="max-w-4xl mx-auto px-6 py-8 sm:py-12 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#dadad3] shadow-sm space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#e60023] font-bold">
            Guided Route & Bespoke Departures
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a18] tracking-tight">
            Interested in experiencing {selectedPlace.name}?
          </h3>
          <p className="text-sm text-[#71716b] max-w-lg mx-auto leading-relaxed">
            Our destination specialists arrange small-party logistics, photography guidance, and secluded accommodation across {selectedPlace.country}.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#e60023] hover:bg-[#cc001f] text-white text-xs sm:text-sm font-bold rounded-full shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] transition-all cursor-pointer"
            >
              <span>Travel this route with us</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. MORE FROM THE MAP: 4 Place Cards */}
      <section className="border-t border-[#dadad3]/70 bg-[#f4f4f1]/60 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e60023] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
                <span>Keep Exploring</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#000000]">
                More from the map
              </h3>
            </div>
            <button
              onClick={handleBackToMap}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#262622] hover:text-[#e60023] transition-colors cursor-pointer"
            >
              <span>View global explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => openPlaceJournal(place.id)}
                className="group block bg-white rounded-[20px] p-2.5 border border-[#dadad3]/70 shadow-sm hover:border-[#262622] transition-all hover:shadow-md cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden mb-3 bg-[#e5e5e0]">
                  <AtlasImage
                    src={place.thumbnailImage || place.heroImage}
                    placeId={place.id}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white/90">
                    {place.country} · {place.category}
                  </div>
                </div>
                <div className="px-2 pb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
                    <span className="font-bold text-sm text-[#000000] group-hover:text-[#e60023] transition-colors">
                      {place.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#62625b] font-medium">
                    {place.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
