import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Scale, 
  Flame, 
  Thermometer, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldAlert, 
  Zap,
  Layers,
  Award
} from 'lucide-react';
import { playClickSound, playImpactBoom, playHoverBeep } from '../utils/sound';

interface LunarLabProps {
  onUnlockAchievement: (id: string) => void;
}

type LabTab = 'gravity' | 'crater' | 'temperature';

export const LunarLab: React.FC<LunarLabProps> = ({ onUnlockAchievement }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('gravity');
  const [experimentsRan, setExperimentsRan] = useState<Set<string>>(new Set());

  // 1. Gravity Experiment State
  const [objectType, setObjectType] = useState<'astronaut' | 'rock' | 'feather' | 'lander'>('astronaut');
  const [dropHeightM, setDropHeightM] = useState<number>(10);
  const [isDropping, setIsDropping] = useState(false);
  const [dropProgress, setDropProgress] = useState<{ earth: number; moon: number; mars: number }>({
    earth: 0,
    moon: 0,
    mars: 0,
  });
  const [dropStats, setDropStats] = useState<{
    earthTime: number;
    moonTime: number;
    marsTime: number;
    earthVel: number;
    moonVel: number;
    marsVel: number;
  }>({
    earthTime: 0,
    moonTime: 0,
    marsTime: 0,
    earthVel: 0,
    moonVel: 0,
    marsVel: 0,
  });

  // 2. Crater Experiment State
  const [asteroidSizeM, setAsteroidSizeM] = useState<number>(50); // 10 to 500m
  const [impactSpeedKmS, setImpactSpeedKmS] = useState<number>(20); // 12 to 72 km/s
  const [impactAngleDeg, setImpactAngleDeg] = useState<number>(45); // 15 to 90 deg
  const [craterResult, setCraterResult] = useState<{
    diameterKm: number;
    depthM: number;
    energyMegatons: number;
    blastRadiusKm: number;
  }>({
    diameterKm: 0.95,
    depthM: 190,
    energyMegatons: 12.8,
    blastRadiusKm: 4.2,
  });
  const [isImpactAnimating, setIsImpactAnimating] = useState(false);

  // 3. Temperature Experiment State
  const [thermalZone, setThermalZone] = useState<'sunlight' | 'shadow' | 'lunar_night' | 'polar_psr'>('sunlight');

  // Track experiments for achievement
  const recordExperiment = (expId: string) => {
    const next = new Set(experimentsRan);
    next.add(expId);
    setExperimentsRan(next);
    if (next.size >= 2) {
      onUnlockAchievement('lunar_scientist');
    }
  };

  // Run Gravity Drop Simulation
  const handleDrop = () => {
    if (isDropping) return;
    playClickSound();
    setIsDropping(true);
    recordExperiment('gravity');

    const gEarth = 9.807;
    const gMoon = 1.62;
    const gMars = 3.72;

    const tEarth = Math.sqrt((2 * dropHeightM) / gEarth);
    const tMoon = Math.sqrt((2 * dropHeightM) / gMoon);
    const tMars = Math.sqrt((2 * dropHeightM) / gMars);

    const vEarth = gEarth * tEarth;
    const vMoon = gMoon * tMoon;
    const vMars = gMars * tMars;

    setDropStats({
      earthTime: parseFloat(tEarth.toFixed(2)),
      moonTime: parseFloat(tMoon.toFixed(2)),
      marsTime: parseFloat(tMars.toFixed(2)),
      earthVel: parseFloat(vEarth.toFixed(1)),
      moonVel: parseFloat(vMoon.toFixed(1)),
      marsVel: parseFloat(vMars.toFixed(1)),
    });

    setDropProgress({ earth: 0, moon: 0, mars: 0 });

    const startTime = performance.now();
    const maxDurationMs = tMoon * 1000;

    const animateFrame = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;

      const pEarth = Math.min(100, (0.5 * gEarth * elapsedSec * elapsedSec / dropHeightM) * 100);
      const pMoon = Math.min(100, (0.5 * gMoon * elapsedSec * elapsedSec / dropHeightM) * 100);
      const pMars = Math.min(100, (0.5 * gMars * elapsedSec * elapsedSec / dropHeightM) * 100);

      setDropProgress({ earth: pEarth, moon: pMoon, mars: pMars });

      if (elapsedSec < tMoon) {
        requestAnimationFrame(animateFrame);
      } else {
        setIsDropping(false);
        playImpactBoom();
      }
    };

    requestAnimationFrame(animateFrame);
  };

  // Run Crater Simulation
  const calculateCrater = () => {
    playClickSound();
    setIsImpactAnimating(true);
    playImpactBoom();
    recordExperiment('crater');

    // Real-world planetary science scaling approximation
    // Kinetic energy: E = 0.5 * mass * v^2
    // Asteroid density ~ 3000 kg/m^3 (stony chondrite)
    const radius = asteroidSizeM / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const massKg = volume * 3000;
    const velocityMS = impactSpeedKmS * 1000;
    const energyJoules = 0.5 * massKg * Math.pow(velocityMS, 2);
    // 1 Megaton TNT = 4.184e15 Joules
    const energyMegatons = energyJoules / 4.184e15;

    // Crater diameter scaling with angle sin(theta)^(1/3)
    const angleRad = (impactAngleDeg * Math.PI) / 180;
    const angleFactor = Math.pow(Math.sin(angleRad), 1 / 3);

    // Approximate lunar crater diameter (Piekutowski / Melosh scaling)
    const diameterKm = (0.07 * Math.pow(energyMegatons, 0.28) * angleFactor);
    const depthM = diameterKm * 1000 * 0.2; // roughly 1:5 depth-to-diameter ratio
    const blastRadiusKm = Math.pow(energyMegatons, 0.33) * 2.2;

    setTimeout(() => {
      setCraterResult({
        diameterKm: parseFloat(Math.max(0.05, diameterKm).toFixed(2)),
        depthM: Math.round(depthM),
        energyMegatons: parseFloat(energyMegatons.toFixed(2)),
        blastRadiusKm: parseFloat(blastRadiusKm.toFixed(1)),
      });
      setIsImpactAnimating(false);
    }, 600);
  };

  useEffect(() => {
    // initialize drop stats
    const gEarth = 9.807;
    const gMoon = 1.62;
    const gMars = 3.72;
    setDropStats({
      earthTime: parseFloat(Math.sqrt((2 * dropHeightM) / gEarth).toFixed(2)),
      moonTime: parseFloat(Math.sqrt((2 * dropHeightM) / gMoon).toFixed(2)),
      marsTime: parseFloat(Math.sqrt((2 * dropHeightM) / gMars).toFixed(2)),
      earthVel: parseFloat((gEarth * Math.sqrt((2 * dropHeightM) / gEarth)).toFixed(1)),
      moonVel: parseFloat((gMoon * Math.sqrt((2 * dropHeightM) / gMoon)).toFixed(1)),
      marsVel: parseFloat((gMars * Math.sqrt((2 * dropHeightM) / gMars)).toFixed(1)),
    });
  }, [dropHeightM]);

  const objects = [
    { id: 'astronaut', label: 'Astronaut (Suit)', icon: '🧑‍🚀', mass: '120 kg' },
    { id: 'rock', label: 'Basalt Boulder', icon: '🪨', mass: '45 kg' },
    { id: 'feather', label: 'Apollo Feather', icon: '🪶', mass: '0.01 kg (Vacuum)' },
    { id: 'lander', label: 'Equipment Pack', icon: '🎒', mass: '350 kg' },
  ];

  const thermalData = {
    sunlight: {
      title: 'Direct Sunlight (Lunar Noon)',
      tempC: '+120°C',
      tempF: '+248°F',
      desc: 'Blistering heat exceeding boiling water! With no air to scatter or absorb solar photons, the regolith acts as a thermal sponge.',
      hazard: 'Space suits require multilayer aluminized insulation and active sublimation water-ice chillers.',
      color: 'from-amber-500/20 to-rose-600/20',
      borderColor: 'border-amber-500/40',
      badgeColor: 'text-amber-400 bg-amber-950/80',
    },
    shadow: {
      title: 'Bolder / Crater Shadow',
      tempC: '-130°C',
      tempF: '-202°F',
      desc: 'Stepping into a shadow drops temperature by over 250°C in seconds! On Earth, air circulates heat, but on the Moon vacuum prevents thermal diffusion.',
      hazard: 'Metals rapidly contract and become brittle; mechanical joints require cryogenic dry lubricants.',
      color: 'from-blue-900/20 to-cyan-950/20',
      borderColor: 'border-blue-500/40',
      badgeColor: 'text-blue-300 bg-blue-950/80',
    },
    lunar_night: {
      title: 'Lunar Night (14 Earth Days)',
      tempC: '-150°C',
      tempF: '-238°F',
      desc: 'Night lasts for two straight weeks. Surface heat radiates into outer space with no cloud blanket to preserve warmth.',
      hazard: 'Solar panels produce zero energy. Habitats must use radioisotope thermoelectric generators (RTG) or fission reactors.',
      color: 'from-indigo-950/40 to-slate-950/40',
      borderColor: 'border-indigo-500/40',
      badgeColor: 'text-indigo-300 bg-indigo-950/80',
    },
    polar_psr: {
      title: 'Permanently Shadowed Region (PSR)',
      tempC: '-246°C',
      tempF: '-410°F',
      desc: 'One of the coldest places in the entire Solar System, colder than the surface of Pluto! Sunlight has not entered here in 2 billion years.',
      hazard: 'Locks cryogenic water-ice, methane, and ammonia in glass-hard permafrost.',
      color: 'from-cyan-950/40 to-teal-950/40',
      borderColor: 'border-cyan-400/50',
      badgeColor: 'text-cyan-300 bg-cyan-950/80',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span>EXPERIMENTAL ASTROPHYSICS & PLANETARY GEOLOGY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          LUNAR SCIENCE LABORATORY
        </h2>
        <p className="text-sm text-slate-400">
          Conduct hands-on scientific experiments comparing gravity, modeling asteroid impact craters, and testing thermal swings.
        </p>
      </div>

      {/* Lab Module Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          id="lab-tab-gravity"
          onClick={() => {
            playClickSound();
            setActiveTab('gravity');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all ${
            activeTab === 'gravity'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'glass-panel text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>GRAVITY EXPERIMENT</span>
        </button>

        <button
          id="lab-tab-crater"
          onClick={() => {
            playClickSound();
            setActiveTab('crater');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all ${
            activeTab === 'crater'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'glass-panel text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>CRATER IMPACT EXPERIMENT</span>
        </button>

        <button
          id="lab-tab-temperature"
          onClick={() => {
            playClickSound();
            setActiveTab('temperature');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all ${
            activeTab === 'temperature'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'glass-panel text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>TEMPERATURE CHAMBER</span>
        </button>
      </div>

      {/* EXPERIMENT 1: GRAVITY COMPARISON */}
      {activeTab === 'gravity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                TEST SETUP
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                FREE-FALL ACCELERATION
              </h3>
              <p className="text-xs text-slate-400">
                In a vacuum, all objects accelerate at the exact same rate regardless of mass!
              </p>
            </div>

            {/* Object selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                SELECT TEST OBJECT:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {objects.map(obj => (
                  <button
                    key={obj.id}
                    onClick={() => {
                      playClickSound();
                      setObjectType(obj.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      objectType === obj.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-lg">{obj.icon}</div>
                    <div className="text-xs font-mono font-bold mt-1 truncate">{obj.label}</div>
                    <div className="text-[10px] text-slate-500">{obj.mass}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">DROP HEIGHT (h):</span>
                <span className="text-cyan-300 font-bold">{dropHeightM} METERS</span>
              </div>
              <input
                id="gravity-height-slider"
                type="range"
                min="2"
                max="30"
                value={dropHeightM}
                onChange={e => setDropHeightM(Number(e.target.value))}
                disabled={isDropping}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2m (Ladder)</span>
                <span>15m (Habitat)</span>
                <span>30m (Tower)</span>
              </div>
            </div>

            {/* Drop Trigger Button */}
            <button
              id="release-drop-btn"
              onClick={handleDrop}
              disabled={isDropping}
              className={`w-full py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isDropping
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isDropping ? 'FREE-FALL IN PROGRESS...' : 'RELEASE OBJECTS'}</span>
            </button>

            {/* Physics Formula Note */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-cyan-400 font-bold">PHYSICS CONSTANTS:</div>
              <div>• Earth: g = 9.80 m/s²</div>
              <div>• Moon: g = 1.62 m/s² (1/6th)</div>
              <div>• Mars: g = 3.72 m/s² (38%)</div>
              <div className="text-slate-500 pt-1 text-[10px]">Formula: t = √(2h / g)</div>
            </div>

          </div>

          {/* Fall Animation Chamber Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* EARTH */}
              <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 flex flex-col justify-between h-[420px] relative overflow-hidden bg-gradient-to-b from-[#06122b] to-[#02050f]">
                <div className="text-center border-b border-blue-500/20 pb-2">
                  <span className="text-2xl">🌍</span>
                  <div className="font-display font-bold text-sm text-white">EARTH</div>
                  <div className="text-xs font-mono text-blue-300">g = 9.81 m/s²</div>
                </div>

                {/* Drop shaft */}
                <div className="flex-1 relative my-2 mx-auto w-12 border-x border-dashed border-blue-500/20">
                  <div
                    className="absolute left-1/2 -translate-x-1/2 text-2xl transition-all duration-75"
                    style={{ top: `${Math.min(90, dropProgress.earth)}%` }}
                  >
                    {objects.find(o => o.id === objectType)?.icon || '🧑‍🚀'}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-center space-y-1">
                  <div className="text-slate-400 text-[10px]">FALL TIME</div>
                  <div className="text-white font-bold text-sm">{dropStats.earthTime}s</div>
                  <div className="text-[10px] text-blue-300">Impact: {dropStats.earthVel} m/s</div>
                </div>
              </div>

              {/* MOON */}
              <div className="glass-panel p-4 rounded-2xl border border-cyan-400/50 flex flex-col justify-between h-[420px] relative overflow-hidden bg-gradient-to-b from-[#061e33] to-[#02050f] shadow-lg shadow-cyan-500/10">
                <div className="text-center border-b border-cyan-500/20 pb-2">
                  <span className="text-2xl">🌙</span>
                  <div className="font-display font-bold text-sm text-cyan-300">MOON (LUNA)</div>
                  <div className="text-xs font-mono text-cyan-400 font-bold">g = 1.62 m/s²</div>
                </div>

                {/* Drop shaft */}
                <div className="flex-1 relative my-2 mx-auto w-12 border-x border-dashed border-cyan-500/30">
                  <div
                    className="absolute left-1/2 -translate-x-1/2 text-2xl transition-all duration-75"
                    style={{ top: `${Math.min(90, dropProgress.moon)}%` }}
                  >
                    {objects.find(o => o.id === objectType)?.icon || '🧑‍🚀'}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/40 text-xs font-mono text-center space-y-1">
                  <div className="text-cyan-300 text-[10px] font-bold">FALL TIME (2.5x SLOWER)</div>
                  <div className="text-white font-bold text-sm">{dropStats.moonTime}s</div>
                  <div className="text-[10px] text-cyan-400 font-bold">Impact: {dropStats.moonVel} m/s</div>
                </div>
              </div>

              {/* MARS */}
              <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 flex flex-col justify-between h-[420px] relative overflow-hidden bg-gradient-to-b from-[#240c10] to-[#02050f]">
                <div className="text-center border-b border-rose-500/20 pb-2">
                  <span className="text-2xl">🔴</span>
                  <div className="font-display font-bold text-sm text-rose-200">MARS</div>
                  <div className="text-xs font-mono text-rose-400">g = 3.72 m/s²</div>
                </div>

                {/* Drop shaft */}
                <div className="flex-1 relative my-2 mx-auto w-12 border-x border-dashed border-rose-500/20">
                  <div
                    className="absolute left-1/2 -translate-x-1/2 text-2xl transition-all duration-75"
                    style={{ top: `${Math.min(90, dropProgress.mars)}%` }}
                  >
                    {objects.find(o => o.id === objectType)?.icon || '🧑‍🚀'}
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-center space-y-1">
                  <div className="text-slate-400 text-[10px]">FALL TIME</div>
                  <div className="text-white font-bold text-sm">{dropStats.marsTime}s</div>
                  <div className="text-[10px] text-rose-300">Impact: {dropStats.marsVel} m/s</div>
                </div>
              </div>

            </div>

            {/* Apollo 15 Hammer vs Feather Fact */}
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="text-2xl">🔨</span>
              <p>
                <strong className="text-white">Historic Apollo 15 Experiment (1971):</strong> Commander Dave Scott dropped a geological hammer (1.3 kg) and a falcon feather (0.03 kg) simultaneously on the Moon. With no atmosphere to create air drag, both struck the lunar dust at the exact same instant!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* EXPERIMENT 2: CRATER SIMULATION */}
      {activeTab === 'crater' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                ASTEROID PARAMETERS
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                IMPACT CRATER SCALING
              </h3>
              <p className="text-xs text-slate-400">
                Adjust the projectile size, velocity, and impact trajectory angle to calculate the resulting impact crater morphology.
              </p>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">ASTEROID DIAMETER:</span>
                <span className="text-cyan-300 font-bold">{asteroidSizeM} METERS</span>
              </div>
              <input
                id="crater-size-slider"
                type="range"
                min="10"
                max="500"
                step="10"
                value={asteroidSizeM}
                onChange={e => setAsteroidSizeM(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>10m (Meteor)</span>
                <span>100m (Chelyabinsk+)</span>
                <span>500m (City Killer)</span>
              </div>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">IMPACT VELOCITY:</span>
                <span className="text-cyan-300 font-bold">{impactSpeedKmS} KM/S</span>
              </div>
              <input
                id="crater-speed-slider"
                type="range"
                min="12"
                max="72"
                step="2"
                value={impactSpeedKmS}
                onChange={e => setImpactSpeedKmS(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>12 km/s (Min orbit)</span>
                <span>35 km/s (Typical)</span>
                <span>72 km/s (Retrograde comet)</span>
              </div>
            </div>

            {/* Angle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">IMPACT ANGLE:</span>
                <span className="text-cyan-300 font-bold">{impactAngleDeg}°</span>
              </div>
              <input
                id="crater-angle-slider"
                type="range"
                min="15"
                max="90"
                step="5"
                value={impactAngleDeg}
                onChange={e => setImpactAngleDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>15° (Shallow Ricochet)</span>
                <span>45° (Most Likely)</span>
                <span>90° (Direct Vertical)</span>
              </div>
            </div>

            {/* Run button */}
            <button
              id="simulate-impact-btn"
              onClick={calculateCrater}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>DETONATE & SIMULATE IMPACT</span>
            </button>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Crater Cross-Section Visualizer */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative min-h-[280px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0d162a] to-[#040814]">
              
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>LUNAR REGOLITH PROFILE</span>
                <span className="text-slate-400">ELEVATION 0.0m</span>
              </div>

              {/* Animated impact effect */}
              {isImpactAnimating && (
                <div className="absolute inset-0 bg-amber-500/30 backdrop-blur-sm z-20 flex items-center justify-center animate-ping">
                  <div className="w-32 h-32 rounded-full bg-white blur-xl" />
                </div>
              )}

              {/* Diagrammatic Crater Shape */}
              <div className="my-6 relative flex items-center justify-center">
                <svg viewBox="0 0 400 120" className="w-full h-32 stroke-cyan-400 fill-none">
                  {/* Surface line */}
                  <path
                    d="M 10,40 L 120,40 Q 150,40 160,25 Q 170,10 180,30 Q 200,105 220,30 Q 230,10 240,25 Q 250,40 390,40"
                    strokeWidth="2.5"
                    className="stroke-cyan-300"
                  />
                  {/* Central peak if large crater */}
                  {craterResult.diameterKm > 10 && (
                    <path
                      d="M 195,95 Q 200,60 205,95"
                      strokeWidth="2"
                      className="stroke-cyan-400 fill-cyan-950/60"
                    />
                  )}
                  {/* Depth line */}
                  <line x1="200" y1="40" x2="200" y2="100" stroke="#f59e0b" strokeDasharray="3,3" />
                  <text x="208" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                    Depth: {craterResult.depthM}m
                  </text>
                  {/* Diameter arrow */}
                  <line x1="160" y1="20" x2="240" y2="20" stroke="#38bdf8" />
                  <text x="175" y="15" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    Ø {craterResult.diameterKm} km
                  </text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <span>IMPACT ENERGY: <strong className="text-rose-400">{craterResult.energyMegatons} Megatons TNT</strong></span>
                <span>SEISMIC BLUNT SHOCK: <strong className="text-white">{craterResult.blastRadiusKm} km</strong></span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 text-[10px] block">CRATER DIAMETER</span>
                <span className="text-lg font-bold text-cyan-300">{craterResult.diameterKm} km</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Rim-to-Rim</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-amber-500/20">
                <span className="text-slate-400 text-[10px] block">CRATER DEPTH</span>
                <span className="text-lg font-bold text-amber-400">{craterResult.depthM} m</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Floor Excavation</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-rose-500/20">
                <span className="text-slate-400 text-[10px] block">KINETIC ENERGY</span>
                <span className="text-lg font-bold text-rose-400">{craterResult.energyMegatons} MT</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Hiroshima × {Math.round(craterResult.energyMegatons * 66)}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-purple-500/20">
                <span className="text-slate-400 text-[10px] block">EJECTA BLANKET</span>
                <span className="text-lg font-bold text-purple-300">{(craterResult.diameterKm * 2.8).toFixed(1)} km</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Debris Spread</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* EXPERIMENT 3: TEMPERATURE EXPERIMENT */}
      {activeTab === 'temperature' && (
        <div className="space-y-6">
          
          {/* Thermal Zone Selector Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'sunlight', label: 'DIRECT SUNLIGHT', icon: <Sun className="w-4 h-4 text-amber-400" />, temp: '+120°C' },
              { id: 'shadow', label: 'CRATER SHADOW', icon: <Moon className="w-4 h-4 text-blue-400" />, temp: '-130°C' },
              { id: 'lunar_night', label: 'LUNAR NIGHT', icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />, temp: '-150°C' },
              { id: 'polar_psr', label: 'POLAR COLD TRAP', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, temp: '-246°C' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  setThermalZone(item.id as any);
                  recordExperiment('temperature');
                }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  thermalZone === item.id
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300">{item.label}</span>
                  {item.icon}
                </div>
                <div className="text-xl font-mono font-bold text-white mt-2">{item.temp}</div>
              </button>
            ))}
          </div>

          {/* Active Thermal Zone Card */}
          {(() => {
            const data = thermalData[thermalZone];
            return (
              <div className={`glass-panel p-6 rounded-2xl border ${data.borderColor} bg-gradient-to-r ${data.color} space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${data.badgeColor}`}>
                      ENVIRONMENT TEST
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white mt-1">
                      {data.title}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-bold text-white">{data.tempC}</span>
                    <span className="text-lg font-mono text-slate-400">({data.tempF})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      PHYSICAL PHENOMENON
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {data.desc}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono text-rose-300 font-bold uppercase tracking-wider">
                      MISSION & HABITAT CHALLENGE
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {data.hazard}
                    </p>
                  </div>
                </div>

                {/* Educational Atmosphere Comparison */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="text-cyan-400 font-bold font-mono">
                    WHY EARTH DOESN'T EXPERIENCE THIS:
                  </div>
                  <p>
                    Earth has a thick blanket of nitrogen, oxygen, and water vapor that circulates heat via convection currents and traps infrared radiation (natural greenhouse effect). The Moon has essentially <strong>zero atmosphere (exosphere density is less than a trillionth of Earth)</strong>, so heat escapes straight into space the moment sunlight vanishes!
                  </p>
                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
