import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  Rocket, 
  Compass, 
  FlaskConical, 
  Radio, 
  Layers, 
  SunMoon, 
  History, 
  HelpCircle, 
  Award, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Satellite
} from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/sound';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unlockedCount: number;
  totalAchievements: number;
  onOpenAchievements: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  unlockedCount,
  totalAchievements,
  onOpenAchievements,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [missionClock, setMissionClock] = useState('00:00:00');

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const interval = setInterval(() => {
      const now = new Date();
      setMissionClock(now.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClickSound();
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'HOME', icon: <Satellite className="w-4 h-4" /> },
    { id: 'map', label: 'MOON MAP', icon: <Compass className="w-4 h-4" /> },
    { id: 'mission', label: 'MISSION', icon: <Rocket className="w-4 h-4" /> },
    { id: 'lab', label: 'LUNAR LAB', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'rover', label: 'ROVER', icon: <Radio className="w-4 h-4" /> },
    { id: 'resources', label: 'RESOURCES', icon: <Layers className="w-4 h-4" /> },
    { id: 'phases', label: 'PHASES', icon: <SunMoon className="w-4 h-4" /> },
    { id: 'timeline', label: 'TIMELINE', icon: <History className="w-4 h-4" /> },
    { id: 'quiz', label: 'QUIZ', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: TabType) => {
    playClickSound();
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050b18]/85 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Mission Badge */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-inner shadow-cyan-400/30 group-hover:border-cyan-300 transition-all">
              <span className="text-xl">🌙</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  LUNAR EXPLORER
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  NASA/EDU
                </span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400/70 hidden sm:block tracking-wide">
                SYS: ONLINE • {missionClock}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Achievements Button */}
            <button
              id="achievements-modal-toggle-btn"
              onClick={() => {
                playClickSound();
                onOpenAchievements();
              }}
              title="View Mission Achievements"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900/80 border border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-purple-950/40 transition-all shadow-sm shadow-purple-500/10"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline font-bold">BADGES</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-mono">
                {unlockedCount}/{totalAchievements}
              </span>
            </button>

            {/* Audio Toggle Button */}
            <button
              id="audio-toggle-btn"
              onClick={handleSoundToggle}
              title={soundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#050b18]/95 border-b border-cyan-500/30 px-4 pt-2 pb-5 space-y-1 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                      : 'text-slate-300 bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] font-mono text-cyan-400/70">
              MISSION CONTROL: ACTIVE • {missionClock}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
