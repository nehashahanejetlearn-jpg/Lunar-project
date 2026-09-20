import React, { useState } from 'react';
import { LUNAR_PHASES } from '../data/lunarData';
import { 
  SunMoon, 
  RotateCw, 
  Info, 
  Compass, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Sun
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const MoonPhasesSimulator: React.FC = () => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const currentPhase = LUNAR_PHASES[selectedPhaseIndex];

  const handleNextPhase = () => {
    playClickSound();
    setSelectedPhaseIndex(prev => (prev + 1) % LUNAR_PHASES.length);
  };

  const handlePrevPhase = () => {
    playClickSound();
    setSelectedPhaseIndex(prev => (prev - 1 + LUNAR_PHASES.length) % LUNAR_PHASES.length);
  };

  // Convert orbital angle to x, y coordinates on orbital ring
  const orbitRadius = 110;
  const angleRad = (currentPhase.angleDeg * Math.PI) / 180;
  // Let Sun be on the Right (X > 0)
  const moonX = 160 + orbitRadius * Math.cos(angleRad);
  const moonY = 160 + orbitRadius * Math.sin(angleRad);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <SunMoon className="w-4 h-4 text-cyan-400" />
          <span>ORBITAL CELESTIAL MECHANICS & SYNODIC CYCLES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          MOON PHASES SIMULATOR
        </h2>
        <p className="text-sm text-slate-400">
          Understand why the Moon changes shape throughout the 29.5-day lunar month through interactive Earth-Moon-Sun orbital geometry.
        </p>
      </div>

      {/* Main Dual-View Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Top-Down Orbital Diagram */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 relative overflow-hidden bg-gradient-to-b from-[#060f22] to-[#02050e]">
          
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-slate-800 pb-2">
            <span>VIEW 1: TOP-DOWN ORBITAL PERSPECTIVE</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              <span>SUNLIGHT → FROM RIGHT</span>
            </span>
          </div>

          {/* Interactive SVG Orbit Stage */}
          <div className="relative flex items-center justify-center min-h-[340px]">
            <svg viewBox="0 0 360 320" className="w-full max-w-[360px] h-auto">
              {/* Sunlight Rays on Right */}
              <g stroke="#f59e0b" strokeWidth="1.5" opacity="0.6">
                <line x1="330" y1="60" x2="290" y2="60" strokeDasharray="4,4" />
                <line x1="330" y1="110" x2="290" y2="110" strokeDasharray="4,4" />
                <line x1="330" y1="160" x2="290" y2="160" strokeDasharray="4,4" />
                <line x1="330" y1="210" x2="290" y2="210" strokeDasharray="4,4" />
                <line x1="330" y1="260" x2="290" y2="260" strokeDasharray="4,4" />
              </g>

              {/* Orbital Ring */}
              <circle
                cx="160"
                cy="160"
                r={orbitRadius}
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeDasharray="5,5"
                strokeWidth="1.5"
              />

              {/* Central Earth */}
              <circle cx="160" cy="160" r="26" fill="#1d4ed8" />
              {/* Earth Night side (left) */}
              <path
                d="M 160,134 A 26,26 0 0,0 160,186 Z"
                fill="#0f172a"
                opacity="0.85"
              />
              <circle cx="160" cy="160" r="26" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="160" y="164" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                EARTH
              </text>

              {/* Clickable Phase nodes along the circle */}
              {LUNAR_PHASES.map((p, idx) => {
                const rad = (p.angleDeg * Math.PI) / 180;
                const px = 160 + orbitRadius * Math.cos(rad);
                const py = 160 + orbitRadius * Math.sin(rad);
                const isSelected = idx === selectedPhaseIndex;

                return (
                  <g
                    key={p.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedPhaseIndex(idx);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? 14 : 9}
                      fill={isSelected ? '#06b6d4' : '#1e293b'}
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? 2.5 : 1}
                    />
                    {/* Dark/lit half of Moon */}
                    <path
                      d={`M ${px},${py - (isSelected ? 14 : 9)} A ${isSelected ? 14 : 9},${isSelected ? 14 : 9} 0 0,0 ${px},${py + (isSelected ? 14 : 9)} Z`}
                      fill="#030712"
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Active Moon Pointer & Glow */}
              <circle
                cx={moonX}
                cy={moonY}
                r="18"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                className="animate-ping opacity-40"
              />
            </svg>
          </div>

          {/* Stepper Controls & Slider */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <button
              onClick={handlePrevPhase}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>

            {/* Slider */}
            <div className="flex-1 text-center">
              <input
                id="moon-phase-slider"
                type="range"
                min="0"
                max={LUNAR_PHASES.length - 1}
                value={selectedPhaseIndex}
                onChange={e => setSelectedPhaseIndex(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="text-[11px] font-mono text-cyan-400 mt-1">
                CYCLE DAY: ~{Math.round(selectedPhaseIndex * 3.7)} / 29.5 DAYS
              </div>
            </div>

            <button
              onClick={handleNextPhase}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Earth Observer View & Explanation */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-6">
            
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                VIEW 2: SKY WATCHER VIEW (FROM EARTH)
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                {currentPhase.name}
              </h3>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                ILLUMINATION VISIBLE: <strong className="text-cyan-300">{currentPhase.illumination}</strong>
              </div>
            </div>

            {/* Earth Night Sky Visualizer (Simulated Phase Sphere) */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="relative w-36 h-36 rounded-full bg-slate-900 border-2 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Lit fraction simulation */}
                <div
                  className="w-full h-full rounded-full transition-all duration-300"
                  style={{
                    background:
                      currentPhase.id === 'new_moon'
                        ? '#090d16'
                        : currentPhase.id === 'full_moon'
                        ? '#f8fafc'
                        : currentPhase.id === 'first_quarter'
                        ? 'linear-gradient(to right, #090d16 50%, #f8fafc 50%)'
                        : currentPhase.id === 'third_quarter'
                        ? 'linear-gradient(to right, #f8fafc 50%, #090d16 50%)'
                        : currentPhase.id === 'waxing_crescent'
                        ? 'radial-gradient(circle at 75% 50%, #f8fafc 28%, #090d16 35%)'
                        : currentPhase.id === 'waning_crescent'
                        ? 'radial-gradient(circle at 25% 50%, #f8fafc 28%, #090d16 35%)'
                        : '#cbd5e1',
                    boxShadow: currentPhase.id !== 'new_moon' ? '0 0 25px rgba(255,255,255,0.2)' : 'none',
                  }}
                />
              </div>

              <div className="text-xs font-mono text-cyan-300 font-bold mt-4 tracking-wider uppercase">
                {currentPhase.name}
              </div>
            </div>

            {/* Explanation text */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                WHY THIS HAPPENS:
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {currentPhase.description}
              </p>
            </div>

            {/* Fun Astro Fact */}
            <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-500/30 text-xs text-blue-200 space-y-1">
              <div className="font-bold font-mono text-blue-300">ASTRONOMICAL FACT:</div>
              <p>{currentPhase.fact}</p>
            </div>

            {/* Misconception Buster */}
            <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <div className="font-bold font-mono text-purple-300">COMMON MISCONCEPTION BUSTER:</div>
              <p>
                Moon phases are <strong>NOT caused by Earth's shadow</strong>! Half the Moon is always illuminated by the Sun at all times; phases only change because of where we stand on Earth while looking at that sunlit sphere. Earth's shadow only hits the Moon during a rare <em>Lunar Eclipse</em>!
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
