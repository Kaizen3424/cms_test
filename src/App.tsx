import React, { useState } from 'react';
import { AtlasProvider, useAtlas } from './context/AtlasContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeExplorer } from './components/HomeExplorer';
import { PhilosophyView } from './components/PhilosophyView';
import { PlaceJournalView } from './components/PlaceJournalView';
import { AdminPlacesView } from './components/AdminPlacesView';
import { AdminHomeView } from './components/AdminHomeView';
import { AdminPagesView } from './components/AdminPagesView';
import { AdminEditorView } from './components/AdminEditorView';
import { TravelWithUsView } from './components/TravelWithUsView';
import { NewsletterModal } from './components/NewsletterModal';
import { NewPlaceModal } from './components/NewPlaceModal';

const AppContent: React.FC = () => {
  const { currentView, toastMessage } = useAtlas();
  const [isNewPlaceModalOpen, setIsNewPlaceModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#e60023] selection:text-white bg-[#f7f6f2] text-[#1a1a18]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1a1a18] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#e60023]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {currentView === 'home' && <HomeExplorer />}
        {currentView === 'philosophy' && <PhilosophyView />}
        {currentView === 'place' && <PlaceJournalView />}
        {currentView === 'contact' && <TravelWithUsView />}
        {currentView === 'admin-places' && (
          <AdminPlacesView onNewPlaceClick={() => setIsNewPlaceModalOpen(true)} />
        )}
        {currentView === 'admin-home' && <AdminHomeView />}
        {currentView === 'admin-pages' && <AdminPagesView />}
        {currentView === 'admin-editor' && <AdminEditorView />}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <NewsletterModal />
      <NewPlaceModal
        isOpen={isNewPlaceModalOpen}
        onClose={() => setIsNewPlaceModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AtlasProvider>
      <AppContent />
    </AtlasProvider>
  );
}
