import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { Place } from '../types/atlas';
import { Bookmark, ArrowRight } from 'lucide-react';
import { AtlasImage } from './AtlasImage';
import { FlatWorldMap } from './FlatWorldMap';

export const HomeExplorer: React.FC = () => {
  const {
    places,
    openPlaceJournal,
    isPlaceSaved,
    toggleSavePlace,
    setCurrentView,
    homeSettings,
  } = useAtlas();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const curatedPlaces = React.useMemo(() => {
    if (homeSettings.curatedPlaceIds && homeSettings.curatedPlaceIds.length > 0) {
      const selected = homeSettings.curatedPlaceIds
        .map((id) => places.find((p) => p.id === id))
        .filter((p): p is Place => Boolean(p && p.frames && p.frames.length > 0));
      if (selected.length > 0) return selected;
    }
    return places.filter((p) => p.frames && p.frames.length > 0).slice(0, 5);
  }, [places, homeSettings.curatedPlaceIds]);

  return (
    <div className="w-full">
      {/* 1. HERO CANVAS: FULL VIEWPORT INTERACTIVE 2D FLAT WORLD MAP */}
      <section
        id="hero-map"
        className="relative w-full h-[92vh] min-h-[640px] map-canvas overflow-hidden flex items-center justify-center border-b border-[#e2dfd7]"
      >
        <FlatWorldMap
          places={places}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedPlaceId={selectedPinId}
          onSelectPlace={setSelectedPinId}
          onOpenJournal={openPlaceJournal}
          isPlaceSaved={isPlaceSaved}
          onToggleSave={toggleSavePlace}
        />
      </section>

      {/* 2. SEASONAL OFFER & ANNOUNCEMENT BANNER */}
      {homeSettings.offerBannerEnabled && (
        <section className="bg-[#181816] border-b border-[#2d2d27] text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <span className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60023]/25 border border-[#e60023]/40 text-[#ff7082] text-xs font-bold uppercase tracking-wider flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e60023] animate-pulse"></span>
                {homeSettings.offerBannerBadge}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {homeSettings.offerBannerTitle}
                </h3>
                <p className="text-xs text-[#9d9d93] mt-0.5 max-w-2xl leading-normal">
                  {homeSettings.offerBannerDescription}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="self-start md:self-auto inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e60023] hover:bg-[#cc001f] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(230,0,35,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <span>{homeSettings.offerBannerCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. EDITORIAL INTERLUDE: MAGAZINE MANIFESTO */}
      <section
        id="philosophy"
        className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20 flex flex-col md:flex-row items-baseline justify-between gap-8 border-b border-[#e2dfd7]"
      >
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-widest text-[#e60023] font-bold">
            {homeSettings.manifestoTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a18] mt-2 tracking-tight">
            {homeSettings.manifestoTitle}
          </h2>
        </div>
        <div className="max-w-md text-[#71716b] text-sm sm:text-base leading-relaxed font-normal space-y-4">
          <p>{homeSettings.manifestoBody}</p>
          <div>
            <button
              onClick={() => {
                setCurrentView('philosophy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:underline cursor-pointer"
            >
              <span>{homeSettings.manifestoCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION: FRESH FROM THE ROAD (CURATED SELECTION) */}
      <section id="road-strip" className="py-16 sm:py-20 bg-[#f7f6f2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
                <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
                  {homeSettings.curatedBadge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a18] tracking-tight">
                {homeSettings.curatedTitle}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-[#71716b] font-medium">
                {homeSettings.curatedSubtitle}
              </span>
              <div className="w-8 h-[1px] bg-[#e2dfd7]"></div>
            </div>
          </div>

          {/* Grid of Curated Photo Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {curatedPlaces.map((place) => {
              const saved = isPlaceSaved(place.id);
              return (
                <article
                  key={place.id}
                  onClick={() => openPlaceJournal(place.id)}
                  className="group relative rounded-2xl overflow-hidden bg-[#efece6] aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <AtlasImage
                    src={place.thumbnailImage || place.heroImage}
                    placeId={place.id}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Top Tag and Save Icon */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1a1a18] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {place.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavePlace(place.id);
                      }}
                      className={`w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-sm active:scale-90 ${
                        saved
                          ? 'bg-[#e60023] text-white'
                          : 'bg-white/90 text-[#e60023] hover:bg-white'
                      }`}
                      title={saved ? 'Saved' : 'Save to Atlas'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Bottom Label */}
                  <div className="absolute bottom-3.5 inset-x-3.5 text-white z-10">
                    <p className="text-[11px] text-white/70 uppercase tracking-widest font-mono">
                      {place.country} · {place.coordinatesText.split(',')[0]}
                    </p>
                    <h4 className="text-sm font-bold leading-snug line-clamp-1 mt-0.5">
                      {place.frames[0]?.caption || place.oneLineFragment}
                    </h4>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
