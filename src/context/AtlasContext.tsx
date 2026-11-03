import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Place,
  ViewMode,
  AtlasMetrics,
  PhotoFrame,
  HomePageSettings,
  PhilosophySettings,
  ContactSettings,
} from '../types/atlas';
import { INITIAL_PLACES } from '../data/initialPlaces';
import { calculateAtlasMetrics, reorderFrames } from '../utils/atlasRules';

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  manifestoTag: 'Field Notes & Photographic Record',
  manifestoTitle: 'A calm expedition instrument wrapped in quiet print chrome.',
  manifestoBody:
    'Meridian Travel rejects fast tourism. We curate places reached with patience, documented on medium-format emulsion, and recorded with geographic fidelity. Every location marker corresponds to a finished visual essay and guided route.',
  manifestoCtaText: 'Read Our Philosophy',

  curatedBadge: 'Curated Selection',
  curatedTitle: 'Fresh From The Road',
  curatedSubtitle: 'Click any frame to view journal',
  curatedPlaceIds: ['ladakh', 'lofoten', 'wadi-rum', 'kyoto', 'namibia'],

  offerBannerEnabled: true,
  offerBannerBadge: 'Autumn & Winter 2026 Expeditions',
  offerBannerTitle: 'Private Alpine & Desert Routes Now Open for Booking',
  offerBannerDescription:
    'Complimentary private charter transit and Hasselblad negative prints included with all early bespoke commissions.',
  offerBannerCtaText: 'Inquire for Route Details',
  offerBannerCtaLink: 'contact',
};

export const DEFAULT_PHILOSOPHY_SETTINGS: PhilosophySettings = {
  badge: 'Our Philosophy',
  heroTitle: 'We go slow,\nand we stay long.',
  heroSubtitle: 'No itineraries. No top-tens. Just places, and the light on them.',
  manifestoParagraphs: [
    'We photograph first, and write only when the dust has settled. Images tell truths that adjectives quickly dilute. By giving precedence to the eye over the pen, we allow the landscape to speak on its own unhurried terms.',
    'We stay long enough that a place stops performing for us. The first day reveals only expectations; the tenth day reveals the rhythm of water boiling over dried juniper, sheep bells echoing off cold granite, and the long patience of wind.',
    'Silence does the storytelling. Most travel writing fills the quiet with recommendations and prices. We prefer the quiet itself—documenting high mountain passes, empty coastlines, and dawn light as quiet physical facts.',
  ],
  principles: [
    {
      id: 'p1',
      num: '01',
      title: 'Photographs first',
      description: 'Every entry begins with light on emulsion. Words are strictly secondary annotations.',
    },
    {
      id: 'p2',
      num: '02',
      title: 'Fewer words',
      description: 'If a sentence doesn\'t deepen the atmosphere of a frame, we strike it from the page.',
    },
    {
      id: 'p3',
      num: '03',
      title: 'No lists, no rankings',
      description: 'We catalog coordinates, not hierarchies. Every landscape has its own singular gravity.',
    },
    {
      id: 'p4',
      num: '04',
      title: 'Leave things out',
      description: 'The secret trail remains unposted. Discovery belongs to the traveler who walks there.',
    },
  ],
  interludeImageUrl:
    'https://lh3.googleusercontent.com/aida/AEtjO1VitY7JOzoNFDFLMHrQl4N8kc_3gdSBQquE21M2jC26g7Q3wWvB3Gubl8YFLnhCKGJ12RQE6RlfI3W2b56Z5oKEAczrGhx9xnYBje_SodfkisalbPXSqqfykhwPye_W8Ub_f-oDEMvuHFUePAr8UjLGPKVEMGokDsL_orTM8ooMGeZgLsp3uoJpWFe01D2SOCffIF5EoZt8ULBTpZphk9YyZVUMS59bWRcdroKZjHbrIrBGCZ3BBSmooqjQ',
  interludeTag: '34.1526° N, 77.5771° E · DISPATCH #14 INTERLUDE',
  interludeLocation: 'somewhere past the last village, Ladakh',
  interludeFilmNote: 'Medium format emulsion · Dawn',
  pullQuote: '“The map is not the point. The morning is.”',
  closingHeadline: 'The journey continues on the map.',
  closingSubtext: 'Every destination cataloged is an invitation to witness the world unhurried.',
};

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  badge: 'Bespoke Tourism & Guided Expeditions',
  title: 'Travel With Us.',
  subtitle:
    'We curate small-group expeditions and tailored itineraries to the world\'s most quietly extraordinary landscapes. Reach out to our expedition desk to join an upcoming route or commission a private journey.',
  formTitle: 'Start Your Expedition Planning',
  formSubtitle: 'No automated responses. Every route is crafted directly by our field team.',
  hqDeskTitle: 'Expedition Headquarters Desk',
  inquiryEmail: 'expeditions@meridiantravel.com',
  tollFreePhone: '+1 (800) 492-8527',
  internationalPhone: '+44 20 7946 0912',
  operatingHours: 'Monday – Friday: 08:00 – 18:00 GMT',
  liveMonitoringNote: 'Live journey satellite monitoring 24/7',
  outposts: [
    {
      id: 'outpost-leh',
      name: 'Leh Basecamp, Ladakh',
      address: 'Old Fort Road, Leh 194101, High Himalayas',
    },
    {
      id: 'outpost-svolvaer',
      name: 'Svolvær Outpost, Norway',
      address: 'Fiskergata 14, 8300 Lofoten Archipelago',
    },
    {
      id: 'outpost-kyoto',
      name: 'Kyoto Atelier, Japan',
      address: 'Shirakawa-suji, Higashiyama-ku, Kyoto',
    },
  ],
  brandPromiseTitle: 'The Meridian Travel Promise',
  brandPromises: [
    'Small party cap: Maximum 6 travelers per expedition',
    'Full carbon & environmental preservation contribution',
    'Authentic, unscripted local homestays & private refuges',
    'Dedicated photography and regional field leader on all routes',
  ],
};

