import React from 'react';
import { useAtlas } from '../context/AtlasContext';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentView, setCurrentView, openPlaceJournal } = useAtlas();

  const isAdmin =
    currentView === 'admin-places' ||
    currentView === 'admin-editor' ||
    currentView === 'admin-home' ||
    currentView === 'admin-pages';

  if (isAdmin) {
    return (
      <footer className="w-full bg-[#f9f9f7] border-t border-[#eaeae6] py-6 px-6 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#71716b] text-center md:text-left">
            © 2026 Meridian Travel Journal. All entries and photographic negatives are preserved locally.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#71716b]">
            <button
              onClick={() => setCurrentView('home')}
              className="uppercase tracking-wider font-semibold hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              Public Site
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="uppercase tracking-wider font-semibold hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              Travel With Us Desk
            </button>
            <span className="uppercase tracking-wider font-semibold text-emerald-700">
              Safe Storage Active
            </span>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1c1c19] text-[#dadad3] pt-14 pb-10 border-t border-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Main Grid: Clean 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#33332e]">
          {/* Col 1: Brand & Ethos (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e60023]"></div>
              <span className="font-extrabold tracking-tight text-xl text-white">
                Meridian Travel
              </span>
            </div>
            <p className="text-xs text-[#91918c] leading-relaxed max-w-sm">
              A bespoke expedition agency dedicated to quiet landscapes, slow travel, and medium-format photographic documentation.
            </p>
            <div className="pt-2 text-xs text-[#b5b5ad] space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#e60023]" />
                <a href="mailto:expeditions@meridiantravel.com" className="hover:text-white transition-colors">
                  expeditions@meridiantravel.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#e60023]" />
                <span>+1 (800) 492-8527</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Pages (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Pages
            </h4>
            <ul className="space-y-2.5 text-xs text-[#91918c]">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explore World Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('philosophy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#e60023] hover:underline font-semibold cursor-pointer"
                >
                  Travel With Us (Inquiries & Routes) →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Featured Expeditions (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Featured Routes
            </h4>
            <ul className="space-y-2.5 text-xs text-[#91918c]">
              <li>
                <button
                  onClick={() => openPlaceJournal('ladakh')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ladakh, India
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlaceJournal('lofoten')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lofoten, Norway
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlaceJournal('wadi-rum')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wadi Rum, Jordan
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlaceJournal('kyoto')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kyoto, Japan
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Bottom Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71716b] gap-3">
          <div>
            © 2026 Meridian Travel Guild Ltd. Handcrafted expeditions worldwide.
          </div>
          <div className="flex items-center gap-5">
            <span className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white/70 transition-colors cursor-pointer">Terms of Travel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
