import React from 'react';
import { TabType, LunarLocation } from '../types';
import { ThreeMoonCanvas } from './ThreeMoonCanvas';
import { 
  Rocket, 
  Compass, 
  Activity, 
  ShieldCheck, 
  Orbit, 
  Thermometer, 
  Scale, 
  Maximize2,
  ChevronRight,
  Globe2,
  Sparkles
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface HeroSectionProps {
  onNavigate: (tab: TabType) => void;
  onSelectLocation?: (location: LunarLocation) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onSelectLocation }) => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden py-8 lg:py-12">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 hud-grid opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Mission Status & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Mission Identifier Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>PROJECT ARTEMIS & LUNAR SCIENCE PLATFORM</span>
            </div>

            {/* Main Heading & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-none">
                LUNAR <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                  EXPLORER
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-light tracking-wide max-w-xl italic">
                “Journey beyond Earth. Discover the Moon.”
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
              Step into mission control. Investigate craters, launch orbital spacecraft, operate a lunar surface rover, simulate asteroid impacts, and uncover deep-freeze polar ice deposits.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-start-exploration-btn"
                onClick={() => {
                  playClickSound();
                  onNavigate('mission');
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5"
              >
                <Rocket className="w-4 h-4" />
                <span>START EXPLORATION</span>
              </button>

              <button
                id="hero-explore-moon-btn"
                onClick={() => {
                  playClickSound();
                  onNavigate('map');
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 hover:text-white font-display font-bold text-sm tracking-wider uppercase border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-md shadow-black/50"
              >
                <span>🌙</span>
                <span>EXPLORE THE MOON</span>
              </button>
            </div>

            {/* Required Mission Status Panel */}
            <div className="pt-4">
              <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 max-w-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                      TELEMETRY SUBSYSTEM
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold">
                    NOMINAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">MISSION STATUS</span>
                    <span className="text-white font-bold tracking-wide">READY</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                    <span className="text-cyan-300 font-bold tracking-wide">MOON (LUNA)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">CREW</span>
                    <span className="text-white font-bold tracking-wide">EXPLORER</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">SYSTEM</span>
                    <span className="text-emerald-400 font-bold tracking-wide">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Moon & Floating Telemetry Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px]">
            
            {/* Background Halo */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/10 filter blur-3xl pointer-events-none" />

            {/* Interactive 3D Moon Canvas */}
            <div className="w-full h-[440px] sm:h-[500px] relative z-10">
              <ThreeMoonCanvas
                onSelectLocation={(loc) => {
                  if (onSelectLocation) onSelectLocation(loc);
                  onNavigate('map');
                }}
                autoRotateSpeed={0.0025}
                showPins={true}
                enableZoom={true}
              />
            </div>

            {/* Floating Information Labels around the Moon */}
            {/* Top Left: Moon Radius */}
            <div className="absolute top-2 left-2 sm:left-4 z-20 glass-panel p-2.5 rounded-xl border border-cyan-500/30 text-xs font-mono backdrop-blur-md shadow-lg shadow-black/60 max-w-[150px] sm:max-w-[180px] pointer-events-none">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold">
                <Orbit className="w-3 h-3" />
                <span>Moon Radius</span>
              </div>
              <div className="text-white font-bold text-sm sm:text-base mt-0.5">1,737.4 km</div>
              <div className="text-slate-400 text-[10px]">~27% of Earth's size</div>
            </div>

            {/* Top Right: Distance from Earth */}
            <div className="absolute top-4 right-2 sm:right-4 z-20 glass-panel p-2.5 rounded-xl border border-indigo-500/30 text-xs font-mono backdrop-blur-md shadow-lg shadow-black/60 max-w-[150px] sm:max-w-[180px] pointer-events-none">
              <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] uppercase font-bold">
                <Globe2 className="w-3 h-3" />
                <span>Distance to Earth</span>
              </div>
              <div className="text-white font-bold text-sm sm:text-base mt-0.5">384,400 km</div>
              <div className="text-slate-400 text-[10px]">~1.28 Light Seconds</div>
            </div>

            {/* Middle Left: Gravity */}
            <div className="absolute bottom-24 left-1 sm:left-2 z-20 glass-panel p-2.5 rounded-xl border border-emerald-500/30 text-xs font-mono backdrop-blur-md shadow-lg shadow-black/60 max-w-[150px] sm:max-w-[180px] pointer-events-none">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold">
                <Scale className="w-3 h-3" />
                <span>Surface Gravity</span>
              </div>
              <div className="text-white font-bold text-sm sm:text-base mt-0.5">1.62 m/s²</div>
              <div className="text-slate-400 text-[10px]">16.6% (1/6th of Earth)</div>
            </div>

            {/* Bottom Right: Temperature */}
            <div className="absolute bottom-20 right-2 sm:right-4 z-20 glass-panel p-2.5 rounded-xl border border-amber-500/30 text-xs font-mono backdrop-blur-md shadow-lg shadow-black/60 max-w-[150px] sm:max-w-[180px] pointer-events-none">
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] uppercase font-bold">
                <Thermometer className="w-3 h-3" />
                <span>Temperature</span>
              </div>
              <div className="text-white font-bold text-sm sm:text-base mt-0.5">-130°C to +120°C</div>
              <div className="text-slate-400 text-[10px]">Extreme No-Atmosphere</div>
            </div>

            {/* Bottom Center: Orbital Period */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-20 glass-panel px-3 py-1.5 rounded-full border border-purple-500/30 text-xs font-mono backdrop-blur-md shadow-lg shadow-black/60 whitespace-nowrap pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-slate-300">Orbital Period:</span>
              <span className="text-purple-300 font-bold">27.3 Earth Days</span>
              <span className="text-slate-500 text-[10px]">(Tidally Locked)</span>
            </div>

          </div>

        </div>

        {/* Quick Explorer Hub Cards */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button
            id="hub-card-moon-map"
            onClick={() => {
              playClickSound();
              onNavigate('map');
            }}
            className="glass-panel glass-panel-hover p-4 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <Compass className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-display font-bold text-sm text-white group-hover:text-cyan-300">
              Interactive Map
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Explore craters, Apollo landing sites, and volcanic maria.
            </p>
          </button>

          <button
            id="hub-card-mission-control"
            onClick={() => {
              playClickSound();
              onNavigate('mission');
            }}
            className="glass-panel glass-panel-hover p-4 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center justify-between text-blue-400 mb-2">
              <Rocket className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-display font-bold text-sm text-white group-hover:text-blue-300">
              Mission Control
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure spacecraft, set flight duration, and launch to orbit.
            </p>
          </button>

          <button
            id="hub-card-lunar-lab"
            onClick={() => {
              playClickSound();
              onNavigate('lab');
            }}
            className="glass-panel glass-panel-hover p-4 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-display font-bold text-sm text-white group-hover:text-purple-300">
              Science Laboratory
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test gravity drops, simulate asteroid craters, and thermal swings.
            </p>
          </button>

          <button
            id="hub-card-rover-sim"
            onClick={() => {
              playClickSound();
              onNavigate('rover');
            }}
            className="glass-panel glass-panel-hover p-4 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="font-display font-bold text-sm text-white group-hover:text-emerald-300">
              Rover Surface Ops
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pilot a robotic explorer, gather rock samples, and hunt ice.
            </p>
          </button>

        </div>

      </div>
    </section>
  );
};
