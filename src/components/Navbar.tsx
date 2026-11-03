import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView } = useAtlas();

  const isAdmin =
    currentView === 'admin-places' ||
    currentView === 'admin-editor' ||
    currentView === 'admin-home' ||
    currentView === 'admin-pages';

  if (isAdmin) {
    const isPlacesTab = currentView === 'admin-places' || currentView === 'admin-editor';
    const isHomeTab = currentView === 'admin-home';
    const isPagesTab = currentView === 'admin-pages';

    return (
      <header className="w-full bg-[#f9f9f7] border-b border-[#eaeae6] sticky top-0 z-40 backdrop-blur-sm bg-[#f9f9f7]/95">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Brand + Admin Nav Links */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setCurrentView('admin-places')}
              className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-[#1a1a1a] hover:opacity-85 transition-opacity cursor-pointer flex-shrink-0"
            >
              <span>Admin Studio</span>
              <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            </button>

            <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setCurrentView('admin-places')}
                className={`text-xs uppercase tracking-wider font-bold py-1.5 px-2.5 sm:px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isPlacesTab
                    ? 'text-[#1a1a1a] bg-[#ebebe5] border-b-2 border-[#b7001a]'
                    : 'text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#eeeee8]'
                }`}
              >
                Places
              </button>
              <button
                onClick={() => setCurrentView('admin-home')}
                className={`text-xs uppercase tracking-wider font-bold py-1.5 px-2.5 sm:px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isHomeTab
                    ? 'text-[#1a1a1a] bg-[#ebebe5] border-b-2 border-[#b7001a]'
                    : 'text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#eeeee8]'
                }`}
              >
                Home Page
              </button>
              <button
                onClick={() => setCurrentView('admin-pages')}
                className={`text-xs uppercase tracking-wider font-bold py-1.5 px-2.5 sm:px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isPagesTab
                    ? 'text-[#1a1a1a] bg-[#ebebe5] border-b-2 border-[#b7001a]'
                    : 'text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#eeeee8]'
                }`}
              >
                Pages
              </button>
            </nav>
          </div>

          {/* Right Action: Clean View Site button only (Notification, Settings & Profile removed per requirements) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#52524d] hover:text-[#1a1a1a] transition-colors py-1.5 px-3 sm:px-4 rounded-full border border-[#dcdcd5] bg-white hover:bg-[#eeeee9] shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#71716b]" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Public Floating Pill Navigation Bar
  return (
    <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 px-3 sm:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Tourism Brand Wordmark Pill */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#e2dfd7] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.08)] flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer flex-shrink-0"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#e60023] animate-pulse"></div>
          <span className="font-extrabold tracking-tight text-xs sm:text-base text-[#1a1a18]">
            Meridian Travel
          </span>
          <span className="hidden md:inline text-[11px] uppercase tracking-widest text-[#71716b] pl-2 font-semibold border-l border-[#e2dfd7]">
            Explorer
          </span>
        </button>

        {/* Center Pill Nav Links */}
        <nav className="pointer-events-auto bg-white/95 backdrop-blur-md px-1.5 sm:px-4 py-1.5 rounded-full border border-[#e2dfd7] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.08)] flex items-center gap-0.5 sm:gap-2">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'home'
                ? 'bg-[#f4f2ec] text-[#1a1a18]'
                : 'text-[#71716b] hover:text-[#1a1a18]'
            }`}
          >
            {currentView === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
            )}
            Explore
          </button>

          <button
            onClick={() => {
              setCurrentView('philosophy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'philosophy'
                ? 'bg-[#f4f2ec] text-[#1a1a18]'
                : 'text-[#71716b] hover:text-[#1a1a18]'
            }`}
          >
            {currentView === 'philosophy' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
            )}
            Philosophy
          </button>

          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'contact'
                ? 'bg-[#f4f2ec] text-[#1a1a18]'
                : 'text-[#71716b] hover:text-[#1a1a18]'
            }`}
          >
            {currentView === 'contact' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
            )}
            Contact
          </button>
        </nav>

        {/* Right Red CTA: Travel with us */}
        <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#e60023] hover:bg-[#cc001f] text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-1 sm:gap-2 cursor-pointer"
          >
            <span className="hidden xs:inline">Travel with us</span>
            <span className="xs:hidden">Travel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
