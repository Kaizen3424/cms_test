import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-110m.json';
import { Place } from '../types/atlas';
import { AtlasImage } from './AtlasImage';
import { Bookmark, ArrowRight, Compass, Play, Pause } from 'lucide-react';

interface FlatGlobeProps {
  places: Place[];
  filteredPlaces: Place[];
  selectedPlaceId: string;
  onSelectPlace: (id: string) => void;
  onOpenJournal: (id: string) => void;
  isPlaceSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  zoomLevel: number;
}

export const FlatGlobe: React.FC<FlatGlobeProps> = ({
  places,
  filteredPlaces,
  selectedPlaceId,
  onSelectPlace,
  onOpenJournal,
  isPlaceSaved,
  onToggleSave,
  zoomLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [rotation, setRotation] = useState<[number, number]>([-77.5, -28]); // Centered near Ladakh / India initially
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; rot: [number, number] }>({
    x: 0,
    y: 0,
    rot: [-77.5, -28],
  });
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Convert TopoJSON to GeoJSON land feature
  const landGeoJson = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return feature(landTopology as any, (landTopology as any).objects.land);
  }, []);

  // Responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 900,
          height: clientHeight || 600,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When selectedPlaceId changes, smoothly rotate globe to center on it
  useEffect(() => {
    const targetPlace = places.find((p) => p.id === selectedPlaceId);
    if (targetPlace) {
      // For orthographic projection, center on (lng, lat) means rotate to (-lng, -lat)
      const targetRotation: [number, number] = [-targetPlace.lng, -targetPlace.lat * 0.75];
      setRotation(targetRotation);
    }
  }, [selectedPlaceId, places]);

  // Optional auto-rotation
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotation(([r0, r1]) => [(r0 - 0.25) % 360, r1]);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  const radius = Math.min(dimensions.width, dimensions.height) * 0.42 * zoomLevel;

  // D3 Orthographic Projection (Mathematical 2D Flat Globe)
  const projection = useMemo(() => {
    return geoOrthographic()
      .scale(radius)
      .translate([dimensions.width / 2, dimensions.height / 2])
      .rotate([rotation[0], rotation[1], 0])
      .clipAngle(90);
  }, [dimensions, radius, rotation]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  const graticuleLines = useMemo(() => {
    return geoGraticule().step([30, 30])();
  }, []);

  // Mouse / Touch Drag handlers to spin the 2D globe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rot: [...rotation] as [number, number],
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    // Scale drag sensitivity
    const sensitivity = 70 / radius;
    const nextR0 = (dragStart.rot[0] + dx * sensitivity) % 360;
    const nextR1 = Math.max(-80, Math.min(80, dragStart.rot[1] - dy * sensitivity));
    setRotation([nextR0, nextR1]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rot: [...rotation] as [number, number],
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    const sensitivity = 70 / radius;
    const nextR0 = (dragStart.rot[0] + dx * sensitivity) % 360;
    const nextR1 = Math.max(-80, Math.min(80, dragStart.rot[1] - dy * sensitivity));
    setRotation([nextR0, nextR1]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick preset centers
  const handleCenterPreset = (lng: number, lat: number) => {
    setRotation([-lng, -lat * 0.75]);
  };

  // Selected place object
  const activePlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  // Calculate pin positions and front-hemisphere visibility
  const projectedPins = useMemo(() => {
    const centerLng = -rotation[0];
    const centerLat = -rotation[1];

    return places.map((place) => {
      // Angular distance from globe center point (radians)
      const dist = geoDistance([place.lng, place.lat], [centerLng, centerLat]);
      const isVisible = dist < Math.PI / 2; // on front visible hemisphere
      const coords = projection([place.lng, place.lat]);

      return {
        ...place,
        isVisible,
        dist,
        x: coords ? coords[0] : null,
        y: coords ? coords[1] : null,
        isMatch: filteredPlaces.some((fp) => fp.id === place.id),
      };
    });
  }, [places, rotation, projection, filteredPlaces]);

  const activeProjectedPin = projectedPins.find((p) => p.id === selectedPlaceId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full flex items-center justify-center select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* SVG Canvas for Flat 2D Globe */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible pointer-events-none"
      >
        <defs>
          {/* Globe disk background gradient (Cream/Warm Paper Cartography) */}
          <radialGradient id="globe-ocean" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#fbf9f4" />
            <stop offset="70%" stopColor="#f1eee5" />
            <stop offset="100%" stopColor="#e5e0d4" />
          </radialGradient>

          {/* Atmosphere rim shading */}
          <radialGradient id="globe-shading" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="transparent" stopOpacity="0" />
            <stop offset="95%" stopColor="#3d3a33" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1a1a18" stopOpacity="0.22" />
          </radialGradient>

          {/* Soft drop shadow behind the 2D globe disk */}
          <filter id="globe-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="28" floodColor="#1a1a18" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Globe Base Disk (Ocean Surface) */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={radius}
          fill="url(#globe-ocean)"
          stroke="#d2cdc0"
          strokeWidth="1.5"
          filter="url(#globe-shadow)"
        />

        {/* 2. Cartographic Graticules (Latitude & Longitude grid lines) */}
        <g stroke="#dedad0" strokeWidth="0.8" strokeDasharray="3 4" fill="none">
          <path d={pathGenerator(graticuleLines) || ''} />
        </g>

        {/* 3. Real Continents & Landmasses */}
        <g fill="#e3ded2" stroke="#cec8b8" strokeWidth="1">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <path d={pathGenerator(landGeoJson as any) || ''} />
        </g>

        {/* 4. Horizon Rim Shading & Outer Border Ring */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={radius}
          fill="url(#globe-shading)"
          stroke="#c5bfb0"
          strokeWidth="1.5"
        />

        {/* Thin outer atmospheric precision ring */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={radius + 4}
          fill="none"
          stroke="#e2dfd7"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
      </svg>

      {/* Interactive Pin Layer on Top of the 2D Globe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedPins.map((pin) => {
          if (!pin.isVisible || pin.x === null || pin.y === null) return null;

          const isSelected = pin.id === selectedPlaceId;

          return (
            <div
              key={pin.id}
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute transition-opacity duration-300 pointer-events-auto ${
                isSelected ? 'z-40' : 'z-20'
              } ${pin.isMatch ? 'opacity-100' : 'opacity-30'}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlace(pin.id);
              }}
            >
              {isSelected ? (
                /* Selected Active Pin with Pulsing Ring */
                <div className="relative flex items-center justify-center cursor-pointer">
                  <div className="absolute w-12 h-12 rounded-full bg-[#e60023]/25 pulse-ring pointer-events-none"></div>
                  <div className="w-6 h-6 rounded-full bg-[#e60023]/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#e60023] border-2 border-white shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] flex items-center justify-center ring-4 ring-[#e60023]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Inactive Pin */
                <div
                  className="w-6 h-6 rounded-full bg-[#e60023]/20 flex items-center justify-center transition-transform hover:scale-125 cursor-pointer group"
                  title={`${pin.name}, ${pin.country}`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#e60023] border-2 border-white shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#1a1a18] text-white text-[11px] rounded-md font-semibold whitespace-nowrap shadow-md pointer-events-none z-30">
                    {pin.name}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* FLOATING CARD FOR CURRENTLY SELECTED PIN */}
        {activeProjectedPin &&
          activeProjectedPin.isVisible &&
          activeProjectedPin.x !== null &&
          activeProjectedPin.y !== null && (
            <div
              style={{
                left: `${activeProjectedPin.x}px`,
                top: `${activeProjectedPin.y}px`,
                transform: 'translate(-50%, 0)',
              }}
              className="absolute top-7 w-64 sm:w-72 bg-white rounded-2xl p-2.5 shadow-[0_20px_40px_-15px_rgba(28,25,23,0.22)] border border-[#e2dfd7] transition-all duration-300 hover:shadow-2xl z-50 text-left pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card Image */}
              <div
                className="relative h-40 w-full rounded-xl overflow-hidden bg-[#efece6] mb-3 cursor-pointer group/img"
                onClick={() => onOpenJournal(activePlace.id)}
              >
                <AtlasImage
                  src={activePlace.thumbnailImage || activePlace.heroImage}
                  placeId={activePlace.id}
                  alt={`${activePlace.name} Landscape`}
                  className="w-full h-full object-cover object-center transform group-hover/img:scale-105 transition-transform duration-700"
                />
                {/* Tiny overlay badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#1a1a18]/75 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  Dispatch #{activePlace.dispatchNumber}
                </div>

                {/* Bookmark save button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(activePlace.id);
                  }}
                  className={`absolute top-2.5 right-2.5 backdrop-blur-sm p-1.5 rounded-full transition-colors cursor-pointer ${
                    isPlaceSaved(activePlace.id)
                      ? 'bg-[#e60023] text-white'
                      : 'bg-white/90 text-[#e60023] hover:bg-white'
                  }`}
                  title={isPlaceSaved(activePlace.id) ? 'Saved' : 'Save to Atlas'}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Card Content */}
              <div className="px-2 pb-1.5">
                <div className="flex items-center gap-1.5 mb-1 text-[#e60023]">
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                  </svg>
                  <h3 className="font-bold text-base text-[#1a1a18] leading-tight tracking-tight">
                    {activePlace.name}, {activePlace.country}
                  </h3>
                </div>

                <p className="text-xs text-[#71716b] font-medium italic font-serif-quote tracking-normal mb-3 line-clamp-2">
                  “{activePlace.oneLineFragment}”
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#e2dfd7] text-[11px] text-[#71716b]">
                  <span className="font-mono">{activePlace.coordinatesText.split('•')[0]}</span>
                  <button
                    onClick={() => onOpenJournal(activePlace.id)}
                    className="text-[#e60023] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    View Journal
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Upward-pointing anchor notch to pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-[#e2dfd7] transform rotate-45"></div>
            </div>
          )}
      </div>

      {/* Floating 2D Globe Orientation & Quick Region Controls (Bottom Center of Map) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#e2dfd7] shadow-sm text-xs pointer-events-auto">
        <span className="text-[#8c8c83] font-mono text-[11px] hidden sm:inline-flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-[#e60023]" />
          Drag to spin 2D globe
        </span>
        <span className="text-[#e2dfd7] hidden sm:inline">|</span>
        <button
          onClick={() => handleCenterPreset(77.5, 34)}
          className="text-[#71716b] hover:text-[#1a1a18] font-medium px-2 py-0.5 rounded hover:bg-[#efece6] transition-colors"
        >
          Asia
        </button>
        <button
          onClick={() => handleCenterPreset(15, 55)}
          className="text-[#71716b] hover:text-[#1a1a18] font-medium px-2 py-0.5 rounded hover:bg-[#efece6] transition-colors"
        >
          Europe
        </button>
        <button
          onClick={() => handleCenterPreset(-95, 30)}
          className="text-[#71716b] hover:text-[#1a1a18] font-medium px-2 py-0.5 rounded hover:bg-[#efece6] transition-colors"
        >
          Americas
        </button>
        <button
          onClick={() => handleCenterPreset(140, -25)}
          className="text-[#71716b] hover:text-[#1a1a18] font-medium px-2 py-0.5 rounded hover:bg-[#efece6] transition-colors"
        >
          Pacific
        </button>
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`p-1 rounded-full transition-colors ${
            isAutoRotating ? 'text-[#e60023] bg-[#e60023]/10' : 'text-[#71716b] hover:text-[#1a1a18]'
          }`}
          title={isAutoRotating ? 'Pause auto-rotation' : 'Start slow auto-rotation'}
        >
          {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
