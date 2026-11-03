/**
 * Dashboard — the /admin and /admin/home landing screen. Shows content
 * metrics (via calculateAtlasMetrics), pending local drafts, the last publish
 * record, quick links into the settings files and editor, and the full
 * places list below.
 */
import { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Camera,
  FileText,
  Globe,
  Home,
  Mail,
  PencilLine,
} from 'lucide-react';
import { useCms } from '../../../cms/provider';
import { calculateAtlasMetrics, type PlaceWithId } from '../../../lib/adminRules';
import { PlacesListScreen } from './PlacesListScreen';
import { DraftPill, formatClock } from './shared';

export function DashboardScreen() {
  const cms = useCms();

  // Flatten provider rows into the `PlaceWithId` shape the helpers speak:
  // CMS value fields plus the patcms entry id (the slug).
  const placeRows = useMemo<PlaceWithId[]>(
    () => cms.places.map((row) => ({ ...row.value, id: row.id })),
    [cms.places],
  );
  const metrics = useMemo(() => calculateAtlasMetrics(placeRows), [placeRows]);

  const quickLinks: Array<{
    href: string;
    label: string;
    icon: typeof Home;
    draft: boolean;
  }> = [
    {
      href: '/admin/pages?file=home',
      label: 'Home page settings',
      icon: Home,
      draft: cms.draftKeys.has('settings/home'),
    },
    {
      href: '/admin/pages?file=philosophy',
      label: 'Philosophy page',
      icon: BookOpen,
      draft: cms.draftKeys.has('settings/philosophy'),
    },
    {
      href: '/admin/pages?file=contact',
      label: 'Contact & travel desk',
      icon: Mail,
      draft: cms.draftKeys.has('settings/contact'),
    },
    {
      href: '/admin/editor',
      label: 'Open the place editor',
      icon: PencilLine,
      draft: false,
    },
  ];

  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      {/* 1. Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#e2e3e1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
              Editorial Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Studio Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#5f5e5e] mt-1 max-w-2xl">
            The live explorer at a glance — dispatches, pending drafts, and the latest commit to the site.
          </p>
        </div>
      </section>

      {/* 2. Status summary strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              Published on site
            </span>
            <Globe className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">{metrics.publishedCount}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f4f2] border border-[#e2e3e1] text-xs font-semibold text-[#5f5e5e]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              In progress
            </span>
            <FileText className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">{metrics.draftCount}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f4f2] border border-[#e2e3e1] text-xs font-semibold text-[#5f5e5e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Draft
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e]">
              Drafts pending publish
            </span>
            <PencilLine className="w-5 h-5 text-[#5f5e5e]" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-[#1a1c1b]">{cms.draftKeys.size}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f4f2] border border-[#e2e3e1] text-xs font-semibold text-[#5f5e5e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Local only
            </span>
          </div>
        </div>

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

      {/* 3. Last publish + quick links */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#1a1a18] text-white rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <span className="text-xs uppercase tracking-wider font-bold text-[#a3a39b]">
            Last publish
          </span>
          {cms.lastPublish ? (
            <div className="mt-3 space-y-1.5">
              {cms.lastPublish.url ? (
                <a
                  href={cms.lastPublish.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-sm text-[#f7f6f2] underline decoration-[#e60023] underline-offset-4 hover:text-white"
                >
                  {cms.lastPublish.sha?.slice(0, 7) ?? 'commit'}
                </a>
              ) : (
                <span className="font-mono text-sm text-[#f7f6f2]">no changes</span>
              )}
              <p className="text-xs text-[#a3a39b]">{formatClock(cms.lastPublish.at)}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#a3a39b]">
              Nothing published yet in this session.
            </p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-[#e2e3e1] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs uppercase tracking-wider font-bold text-[#5f5e5e] block mb-3">
            Quick links
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#e2e2dc] bg-[#fafaf8] hover:border-[#1a1a1a] hover:bg-white transition-colors"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-white border border-[#dcdcd5] flex items-center justify-center text-[#e60023] flex-shrink-0">
                    <link.icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {link.label}
                  </span>
                </span>
                {link.draft && <DraftPill label="Draft" />}
                <ArrowRight className="w-4 h-4 text-[#9c9c93] group-hover:translate-x-0.5 group-hover:text-[#1a1a1a] transition-all flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The places list (search, filters, cards, new dispatch) */}
      <PlacesListScreen />
    </main>
  );
}