interface AtlasContextType {
  places: Place[];
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedPlaceId: string | null;
  setSelectedPlaceId: (id: string | null) => void;
  selectedPlace: Place;
  editingPlaceId: string;
  setEditingPlaceId: (id: string) => void;
  savedPlaceIds: string[];
  toggleSavePlace: (id: string) => void;
  isPlaceSaved: (id: string) => boolean;
  updatePlace: (updated: Place) => void;
  createPlace: (draft: Partial<Place>) => Place;
  reorderPlaceFrames: (placeId: string, fromIndex: number, toIndex: number) => void;
  updatePlaceFrameCaption: (placeId: string, frameId: string, caption: string) => void;
  addPlaceFrame: (placeId: string, frame: Omit<PhotoFrame, 'id'>) => void;
  metrics: AtlasMetrics;
  isNewsletterOpen: boolean;
  setIsNewsletterOpen: (open: boolean) => void;
  newsletterSubscribed: boolean;
  subscribeNewsletter: (email: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  openPlaceJournal: (placeId: string) => void;
  openEditor: (placeId: string) => void;

  // Home Page Settings
  homeSettings: HomePageSettings;
  updateHomeSettings: (updates: Partial<HomePageSettings>) => void;
  resetHomeSettings: () => void;

  // Philosophy Page Settings
  philosophySettings: PhilosophySettings;
  updatePhilosophySettings: (updates: Partial<PhilosophySettings>) => void;
  resetPhilosophySettings: () => void;

  // Contact Page Settings
  contactSettings: ContactSettings;
  updateContactSettings: (updates: Partial<ContactSettings>) => void;
  resetContactSettings: () => void;
}

const AtlasContext = createContext<AtlasContextType | undefined>(undefined);

const STORAGE_KEY = 'meridian_travel_places_v2';
const SAVED_KEY = 'meridian_saved_places_v2';
const HOME_SETTINGS_KEY = 'meridian_home_settings_v1';
const PHILOSOPHY_SETTINGS_KEY = 'meridian_philosophy_settings_v1';
const CONTACT_SETTINGS_KEY = 'meridian_contact_settings_v1';

const getViewFromPath = (path: string): ViewMode => {
  if (path === '/admin/home') return 'admin-home';
  if (path === '/admin/pages' || path === '/admin/content' || path === '/admin/philosophy' || path === '/admin/contact') {
    return 'admin-pages';
  }
  if (path === '/admin/editor') return 'admin-editor';
  if (path.startsWith('/admin')) return 'admin-places';
  if (path === '/philosophy') return 'philosophy';
  if (path === '/contact' || path === '/travel-with-us') return 'contact';
  if (path.startsWith('/place/')) return 'place';
  return 'home';
};

export const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<Place[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasRichFrames = parsed.some((p: Place) => p.frames && p.frames.length >= 3);
          if (hasRichFrames) {
            return parsed;
          }
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PLACES;
  });

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return ['ladakh', 'lofoten'];
  });

  const [currentView, setViewState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [homeSettings, setHomeSettings] = useState<HomePageSettings>(() => {
    try {
      const stored = localStorage.getItem(HOME_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_HOME_SETTINGS, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_HOME_SETTINGS;
  });

  const [philosophySettings, setPhilosophySettings] = useState<PhilosophySettings>(() => {
    try {
      const stored = localStorage.getItem(PHILOSOPHY_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_PHILOSOPHY_SETTINGS, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PHILOSOPHY_SETTINGS;
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>(() => {
    try {
      const stored = localStorage.getItem(CONTACT_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_CONTACT_SETTINGS, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_CONTACT_SETTINGS;
  });

  // Start with null so NO card pops up on website load!
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [editingPlaceId, setEditingPlaceId] = useState<string>('ladakh');
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync URL history state
  const setCurrentView = (view: ViewMode) => {
    setViewState(view);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (view === 'admin-places') targetPath = '/admin';
      else if (view === 'admin-home') targetPath = '/admin/home';
      else if (view === 'admin-pages') targetPath = '/admin/pages';
      else if (view === 'admin-editor') targetPath = '/admin/editor';
      else if (view === 'philosophy') targetPath = '/philosophy';
      else if (view === 'contact') targetPath = '/contact';
      else if (view === 'place') targetPath = `/place/${selectedPlaceId || 'expedition'}`;
      else targetPath = '/';

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const view = getViewFromPath(window.location.pathname);
        setViewState(view);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch {
      // ignore
    }
  }, [places]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedPlaceIds));
    } catch {
      // ignore
    }
  }, [savedPlaceIds]);

  useEffect(() => {
    try {
      localStorage.setItem(HOME_SETTINGS_KEY, JSON.stringify(homeSettings));
    } catch {
      // ignore
    }
  }, [homeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(PHILOSOPHY_SETTINGS_KEY, JSON.stringify(philosophySettings));
    } catch {
      // ignore
    }
  }, [philosophySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(contactSettings));
    } catch {
      // ignore
    }
  }, [contactSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Safe fallback to places[0] if selectedPlaceId is null or not found
  const selectedPlace = (selectedPlaceId ? places.find((p) => p.id === selectedPlaceId) : null) || places[0];

  const toggleSavePlace = (id: string) => {
    setSavedPlaceIds((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from your saved expeditions');
        return prev.filter((p) => p !== id);
      } else {
        const place = places.find((p) => p.id === id);
        showToast(`Saved ${place?.name || 'Place'} to your Atlas`);
        return [...prev, id];
      }
    });
  };

  const isPlaceSaved = (id: string) => savedPlaceIds.includes(id);

  const updatePlace = (updated: Place) => {
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy[idx] = {
        ...updated,
        editedTimeAgo: 'Just now',
      };
      return copy;
    });
    showToast(`Updated "${updated.name}" record`);
  };

  const createPlace = (draft: Partial<Place>): Place => {
    const newId =
      draft.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ||
      `place-${Date.now()}`;
    const newDispatch = Math.max(1, ...places.map((p) => p.dispatchNumber)) + 1;

    const newPlace: Place = {
      id: newId,
      name: draft.name || 'Untitled Expedition',
      country: draft.country || 'Unknown Region',
      region: draft.region || 'Worldwide',
      coordinatesText: draft.coordinatesText || '0.00° N, 0.00° E',
      lat: draft.lat ?? 30.0,
      lng: draft.lng ?? 20.0,
      mapX: draft.mapX ?? 50,
      mapY: draft.mapY ?? 50,
      status: draft.status || 'draft',
      dispatchNumber: newDispatch,
      category: draft.category || 'High Altitude',
      oneLineFragment: draft.oneLineFragment || 'A new quiet horizon recorded in the field.',
      narrativeStory:
        draft.narrativeStory ||
        'The route begins where paved roads end. Wind moves through the grass with quiet persistence.',
      heroImage:
        draft.heroImage ||
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      thumbnailImage:
        draft.thumbnailImage ||
        draft.heroImage ||
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      editedTimeAgo: 'Just now',
      frames: [],
      introLines: [
        'A solitary route through unmapped terrain.',
        'Medium format negative exposed at dawn.',
      ],
      subtitle: draft.subtitle || 'Field Dispatch • Expedition Route',
    };

    setPlaces((prev) => [newPlace, ...prev]);
    showToast(`Created new route "${newPlace.name}"`);
    return newPlace;
  };

  const reorderPlaceFrames = (placeId: string, fromIndex: number, toIndex: number) => {
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === placeId);
      if (idx === -1) return prev;
      const place = prev[idx];
      const updatedFrames = reorderFrames(place.frames, fromIndex, toIndex);
      const copy = [...prev];
      copy[idx] = {
        ...place,
        frames: updatedFrames,
        editedTimeAgo: 'Just now',
      };
      return copy;
    });
  };

  const updatePlaceFrameCaption = (placeId: string, frameId: string, caption: string) => {
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === placeId);
      if (idx === -1) return prev;
      const place = prev[idx];
      const updatedFrames = place.frames.map((f) => (f.id === frameId ? { ...f, caption } : f));
      const copy = [...prev];
      copy[idx] = {
        ...place,
        frames: updatedFrames,
        editedTimeAgo: 'Just now',
      };
      return copy;
    });
  };

  const addPlaceFrame = (placeId: string, frame: Omit<PhotoFrame, 'id'>) => {
    const newFrameId = `frame-${Date.now()}`;
    const newFrame: PhotoFrame = {
      ...frame,
      id: newFrameId,
    };
    setPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === placeId);
      if (idx === -1) return prev;
      const place = prev[idx];
      const copy = [...prev];
      copy[idx] = {
        ...place,
        frames: [...place.frames, newFrame],
        editedTimeAgo: 'Just now',
      };
      return copy;
    });
    showToast('Added new photo frame to expedition');
  };

  const subscribeNewsletter = (email: string): boolean => {
    if (!email || !email.includes('@')) return false;
    setNewsletterSubscribed(true);
    showToast(`Subscribed ${email} to Field Dispatches`);
    return true;
  };

  const openPlaceJournal = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setCurrentView('place');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditor = (placeId: string) => {
    setEditingPlaceId(placeId);
    setCurrentView('admin-editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateHomeSettings = (updates: Partial<HomePageSettings>) => {
    setHomeSettings((prev) => {
      const merged = { ...prev, ...updates };
      return merged;
    });
    showToast('Updated Home Page configuration');
  };

  const resetHomeSettings = () => {
    setHomeSettings(DEFAULT_HOME_SETTINGS);
    showToast('Reset Home Page settings to editorial defaults');
  };

  const updatePhilosophySettings = (updates: Partial<PhilosophySettings>) => {
    setPhilosophySettings((prev) => ({ ...prev, ...updates }));
    showToast('Updated Philosophy Page content');
  };

  const resetPhilosophySettings = () => {
    setPhilosophySettings(DEFAULT_PHILOSOPHY_SETTINGS);
    showToast('Reset Philosophy settings to defaults');
  };

  const updateContactSettings = (updates: Partial<ContactSettings>) => {
    setContactSettings((prev) => ({ ...prev, ...updates }));
    showToast('Updated Contact & Expedition Desk details');
  };

  const resetContactSettings = () => {
    setContactSettings(DEFAULT_CONTACT_SETTINGS);
    showToast('Reset Contact settings to defaults');
  };

  const metrics = calculateAtlasMetrics(places);

  return (
    <AtlasContext.Provider
      value={{
        places,
        currentView,
        setCurrentView,
        selectedPlaceId,
        setSelectedPlaceId,
        selectedPlace,
        editingPlaceId,
        setEditingPlaceId,
        savedPlaceIds,
        toggleSavePlace,
        isPlaceSaved,
        updatePlace,
        createPlace,
        reorderPlaceFrames,
        updatePlaceFrameCaption,
        addPlaceFrame,
        metrics,
        isNewsletterOpen,
        setIsNewsletterOpen,
        newsletterSubscribed,
        subscribeNewsletter,
        toastMessage,
        showToast,
        openPlaceJournal,
        openEditor,
        homeSettings,
        updateHomeSettings,
        resetHomeSettings,
        philosophySettings,
        updatePhilosophySettings,
        resetPhilosophySettings,
        contactSettings,
        updateContactSettings,
        resetContactSettings,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
};

export const useAtlas = () => {
  const context = useContext(AtlasContext);
  if (!context) {
    throw new Error('useAtlas must be used within an AtlasProvider');
  }
  return context;
};
