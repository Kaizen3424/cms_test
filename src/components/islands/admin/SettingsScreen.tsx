/**
 * Settings editors — /admin/pages?file=home|philosophy|contact.
 * Ports the legacy AdminHomeView (home customiser) and the philosophy/contact
 * tabs of AdminPagesView. Edits write straight into the patcms draft buffer;
 * tabs are real links (?file=…) so each file keeps its own draft state.
 */
import {
  BookOpen,
  Compass,
  FileText,
  Home,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useCms } from '../../../cms/provider';
import type {
  ContactSettings,
  HomeSettings,
  PhilosophySettings,
  SettingsName,
} from '../../../cms/provider';
import { useAutoPushEnabled } from './autoPush';
import {
  DiscardButton,
  ImageField,
  PublishButton,
  cardClass,
  inputClass,
  labelClass,
  newId,
  usePublishFlow,
  useToast,
} from './shared';

const TABS: Array<{ id: SettingsName; href: string; label: string; icon: typeof Home }> = [
  { id: 'home', href: '/admin/pages?file=home', label: 'Home Page', icon: Home },
  { id: 'philosophy', href: '/admin/pages?file=philosophy', label: 'Philosophy Page', icon: BookOpen },
  { id: 'contact', href: '/admin/pages?file=contact', label: 'Contact Us & Travel Desk', icon: Mail },
];

