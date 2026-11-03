import React, { useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { X, Plus, MapPin } from 'lucide-react';
import { Place } from '../types/atlas';

interface NewPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPlaceModal: React.FC<NewPlaceModalProps> = ({ isOpen, onClose }) => {
  const { createPlace, openEditor } = useAtlas();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [coordinatesText, setCoordinatesText] = useState('45.1234° N, 12.5678° E');
  const [category, setCategory] = useState<Place['category']>('High Altitude');
  const [oneLineFragment, setOneLineFragment] = useState('');
  const [heroImage, setHeroImage] = useState(
    'https://lh3.googleusercontent.com/aida/AEtjO1VitY7JOzoNFDFLMHrQl4N8kc_3gdSBQquE21M2jC26g7Q3wWvB3Gubl8YFLnhCKGJ12RQE6RlfI3W2b56Z5oKEAczrGhx9xnYBje_SodfkisalbPXSqqfykhwPye_W8Ub_f-oDEMvuHFUePAr8UjLGPKVEMGokDsL_orTM8ooMGeZgLsp3uoJpWFe01D2SOCffIF5EoZt8ULBTpZphk9YyZVUMS59bWRcdroKZjHbrIrBGCZ3BBSmooqjQ'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlace = createPlace({
      name: name.trim(),
      country: country.trim() || 'Remote Terrane',
      coordinatesText: coordinatesText.trim() || '50.0000° N, 15.0000° E',
      category,
      oneLineFragment: oneLineFragment.trim() || 'First light on unmapped ridgelines.',
      heroImage: heroImage.trim(),
      thumbnailImage: heroImage.trim(),
    });

    onClose();
    // Directly open editor for the new place
    openEditor(newPlace.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#f9f9f7] rounded-3xl border border-[#e2dfd7] shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#71716b] hover:text-[#1a1a18] hover:bg-[#eeeee9] transition-colors"
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
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Place Name *
                </label>
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
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Country *
                </label>
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
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Place['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
                >
                  <option value="High Altitude">High Altitude</option>
                  <option value="Coastlines">Coastlines</option>
                  <option value="Quiet Sanctuaries">Quiet Sanctuaries</option>
                  <option value="Highlands">Highlands</option>
                  <option value="Deserts">Deserts</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2a2a26]">
                  Coordinates
                </label>
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
              <label className="text-xs font-semibold text-[#2a2a26]">
                One-Line Fragment
              </label>
              <input
                type="text"
                value={oneLineFragment}
                onChange={(e) => setOneLineFragment(e.target.value)}
                placeholder="Quiet impression beneath the title"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#2a2a26]">
                Cover Image URL
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dcdcd5] text-xs font-mono text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#1a1a18]"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#71716b] hover:bg-[#eeeee9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create & Open Editor</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
