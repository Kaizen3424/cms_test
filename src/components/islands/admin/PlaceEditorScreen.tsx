/**
 * Place editor — port of the legacy AdminEditorView. Every keystroke lands in
 * the patcms draft buffer (cms.updatePlaceDraft — no save button, no network);
 * "Discard Draft" reverts to the committed value and "Publish" commits via
 * cms.publishPlace. Adds cover-image/frame uploads and introLines editing per
 * the new content shape. Without ?id= it renders a place picker.
 */
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCms } from '../../../cms/provider';
import type { PlaceRow } from '../../../cms/provider';
import type { PhotoFrameContent, PlaceValue } from '../../../cms/types';
import { reorderFrames } from '../../../lib/adminRules';
import {
  ConflictDialog,
  DiscardButton,
  DraftPill,
  ImageField,
  MediaPreview,
  PLACE_CATEGORIES,
  PublishButton,
  StatusBadge,
  UploadButton,
  ValidationDialog,
  inputClass,
  inputMonoClass,
  labelClass,
  newId,
  usePublishFlow,
  useToast,
} from './shared';

export function PlaceEditorScreen({ placeId }: { placeId?: string }) {
  const cms = useCms();

  if (!placeId) {
    return <PlacePicker />;
  }

  const row = cms.places.find((candidate) => candidate.id === placeId);
  if (!row) {
    return (
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Place not found</h1>
        <p className="text-sm text-[#73736c]">
          No dispatch with id <span className="font-mono">{placeId}</span> exists on the branch.
        </p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#e60023] hover:text-[#b7001a]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Your Places
        </a>
      </main>
    );
  }

  return <Editor key={row.id} row={row} />;
}

function PlacePicker() {
  const cms = useCms();
  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#e2e3e1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
              Place Editor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Choose a dispatch
          </h1>
          <p className="text-sm sm:text-base text-[#5f5e5e] mt-1 max-w-2xl">
            Pick a place to edit its story, frames, and coordinates — or create a new one from the
            places list.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cms.places.map((row) => (
          <a
            key={row.id}
            href={`/admin/editor?id=${encodeURIComponent(row.id)}`}
            className="bg-white rounded-2xl border border-[#e2e3e1] p-5 hover:border-[#1a1a1a] transition-colors flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
                Dispatch #{row.value.dispatchNumber}
              </p>
              <p className="text-lg font-semibold text-[#1a1a1a] truncate group-hover:text-[#b7001a] transition-colors">
                {row.value.name}
              </p>
              <p className="text-xs text-[#71716b] truncate">
                {row.value.country} · {row.value.category}
              </p>
            </div>
            {row.hasDraft ? <DraftPill label="Draft" /> : <StatusBadge status={row.value.status} />}
          </a>
        ))}
        {cms.places.length === 0 && (
          <p className="col-span-full text-sm text-[#71716b] bg-white border border-dashed border-[#dcdcd5] rounded-2xl p-8 text-center">
            No places on the branch yet.
          </p>
        )}
      </section>

      <p className="text-sm text-[#5f5e5e]">
        Need something new?{' '}
        <a href="/admin" className="font-semibold text-[#e60023] hover:text-[#b7001a]">
          Create a dispatch from the places list
        </a>
        .
      </p>
    </main>
  );
}

