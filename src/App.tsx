import React, { useState, useEffect } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { FeatureAnnouncementModal } from './components/announcements/FeatureAnnouncementModal';
import {
  DUEL_1VS1_ANNOUNCEMENT,
  hasUserSeenAnnouncement,
  markAnnouncementAsSeen
} from './components/announcements/announcementsConfig';
import { CelebrationModal } from './components/common/CelebrationModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { CoursesView } from './components/courses/CoursesView';
import { ModuleDetailView } from './components/module/ModuleDetailView';
import { BadgesView } from './components/badges/BadgesView';
import { ProgressView } from './components/progress/ProgressView';
import { ReviewView } from './components/review/ReviewView';
import { ResourcesView } from './components/resources/ResourcesView';
import { ExamsPortalView } from './components/exams/ExamsPortalView';
import { ChallengesPortalView } from './components/challenges/ChallengesPortalView';
import { OnlineChallengesPortalView } from './components/onlineChallenges/OnlineChallengesPortalView';
import { TeamDuelPortalView } from './components/teamDuel/TeamDuelPortalView';
import { LogicArenaView } from './components/logicArena/LogicArenaView';
import { RankingView } from './components/ranking/RankingView';
import { Footer } from './components/layout/Footer';
import { ALL_MODULES, getModuleByNumber } from './data/modulesList';

const MainApp: React.FC = () => {
  const { progress } = useProgress();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeModuleNumber, setActiveModuleNumber] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState<boolean>(false);

  // Anuncio visual para comunicar la nueva funcionalidad Duelo 1 vs 1
  useEffect(() => {
    // Solo debe aparecer al ingresar a la página principal / inicio (dashboard)
    if (currentView !== 'dashboard') return;
    // Si es un alumno nuevo sin onboarding completado, se prioriza el WelcomeModal
    if (!progress.userName || !progress.onboardingCompleted) return;

    // Verificar si el usuario ya vio el anuncio
    const alreadySeen = hasUserSeenAnnouncement(DUEL_1VS1_ANNOUNCEMENT.id, progress.userName);
    if (!alreadySeen && DUEL_1VS1_ANNOUNCEMENT.active) {
      const timer = setTimeout(() => {
        setAnnouncementModalOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentView, progress.userName, progress.onboardingCompleted]);

  const handleCloseAnnouncement = () => {
    markAnnouncementAsSeen(DUEL_1VS1_ANNOUNCEMENT.id, progress.userName);
    setAnnouncementModalOpen(false);
  };

  const handleActionAnnouncement = () => {
    markAnnouncementAsSeen(DUEL_1VS1_ANNOUNCEMENT.id, progress.userName);
    setAnnouncementModalOpen(false);
    handleNavigate('online-challenges');
  };

  const handleSelectModule = (num: number) => {
    setActiveModuleNumber(num);
    setCurrentView('module');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewType) => {
    if (view === 'settings') {
      setSettingsOpen(true);
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeModule = getModuleByNumber(activeModuleNumber) || ALL_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        currentView={currentView}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView
              onSelectModule={handleSelectModule}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'roadmap' && (
            <RoadmapView
              onSelectModule={handleSelectModule}
            />
          )}

          {currentView === 'courses' && (
            <CoursesView
              onSelectModule={handleSelectModule}
            />
          )}

          {currentView === 'module' && (
            <ModuleDetailView
              module={activeModule}
              onBack={() => setCurrentView('dashboard')}
              onSelectModule={handleSelectModule}
            />
          )}

          {currentView === 'exams' && (
            <ExamsPortalView />
          )}

          {currentView === 'challenges' && (
            <ChallengesPortalView
              onViewRanking={() => handleNavigate('ranking')}
            />
          )}

          {currentView === 'online-challenges' && (
            <OnlineChallengesPortalView
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'team-duel' && (
            <TeamDuelPortalView
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'logic-arena' && (
            <LogicArenaView
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'ranking' && (
            <RankingView
              onGoToChallenges={() => handleNavigate('challenges')}
            />
          )}

          {currentView === 'badges' && (
            <BadgesView />
          )}

          {currentView === 'progress' && (
            <ProgressView />
          )}

          {currentView === 'review' && (
            <ReviewView
              onSelectModule={handleSelectModule}
            />
          )}

          {currentView === 'resources' && (
            <ResourcesView />
          )}
        </main>

      </div>

      {/* Institutional Footer */}
      <Footer hidden={currentView === 'module'} />

      {/* Global Modals & Overlays */}
      <WelcomeModal />
      <FeatureAnnouncementModal
        isOpen={announcementModalOpen}
        onClose={handleCloseAnnouncement}
        onAction={handleActionAnnouncement}
        announcement={DUEL_1VS1_ANNOUNCEMENT}
      />
      <CelebrationModal />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <MainApp />
    </ProgressProvider>
  );
}