export function SettingsScreen({ file }: { file: SettingsName }) {
  const cms = useCms();
  const showToast = useToast();
  const flow = usePublishFlow();
  const [autoPush] = useAutoPushEnabled();
  const draftKey = `settings/${file}`;
  const hasDraft = cms.draftKeys.has(draftKey);

  const handleDiscard = async () => {
    await cms.discardDraft(draftKey);
    showToast('Reverted to the last published version');
  };

  const handlePublish = () =>
    void flow.publish(
      draftKey,
      () => cms.publishSettings(file),
      'Published page changes to the live site',
    );

  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      {/* 1. Header with Actions */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e2e3e1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
              Site Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Site Pages
          </h1>
          <p className="text-sm sm:text-base text-[#5f5e5e] mt-1 max-w-2xl">
            Customise the home manifesto and curated strip, the philosophy essay, and the contact &
            travel desk information.
          </p>
        </div>

        {/* Global Toolbar: Discard & Publish for the active file */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DiscardButton onClick={() => void handleDiscard()} disabled={!hasDraft || flow.busy} />
          <PublishButton onClick={handlePublish} busy={flow.busy} />
        </div>
      </section>

      {/* 2. Sub-Tab Switcher Pills (real links, one draft per file) */}
      <div className="flex items-center gap-3 border-b border-[#e2e3e1] pb-3 overflow-x-auto">
        {TABS.map((tab) => {
          const active = tab.id === file;
          const tabHasDraft = cms.draftKeys.has(`settings/${tab.id}`);
          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'bg-white border border-[#e2e3e1] text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#f6f6f2]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tabHasDraft && (
                <span className="w-2 h-2 rounded-full bg-[#e60023] animate-pulse"></span>
              )}
            </a>
          );
        })}
      </div>

      {/* 3. Active file content */}
      {file === 'home' && <HomeSettingsContent />}
      {file === 'philosophy' && <PhilosophySettingsContent />}
      {file === 'contact' && <ContactSettingsContent />}

      {/* 4. Sticky Bottom Action Bar while a draft is pending */}
      {hasDraft && (
        <div className="sticky bottom-6 z-40 bg-[#1a1c1b] text-white rounded-2xl p-4 sm:px-6 flex items-center justify-between shadow-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e60023] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold">
              {autoPush
                ? 'Auto-push will commit these changes to GitHub shortly.'
                : 'You have unpublished draft changes to this page.'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void handleDiscard()}
              type="button"
              className="text-xs font-semibold text-[#a8a89f] hover:text-white transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handlePublish}
              type="button"
              disabled={flow.busy}
              className="bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-wait"
            >
              {flow.busy ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------------- home ---------------------------------- */

function HomeSettingsContent() {
  const cms = useCms();
  const value = cms.settings.home;
  const patch = (next: Partial<HomeSettings>) => cms.updateSettingsDraft('home', next);

  const togglePlaceSelection = (placeId: string) => {
    const current = value.curatedPlaceIds ?? [];
    const next = current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];
    patch({ curatedPlaceIds: next });
  };

  const selectFirstN = (n: number) => {
    const ids = cms.places
      .filter((row) => row.value.status === 'published')
      .slice(0, n)
      .map((row) => row.id);
    patch({ curatedPlaceIds: ids });
  };

  return (
    <div className="space-y-8">
      {/* Section: Seasonal Offers & Announcements */}
      <section className={`${cardClass} space-y-6`}>
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
              {value.offerBannerEnabled ? 'Banner Active' : 'Banner Hidden'}
            </span>
            <span
              onClick={() => patch({ offerBannerEnabled: !value.offerBannerEnabled })}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                value.offerBannerEnabled ? 'bg-[#e60023]' : 'bg-[#d6d6ce]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  value.offerBannerEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </span>
          </label>
        </div>

        {value.offerBannerEnabled ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Badge / Season Tag</label>
                <input
                  type="text"
                  value={value.offerBannerBadge}
                  onChange={(e) => patch({ offerBannerBadge: e.target.value })}
                  placeholder="e.g. Autumn & Winter 2026 Expeditions"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>CTA Button Label</label>
                <input
                  type="text"
                  value={value.offerBannerCtaText}
                  onChange={(e) => patch({ offerBannerCtaText: e.target.value })}
                  placeholder="e.g. Inquire for Route Details"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Headline / Offer Title</label>
              <input
                type="text"
                value={value.offerBannerTitle}
                onChange={(e) => patch({ offerBannerTitle: e.target.value })}
                placeholder="e.g. Private Alpine & Desert Routes Now Open for Booking"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Description / Terms</label>
              <textarea
                rows={2}
                value={value.offerBannerDescription}
                onChange={(e) => patch({ offerBannerDescription: e.target.value })}
                placeholder="e.g. Complimentary private charter transit and Hasselblad negative prints included with all early bespoke commissions."
                className={inputClass}
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
                    <span>{value.offerBannerBadge}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {value.offerBannerTitle}
                  </h3>
                  <p className="text-xs text-[#a3a39b] leading-relaxed">
                    {value.offerBannerDescription}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e60023] text-white text-xs font-bold shadow-sm">
                    <span>{value.offerBannerCtaText}</span>
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

      {/* Section: Editorial Manifesto Text */}
      <section className={`${cardClass} space-y-6`}>
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0f0eb]">
          <div className="w-10 h-10 rounded-xl bg-[#eef3ea] text-emerald-700 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">Editorial Manifesto Copy</h2>
            <p className="text-xs text-[#71716b]">
              The philosophy interlude situated directly below the interactive world map.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className={labelClass}>Eyebrow / Category Tag</label>
              <input
                type="text"
                value={value.manifestoTag}
                onChange={(e) => patch({ manifestoTag: e.target.value })}
                placeholder="e.g. Field Notes & Photographic Record"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Link Button Label</label>
              <input
                type="text"
                value={value.manifestoCtaText}
                onChange={(e) => patch({ manifestoCtaText: e.target.value })}
                placeholder="e.g. Read Our Philosophy"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Main Manifesto Headline</label>
            <input
              type="text"
              value={value.manifestoTitle}
              onChange={(e) => patch({ manifestoTitle: e.target.value })}
              placeholder="e.g. A calm expedition instrument wrapped in quiet print chrome."
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Editorial Narrative Body</label>
            <textarea
              rows={4}
              value={value.manifestoBody}
              onChange={(e) => patch({ manifestoBody: e.target.value })}
              placeholder="e.g. Meridian Travel rejects fast tourism..."
              className={`${inputClass} leading-relaxed`}
            />
          </div>
        </div>
      </section>

      {/* Section: Curated Places Selection ("Fresh From The Road") */}
      <section className={`${cardClass} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f0eb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef1f8] text-indigo-700 flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a]">Curated Road Dispatches Strip</h2>
              <p className="text-xs text-[#71716b]">
                Choose which destinations appear in the magazine photo grid ("Fresh From The Road") on the homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => selectFirstN(5)}
              type="button"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f0f0ea] hover:bg-[#e4e4dd] text-[#333] transition-colors cursor-pointer"
            >
              Select Top 5
            </button>
            <button
              onClick={() => patch({ curatedPlaceIds: [] })}
              type="button"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f0f0ea] hover:bg-[#e4e4dd] text-[#333] transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Section Titles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Badge Eyebrow</label>
            <input
              type="text"
              value={value.curatedBadge}
              onChange={(e) => patch({ curatedBadge: e.target.value })}
              placeholder="e.g. Curated Selection"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Section Title</label>
            <input
              type="text"
              value={value.curatedTitle}
              onChange={(e) => patch({ curatedTitle: e.target.value })}
              placeholder="e.g. Fresh From The Road"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Right Note / Hint</label>
            <input
              type="text"
              value={value.curatedSubtitle}
              onChange={(e) => patch({ curatedSubtitle: e.target.value })}
              placeholder="e.g. Click any frame to view journal"
              className={inputClass}
            />
          </div>
        </div>

        {/* Selected Counter & Instruction */}
        <div className="flex items-center justify-between text-xs font-medium text-[#71716b] bg-[#fbfbf9] p-3 rounded-xl border border-[#deded7]">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-[#1a1a1a]">{value.curatedPlaceIds?.length || 0}</span>{' '}
            places selected for the homepage strip.
          </span>
          <span className="text-[#8c8c83]">
            Tip: 3 to 5 places create an ideal single-row photo layout.
          </span>
        </div>

        {/* Places Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cms.places.map((row) => {
            const isSelected = value.curatedPlaceIds?.includes(row.id);
            const isPublished = row.value.status === 'published';

            return (
              <div
                key={row.id}
                onClick={() => togglePlaceSelection(row.id)}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffaf0] border-[#e60023] shadow-sm ring-1 ring-[#e60023]'
                    : 'bg-[#fafaf8] border-[#e2e2dc] hover:border-[#cbcbc2] hover:bg-white'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#e0e0db] flex-shrink-0">
                  <img
                    src={row.value.heroImage}
                    alt={row.value.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                    {row.value.frames.length}f
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1a1a1a] truncate">{row.value.name}</h4>
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isPublished ? 'bg-emerald-600' : 'bg-[#e60023]'
                      }`}
                    ></span>
                  </div>
                  <p className="text-xs text-[#71716b] truncate">
                    {row.value.country} · {row.value.category}
                  </p>
                  <p className="text-[11px] text-[#9c9c93] line-clamp-1 mt-0.5">
                    {row.value.oneLineFragment}
                  </p>
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0 pr-1">
                  {isSelected ? (
                    <span className="w-5 h-5 rounded bg-[#e60023] text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded border border-[#c2c2b8] bg-white block"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- philosophy -------------------------------- */

function PhilosophySettingsContent() {
  const cms = useCms();
  const value = cms.settings.philosophy;
  const patch = (next: Partial<PhilosophySettings>) => cms.updateSettingsDraft('philosophy', next);

  const setParagraph = (index: number, text: string) => {
    const copy = [...value.manifestoParagraphs];
    copy[index] = text;
    patch({ manifestoParagraphs: copy });
  };

  const setPrinciple = (id: string, field: 'num' | 'title' | 'description', text: string) => {
    patch({
      principles: value.principles.map((p) => (p.id === id ? { ...p, [field]: text } : p)),
    });
  };

  const addPrinciple = () => {
    const nextNum = `0${value.principles.length + 1}`.slice(-2);
    patch({
      principles: [
        ...value.principles,
        {
          id: newId('p'),
          num: nextNum,
          title: 'New Tenet',
          description: 'Describe the core tenet of your travel philosophy here.',
        },
      ],
    });
  };

  const removePrinciple = (id: string) =>
    patch({ principles: value.principles.filter((p) => p.id !== id) });

  return (
    <div className="space-y-8">
      {/* Section A: Hero Statement */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e60023]" />
            <span>Hero Headline & Statement</span>
          </h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            The opening typography statement that sets the tone for your philosophy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Badge Pill Text</label>
            <input
              type="text"
              value={value.badge}
              onChange={(e) => patch({ badge: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass}>Main Hero Title (Supports line breaks)</label>
            <textarea
              rows={2}
              value={value.heroTitle}
              onChange={(e) => patch({ heroTitle: e.target.value })}
              className={`${inputClass} font-bold`}
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className={labelClass}>Hero Subtitle</label>
            <input
              type="text"
              value={value.heroSubtitle}
              onChange={(e) => patch({ heroSubtitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Section B: Manifesto Paragraphs */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Manifesto Prose</h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            The core body paragraphs expressing patience, quiet facts, and the unhurried gaze.
          </p>
        </div>

        <div className="space-y-4">
          {value.manifestoParagraphs.map((para, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className={`${labelClass} flex items-center justify-between`}>
                <span>Paragraph {String(idx + 1).padStart(2, '0')}</span>
                <span className="text-[11px] text-[#8c8c83] font-normal">
                  {para.length} characters
                </span>
              </label>
              <textarea
                rows={3}
                value={para}
                onChange={(e) => setParagraph(idx, e.target.value)}
                className={`${inputClass} leading-relaxed`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section C: Editorial Tenets / Principles */}
      <section className={`${cardClass} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0eb] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">Editorial Principles & Tenets</h2>
            <p className="text-xs text-[#71716b] mt-0.5">
              How the studio works: numbered rules guiding every expedition and photograph.
            </p>
          </div>
          <button
            type="button"
            onClick={addPrinciple}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tenet</span>
          </button>
        </div>

        <div className="space-y-4">
          {value.principles.map((pr) => (
            <div
              key={pr.id}
              className="p-4 rounded-xl border border-[#e5e5df] bg-[#fafaf8] space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#dcdcd5] flex items-center justify-center font-mono font-bold text-xs text-[#e60023]">
                    {pr.num}
                  </div>
                  <input
                    type="text"
                    value={pr.title}
                    onChange={(e) => setPrinciple(pr.id, 'title', e.target.value)}
                    placeholder="Tenet Title"
                    className="flex-1 h-9 px-3 bg-white border border-[#dcdcd5] rounded-lg text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                  />
                </div>
                {value.principles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrinciple(pr.id)}
                    className="text-[#999990] hover:text-[#e60023] p-1.5 transition-colors cursor-pointer"
                    title="Delete principle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <textarea
                  rows={2}
                  value={pr.description}
                  onChange={(e) => setPrinciple(pr.id, 'description', e.target.value)}
                  placeholder="Tenet explanation..."
                  className="w-full px-3 py-2 bg-white border border-[#dcdcd5] rounded-lg text-xs text-[#55554f] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section D: Photographic Interlude Banner */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Photographic Interlude Banner</h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            The full-bleed medium-format landscape image displayed halfway down the philosophy essay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <ImageField
              label="Landscape Image URL"
              value={value.interludeImageUrl}
              onChange={(interludeImageUrl) => patch({ interludeImageUrl })}
              placeholder="/images/… or https://…"
              hint="Upload to the media library or paste any remote image URL."
            />

            <div className="space-y-1.5">
              <label className={labelClass}>Coordinates / Dispatch Tag</label>
              <input
                type="text"
                value={value.interludeTag}
                onChange={(e) => patch({ interludeTag: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Location Fragment Caption</label>
              <input
                type="text"
                value={value.interludeLocation}
                onChange={(e) => patch({ interludeLocation: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Film / Emulsion Note</label>
              <input
                type="text"
                value={value.interludeFilmNote}
                onChange={(e) => patch({ interludeFilmNote: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#71716b] block mb-2">
              Image Preview
            </span>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#eeeee9] border border-[#dcdcd5]">
              {value.interludeImageUrl ? (
                <img
                  src={value.interludeImageUrl}
                  alt="Interlude preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8c8c83]">
                  No interlude image yet
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                {value.interludeTag}
              </div>
              <div className="absolute bottom-2 left-2 text-white text-xs drop-shadow">
                {value.interludeLocation}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section E: Pull Quote & Closing */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Pull-Quote & Closing Section</h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            The typographic quote of honor and the concluding invitation on the page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelClass}>Editorial Pull-Quote</label>
            <textarea
              rows={2}
              value={value.pullQuote}
              onChange={(e) => patch({ pullQuote: e.target.value })}
              className={`${inputClass} font-serif italic text-base`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Closing Headline</label>
            <input
              type="text"
              value={value.closingHeadline}
              onChange={(e) => patch({ closingHeadline: e.target.value })}
              className={`${inputClass} font-bold`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Closing Subtext</label>
            <input
              type="text"
              value={value.closingSubtext}
              onChange={(e) => patch({ closingSubtext: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------- contact --------------------------------- */

function ContactSettingsContent() {
  const cms = useCms();
  const value = cms.settings.contact;
  const patch = (next: Partial<ContactSettings>) => cms.updateSettingsDraft('contact', next);

  const setOutpost = (id: string, field: 'name' | 'address', text: string) => {
    patch({
      outposts: value.outposts.map((o) => (o.id === id ? { ...o, [field]: text } : o)),
    });
  };

  const addOutpost = () =>
    patch({
      outposts: [
        ...value.outposts,
        { id: newId('outpost'), name: 'New Regional Outpost', address: 'Station Street, City, Country' },
      ],
    });

  const removeOutpost = (id: string) =>
    patch({ outposts: value.outposts.filter((o) => o.id !== id) });

  const setPromise = (index: number, text: string) => {
    const copy = [...value.brandPromises];
    copy[index] = text;
    patch({ brandPromises: copy });
  };

  const addPromise = () =>
    patch({ brandPromises: [...value.brandPromises, 'New traveler guarantee & commitment'] });

  const removePromise = (index: number) =>
    patch({ brandPromises: value.brandPromises.filter((_, i) => i !== index) });

  return (
    <div className="space-y-8">
      {/* Section A: Header Intro */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#e60023]" />
            <span>Page Header & Intro</span>
          </h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            Main titles and invitation text on the Travel With Us / Contact page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Badge Tag</label>
            <input
              type="text"
              value={value.badge}
              onChange={(e) => patch({ badge: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass}>Page Title</label>
            <input
              type="text"
              value={value.title}
              onChange={(e) => patch({ title: e.target.value })}
              className={`${inputClass} text-lg font-bold`}
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className={labelClass}>Intro Paragraph</label>
            <textarea
              rows={2}
              value={value.subtitle}
              onChange={(e) => patch({ subtitle: e.target.value })}
              className={`${inputClass} leading-relaxed`}
            />
          </div>
        </div>
      </section>

      {/* Section B: Headquarters Desk Details */}
      <section className={`${cardClass} space-y-6`}>
        <div className="border-b border-[#f0f0eb] pb-3">
          <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#e60023]" />
            <span>Expedition Headquarters Desk</span>
          </h2>
          <p className="text-xs text-[#71716b] mt-0.5">
            Official contact telephone numbers, central routing email, and operational timings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Desk Card Title</label>
            <input
              type="text"
              value={value.hqDeskTitle}
              onChange={(e) => patch({ hqDeskTitle: e.target.value })}
              className={`${inputClass} font-semibold`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Inquiry Email Address</label>
            <input
              type="email"
              value={value.inquiryEmail}
              onChange={(e) => patch({ inquiryEmail: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Toll-Free Phone</label>
            <input
              type="text"
              value={value.tollFreePhone}
              onChange={(e) => patch({ tollFreePhone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>International / London Phone</label>
            <input
              type="text"
              value={value.internationalPhone}
              onChange={(e) => patch({ internationalPhone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Operational Hours</label>
            <input
              type="text"
              value={value.operatingHours}
              onChange={(e) => patch({ operatingHours: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Monitoring Status Note</label>
            <input
              type="text"
              value={value.liveMonitoringNote}
              onChange={(e) => patch({ liveMonitoringNote: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Section C: Regional Field Outposts */}
      <section className={`${cardClass} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0eb] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#e60023]" />
              <span>Regional Field Outposts</span>
            </h2>
            <p className="text-xs text-[#71716b] mt-0.5">
              Physical presence basecamps and ateliers displayed to reassure travelers.
            </p>
          </div>
          <button
            type="button"
            onClick={addOutpost}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Outpost</span>
          </button>
        </div>

        <div className="space-y-3">
          {value.outposts.map((outpost) => (
            <div
              key={outpost.id}
              className="p-4 rounded-xl border border-[#e5e5df] bg-[#fafaf8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={outpost.name}
                  onChange={(e) => setOutpost(outpost.id, 'name', e.target.value)}
                  placeholder="Outpost Name"
                  className="h-10 px-3 bg-white border border-[#dcdcd5] rounded-lg text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                />
                <input
                  type="text"
                  value={outpost.address}
                  onChange={(e) => setOutpost(outpost.id, 'address', e.target.value)}
                  placeholder="Address details"
                  className="h-10 px-3 bg-white border border-[#dcdcd5] rounded-lg text-xs text-[#62625b] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                />
              </div>

              {value.outposts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOutpost(outpost.id)}
                  className="text-[#999990] hover:text-[#e60023] p-2 transition-colors cursor-pointer self-end sm:self-auto"
                  title="Delete outpost"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section D: The Travel Promise Guarantees */}
      <section className={`${cardClass} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0eb] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#e60023]" />
              <span>The Meridian Travel Promise</span>
            </h2>
            <p className="text-xs text-[#71716b] mt-0.5">
              The trust badge and service assurances displayed in the side panel.
            </p>
          </div>
          <button
            type="button"
            onClick={addPromise}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Promise Point</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Promise Box Title</label>
          <input
            type="text"
            value={value.brandPromiseTitle}
            onChange={(e) => patch({ brandPromiseTitle: e.target.value })}
            className={`${inputClass} sm:w-80 font-bold`}
          />
        </div>

        <div className="space-y-3">
          {value.brandPromises.map((promise, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e5df] bg-[#fafaf8]"
            >
              <span className="w-2 h-2 rounded-full bg-[#e60023] flex-shrink-0"></span>
              <input
                type="text"
                value={promise}
                onChange={(e) => setPromise(idx, e.target.value)}
                className="flex-1 h-9 px-3 bg-white border border-[#dcdcd5] rounded-lg text-xs sm:text-sm text-[#2a2a26] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
              />
              {value.brandPromises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePromise(idx)}
                  className="text-[#999990] hover:text-[#e60023] p-1.5 transition-colors cursor-pointer"
                  title="Remove promise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
