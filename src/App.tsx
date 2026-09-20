import React, { useState } from 'react';
import { TabType, LunarLocation } from './types';
import { ACHIEVEMENTS, LUNAR_LOCATIONS } from './data/lunarData';
import { Starfield } from './components/Starfield';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LunarMap } from './components/LunarMap';
import { MissionSimulator } from './components/MissionSimulator';
import { LunarLab } from './components/LunarLab';
import { LunarRoverSimulator } from './components/LunarRoverSimulator';
import { LunarResources } from './components/LunarResources';
import { MoonPhasesSimulator } from './components/MoonPhasesSimulator';
import { LunarTimeline } from './components/LunarTimeline';
import { LunarQuiz } from './components/LunarQuiz';
import { LunaAssistant } from './components/LunaAssistant';
import { AchievementsModal } from './components/AchievementsModal';
import { CheckCircle2 } from 'lucide-react';
import { playSuccessChime } from './utils/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedLocation, setSelectedLocation] = useState<LunarLocation | null>(LUNAR_LOCATIONS[0]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(['lunar_pioneer']);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [recentUnlockToast, setRecentUnlockToast] = useState<{ id: string; title: string; icon: string } | null>(null);

  // Unlock achievement handler with notification toast
  const unlockAchievement = (id: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        setRecentUnlockToast({ id, title: achievement.title, icon: achievement.icon });
        playSuccessChime();
        setTimeout(() => setRecentUnlockToast(null), 4500);
      }
      return [...prev, id];
    });
  };

  const handleNavigate = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationSelect = (loc: LunarLocation) => {
    setSelectedLocation(loc);
    setCurrentTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Animated Starfield Background */}
      <Starfield />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        unlockedCount={unlockedAchievements.length}
        totalAchievements={ACHIEVEMENTS.length}
        onOpenAchievements={() => setAchievementsModalOpen(true)}
      />

      {/* Achievement Unlock Toast Notification */}
      {recentUnlockToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/95 border border-purple-400 text-white shadow-2xl shadow-purple-500/30 animate-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-xl">
            {recentUnlockToast.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACHIEVEMENT UNLOCKED!</span>
            </div>
            <div className="font-display font-bold text-sm text-white">
              {recentUnlockToast.title}
            </div>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="relative z-10 pb-16">
        {currentTab === 'home' && (
          <HeroSection
            onNavigate={handleNavigate}
            onSelectLocation={handleLocationSelect}
          />
        )}

        {currentTab === 'map' && (
          <LunarMap
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            onUnlockAchievement={unlockAchievement}
          />
        )}

        {currentTab === 'mission' && (
          <MissionSimulator onUnlockAchievement={unlockAchievement} />
        )}

        {currentTab === 'lab' && (
          <LunarLab onUnlockAchievement={unlockAchievement} />
        )}

        {currentTab === 'rover' && (
          <LunarRoverSimulator onUnlockAchievement={unlockAchievement} />
        )}

        {currentTab === 'resources' && (
          <LunarResources onUnlockAchievement={unlockAchievement} />
        )}

        {currentTab === 'phases' && (
          <MoonPhasesSimulator />
        )}

        {currentTab === 'timeline' && (
          <LunarTimeline onUnlockAchievement={unlockAchievement} />
        )}

        {currentTab === 'quiz' && (
          <LunarQuiz onUnlockAchievement={unlockAchievement} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#02050e]/90 py-8 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400 font-display font-bold">LUNAR EXPLORER</span>
            <span>• NASA Artemis Educational Project</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Orbital Synchronous Telemetry</span>
            <span>•</span>
            <button
              onClick={() => setAchievementsModalOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Badges ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </button>
          </div>
        </div>
      </footer>

      {/* LUNA AI Floating Interactive Chat Copilot */}
      <LunaAssistant onUnlockAchievement={unlockAchievement} />

      {/* Badges and Honors Modal */}
      <AchievementsModal
        unlockedIds={unlockedAchievements}
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
      />

    </div>
  );
}