function Editor({ row }: { row: PlaceRow }) {
  const cms = useCms();
  const showToast = useToast();
  const flow = usePublishFlow();
  const place = row.value;
  const draftKey = `places/${row.id}`;

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoDetail, setNewPhotoDetail] = useState('');

  const update = (patch: Partial<PlaceValue>) => cms.updatePlaceDraft(row.id, patch);
  const setFrames = (frames: PhotoFrameContent[]) => update({ frames });

  const patchFrame = (frameId: string, patch: Partial<PhotoFrameContent>) =>
    setFrames(place.frames.map((frame) => (frame.id === frameId ? { ...frame, ...patch } : frame)));

  const moveFrame = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= place.frames.length) return;
    setFrames(reorderFrames(place.frames, index, targetIndex));
  };

  const removeFrame = (frameId: string) => {
    setFrames(place.frames.filter((frame) => frame.id !== frameId));
    showToast('Photograph removed from essay');
  };

  const handleAddPhotoSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPhotoUrl.trim()) {
      showToast('Please enter an image URL or upload a file');
      return;
    }
    setFrames([
      ...place.frames,
      {
        id: newId('frame'),
        url: newPhotoUrl.trim(),
        caption: newPhotoCaption.trim() || 'Curated frame from expedition',
        locationDetail: newPhotoDetail.trim() || `${place.name} • 120 format emulsion`,
        aspect: '4/3',
        format: '120 Format Roll Film',
      },
    ]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoDetail('');
    setIsAddingPhoto(false);
  };

  const setIntroLine = (index: number, line: string) => {
    const copy = [...place.introLines];
    copy[index] = line;
    update({ introLines: copy });
  };

  const handleDiscard = async () => {
    await cms.discardDraft(draftKey);
    showToast(`Reverted ${place.name} to the published version`);
  };

  const handlePublish = () =>
    void flow.publish(
      draftKey,
      () => cms.publishPlace(row.id),
      `Published ${place.name} to the live site`,
    );

  const wordCount = place.narrativeStory
    ? place.narrativeStory.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const isDraft = place.status === 'draft';

  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-8 sm:space-y-12">
      {/* 1. Editor Header Row */}
      <div className="space-y-4">
        {/* Back Link */}
        <div>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-[#70706a] hover:text-[#1a1a1a] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back to Your Places</span>
          </a>
        </div>

        {/* Title, Status & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
              {place.name}
            </h1>
            <button
              type="button"
              onClick={() => update({ status: isDraft ? 'published' : 'draft' })}
              title="Toggle visibility on the live site"
              className="cursor-pointer"
            >
              <StatusBadge status={place.status} />
            </button>
            {row.hasDraft && <DraftPill />}
          </div>

          <div className="flex items-center gap-3">
            <DiscardButton onClick={() => void handleDiscard()} disabled={!row.hasDraft || flow.busy} />
            <PublishButton onClick={handlePublish} busy={flow.busy} />
          </div>
        </div>

        {/* Reassuring Draft Notice */}
        <div className="flex items-center gap-2 text-xs font-normal text-[#808078] pt-0.5">
          <Check className="w-3.5 h-3.5 text-[#50a773]" />
          <span>Edits are kept as local drafts on this device</span>
          <span className="text-[#b5b5ad]">•</span>
          <span className="text-[#a0a098]">Publish to commit them to the live site</span>
        </div>
      </div>

      {/* 2. Details Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">Place Details</h2>
          <p className="text-sm text-[#73736c]">
            Basic geographic context that anchors this dispatch on the world atlas.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">Place name</label>
              <input
                type="text"
                value={place.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[#8c8c83]">
                The primary name shown on the cover and journal header.
              </p>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">Country</label>
              <input
                type="text"
                value={place.country}
                onChange={(e) => update({ country: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
              />
              <p className="text-xs text-[#8c8c83]">
                Used for region grouping and filtering in the global archive.
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">Category</label>
              <select
                value={place.category}
                onChange={(e) => update({ category: e.target.value as PlaceValue['category'] })}
                className={inputClass}
              >
                {PLACE_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#8c8c83]">Collection the dispatch belongs to.</p>
            </div>

            {/* Dispatch number (read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2a2a26]">Dispatch number</label>
              <div className="w-full px-4 py-3 rounded-xl bg-[#f0f0ea] border border-[#deded7] font-mono text-[#1a1a1a] text-base">
                #{place.dispatchNumber}
              </div>
              <p className="text-xs text-[#8c8c83]">
                Order in the road archive — set automatically at creation.
              </p>
            </div>
          </div>

          {/* Map Position & Coordinates */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">Map position</label>
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
                    value={place.coordinatesText}
                    onChange={(e) => update({ coordinatesText: e.target.value })}
                    placeholder="e.g. 34.1526° N, 77.5771° E"
                    className="font-mono text-sm font-semibold text-[#1a1a1a] tracking-tight bg-transparent border-b border-dashed border-[#c2c2b8] focus:outline-none focus:border-[#1a1a1a] w-full"
                  />
                  <input
                    type="text"
                    value={place.subtitle ?? ''}
                    onChange={(e) => update({ subtitle: e.target.value })}
                    placeholder="Terrain description e.g. High Altitude Cold Desert Plateau"
                    className="text-xs text-[#707068] bg-transparent border-b border-transparent focus:border-[#c2c2b8] focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="self-start sm:self-center font-mono text-[11px] text-[#70706a] whitespace-nowrap">
                {place.lat.toFixed(4)}, {place.lng.toFixed(4)} · map{' '}
                {Math.round(place.mapX)},{Math.round(place.mapY)}
              </div>
            </div>
          </div>

          {/* One-line Fragment */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">One-line fragment</label>
            <input
              type="text"
              value={place.oneLineFragment}
              onChange={(e) => update({ oneLineFragment: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-[#1a1a1a] font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all"
            />
            <p className="text-xs text-[#8c8c83]">
              A single quiet impression that sits beneath the title on the explorer map card.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Cover Photograph */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">Cover photograph</h2>
          <p className="text-sm text-[#73736c]">
            The hero image on the map card and the top of the dispatch journal.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <ImageField
              label="Cover Image URL"
              value={place.heroImage}
              onChange={(heroImage) => update({ heroImage })}
              placeholder="/images/… or https://…"
              hint="Upload to the media library or paste any remote image URL."
            />
            <div className="space-y-1.5">
              <label className={labelClass}>Alt text</label>
              <input
                type="text"
                value={place.heroAlt ?? ''}
                onChange={(e) => update({ heroAlt: e.target.value })}
                placeholder="Quiet description of the frame"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#8c8c83] uppercase tracking-wider mb-2">
              Preview
            </span>
            <div className="relative rounded-2xl overflow-hidden aspect-[3/2] bg-[#eeeee9] border border-[#dcdcd5]">
              <MediaPreview
                src={place.heroImage}
                alt={place.heroAlt ?? place.name}
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Intro Lines */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">The opening lines</h2>
            <p className="text-sm text-[#73736c]">
              Short lines set at the top of the dispatch page, one per row.
            </p>
          </div>
          <span className="text-xs font-medium text-[#8c8c83] bg-[#f0f0ea] px-2.5 py-1 rounded-full self-start sm:self-auto">
            {place.introLines.length} lines
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
          {place.introLines.map((line, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#f0f0ea] border border-[#deded7] flex items-center justify-center font-mono font-bold text-[10px] text-[#e60023] flex-shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={line}
                onChange={(e) => setIntroLine(index, e.target.value)}
                placeholder="An opening impression…"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => update({ introLines: place.introLines.filter((_, i) => i !== index) })}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9c93] hover:text-[#e60023] hover:bg-[#fee2e2]/40 transition-colors cursor-pointer flex-shrink-0"
                title="Remove line"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update({ introLines: [...place.introLines, ''] })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add line</span>
          </button>
        </div>
      </section>

      {/* 5. Photo Essay Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">The photo essay</h2>
            <p className="text-sm text-[#73736c]">
              Use arrows to reorder photos. Visitors see them in this order.
            </p>
          </div>
          <span className="text-xs font-medium text-[#8c8c83] bg-[#f0f0ea] px-2.5 py-1 rounded-full self-start sm:self-auto">
            {place.frames.length} curated frames
          </span>
        </div>

        {/* Vertical List of Photo Rows */}
        <div className="space-y-3.5">
          {place.frames.map((frame, index) => {
            const isFirst = index === 0;
            const isLast = index === place.frames.length - 1;

            return (
              <div
                key={frame.id}
                className="bg-white rounded-2xl border border-[#e7e7e2] p-4 sm:p-5 flex flex-col md:flex-row md:items-start gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#d6d6ce] transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-full md:w-36 h-28 md:h-24 rounded-xl overflow-hidden bg-[#e0e0db] flex-shrink-0">
                  <MediaPreview
                    src={frame.url}
                    alt={frame.caption}
                    class="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono font-medium text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={frame.url}
                      onChange={(e) => patchFrame(frame.id, { url: e.target.value })}
                      placeholder="Image URL"
                      spellCheck={false}
                      className={`flex-1 min-w-0 ${inputMonoClass}`}
                    />
                    <UploadButton onUploaded={(path) => patchFrame(frame.id, { url: path })} />
                  </div>
                  <input
                    type="text"
                    value={frame.caption}
                    onChange={(e) => patchFrame(frame.id, { caption: e.target.value })}
                    placeholder="Caption"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  />
                  <input
                    type="text"
                    value={frame.locationDetail ?? ''}
                    onChange={(e) => patchFrame(frame.id, { locationDetail: e.target.value })}
                    placeholder="Location detail & format"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-xs text-[#55554f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  />
                </div>

                {/* Controls: Up/Down arrows, Remove, & Drag Handle */}
                <div className="flex items-center justify-end md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#f2f2ee]">
                  <div className="flex items-center gap-1 bg-[#fbfbf9] p-1 rounded-lg border border-[#e3e3dc]">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveFrame(index, 'up')}
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
                      onClick={() => moveFrame(index, 'down')}
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
                    onClick={() => removeFrame(frame.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c9c93] hover:text-[#e60023] hover:bg-[#fee2e2]/40 transition-colors cursor-pointer"
                    title="Remove Frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8e8e84] hover:text-[#1a1a1a] hover:bg-[#f2f2ec] cursor-grab active:cursor-grabbing transition-colors"
                    title="Ordered with the arrows"
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
          <button
            type="button"
            onClick={() => setIsAddingPhoto(true)}
            className="mt-4 w-full border-2 border-dashed border-[#d8d8d0] hover:border-[#1a1a1a] bg-[#fafaf7] hover:bg-white rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <span className="w-12 h-12 rounded-full bg-white border border-[#deded6] group-hover:border-[#1a1a1a] flex items-center justify-center text-[#66665e] group-hover:text-[#1a1a1a] shadow-sm transition-colors mb-3">
              <Plus className="w-5 h-5" />
            </span>
            <span className="text-sm font-semibold text-[#1a1a1a]">
              Add a photographic frame
            </span>
            <span className="text-xs text-[#8c8c83] mt-1">
              Paste a scan URL or upload a high-resolution negative.
            </span>
          </button>
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
                className="text-xs text-[#707068] hover:text-[#1a1a1a] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5a5a54]">Image URL / Scan Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  spellCheck={false}
                  className={`flex-1 min-w-0 ${inputMonoClass}`}
                />
                <UploadButton onUploaded={setNewPhotoUrl} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5a5a54]">Caption</label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Quiet descriptive impression"
                  className="w-full px-3 py-2 rounded-lg bg-[#fafaf8] border border-[#dcdcd5] text-xs"
                />
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
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingPhoto(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#5a5a54] hover:bg-[#fafaf7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                Add Frame
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 6. Story Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">The words</h2>
          <p className="text-sm text-[#73736c]">Short is good. A few sentences are plenty.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e7e7e2] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#2a2a26]">Narrative dispatch</label>
            <textarea
              rows={6}
              value={place.narrativeStory}
              onChange={(e) => update({ narrativeStory: e.target.value })}
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

      {flow.conflict && (
        <ConflictDialog
          conflict={flow.conflict}
          onResolve={(choice) => void flow.resolveConflict(choice)}
          onDismiss={flow.dismissConflict}
        />
      )}
      {flow.validation && (
        <ValidationDialog validation={flow.validation} onDismiss={flow.dismissValidation} />
      )}
    </main>
  );
}
