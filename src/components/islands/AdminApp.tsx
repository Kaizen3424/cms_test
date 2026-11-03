/**
 * Admin shell — sign-in gate, boot state, and the route switch for the four
 * admin screens. Each /admin/*.astro page renders this island with
 * `client:only="react"`; the active screen comes from `window.location`
 * (read lazily and guarded, never at module init).
 *
 * Routes:
 *   /admin, /admin/home  → DashboardScreen (metrics + quick links + places)
 *   /admin/pages?file=…  → SettingsScreen  (home | philosophy | contact)
 *   /admin/editor?id=…   → PlaceEditorScreen (place picker when ?id is absent)
 */
import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CmsProvider, useCms } from '../../cms/provider';
import type { SettingsName } from '../../cms/provider';
import { DashboardScreen } from './admin/DashboardScreen';
import { PlaceEditorScreen } from './admin/PlaceEditorScreen';
import { SettingsScreen } from './admin/SettingsScreen';
import { ToastProvider } from './admin/shared';

type AdminRoute =
  | { screen: 'dashboard' }
  | { screen: 'settings'; file: SettingsName }
  | { screen: 'editor'; placeId?: string };

const NAV_TABS: Array<{ href: string; label: string; screen: AdminRoute['screen'] }> = [
  { href: '/admin', label: 'Dashboard', screen: 'dashboard' },
  { href: '/admin/pages', label: 'Pages', screen: 'settings' },
  { href: '/admin/editor', label: 'Editor', screen: 'editor' },
];

function readLocation(): { pathname: string; search: string } {
  if (typeof window === 'undefined') return { pathname: '/admin', search: '' };
  return { pathname: window.location.pathname, search: window.location.search };
}

function resolveRoute(pathname: string, search: string): AdminRoute {
  const params = new URLSearchParams(search);
  if (pathname.includes('/admin/editor')) {
    const id = params.get('id')?.trim();
    return { screen: 'editor', placeId: id ? id : undefined };
  }
  if (pathname.includes('/admin/pages')) {
    const file = params.get('file');
    return {
      screen: 'settings',
      file: file === 'philosophy' || file === 'contact' ? file : 'home',
    };
  }
  return { screen: 'dashboard' };
}

/** Location as state so back/forward navigation re-resolves the screen. */
function useAppLocation(): { pathname: string; search: string } {
  const [location, setLocation] = useState(readLocation);
  useEffect(() => {
    const sync = () => setLocation(readLocation());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return location;
}

function BootingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[#a3a099]">Opening the studio…</p>
    </main>
  );
}

function SignInCard() {
  const cms = useCms();
  const [token, setToken] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || token.trim().length === 0) return;
    setBusy(true);
    try {
      await cms.signIn(token, remember);
    } finally {
      setBusy(false);
      setToken('');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-[#3a3a36] bg-[#232320] p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e60023]">Atlas</p>
        <h1 className="mt-2 font-serif-quote text-2xl text-[#f7f6f2]">Content Studio</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#a3a099]">
          Sign in with a GitHub fine-grained personal access token with{' '}
          <span className="text-[#f7f6f2]">Contents read & write</span> on this repository only.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-[#a3a099]">Access key</span>
            <input
              type="password"
              name="pat"
              autoComplete="off"
              spellCheck={false}
              value={token}
              onInput={(event) => setToken(event.currentTarget.value)}
              className="mt-1 w-full rounded-lg border border-[#3a3a36] bg-[#1a1a18] px-3 py-2 text-sm text-[#f7f6f2] outline-none focus:border-[#e60023]"
              placeholder="github_pat_…"
              required
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[#a3a099]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.currentTarget.checked)}
              className="h-4 w-4 accent-[#e60023]"
            />
            Remember on this device
          </label>

          {cms.error && (
            <p className="rounded-lg border border-[#e60023]/40 bg-[#e60023]/10 px-3 py-2 text-sm text-[#f7f6f2]">
              {cms.error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || token.trim().length === 0}
            className="w-full rounded-lg bg-[#e60023] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

function AdminNavbar({ route }: { route: AdminRoute }) {
  const cms = useCms();
  return (
    <header className="w-full bg-[#f9f9f7]/95 border-b border-[#eaeae6] sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left brand + admin nav links */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 overflow-x-auto scrollbar-none py-1">
          <a
            href="/admin"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-[#1a1a1a] hover:opacity-85 transition-opacity flex-shrink-0"
          >
            <span>Admin Studio</span>
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
          </a>

          <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {NAV_TABS.map((tab) => {
              const active = route.screen === tab.screen;
              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  className={`text-xs uppercase tracking-wider font-bold py-1.5 px-2.5 sm:px-3 rounded-lg transition-all whitespace-nowrap border-b-2 ${
                    active
                      ? 'text-[#1a1a1a] bg-[#ebebe5] border-[#b7001a]'
                      : 'text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#eeeee8] border-transparent'
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right actions: view the public site, sign out */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#52524d] hover:text-[#1a1a1a] transition-colors py-1.5 px-3 sm:px-4 rounded-full border border-[#dcdcd5] bg-white hover:bg-[#eeeee9] shadow-sm whitespace-nowrap"
          >
            <span>View Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#71716b]" />
          </a>
          <button
            type="button"
            onClick={() => void cms.signOut()}
            className="text-xs sm:text-sm font-semibold text-[#71716b] hover:text-[#e60023] transition-colors py-1.5 px-3 rounded-full whitespace-nowrap cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminShell() {
  const cms = useCms();
  const location = useAppLocation();
  const route = resolveRoute(location.pathname, location.search);

  if (cms.status === 'booting') {
    return <BootingScreen />;
  }

  if (cms.status === 'signed-out' || cms.status === 'error') {
    return <SignInCard />;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#1a1a18]">
      <AdminNavbar route={route} />
      {route.screen === 'dashboard' && <DashboardScreen />}
      {route.screen === 'settings' && <SettingsScreen file={route.file} />}
      {route.screen === 'editor' && <PlaceEditorScreen placeId={route.placeId} />}
    </div>
  );
}

export default function AdminApp() {
  return (
    <CmsProvider>
      <ToastProvider>
        <AdminShell />
      </ToastProvider>
    </CmsProvider>
  );
}
