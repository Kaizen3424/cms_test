import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { X, Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterModal: React.FC = () => {
  const { isNewsletterOpen, setIsNewsletterOpen, subscribeNewsletter, newsletterSubscribed } =
    useAtlas();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  if (!isNewsletterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeNewsletter(email)) {
      setTimeout(() => {
        setIsNewsletterOpen(false);
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#f9f9f7] rounded-3xl border border-[#e2dfd7] shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsNewsletterOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#71716b] hover:text-[#1a1a18] hover:bg-[#eeeee9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f0eb] border border-[#e4e4dd] text-[11px] font-bold tracking-[0.18em] text-[#e60023] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Print & Dispatch Society
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a18] tracking-tight">
              One postcard a month.
            </h2>
            <p className="text-sm text-[#71716b] mt-1.5 leading-relaxed">
              Receive a single physical 5x7" high-resolution photographic print delivered to your postal box, with field emulsion notes and GPS coordinates.
            </p>
          </div>

          {/* Postcard preview graphic */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2dfd7] shadow-sm flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#e0e0db] shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1VitY7JOzoNFDFLMHrQl4N8kc_3gdSBQquE21M2jC26g7Q3wWvB3Gubl8YFLnhCKGJ12RQE6RlfI3W2b56Z5oKEAczrGhx9xnYBje_SodfkisalbPXSqqfykhwPye_W8Ub_f-oDEMvuHFUePAr8UjLGPKVEMGokDsL_orTM8ooMGeZgLsp3uoJpWFe01D2SOCffIF5EoZt8ULBTpZphk9YyZVUMS59bWRcdroKZjHbrIrBGCZ3BBSmooqjQ"
                alt="Postcard Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-mono text-[#e60023] font-bold uppercase tracking-wider">
                DISPATCH #14 EDITION
              </div>
              <div className="font-semibold text-[#1a1a18]">
                Ladakh, High Himalayas (34.15° N)
              </div>
              <div className="text-[#8c8c83] italic font-serif-quote">
                “six mornings above 4,000m”
              </div>
            </div>
          </div>

          {newsletterSubscribed ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              <div className="text-base font-bold text-[#1a1a18]">
                Welcome to the Society
              </div>
              <p className="text-xs text-[#71716b]">
                Your first physical dispatch is cataloged for upcoming dispatch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Digital Dispatch (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71716b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#e60023]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Mailing City / Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Kyoto, Japan or Oslo, Norway"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#e60023]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#e60023] hover:bg-[#cc001f] text-white font-bold py-3 rounded-full text-sm shadow-[0_8px_18px_-4px_rgba(230,0,35,0.45)] transition-all cursor-pointer"
                >
                  Confirm Subscription
                </button>
              </div>

              <p className="text-[11px] text-[#8c8c83] text-center">
                Quiet dispatches only. No marketing or sponsored itineraries.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
