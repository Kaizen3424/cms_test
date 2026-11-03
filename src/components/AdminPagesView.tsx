import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { PhilosophyPrinciple, FieldOutpost } from '../types/atlas';
import {
  BookOpen,
  Mail,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  MapPin,
  Shield,
  Phone,
  Clock,
  Sparkles,
  Compass,
} from 'lucide-react';

export const AdminPagesView: React.FC = () => {
  const {
    philosophySettings,
    updatePhilosophySettings,
    contactSettings,
    updateContactSettings,
    setCurrentView,
    showToast,
  } = useAtlas();

  const [activeTab, setActiveTab] = useState<'philosophy' | 'contact'>('philosophy');

  // Local state for Philosophy
  const [philosophyForm, setPhilosophyForm] = useState({ ...philosophySettings });
  const [philosophyChanged, setPhilosophyChanged] = useState(false);

  // Local state for Contact
  const [contactForm, setContactForm] = useState({ ...contactSettings });
  const [contactChanged, setContactChanged] = useState(false);

  // Philosophy Handlers
  const handlePhilTextChange = (field: keyof typeof philosophySettings, value: any) => {
    setPhilosophyForm((prev) => ({ ...prev, [field]: value }));
    setPhilosophyChanged(true);
  };

  const handleManifestoParagraphChange = (index: number, value: string) => {
    setPhilosophyForm((prev) => {
      const copy = [...prev.manifestoParagraphs];
      copy[index] = value;
      return { ...prev, manifestoParagraphs: copy };
    });
    setPhilosophyChanged(true);
  };

  const handlePrincipleChange = (
    id: string,
    field: keyof PhilosophyPrinciple,
    value: string
  ) => {
    setPhilosophyForm((prev) => {
      const copy = prev.principles.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      );
      return { ...prev, principles: copy };
    });
    setPhilosophyChanged(true);
  };

  const handleAddPrinciple = () => {
    const nextNum = `0${philosophyForm.principles.length + 1}`.slice(-2);
    const newPrinciple: PhilosophyPrinciple = {
      id: `p-${Date.now()}`,
      num: nextNum,
      title: 'New Tenet',
      description: 'Describe the core tenet of your travel philosophy here.',
    };
    setPhilosophyForm((prev) => ({
      ...prev,
      principles: [...prev.principles, newPrinciple],
    }));
    setPhilosophyChanged(true);
  };

  const handleRemovePrinciple = (id: string) => {
    setPhilosophyForm((prev) => ({
      ...prev,
      principles: prev.principles.filter((p) => p.id !== id),
    }));
    setPhilosophyChanged(true);
  };

  // Contact Handlers
  const handleContactTextChange = (field: keyof typeof contactSettings, value: any) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
    setContactChanged(true);
  };

  const handleOutpostChange = (id: string, field: keyof FieldOutpost, value: string) => {
    setContactForm((prev) => {
      const copy = prev.outposts.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      );
      return { ...prev, outposts: copy };
    });
    setContactChanged(true);
  };

  const handleAddOutpost = () => {
    const newOutpost: FieldOutpost = {
      id: `outpost-${Date.now()}`,
      name: 'New Regional Outpost',
      address: 'Station Street, City, Country',
    };
    setContactForm((prev) => ({
      ...prev,
      outposts: [...prev.outposts, newOutpost],
    }));
    setContactChanged(true);
  };

  const handleRemoveOutpost = (id: string) => {
    setContactForm((prev) => ({
      ...prev,
      outposts: prev.outposts.filter((o) => o.id !== id),
    }));
    setContactChanged(true);
  };

  const handlePromiseChange = (index: number, value: string) => {
    setContactForm((prev) => {
      const copy = [...prev.brandPromises];
      copy[index] = value;
      return { ...prev, brandPromises: copy };
    });
    setContactChanged(true);
  };

  const handleAddPromise = () => {
    setContactForm((prev) => ({
      ...prev,
      brandPromises: [...prev.brandPromises, 'New traveler guarantee & commitment'],
    }));
    setContactChanged(true);
  };

  const handleRemovePromise = (index: number) => {
    setContactForm((prev) => ({
      ...prev,
      brandPromises: prev.brandPromises.filter((_, i) => i !== index),
    }));
    setContactChanged(true);
  };

  const handleRevertChanges = () => {
    if (activeTab === 'philosophy') {
      setPhilosophyForm({ ...philosophySettings });
      setPhilosophyChanged(false);
      showToast('Reverted changes for Philosophy Page');
    } else {
      setContactForm({ ...contactSettings });
      setContactChanged(false);
      showToast('Reverted changes for Contact Us');
    }
  };

  const handlePublish = () => {
    if (activeTab === 'philosophy') {
      updatePhilosophySettings(philosophyForm);
      setPhilosophyChanged(false);
      showToast('Published Philosophy Page updates!');
    } else {
      updateContactSettings(contactForm);
      setContactChanged(false);
      showToast('Published Contact & Travel With Us updates!');
    }
  };

  return (
    <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      {/* 1. Header with Page Selector & Actions */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e2e3e1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#71716b]">
              Site Content Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1a1c1b]">
            Philosophy & Contact Pages
          </h1>
          <p className="text-sm sm:text-base text-[#5f5e5e] mt-1 max-w-2xl">
            Customise editorial ethos, manifestos, photographic interludes, field outposts, and travel inquiry desk information.
          </p>
        </div>

        {/* Global Toolbar - Exactly 2 buttons: Revert Changes & Publish */}
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

      {/* 2. Sub-Tab Switcher Pills */}
      <div className="flex items-center gap-3 border-b border-[#e2e3e1] pb-3">
        <button
          onClick={() => setActiveTab('philosophy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'philosophy'
              ? 'bg-[#1a1a1a] text-white shadow-sm'
              : 'bg-white border border-[#e2e3e1] text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#f6f6f2]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Philosophy Page</span>
          {philosophyChanged && (
            <span className="w-2 h-2 rounded-full bg-[#e60023] animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#1a1a1a] text-white shadow-sm'
              : 'bg-white border border-[#e2e3e1] text-[#71716b] hover:text-[#1a1a1a] hover:bg-[#f6f6f2]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Contact Us & Travel Desk</span>
          {contactChanged && (
            <span className="w-2 h-2 rounded-full bg-[#e60023] animate-pulse"></span>
          )}
        </button>
      </div>

      {/* 3. PHILOSOPHY TAB CONTENT */}
      {activeTab === 'philosophy' && (
        <div className="space-y-8">
          {/* Section A: Hero Statement */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
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
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Badge Pill Text
                </label>
                <input
                  type="text"
                  value={philosophyForm.badge}
                  onChange={(e) => handlePhilTextChange('badge', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Main Hero Title (Supports line breaks)
                </label>
                <textarea
                  rows={2}
                  value={philosophyForm.heroTitle}
                  onChange={(e) => handlePhilTextChange('heroTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-bold text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={philosophyForm.heroSubtitle}
                  onChange={(e) => handlePhilTextChange('heroSubtitle', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                />
              </div>
            </div>
          </section>

          {/* Section B: Manifesto Paragraphs */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-[#f0f0eb] pb-3">
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Manifesto Prose
              </h2>
              <p className="text-xs text-[#71716b] mt-0.5">
                The 3 core body paragraphs expressing patience, quiet facts, and the unhurried gaze.
              </p>
            </div>

            <div className="space-y-4">
              {philosophyForm.manifestoParagraphs.map((para, idx) => (
                <div key={idx} className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#44443f] flex items-center justify-between">
                    <span>Paragraph 0{idx + 1}</span>
                    <span className="text-[11px] text-[#8c8c83] font-normal">
                      {para.length} characters
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => handleManifestoParagraphChange(idx, e.target.value)}
                    className="w-full px-4 py-3 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#2c2c28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Editorial Tenets / Principles */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0eb] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Editorial Principles & Tenets
                </h2>
                <p className="text-xs text-[#71716b] mt-0.5">
                  How the studio works: numbered rules guiding every expedition and photograph.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPrinciple}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tenet</span>
              </button>
            </div>

            <div className="space-y-4">
              {philosophyForm.principles.map((pr, idx) => (
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
                        onChange={(e) => handlePrincipleChange(pr.id, 'title', e.target.value)}
                        placeholder="Tenet Title"
                        className="flex-1 h-9 px-3 bg-white border border-[#dcdcd5] rounded-lg text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                      />
                    </div>
                    {philosophyForm.principles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePrinciple(pr.id)}
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
                      onChange={(e) => handlePrincipleChange(pr.id, 'description', e.target.value)}
                      placeholder="Tenet explanation..."
                      className="w-full px-3 py-2 bg-white border border-[#dcdcd5] rounded-lg text-xs text-[#55554f] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Photographic Interlude Banner */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-[#f0f0eb] pb-3">
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Photographic Interlude Banner
              </h2>
              <p className="text-xs text-[#71716b] mt-0.5">
                The full-bleed medium-format landscape image displayed halfway down the philosophy essay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                    Landscape Image URL
                  </label>
                  <input
                    type="url"
                    value={philosophyForm.interludeImageUrl}
                    onChange={(e) => handlePhilTextChange('interludeImageUrl', e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-xs font-mono text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                    Coordinates / Dispatch Tag
                  </label>
                  <input
                    type="text"
                    value={philosophyForm.interludeTag}
                    onChange={(e) => handlePhilTextChange('interludeTag', e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                    Location Fragment Caption
                  </label>
                  <input
                    type="text"
                    value={philosophyForm.interludeLocation}
                    onChange={(e) => handlePhilTextChange('interludeLocation', e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                    Film / Emulsion Note
                  </label>
                  <input
                    type="text"
                    value={philosophyForm.interludeFilmNote}
                    onChange={(e) => handlePhilTextChange('interludeFilmNote', e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-xs text-[#1a1a1a]"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#71716b] block mb-2">
                  Image Preview
                </span>
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#eeeee9] border border-[#dcdcd5]">
                  <img
                    src={philosophyForm.interludeImageUrl}
                    alt="Interlude preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                    {philosophyForm.interludeTag}
                  </div>
                  <div className="absolute bottom-2 left-2 text-white text-xs drop-shadow">
                    {philosophyForm.interludeLocation}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section E: Pull Quote & Closing */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
            <div className="border-b border-[#f0f0eb] pb-3">
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Pull-Quote & Closing Section
              </h2>
              <p className="text-xs text-[#71716b] mt-0.5">
                The typographic quote of honor and the concluding invitation on the page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Editorial Pull-Quote
                </label>
                <textarea
                  rows={2}
                  value={philosophyForm.pullQuote}
                  onChange={(e) => handlePhilTextChange('pullQuote', e.target.value)}
                  className="w-full px-4 py-3 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-base font-serif italic text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Closing Headline
                </label>
                <input
                  type="text"
                  value={philosophyForm.closingHeadline}
                  onChange={(e) => handlePhilTextChange('closingHeadline', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-bold text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Closing Subtext
                </label>
                <input
                  type="text"
                  value={philosophyForm.closingSubtext}
                  onChange={(e) => handlePhilTextChange('closingSubtext', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#1a1a1a]"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 4. CONTACT TAB CONTENT */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          {/* Section A: Header Intro */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
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
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={contactForm.badge}
                  onChange={(e) => handleContactTextChange('badge', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-medium text-[#1a1a1a]"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Page Title
                </label>
                <input
                  type="text"
                  value={contactForm.title}
                  onChange={(e) => handleContactTextChange('title', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-lg font-bold text-[#1a1a1a]"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Intro Paragraph
                </label>
                <textarea
                  rows={2}
                  value={contactForm.subtitle}
                  onChange={(e) => handleContactTextChange('subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#1a1a1a] leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* Section B: Headquarters Desk Details */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
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
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Desk Card Title
                </label>
                <input
                  type="text"
                  value={contactForm.hqDeskTitle}
                  onChange={(e) => handleContactTextChange('hqDeskTitle', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-semibold text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Inquiry Email Address
                </label>
                <input
                  type="email"
                  value={contactForm.inquiryEmail}
                  onChange={(e) => handleContactTextChange('inquiryEmail', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-medium text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Toll-Free Phone
                </label>
                <input
                  type="text"
                  value={contactForm.tollFreePhone}
                  onChange={(e) => handleContactTextChange('tollFreePhone', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-medium text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  International / London Phone
                </label>
                <input
                  type="text"
                  value={contactForm.internationalPhone}
                  onChange={(e) => handleContactTextChange('internationalPhone', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-medium text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Operational Hours
                </label>
                <input
                  type="text"
                  value={contactForm.operatingHours}
                  onChange={(e) => handleContactTextChange('operatingHours', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#1a1a1a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                  Monitoring Status Note
                </label>
                <input
                  type="text"
                  value={contactForm.liveMonitoringNote}
                  onChange={(e) => handleContactTextChange('liveMonitoringNote', e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm text-[#1a1a1a]"
                />
              </div>
            </div>
          </section>

          {/* Section C: Regional Field Outposts */}
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
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
                onClick={handleAddOutpost}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Outpost</span>
              </button>
            </div>

            <div className="space-y-3">
              {contactForm.outposts.map((outpost) => (
                <div
                  key={outpost.id}
                  className="p-4 rounded-xl border border-[#e5e5df] bg-[#fafaf8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={outpost.name}
                      onChange={(e) => handleOutpostChange(outpost.id, 'name', e.target.value)}
                      placeholder="Outpost Name"
                      className="h-10 px-3 bg-white border border-[#dcdcd5] rounded-lg text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                    />
                    <input
                      type="text"
                      value={outpost.address}
                      onChange={(e) => handleOutpostChange(outpost.id, 'address', e.target.value)}
                      placeholder="Address details"
                      className="h-10 px-3 bg-white border border-[#dcdcd5] rounded-lg text-xs text-[#62625b] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                    />
                  </div>

                  {contactForm.outposts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOutpost(outpost.id)}
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
          <section className="bg-white rounded-2xl border border-[#e2e3e1] p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
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
                onClick={handleAddPromise}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e60023] hover:text-[#b7001a] py-1.5 px-3 rounded-lg border border-[#e60023]/30 hover:bg-[#faecee] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Promise Point</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-[#44443f]">
                Promise Box Title
              </label>
              <input
                type="text"
                value={contactForm.brandPromiseTitle}
                onChange={(e) => handleContactTextChange('brandPromiseTitle', e.target.value)}
                className="w-full sm:w-80 h-10 px-3.5 bg-[#fcfcfb] border border-[#dcdcd5] rounded-xl text-sm font-bold text-[#1a1a1a]"
              />
            </div>

            <div className="space-y-3">
              {contactForm.brandPromises.map((promise, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e5df] bg-[#fafaf8]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#e60023] flex-shrink-0"></span>
                  <input
                    type="text"
                    value={promise}
                    onChange={(e) => handlePromiseChange(idx, e.target.value)}
                    className="flex-1 h-9 px-3 bg-white border border-[#dcdcd5] rounded-lg text-xs sm:text-sm text-[#2a2a26] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]"
                  />
                  {contactForm.brandPromises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePromise(idx)}
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
      )}
    </main>
  );
};
