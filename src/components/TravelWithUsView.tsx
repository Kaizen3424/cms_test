import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const TravelWithUsView: React.FC = () => {
  const { setCurrentView, showToast, places, contactSettings } = useAtlas();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Ladakh');
  const [travelSeason, setTravelSeason] = useState('Autumn 2026');
  const [groupSize, setGroupSize] = useState('2 Travelers');
  const [interest, setInterest] = useState('Landscape Photography & Slow Travel');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      showToast('Please provide your name and email');
      return;
    }
    setIsSubmitted(true);
    showToast('Your travel inquiry has been received! An expedition director will be in touch within 24 hours.');
  };

  return (
    <main className="w-full pt-28 sm:pt-36 pb-20 sm:pb-24 flex-grow bg-[#f7f6f2] text-[#1a1a18]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f0eb] border border-[#e4e4dd] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#e60023] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
            {contactSettings.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1a18] leading-[1.1]">
            {contactSettings.title}
          </h1>
          <p className="text-sm sm:text-lg text-[#71716b] mt-3 leading-relaxed">
            {contactSettings.subtitle}
          </p>
        </div>

        {/* 2-Column Layout: Booking Form + Direct Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#e2dfd7] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]">
            {isSubmitted ? (
              <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a18]">
                  Expedition Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-[#71716b] max-w-md leading-relaxed">
                  Thank you, <span className="font-semibold text-[#1a1a18]">{fullName}</span>. One of our destination specialists will review your vision for {destination} and contact you at <span className="font-semibold text-[#1a1a18]">{email}</span> within 24 hours.
                </p>
                <div className="pt-4 flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-5 sm:px-6 py-2.5 rounded-full border border-[#dcdcd5] text-xs font-semibold text-[#1a1a18] hover:bg-[#fafaf8] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 sm:px-6 py-2.5 rounded-full bg-[#e60023] text-white text-xs font-semibold hover:bg-[#cc001f] cursor-pointer"
                  >
                    Back to Map
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1a1a18] tracking-tight">
                    {contactSettings.formTitle}
                  </h2>
                  <p className="text-xs text-[#71716b] mt-0.5">
                    {contactSettings.formSubtitle}
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Eleanor Vance"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@domain.com"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Destination of Interest
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all cursor-pointer"
                    >
                      {places.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}, {p.country} ({p.category})
                        </option>
                      ))}
                      <option value="Multi-Region Expedition">Multi-Region Expedition</option>
                      <option value="Custom Route">Custom Route</option>
                    </select>
                  </div>
                </div>

                {/* Season & Party Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Preferred Timing
                    </label>
                    <select
                      value={travelSeason}
                      onChange={(e) => setTravelSeason(e.target.value)}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all cursor-pointer"
                    >
                      <option value="Autumn 2026">Autumn 2026</option>
                      <option value="Winter 2026 / 2027">Winter 2026 / 2027</option>
                      <option value="Spring 2027">Spring 2027</option>
                      <option value="Summer 2027">Summer 2027</option>
                      <option value="Flexible Window">Dates are flexible</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                      Travel Party
                    </label>
                    <select
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all cursor-pointer"
                    >
                      <option value="Solo Traveler">Solo Traveler</option>
                      <option value="2 Travelers">2 Travelers (Couple / Companions)</option>
                      <option value="Small Group (3-6)">Small Group (3-6 Travelers)</option>
                      <option value="Private Expedition (7+)">Private Expedition (7+)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Interest */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                    Travel Focus
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all cursor-pointer"
                  >
                    <option value="Landscape Photography & Slow Travel">
                      Landscape Photography & Slow Travel
                    </option>
                    <option value="High-Altitude Trekking & Wilderness">
                      High-Altitude Trekking & Wilderness
                    </option>
                    <option value="Cultural Sanctuaries & Heritage Architecture">
                      Cultural Sanctuaries & Heritage Architecture
                    </option>
                    <option value="Coastal Solitude & Archipelago Crossing">
                      Coastal Solitude & Archipelago Crossing
                    </option>
                  </select>
                </div>

                {/* Message / Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2a2a26] uppercase tracking-wider">
                    Tell Us About Your Vision
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you hope to experience, physical pace preferences, or specific photographic interests..."
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm text-[#1a1a18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a18] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e60023] hover:bg-[#cc001f] text-white font-bold py-3 sm:py-3.5 rounded-full text-xs sm:text-sm shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Travel Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details, Field Offices, Service Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e2dfd7] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-5">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a18] tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#e60023]" />
                <span>{contactSettings.hqDeskTitle}</span>
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3 text-[#52524d]">
                  <Mail className="w-4 h-4 text-[#e60023] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#8c8c83] uppercase tracking-wider font-semibold">
                      Direct Inquiries
                    </div>
                    <a
                      href={`mailto:${contactSettings.inquiryEmail}`}
                      className="font-medium text-[#1a1a18] hover:underline break-all"
                    >
                      {contactSettings.inquiryEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#52524d]">
                  <Phone className="w-4 h-4 text-[#e60023] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#8c8c83] uppercase tracking-wider font-semibold">
                      Telephone
                    </div>
                    <div className="font-medium text-[#1a1a18]">
                      {contactSettings.tollFreePhone} <span className="text-xs text-[#71716b]">(Toll Free)</span>
                    </div>
                    <div className="font-medium text-[#71716b] text-xs">
                      {contactSettings.internationalPhone} <span className="text-[#8c8c83]">(International Desk)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#52524d]">
                  <Clock className="w-4 h-4 text-[#e60023] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#8c8c83] uppercase tracking-wider font-semibold">
                      Operational Hours
                    </div>
                    <div className="text-xs text-[#71716b]">
                      {contactSettings.operatingHours}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      {contactSettings.liveMonitoringNote}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Outposts Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e2dfd7] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#1a1a18] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e60023]" />
                <span>Regional Field Outposts</span>
              </h3>

              <div className="space-y-3 divide-y divide-[#eeeeea] text-xs text-[#71716b]">
                {contactSettings.outposts.map((outpost) => (
                  <div key={outpost.id} className="pt-2.5 first:pt-0">
                    <div className="font-bold text-[#1a1a18] text-xs sm:text-sm">{outpost.name}</div>
                    <p className="mt-0.5">{outpost.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Ethos Guarantee */}
            <div className="bg-[#f0f0eb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#e4e4dd] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a1a18]">
                <Shield className="w-4 h-4 text-[#e60023]" />
                <span>{contactSettings.brandPromiseTitle}</span>
              </div>
              <ul className="text-xs text-[#62625b] space-y-2 leading-relaxed">
                {contactSettings.brandPromises.map((promise, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e60023] mt-1 shrink-0"></span>
                    <span>{promise}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
