import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { Place } from '../types/atlas';
import {
  Sparkles,
  Check,
  RotateCcw,
  Tag,
  FileText,
  Compass,
  ArrowRight,
  Sliders,
  CheckSquare,
  Square,
  Megaphone,
} from 'lucide-react';
import { AtlasImage } from './AtlasImage';

export const AdminHomeView: React.FC = () => {
  const {
    places,
    homeSettings,
    updateHomeSettings,
    setCurrentView,
    showToast,
  } = useAtlas();

  // Local state for the form so edits can be saved or discarded
  const [formData, setFormData] = useState({ ...homeSettings });
  const [hasChanges, setHasChanges] = useState(false);

  const handleTextChange = (field: keyof typeof homeSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleTogglePlaceSelection = (placeId: string) => {
    setFormData((prev) => {
      const current = prev.curatedPlaceIds || [];
      const exists = current.includes(placeId);
      const updated = exists
        ? current.filter((id) => id !== placeId)
        : [...current, placeId];
      return { ...prev, curatedPlaceIds: updated };
    });
    setHasChanges(true);
  };

  const handleSelectFirstN = (n: number) => {
    const published = places.filter((p) => p.status === 'published');
    const ids = published.slice(0, n).map((p) => p.id);
    setFormData((prev) => ({ ...prev, curatedPlaceIds: ids }));
    setHasChanges(true);
  };

  const handleRevertChanges = () => {
    setFormData({ ...homeSettings });
    setHasChanges(false);
    showToast('Reverted changes for Home Page');
  };

  const handlePublish = () => {
    updateHomeSettings(formData);
    setHasChanges(false);
    showToast('Published Home Page changes to live site!');
  };

  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8 sm:space-y-10">
      {/* 1. Header with Actions */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#e2e3e1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
              Editorial Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Home Page Customiser
          </h1>
          <p className="text-sm sm:text-base text-[#5f5e5e] mt-1 max-w-2xl">
            Configure seasonal offers, promotional notices, manifesto philosophy text, and curated road dispatches for the live explorer.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleRevertChanges}
            type="button"
            className="px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white border border-[#dadad3] text-[#2b2b27] hover:bg-[#f6f6f2] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            title="Revert unsaved edits"
          >
            <RotateCcw className="w-4 h-4 text-[#70706a]" />
            <span>Revert Changes</span>
          </button>

          <button
            onClick={handlePublish}
            type="button"
            className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#e60023] hover:bg-[#cc001f] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Publish</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. Section: Seasonal Offers & Announcements */}
      <section className="bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0eb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faecee] text-[#e60023] flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Seasonal Offer & Announcement Banner
              </h2>
              <p className="text-xs text-[#71716b]">
                Promote seasonal booking openings, private charter offers, or route announcements on the homepage.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto select-none">
            <span className="text-xs font-semibold text-[#5a5a54]">
              {formData.offerBannerEnabled ? 'Banner Active' : 'Banner Hidden'}
            </span>
            <div
              onClick={() =>
                handleTextChange('offerBannerEnabled', !formData.offerBannerEnabled)
              }
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                formData.offerBannerEnabled ? 'bg-[#e60023]' : 'bg-[#d6d6ce]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.offerBannerEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </label>
        </div>

        {formData.offerBannerEnabled ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                  Badge / Season Tag
                </label>
                <input
                  type="text"
                  value={formData.offerBannerBadge}
                  onChange={(e) => handleTextChange('offerBannerBadge', e.target.value)}
                  placeholder="e.g. Autumn & Winter 2026 Expeditions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.offerBannerCtaText}
                  onChange={(e) => handleTextChange('offerBannerCtaText', e.target.value)}
                  placeholder="e.g. Inquire for Route Details"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                Headline / Offer Title
              </label>
              <input
                type="text"
                value={formData.offerBannerTitle}
                onChange={(e) => handleTextChange('offerBannerTitle', e.target.value)}
                placeholder="e.g. Private Alpine & Desert Routes Now Open for Booking"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                Description / Terms
              </label>
              <textarea
                rows={2}
                value={formData.offerBannerDescription}
                onChange={(e) => handleTextChange('offerBannerDescription', e.target.value)}
                placeholder="e.g. Complimentary private charter transit and Hasselblad negative prints included with all early bespoke commissions."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
              />
            </div>

            {/* Live Banner Preview Box */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-[#8c8c83] uppercase tracking-wider mb-2">
                Live Preview of Homepage Banner
              </span>
              <div className="bg-[#1c1c19] text-white rounded-2xl p-5 sm:p-6 border border-[#2e2e28] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#e60023]/20 border border-[#e60023]/40 text-[#ff667a] text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
                    <span>{formData.offerBannerBadge}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {formData.offerBannerTitle}
                  </h3>
                  <p className="text-xs text-[#a3a39b] leading-relaxed">
                    {formData.offerBannerDescription}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e60023] text-white text-xs font-bold shadow-sm">
                    <span>{formData.offerBannerCtaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#fafaf8] rounded-xl border border-dashed border-[#dcdcd5] text-center text-xs text-[#71716b]">
            The seasonal promotional banner is currently disabled. Toggle it on whenever you have active booking specials or route announcements.
          </div>
        )}
      </section>

      {/* 3. Section: Editorial Manifesto Text */}
      <section className="bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0f0eb]">
          <div className="w-10 h-10 rounded-xl bg-[#eef3ea] text-emerald-700 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Editorial Manifesto Copy
            </h2>
            <p className="text-xs text-[#71716b]">
              The philosophy interlude situated directly below the interactive world map.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                Eyebrow / Category Tag
              </label>
              <input
                type="text"
                value={formData.manifestoTag}
                onChange={(e) => handleTextChange('manifestoTag', e.target.value)}
                placeholder="e.g. Field Notes & Photographic Record"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                Link Button Label
              </label>
              <input
                type="text"
                value={formData.manifestoCtaText}
                onChange={(e) => handleTextChange('manifestoCtaText', e.target.value)}
                placeholder="e.g. Read Our Philosophy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
              Main Manifesto Headline
            </label>
            <input
              type="text"
              value={formData.manifestoTitle}
              onChange={(e) => handleTextChange('manifestoTitle', e.target.value)}
              placeholder="e.g. A calm expedition instrument wrapped in quiet print chrome."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
              Editorial Narrative Body
            </label>
            <textarea
              rows={4}
              value={formData.manifestoBody}
              onChange={(e) => handleTextChange('manifestoBody', e.target.value)}
              placeholder="e.g. Meridian Travel rejects fast tourism..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
        </div>
      </section>

      {/* 4. Section: Curated Places Selection ("Fresh From The Road") */}
      <section className="bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0eb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef1f8] text-indigo-700 flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Curated Road Dispatches Strip
              </h2>
              <p className="text-xs text-[#71716b]">
                Choose which destinations appear in the magazine photo grid ("Fresh From The Road") on the homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSelectFirstN(5)}
              type="button"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f0f0ea] hover:bg-[#e4e4dd] text-[#333] transition-colors"
            >
              Select Top 5
            </button>
            <button
              onClick={() => handleTextChange('curatedPlaceIds', [])}
              type="button"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f0f0ea] hover:bg-[#e4e4dd] text-[#333] transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Section Titles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
              Badge Eyebrow
            </label>
            <input
              type="text"
              value={formData.curatedBadge}
              onChange={(e) => handleTextChange('curatedBadge', e.target.value)}
              placeholder="e.g. Curated Selection"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
              Section Title
            </label>
            <input
              type="text"
              value={formData.curatedTitle}
              onChange={(e) => handleTextChange('curatedTitle', e.target.value)}
              placeholder="e.g. Fresh From The Road"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
              Right Note / Hint
            </label>
            <input
              type="text"
              value={formData.curatedSubtitle}
              onChange={(e) => handleTextChange('curatedSubtitle', e.target.value)}
              placeholder="e.g. Click any frame to view journal"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
        </div>

        {/* Selected Counter & Instruction */}
        <div className="flex items-center justify-between text-xs font-medium text-[#71716b] bg-[#fbfbf9] p-3 rounded-xl border border-[#deded7]">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-[#1a1a1a]">
              {formData.curatedPlaceIds?.length || 0}
            </span>{' '}
            places selected for the homepage strip.
          </span>
          <span className="text-[#8c8c83]">
            Tip: 3 to 5 places create an ideal single-row photo layout.
          </span>
        </div>

        {/* Places Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => {
            const isSelected = formData.curatedPlaceIds?.includes(place.id);
            const isPublished = place.status === 'published';

            return (
              <div
                key={place.id}
                onClick={() => handleTogglePlaceSelection(place.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffaf0] border-[#e60023] shadow-sm ring-1 ring-[#e60023]'
                    : 'bg-[#fafaf8] border-[#e2e2dc] hover:border-[#cbcbc2] hover:bg-white'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#e0e0db] flex-shrink-0">
                  <AtlasImage
                    src={place.thumbnailImage || place.heroImage}
                    placeId={place.id}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/60 text-[9px] font-mono text-white">
                    {place.frames?.length || 0}f
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1a1a1a] truncate">
                      {place.name}
                    </h4>
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isPublished ? 'bg-emerald-600' : 'bg-[#e60023]'
                      }`}
                    ></span>
                  </div>
                  <p className="text-xs text-[#71716b] truncate">
                    {place.country} · {place.category}
                  </p>
                  <p className="text-[11px] text-[#9c9c93] line-clamp-1 mt-0.5">
                    {place.oneLineFragment}
                  </p>
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0 pr-1">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded bg-[#e60023] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded border border-[#c2c2b8] bg-white"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Sticky Bottom Action Bar if modified */}
      {hasChanges && (
        <div className="sticky bottom-6 z-40 bg-[#1a1c1b] text-white rounded-2xl p-4 sm:px-6 flex items-center justify-between shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e60023] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold">
              You have unsaved changes to the Home Page layout.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRevertChanges}
              type="button"
              className="text-xs font-semibold text-[#a8a89f] hover:text-white transition-colors cursor-pointer"
            >
              Revert Changes
            </button>
            <button
              onClick={handlePublish}
              type="button"
              className="bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm"
            >
              Publish
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
