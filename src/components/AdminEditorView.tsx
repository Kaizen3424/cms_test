import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { Place } from '../types/atlas';
import { togglePlaceStatus, reorderFrames } from '../utils/atlasRules';
import {
  ArrowLeft,
  Check,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Plus,
  Eye,
  Trash2,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { AtlasImage } from './AtlasImage';

export const AdminEditorView: React.FC = () => {
  const {
    places,
    editingPlaceId,
    updatePlace,
    setCurrentView,
    openPlaceJournal,
    showToast,
    addPlaceFrame,
  } = useAtlas();

  const place: Place =
    places.find((p) => p.id === editingPlaceId) || places[0];

  // Snapshot on initial mount to allow reverting changes
  const [initialSnapshot] = useState<Place>(() => JSON.parse(JSON.stringify(place)));

  const [name, setName] = useState(place.name);
  const [country, setCountry] = useState(place.country);
  const [coordinatesText, setCoordinatesText] = useState(place.coordinatesText);
  const [subtitle, setSubtitle] = useState(place.subtitle || '');
  const [oneLineFragment, setOneLineFragment] = useState(place.oneLineFragment);
  const [narrativeStory, setNarrativeStory] = useState(place.narrativeStory);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoDetail, setNewPhotoDetail] = useState('');

  // Keep state synced with place changes
  const handleFieldChange = (updates: Partial<Place>) => {
    updatePlace({
      ...place,
      ...updates,
    });
  };

  const handleRevertChanges = () => {
    updatePlace(initialSnapshot);
    setName(initialSnapshot.name);
    setCountry(initialSnapshot.country);
    setCoordinatesText(initialSnapshot.coordinatesText);
    setSubtitle(initialSnapshot.subtitle || '');
    setOneLineFragment(initialSnapshot.oneLineFragment);
    setNarrativeStory(initialSnapshot.narrativeStory);
    showToast(`Reverted changes for ${initialSnapshot.name}`);
  };

  const handlePublish = () => {
    const updated: Place = {
      ...place,
      name,
      country,
      coordinatesText,
      subtitle,
      oneLineFragment,
      narrativeStory,
      status: 'published',
    };
    updatePlace(updated);
    showToast(`Published ${updated.name} to the live explorer!`);
  };

  const handleTogglePublish = () => {
    const updated = togglePlaceStatus(place);
    updatePlace(updated);
    showToast(
      updated.status === 'published'
        ? `Published ${updated.name} to the live explorer!`
        : `Moved ${updated.name} to drafts.`
    );
  };

  const handleMoveFrame = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= place.frames.length) return;

    const newFrames = reorderFrames(place.frames, index, targetIndex);
    updatePlace({
      ...place,
      frames: newFrames,
    });
  };

  const handleRemoveFrame = (frameId: string) => {
    const newFrames = place.frames.filter((f) => f.id !== frameId);
    updatePlace({
      ...place,
      frames: newFrames,
    });
    showToast('Photograph removed from essay');
  };

  const handleCaptionChange = (frameId: string, newCaption: string) => {
    const newFrames = place.frames.map((f) =>
      f.id === frameId ? { ...f, caption: newCaption } : f
    );
    updatePlace({
      ...place,
      frames: newFrames,
    });
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) {
      showToast('Please enter an image URL');
      return;
    }
    addPlaceFrame(place.id, {
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Curated frame from expedition',
      locationDetail: newPhotoDetail.trim() || `${place.name} • 120 format emulsion`,
      aspect: '4/3',
      format: '120 Format Roll Film',
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoDetail('');
    setIsAddingPhoto(false);
  };

  const wordCount = narrativeStory
    ? narrativeStory.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const isDraft = place.status === 'draft';

  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-8 sm:space-y-12">
      {/* 1. Editor Header Row */}
      <div className="space-y-4">
        {/* Back Link */}
        <div>
          <button
            onClick={() => setCurrentView('admin-places')}
            className="inline-flex items-center gap-2 text-sm text-[#70706a] hover:text-[#1a1a1a] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back to Your Places</span>
          </button>
        </div>

        {/* Title, Status & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
              {place.name}
            </h1>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#f0f0eb] border border-[#e2e2dc] text-[#44443f]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDraft ? 'bg-[#e60023] animate-pulse' : 'bg-emerald-600'
                }`}
              ></span>
              {isDraft ? 'Draft' : 'Published'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRevertChanges}
              type="button"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white border border-[#dadad3] text-[#2b2b27] hover:bg-[#f6f6f2] hover:border-[#c8c8c0] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              title="Revert unsaved edits to last saved state"
            >
              <RotateCcw className="w-4 h-4 text-[#70706a]" />
              <span>Revert Changes</span>
            </button>

            <button
              onClick={handlePublish}
              type="button"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#e60023] hover:bg-[#cc001f] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Publish</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reassuring Autosave Notice */}
        <div className="flex items-center gap-2 text-xs font-normal text-[#808078] pt-0.5">
          <Check className="w-3.5 h-3.5 text-[#50a773]" />
          <span>All changes saved automatically</span>
          <span className="text-[#b5b5ad]">•</span>
          <span className="text-[#a0a098]">Just now</span>
        </div>
      </div>

      {/* 2. Details Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            Place Details
          </h2>
          <p className="text-sm text-[#73736c]">
            Basic geographic context that anchors this dispatch on the world atlas.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">
                Place name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  handleFieldChange({ name: e.target.value });
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[#8c8c83]">
                The primary name shown on the cover and journal header.
              </p>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  handleFieldChange({ country: e.target.value });
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[#8c8c83]">
                Used for region grouping and filtering in the global archive.
              </p>
            </div>
          </div>

          {/* Map Position & Coordinates */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">
              Map position
            </label>
            <div className="p-3.5 bg-[#fbfbf9] rounded-xl border border-[#deded7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 flex-1">
                {/* Small inline map visual */}
                <div className="w-14 h-14 rounded-lg bg-[#eeeee8] border border-[#d8d8d0] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#999_1px,transparent_1px)] [background-size:6px_6px]"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e60023] ring-4 ring-[#e60023]/20"></span>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={coordinatesText}
                    onChange={(e) => {
                      setCoordinatesText(e.target.value);
                      handleFieldChange({ coordinatesText: e.target.value });
                    }}
                    placeholder="e.g. 34.1526° N, 77.5771° E"
                    className="font-mono text-sm font-semibold text-[#1a1a1a] tracking-tight bg-transparent border-b border-dashed border-[#c2c2b8] focus:outline-none focus:border-[#1a1a1a] w-full"
                  />
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => {
                      setSubtitle(e.target.value);
                      handleFieldChange({ subtitle: e.target.value });
                    }}
                    placeholder="Terrain description e.g. High Altitude Cold Desert Plateau"
                    className="text-xs text-[#707068] bg-transparent border-b border-transparent focus:border-[#c2c2b8] focus:outline-none w-full"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast(`Adjusted coordinates for ${place.name} on the Atlas projection`);
                }}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-lg border border-[#d2d2ca] bg-white hover:bg-[#f5f5f0] text-xs font-semibold text-[#30302b] transition-colors cursor-pointer"
              >
                Adjust Pin on Map
              </button>
            </div>
          </div>

          {/* One-line Fragment */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">
              One-line fragment
            </label>
            <input
              type="text"
              value={oneLineFragment}
              onChange={(e) => {
                setOneLineFragment(e.target.value);
                handleFieldChange({ oneLineFragment: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
            />
            <p className="text-xs text-[#8c8c83]">
              A single quiet impression that sits beneath the title on the explorer map card.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Photo Essay Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
              The photo essay
            </h2>
            <p className="text-sm text-[#73736c]">
              Drag or use arrows to reorder photos. Visitors see them in this order.
            </p>
          </div>
          <span className="text-xs font-medium text-[#8c8c83] bg-[#f0f0ea] px-2.5 py-1 rounded-full self-start sm:self-auto">
            {place.frames?.length || 0} curated frames
          </span>
        </div>

        {/* Vertical List of Photo Rows */}
        <div className="space-y-3.5">
          {place.frames?.map((frame, index) => {
            const isFirst = index === 0;
            const isLast = index === place.frames.length - 1;

            return (
              <div
                key={frame.id}
                className="bg-white rounded-2xl border border-[#e7e7e2] p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#d6d6ce] transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-full md:w-36 h-28 md:h-24 rounded-xl overflow-hidden bg-[#e0e0db] flex-shrink-0 group">
                  <AtlasImage
                    src={frame.url}
                    placeId={place.id}
                    alt={frame.caption}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono font-medium text-white">
                    0{index + 1}
                  </span>
                </div>

                {/* Caption Input */}
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5a5a54] uppercase tracking-wider">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={frame.caption}
                    onChange={(e) => handleCaptionChange(frame.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  />
                  <p className="text-[11px] text-[#9c9c93]">
                    {frame.locationDetail || '120 format emulsion'}
                  </p>
                </div>

                {/* Controls: Up/Down arrows, Delete, & Drag Handle */}
                <div className="flex items-center justify-end md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#f2f2ee]">
                  <div className="flex items-center gap-1 bg-[#fbfbf9] p-1 rounded-lg border border-[#e3e3dc]">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveFrame(index, 'up')}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                        isFirst
                          ? 'text-[#c2c2b8] cursor-not-allowed'
                          : 'text-[#55554f] hover:bg-white hover:text-[#1a1a1a] cursor-pointer'
                      }`}
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveFrame(index, 'down')}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                        isLast
                          ? 'text-[#c2c2b8] cursor-not-allowed'
                          : 'text-[#55554f] hover:bg-white hover:text-[#1a1a1a] cursor-pointer'
                      }`}
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFrame(frame.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9c93] hover:text-[#e60023] hover:bg-[#fee2e2]/40 transition-colors cursor-pointer"
                    title="Remove Frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8e8e84] hover:text-[#1a1a1a] hover:bg-[#f2f2ec] cursor-grab active:cursor-grabbing transition-colors"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Photo Drop Zone Card or Form */}
        {!isAddingPhoto ? (
          <div
            onClick={() => setIsAddingPhoto(true)}
            className="mt-4 border-2 border-dashed border-[#d8d8d0] hover:border-[#1a1a1a] bg-[#fafaf7] hover:bg-white rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-[#deded6] group-hover:border-[#1a1a1a] flex items-center justify-center text-[#66665e] group-hover:text-[#1a1a1a] shadow-sm transition-colors mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a]">
              Drop photos here or click to browse
            </p>
            <p className="text-xs text-[#8c8c83] mt-1">
              High-resolution scans or raw film negatives up to 50MB each. Color calibrated on upload.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleAddPhotoSubmit}
            className="mt-4 bg-white rounded-2xl border border-[#d8d8d0] p-6 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#eeeee9]">
              <h3 className="text-sm font-bold text-[#1a1a1a]">
                Add Photographic Frame to Essay
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingPhoto(false)}
                className="text-xs text-[#707068] hover:text-[#1a1a1a]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5a5a54]">
                  Image URL / Scan Link
                </label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5a5a54]">
                  Caption
                </label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Quiet descriptive impression"
                  className="w-full px-3 py-2 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5a5a54]">
                Location Detail & Format
              </label>
              <input
                type="text"
                value={newPhotoDetail}
                onChange={(e) => setNewPhotoDetail(e.target.value)}
                placeholder="e.g. Diskit Ridge • 120 format emulsion"
                className="w-full px-3 py-2 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingPhoto(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#5a5a54] hover:bg-[#fafaf7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-semibold shadow-sm"
              >
                Add Frame
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 4. Story Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            The words
          </h2>
          <p className="text-sm text-[#73736c]">
            Short is good. A few sentences are plenty.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">
              Narrative dispatch
            </label>
            <textarea
              rows={6}
              value={narrativeStory}
              onChange={(e) => {
                setNarrativeStory(e.target.value);
                handleFieldChange({ narrativeStory: e.target.value });
              }}
              className="w-full px-4 py-3.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-normal text-base leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
              placeholder="Write quiet notes from the road..."
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#8c8c83] pt-1">
            <span>Formatted as quiet editorial prose on the public dispatch page.</span>
            <span>{wordCount} words</span>
          </div>
        </div>
      </section>
    </main>
  );
};
