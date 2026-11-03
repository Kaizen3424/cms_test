import React, { useState, useMemo } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { Place } from '../types/atlas';
import { filterPlaces } from '../utils/atlasRules';
import { Plus, Search, ArrowRight, ShieldCheck, Globe, FileText, Camera } from 'lucide-react';
import { AtlasImage } from './AtlasImage';

export const AdminPlacesView: React.FC<{ onNewPlaceClick: () => void }> = ({ onNewPlaceClick }) => {
  const { places, metrics, openEditor, openPlaceJournal } = useAtlas();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPlaces = useMemo(() => {
    return filterPlaces(places, searchQuery, statusFilter);
  }, [places, searchQuery, statusFilter]);

  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
      {/* 1. Page Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#e2e3e1]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Your Places
          </h1>
          <p className="text-base text-[#5f5e5e] mt-1">
            Everything visitors see on the map lives here.
          </p>
        </div>
        <div>
          <button
            onClick={onNewPlaceClick}
            type="button"
            className="inline-flex items-center gap-2 bg-[#e60023] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#b7001a] transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Place</span>
          </button>
        </div>
      </section>

      {/* 2. Status Summary Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-6">
        {/* Card 1: Published */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              Published on site
            </span>
            <Globe className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">
              {metrics.publishedCount}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f4f2] border border-[#e2e3e1] text-xs font-semibold text-[#5f5e5e]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Active
            </span>
          </div>
        </div>

        {/* Card 2: Drafts */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              In progress
            </span>
            <FileText className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">
              {metrics.draftCount}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f4f2] border border-[#e2e3e1] text-xs font-semibold text-[#5f5e5e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Draft
            </span>
          </div>
        </div>

        {/* Card 3: Photos */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              Curated negatives
            </span>
            <Camera className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">
              {metrics.totalPhotosCount}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#5f5e5e]">
              Medium Format
            </span>
          </div>
        </div>
      </section>

      {/* 3. Toolbar Row: Search + Filter Chips */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 mb-2">
        {/* Search Capsule */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f5e5e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full h-11 pl-10 pr-4 bg-[#f4f4f2] border border-[#e2e3e1] rounded-full text-sm text-[#1a1c1b] placeholder-[#5f5e5e] focus:outline-none focus:border-[#1a1c1b] transition-colors"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            type="button"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#1a1c1b] text-white'
                : 'bg-white border border-[#e2e3e1] text-[#5f5e5e] hover:text-[#1a1c1b]'
            }`}
          >
            All ({places.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            type="button"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-[#1a1c1b] text-white'
                : 'bg-white border border-[#e2e3e1] text-[#5f5e5e] hover:text-[#1a1c1b]'
            }`}
          >
            Published ({metrics.publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            type="button"
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-[#1a1c1b] text-white'
                : 'bg-white border border-[#e2e3e1] text-[#5f5e5e] hover:text-[#1a1c1b]'
            }`}
          >
            Drafts ({metrics.draftCount})
          </button>
        </div>
      </section>

      {/* 4. Places Grid: 3-column Editorial Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-12">
        {filteredPlaces.map((place) => {
          const isDraft = place.status === 'draft';
          return (
            <article
              key={place.id}
              className="group bg-white rounded-2xl border border-[#e2e3e1] overflow-hidden flex flex-col hover:border-[#dadad8] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              {/* Card Image */}
              <div
                className="relative aspect-[3/2] overflow-hidden bg-[#eeeeec] cursor-pointer"
                onClick={() => openEditor(place.id)}
              >
                <AtlasImage
                  src={place.thumbnailImage || place.heroImage}
                  placeId={place.id}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#e2e3e1] text-xs font-semibold text-[#1a1c1b] shadow-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDraft ? 'bg-[#e60023]' : 'bg-emerald-600'
                      }`}
                    ></span>
                    {isDraft ? 'Draft' : 'Published'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
                    {place.country}
                  </span>
                  <h2
                    onClick={() => openEditor(place.id)}
                    className="text-2xl font-semibold tracking-tight text-[#1a1c1b] mt-1 group-hover:text-[#b7001a] transition-colors cursor-pointer"
                  >
                    {place.name}
                  </h2>
                  <p className="text-sm text-[#5f5e5e] mt-2">
                    {place.frames?.length || 0} medium-format frames · Edited {place.editedTimeAgo}
                  </p>
                </div>

                {/* Card Actions Strip */}
                <div className="pt-4 mt-6 border-t border-[#eeeeec] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditor(place.id)}
                      className={`text-sm font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isDraft
                          ? 'text-[#e60023] hover:text-[#b7001a]'
                          : 'text-[#5f5e5e] group-hover:text-[#1a1c1b]'
                      }`}
                    >
                      <span>{isDraft ? 'Continue editing' : 'Edit story'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    {place.status === 'published' && (
                      <button
                        onClick={() => openPlaceJournal(place.id)}
                        className="text-xs text-[#8c8c83] hover:text-[#1a1a1a] underline"
                      >
                        view live
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[#5f5e5e]">
                    {place.coordinatesText.split('•')[0]}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 5. Calming Reassurance Microcopy Strip */}
      <section className="py-6 border-t border-[#eeeeec] flex items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 text-[#5f5e5e] text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your changes save safely. Nothing goes live until you press Publish.</span>
        </div>
      </section>
    </main>
  );
};
