import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
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
import { RankingView } from './components/ranking/RankingView';
import { Footer } from './components/layout/Footer';
import { ALL_MODULES, getModuleByNumber } from './data/modulesList';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeModuleNumber, setActiveModuleNumber] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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
