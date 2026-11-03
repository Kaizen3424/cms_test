import React, { useRef, useEffect, useState, useMemo } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-110m.json';
import { Bookmark, ArrowRight, X } from 'lucide-react';

/**
 * Serializable place data handed over from the static Astro page at build time.
 * Replaces the old `useAtlas()` context: navigation happens with plain links
 * and bookmarking is delegated to the global `src/scripts/favorites.ts`.
 */
export interface WorldMapPlace {
  id: string;
  name: string;
  country: string;
  category: string;
  lat: number;
  lng: number;
  dispatchNumber: number;
  oneLineFragment: string;
  coordinatesText: string;
  heroImage: string;
}

interface WorldMapProps {
  places: WorldMapPlace[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ places }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 600 });

  // Convert TopoJSON to GeoJSON land feature
  const landGeoJson = useMemo(() => {
    return feature(landTopology as any, (landTopology as any).objects.land);
  }, []);

  // Graticules grid
  const graticules = useMemo(() => {
    return geoGraticule().step([30, 30])();
  }, []);

  // Adaptive dimension tracking for all screens (mobile, tablet, desktop)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Close card when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPinId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Adaptive D3 Natural Earth flat planar projection that fits the screen naturally
  const projection = useMemo(() => {
    const scale = Math.min(dimensions.width / 5.8, dimensions.height / 2.9);
    return geoNaturalEarth1()
      .scale(scale)
      .translate([dimensions.width / 2, dimensions.height / 2 + 10]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Filtered places according to selected category
  const filteredPlaces = useMemo(() => {
    if (!activeCategory) return places;
    return places.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [places, activeCategory]);

  // Selected place object (null if no place selected)
  const activePlace = selectedPinId ? places.find((p) => p.id === selectedPinId) || null : null;

  // Calculate pixel coordinates for all pins on the adaptive flat projection
  const pinCoordinates = useMemo(() => {
    return places.map((place) => {
      const coords = projection([place.lng, place.lat]);
      return {
        ...place,
        x: coords ? coords[0] : -9999,
        y: coords ? coords[1] : -9999,
        isMatch: filteredPlaces.some((fp) => fp.id === place.id),
      };
    });
  }, [places, projection, filteredPlaces]);

  const activePinCoords = selectedPinId ? pinCoordinates.find((p) => p.id === selectedPinId) : null;
  const isMobile = dimensions.width < 640;

  // Background click deselects — unless the click landed on a bookmark button,
  // which must keep bubbling to `document` so the global favorites script can
  // handle the toggle.
  const deselect = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-save-place]')) return;
    setSelectedPinId(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={deselect}
      className="relative w-full h-full min-h-[540px] sm:min-h-[640px] map-canvas overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Category Filter Pills (Top Left) - Smooth scrollable on mobile */}
      <div
        className="absolute top-[22px] sm:top-[38px] left-3 sm:left-10 right-3 sm:right-auto z-30 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={`border px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeCategory === null
              ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
              : 'bg-white/90 backdrop-blur-md border-[#e2dfd7] text-[#71716b] hover:text-[#1a1a18] hover:bg-white'
          }`}
        >
          All Expeditions ({places.length})
        </button>
        <button
          onClick={() =>
            setActiveCategory(activeCategory === 'High Altitude' ? null : 'High Altitude')
          }
          className={`border px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeCategory === 'High Altitude'
              ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
              : 'bg-white/90 backdrop-blur-md border-[#e2dfd7] text-[#71716b] hover:text-[#1a1a18] hover:bg-white'
          }`}
        >
          High Altitude
        </button>
        <button
          onClick={() =>
            setActiveCategory(activeCategory === 'Coastlines' ? null : 'Coastlines')
          }
          className={`border px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeCategory === 'Coastlines'
              ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
              : 'bg-white/90 backdrop-blur-md border-[#e2dfd7] text-[#71716b] hover:text-[#1a1a18] hover:bg-white'
          }`}
        >
          Coastlines
        </button>
        <button
          onClick={() =>
            setActiveCategory(activeCategory === 'Quiet Sanctuaries' ? null : 'Quiet Sanctuaries')
          }
          className={`border px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeCategory === 'Quiet Sanctuaries'
              ? 'bg-[#1a1a18] text-white border-[#1a1a18]'
              : 'bg-white/90 backdrop-blur-md border-[#e2dfd7] text-[#71716b] hover:text-[#1a1a18] hover:bg-white'
          }`}
        >
          Quiet Sanctuaries
        </button>
      </div>

      {/* 2. Interactive SVG 2D Flat Planar Projection */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        onClick={() => setSelectedPinId(null)}
        className="w-full h-full block"
        style={{ touchAction: 'pan-y' }}
      >
        <defs>
          <filter id="land-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1a1a18" floodOpacity="0.05" />
          </filter>
        </defs>

        {/* Ocean Background Canvas */}
        <rect width={dimensions.width} height={dimensions.height} fill="#f4f2ea" />

        {/* Latitude / Longitude Graticules */}
        <path
          d={pathGenerator(graticules) || ''}
          fill="none"
          stroke="#e2ded4"
          strokeWidth="0.75"
          strokeDasharray="2,3"
        />

        {/* Continents & Landmass (Natural Earth) */}
        {landGeoJson && (
          <path
            d={pathGenerator(landGeoJson) || ''}
            fill="#e8e5db"
            stroke="#d8d3c5"
            strokeWidth="1.1"
            filter="url(#land-shadow)"
            className="transition-colors duration-500"
          />
        )}

        {/* Equator & Prime Meridian subtle accent lines */}
        <line
          x1="0"
          y1={dimensions.height / 2 + 10}
          x2={dimensions.width}
          y2={dimensions.height / 2 + 10}
          stroke="#ded9cc"
          strokeWidth="0.8"
          strokeDasharray="4,4"
        />
      </svg>

      {/* 3. HTML Pins Layer Placed Exactly on 2D Coordinates */}
      <div className="absolute inset-0 pointer-events-none">
        {pinCoordinates.map((pin) => {
          if (
            pin.x < -100 ||
            pin.x > dimensions.width + 100 ||
            pin.y < -100 ||
            pin.y > dimensions.height + 100
          ) {
            return null;
          }

          const isSelected = selectedPinId === pin.id;

          return (
            <div
              key={pin.id}
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute pointer-events-auto transition-all duration-300 ${
                isSelected ? 'z-40 scale-125' : 'z-20 hover:scale-110'
              } ${pin.isMatch ? 'opacity-100' : 'opacity-25'}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPinId(isSelected ? null : pin.id);
              }}
            >
              {isSelected ? (
                /* Selected Pin with Glowing Pulse Ring */
                <div className="relative flex items-center justify-center cursor-pointer">
                  <div className="absolute w-12 h-12 rounded-full bg-[#e60023]/25 pulse-ring pointer-events-none"></div>
                  <div className="w-6 h-6 rounded-full bg-[#e60023]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#e60023] border-2 border-white shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] flex items-center justify-center ring-4 ring-[#e60023]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Inactive Pin */
                <div
                  className="w-6 h-6 rounded-full bg-[#e60023]/20 flex items-center justify-center transition-transform hover:scale-125 cursor-pointer group"
                  title={`${pin.name}, ${pin.country}`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#e60023] border-2 border-white shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>

                  {/* Tooltip on hover (desktop only) */}
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#1a1a18] text-white text-[11px] rounded-md font-semibold whitespace-nowrap shadow-md pointer-events-none z-30">
                    {pin.name}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 4. FLOATING PLACE CARD: Only renders when user clicks a pin! */}
        {activePlace && (
          <div
            style={
              isMobile
                ? {
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    margin: '0 auto',
                    maxWidth: '340px',
                  }
                : activePinCoords
                ? {
                    left: `${Math.max(160, Math.min(dimensions.width - 160, activePinCoords.x))}px`,
                    top:
                      activePinCoords.y > dimensions.height - 280
                        ? `${activePinCoords.y - 290}px`
                        : `${activePinCoords.y + 14}px`,
                    transform: 'translate(-50%, 0)',
                  }
                : {}
            }
            className={`absolute w-full max-w-[320px] bg-white rounded-2xl p-2.5 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.25)] border border-[#e2dfd7] transition-all duration-300 z-50 text-left pointer-events-auto`}
            onClick={(e) => {
              // Keep the card open on any click, but let bookmark clicks bubble
              // to `document` for the global favorites script.
              if ((e.target as HTMLElement).closest('[data-save-place]')) return;
              e.stopPropagation();
            }}
          >
            {/* Close button (X) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPinId(null);
              }}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white border border-[#e2dfd7] shadow-md flex items-center justify-center text-[#71716b] hover:text-[#1a1a18] hover:bg-[#f4f2ec] transition-colors cursor-pointer z-50"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Card Image */}
            <a
              href={`/place/${activePlace.id}`}
              className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-[#efece6] mb-2.5 cursor-pointer group/img block"
            >
              <img
                src={activePlace.heroImage}
                alt={`${activePlace.name} Landscape`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center transform group-hover/img:scale-105 transition-transform duration-700"
              />
              {/* Overlay badge */}
              <div className="absolute top-2.5 left-2.5 bg-[#1a1a18]/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                Route #{activePlace.dispatchNumber}
              </div>

              {/* Bookmark save button (handled by the global favorites script) */}
              <button
                type="button"
                data-save-place={activePlace.id}
                data-place-name={activePlace.name}
                aria-pressed="false"
                aria-label="Save to your Atlas"
                title="Save Route"
                className="absolute top-2.5 right-2.5 backdrop-blur-sm p-1.5 rounded-full transition-colors cursor-pointer bg-white/90 text-[#e60023] hover:bg-white aria-pressed:bg-[#e60023] aria-pressed:text-white"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </a>

            {/* Card Content */}
            <div className="px-2 pb-1">
              <div className="flex items-center gap-1.5 mb-1 text-[#e60023]">
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                <h3 className="font-bold text-sm sm:text-base text-[#1a1a18] leading-tight tracking-tight">
                  {activePlace.name}, {activePlace.country}
                </h3>
              </div>

              <p className="text-xs text-[#71716b] font-medium italic font-serif-quote tracking-normal mb-2.5 line-clamp-2">
                “{activePlace.oneLineFragment}”
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2dfd7] text-[11px] text-[#71716b]">
                <span className="font-mono">{activePlace.coordinatesText.split('•')[0]}</span>
                <a
                  href={`/place/${activePlace.id}`}
                  className="text-[#e60023] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  View Route Journal
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Map Info Indicator (Bottom Left) */}
      <div
        className="absolute bottom-4 sm:bottom-6 left-3 sm:left-10 z-20 hidden xs:flex items-center gap-2 sm:gap-3 bg-white/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#e2dfd7] text-[11px] sm:text-xs text-[#1a1a18] font-medium shadow-sm pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{places.length} active routes</span>
        <span className="text-[#e2dfd7] hidden sm:inline">|</span>
        <span className="text-[#71716b] hidden sm:inline">Guided & Independent</span>
      </div>
    </div>
  );
};

export default WorldMap;
