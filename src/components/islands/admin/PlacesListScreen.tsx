/**
 * Places list — port of the legacy AdminPlacesView plus the NewPlaceModal
 * creation flow, now backed by the patcms provider. Cards link to
 * /admin/editor?id=<slug>; "New Dispatch" builds a schema-valid default
 * PlaceValue and calls cms.createPlace, then jumps straight into the editor.
 */
import { useMemo, useState } from 'react';
import type { SubmitEvent } from 'react';
import { ArrowRight, Plus, Search, ShieldCheck, X } from 'lucide-react';
import { isCMSError } from 'patcms';
import { useCms } from '../../../cms/provider';
import type { PlaceValue } from '../../../cms/provider';
import { calculateAtlasMetrics, filterPlaces, type PlaceWithId } from '../../../lib/adminRules';
import {
  DraftPill,
  PLACE_CATEGORIES,
  StatusBadge,
  inputMonoClass,
  timeAgo,
  useToast,
} from './shared';

export function PlacesListScreen() {
  const cms = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [creating, setCreating] = useState(false);

  const placeRows = useMemo<PlaceWithId[]>(
    () => cms.places.map((row) => ({ ...row.value, id: row.id })),
    [cms.places],
  );
  const metrics = useMemo(() => calculateAtlasMetrics(placeRows), [placeRows]);
  const filteredPlaces = useMemo(
    () => filterPlaces(placeRows, searchQuery, statusFilter),
    [placeRows, searchQuery, statusFilter],
  );
  const rowsById = useMemo(() => new Map(cms.places.map((row) => [row.id, row])), [cms.places]);

  return (
    <>
      {/* 1. Page Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 pb-8 border-b border-[#e2e3e1]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Your Places
          </h2>
          <p className="text-base text-[#5f5e5e] mt-1">
            Everything visitors see on the map lives here.
          </p>
        </div>
        <div>
          <button
            onClick={() => setCreating(true)}
            type="button"
            className="inline-flex items-center gap-2 bg-[#e60023] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#b7001a] transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </button>
        </div>
      </section>

      {/* 2. Toolbar Row: Search + Filter Chips */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 mb-2">
        {/* Search Capsule */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5f5e5e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full h-11 pl-10 pr-4 bg-[#f4f4f2] border border-[#e2e3e1] rounded-full text-sm text-[#1a1c1b] placeholder-[#5f5e5e] focus:outline-none focus:border-[#1a1a1b] transition-colors"
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
            All ({cms.places.length})
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

      {/* 3. Places Grid: 3-column Editorial Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-12">
        {filteredPlaces.map((place) => {
          const row = rowsById.get(place.id);
          const isDraft = place.status === 'draft';
          return (
            <article
              key={place.id}
              className="group bg-white rounded-2xl border border-[#e2e3e1] overflow-hidden flex flex-col hover:border-[#dadad8] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              {/* Card Image */}
              <a
                href={`/admin/editor?id=${encodeURIComponent(place.id)}`}
                className="relative aspect-[3/2] overflow-hidden bg-[#eeeeec] block cursor-pointer"
              >
                <img
                  src={place.heroImage}
                  alt={place.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                  <StatusBadge status={place.status} />
                  {row?.hasDraft && <DraftPill label="Edits" />}
                </div>
              </a>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
                    {place.country}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-[#1a1c1b] mt-1 group-hover:text-[#b7001a] transition-colors">
                    <a href={`/admin/editor?id=${encodeURIComponent(place.id)}`}>{place.name}</a>
                  </h3>
                  <p className="text-sm text-[#5f5e5e] mt-2">
                    {place.frames.length} medium-format frames · Dispatch #{place.dispatchNumber}
                  </p>
                  {row?.hasDraft && (
                    <p className="text-xs text-[#e60023] mt-1">
                      Local draft edits · last touched {timeAgo(row?.value.updatedAt)}
                    </p>
                  )}
                </div>

                {/* Card Actions Strip */}
                <div className="pt-4 mt-6 border-t border-[#eeeeec] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <a
                      href={`/admin/editor?id=${encodeURIComponent(place.id)}`}
                      className={`text-sm font-semibold flex items-center gap-1 transition-colors ${
                        isDraft
                          ? 'text-[#e60023] hover:text-[#b7001a]'
                          : 'text-[#5f5e5e] group-hover:text-[#1a1c1b]'
                      }`}
                    >
                      <span>{isDraft ? 'Continue editing' : 'Edit story'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    {place.status === 'published' && (
                      <a
                        href={`/place/${encodeURIComponent(place.id)}`}
                        className="text-xs text-[#8c8c83] hover:text-[#1a1a1a] underline"
                      >
                        view live
                      </a>
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
        {filteredPlaces.length === 0 && (
          <p className="col-span-full text-sm text-[#71716b] bg-white border border-dashed border-[#dcdcd5] rounded-2xl p-8 text-center">
            No places match this view yet. Create your first dispatch with the button above.
          </p>
        )}
      </section>

      {/* 4. Calming Reassurance Microcopy Strip */}
      <section className="py-6 border-t border-[#eeeeec] flex items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 text-[#5f5e5e] text-xs sm:text-sm font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your changes save safely. Nothing goes live until you press Publish.</span>
        </div>
      </section>

      <NewPlaceModal open={creating} onClose={() => setCreating(false)} />
    </>
  );
}

/* ------------------------------ creation modal ----------------------------- */

/** Parse "34.15° N, 77.57° E" (or plain decimals) into signed lat/lng. */
function parseCoordinates(text: string): { lat: number; lng: number } {
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*([NS])?\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*°?\s*([EW])?/i);
  if (!match || !match[1] || !match[3]) return { lat: 0, lng: 0 };
  const lat = parseFloat(match[1]) * (match[2]?.toUpperCase() === 'S' ? -1 : 1);
  const lng = parseFloat(match[3]) * (match[4]?.toUpperCase() === 'W' ? -1 : 1);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { lat: 0, lng: 0 };
  return { lat, lng };
}

function clampPercent(value: number): number {
  return Math.min(95, Math.max(5, value));
}

function NewPlaceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cms = useCms();
  const showToast = useToast();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState<PlaceValue['category']>('High Altitude');
  const [coordinatesText, setCoordinatesText] = useState('45.1234° N, 12.5678° E');
  const [oneLineFragment, setOneLineFragment] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [busy, setBusy] = useState(false);
  const [issues, setIssues] = useState<Array<{ path: string; message: string }>>([]);

  if (!open) return null;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !name.trim()) return;
    setBusy(true);
    setIssues([]);

    const maxDispatch = cms.places.reduce(
      (max, row) => Math.max(max, row.value.dispatchNumber ?? 0),
      0,
    );
    const coords = parseCoordinates(coordinatesText);
    const value: PlaceValue = {
      name: name.trim(),
      country: country.trim() || 'Remote Terrane',
      coordinatesText: coordinatesText.trim() || '50.0000° N, 15.0000° E',
      lat: coords.lat,
      lng: coords.lng,
      mapX: clampPercent(((coords.lng + 180) / 360) * 100),
      mapY: clampPercent(((90 - coords.lat) / 180) * 100),
      status: 'draft',
      dispatchNumber: maxDispatch + 1,
      category,
      oneLineFragment: oneLineFragment.trim() || 'First light on unmapped ridgelines.',
      narrativeStory: '',
      heroImage: heroImage.trim(),
      introLines: [],
      frames: [],
    };

    try {
      const { id } = await cms.createPlace(value);
      window.location.assign(`/admin/editor?id=${encodeURIComponent(id)}`);
    } catch (thrown) {
      if (isCMSError(thrown) && thrown.issues) {
        setIssues(
          thrown.issues
            .filter((issue) => issue.severity === 'error')
            .map((issue) => ({ path: issue.path, message: issue.message })),
        );
      } else {
        showToast(thrown instanceof Error ? thrown.message : 'Could not create the place', 'error');
      }
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#f9f9f7] rounded-3xl border border-[#e2dfd7] shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-[#71716b] hover:text-[#1a1a18] hover:bg-[#eeeee9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f0eb] border border-[#e4e4dd] text-[11px] font-bold tracking-[0.18em] text-[#e60023] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Atlas Studio
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a18] tracking-tight">
              Create New Place Dispatch
            </h2>
            <p className="text-xs text-[#71716b] mt-1">
              Anchor a new geography with quiet photography and field coordinates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2a2a26]">Place Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karakoram"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2a2a26]">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Pakistan"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2a2a26]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PlaceValue['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
                >
                  {PLACE_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2a2a26]">Coordinates</label>
                <input
                  type="text"
                  value={coordinatesText}
                  onChange={(e) => setCoordinatesText(e.target.value)}
                  placeholder="e.g. 35.88° N, 76.51° E"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm font-mono text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2a2a26]">One-Line Fragment</label>
              <input
                type="text"
                value={oneLineFragment}
                onChange={(e) => setOneLineFragment(e.target.value)}
                placeholder="Quiet impression beneath the title"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2a2a26]">Cover Image URL</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/images/… or https://…"
                spellCheck={false}
                className={inputMonoClass}
              />
            </div>

            {issues.length > 0 && (
              <div className="rounded-xl border border-[#e60023]/40 bg-[#faecee] p-3 space-y-1.5">
                {issues.map((issue, index) => (
                  <p key={`${issue.path}-${index}`} className="text-[11px] text-[#8a0018]">
                    <span className="font-mono font-bold">{issue.path}</span> — {issue.message}
                  </p>
                ))}
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#71716b] hover:bg-[#eeeee9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 rounded-full bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{busy ? 'Creating…' : 'Create & Open Editor'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
