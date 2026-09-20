import React, { useState, useEffect, useRef } from 'react';
import { Spacecraft, MissionObjective, LunarLocation } from '../types';
import { SPACECRAFT_LIST, MISSION_OBJECTIVES, LUNAR_LOCATIONS } from '../data/lunarData';
import { 
  Rocket, 
  Compass, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Fuel, 
  Gauge, 
  Radio, 
  Wind, 
  Thermometer, 
  Play, 
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { playClickSound, playLaunchWhoosh, playSuccessChime } from '../utils/sound';

interface MissionSimulatorProps {
  onUnlockAchievement: (id: string) => void;
}

type MissionPhase = 'Configuration' | 'Countdown' | 'Launch' | 'Earth Orbit' | 'Trans-Lunar Injection' | 'Lunar Orbit' | 'Landing' | 'Debrief';

export const MissionSimulator: React.FC<MissionSimulatorProps> = ({ onUnlockAchievement }) => {
  // Step 1: Spacecraft
  const [selectedSpacecraft, setSelectedSpacecraft] = useState<Spacecraft>(SPACECRAFT_LIST[0]);
  // Step 2: Landing location
  const [selectedLocation, setSelectedLocation] = useState<LunarLocation>(LUNAR_LOCATIONS[4]); // Shackleton default
  // Step 3: Duration
  const [durationDays, setDurationDays] = useState<number>(14);
  // Step 4: Objectives
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([MISSION_OBJECTIVES[0].id, MISSION_OBJECTIVES[1].id]);

  // Mission State
  const [phase, setPhase] = useState<MissionPhase>('Configuration');
  const [progress, setProgress] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [oxygen, setOxygen] = useState(100);
  const [distanceKm, setDistanceKm] = useState(0);
  const [speedKmH, setSpeedKmH] = useState(0);
  const [tempC, setTempC] = useState(21);
  const [commStatus, setCommStatus] = useState<'NOMINAL' | 'DSN ACTIVE' | 'ATTENUATION' | 'SIGNAL LOCKED'>('NOMINAL');
  const [missionLogs, setMissionLogs] = useState<Array<{ time: string; msg: string; type: 'info' | 'warn' | 'success' }>>([]);
  const [missionOutcome, setMissionOutcome] = useState<{ success: boolean; score: number; summary: string; rating: string } | null>(null);

  const timerRef = useRef<any>(null);

  // Toggle objective selection
  const toggleObjective = (id: string) => {
    playClickSound();
    if (selectedObjectives.includes(id)) {
      if (selectedObjectives.length > 1) {
        setSelectedObjectives(selectedObjectives.filter(o => o !== id));
      }
    } else {
      setSelectedObjectives([...selectedObjectives, id]);
    }
  };

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const timestamp = `T+${Math.floor(progress * 1.5).toString().padStart(3, '0')}H`;
    setMissionLogs(prev => [
      { time: timestamp, msg, type },
      ...prev.slice(0, 7),
    ]);
  };

  const startMission = () => {
    playClickSound();
    playLaunchWhoosh();
    setPhase('Countdown');
    setProgress(0);
    setFuel(100);
    setOxygen(100);
    setDistanceKm(0);
    setSpeedKmH(0);
    setTempC(21);
    setMissionLogs([
      { time: 'T-00:05', msg: `Pre-flight checks passed on ${selectedSpacecraft.name}. All systems go.`, type: 'info' },
    ]);

    setTimeout(() => {
      setPhase('Launch');
    }, 1500);
  };

  // Progression loop
  useEffect(() => {
    if (phase === 'Configuration' || phase === 'Countdown' || phase === 'Debrief') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2.5;

        // Phase transitions
        if (next < 20) {
          setPhase('Launch');
          setDistanceKm(Math.floor((next / 20) * 2000));
          setSpeedKmH(Math.floor(next * 1400));
          setFuel(Math.floor(100 - next * 0.5));
          setCommStatus('NOMINAL');
        } else if (next < 40) {
          setPhase('Earth Orbit');
          setDistanceKm(Math.floor(2000 + ((next - 20) / 20) * 15000));
          setSpeedKmH(28000);
          setFuel(Math.floor(90 - (next - 20) * 0.4));
          setCommStatus('DSN ACTIVE');
        } else if (next < 70) {
          setPhase('Trans-Lunar Injection');
          setDistanceKm(Math.floor(17000 + ((next - 40) / 30) * 330000));
          setSpeedKmH(39000);
          setFuel(Math.floor(82 - (next - 40) * 0.7));
          setOxygen(Math.floor(100 - (next - 40) * 0.2));
          setTempC(18);
          setCommStatus('DSN ACTIVE');
        } else if (next < 90) {
          setPhase('Lunar Orbit');
          setDistanceKm(Math.floor(347000 + ((next - 70) / 20) * 37000));
          setSpeedKmH(5800);
          setFuel(Math.floor(61 - (next - 70) * 0.8));
          setOxygen(Math.floor(94 - (next - 70) * 0.3));
          setCommStatus('SIGNAL LOCKED');
        } else if (next < 100) {
          setPhase('Landing');
          setDistanceKm(384400);
          setSpeedKmH(Math.floor(Math.max(10, 5800 - ((next - 90) / 10) * 5790)));
          setFuel(Math.floor(45 - (next - 90) * 1.5));
          setOxygen(90);
          setTempC(-15);
        } else {
          // Finish mission
          clearInterval(timerRef.current);
          completeMission();
          return 100;
        }

        // Add milestone logs
        if (Math.floor(next) === 15) addLog('Main engine cutoff (MECO). Stage separation confirmed.', 'success');
        if (Math.floor(next) === 35) addLog('Translunar injection burn ignition successful.', 'info');
        if (Math.floor(next) === 55) addLog('Passing midway point. Gravity equilibrium zone crossed.', 'info');
        if (Math.floor(next) === 75) addLog('Lunar orbit insertion retro-rocket burn initiated.', 'warn');
        if (Math.floor(next) === 92) addLog(`Final terminal descent onto ${selectedLocation.name} site.`, 'info');

        return next;
      });
    }, 400);

    return () => clearInterval(timerRef.current);
  }, [phase, selectedLocation, selectedSpacecraft]);

  const completeMission = () => {
    playSuccessChime();
    setPhase('Debrief');
    onUnlockAchievement('first_launch');

    // Calculate score based on spacecraft reliability, objectives, and landing site difficulty
    let baseScore = 750;
    baseScore += selectedObjectives.length * 150;
    if (selectedSpacecraft.reliability > 95) baseScore += 80;
    if (durationDays >= 14) baseScore += 100;

    const rating = baseScore >= 1100 ? 'MISSION EXCELLENCE (GRADE A+)' : 'MISSION SUCCESS (GRADE A)';
    const summary = `Touchdown confirmed at ${selectedLocation.name}! All ${selectedObjectives.length} scientific objectives successfully deployed. Lunar telemetry returned to Mission Control with zero fatal anomalies.`;

    setMissionOutcome({
      success: true,
      score: baseScore,
      summary,
      rating,
    });
  };

  const resetMission = () => {
    playClickSound();
    setPhase('Configuration');
    setProgress(0);
    setMissionOutcome(null);
  };

  const stepsList = [
    { label: 'Launch', targetPhase: 'Launch', min: 0, max: 20 },
    { label: 'Orbit', targetPhase: 'Earth Orbit', min: 20, max: 40 },
    { label: 'Lunar Transfer', targetPhase: 'Trans-Lunar Injection', min: 40, max: 70 },
    { label: 'Lunar Orbit', targetPhase: 'Lunar Orbit', min: 70, max: 90 },
    { label: 'Landing', targetPhase: 'Landing', min: 90, max: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <Rocket className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>FLIGHT OPERATIONS & TRAJECTORY PLANNING</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          LUNAR MISSION SIMULATOR
        </h2>
        <p className="text-sm text-slate-400">
          Design your custom exploration flight, configure lander systems, and monitor telemetry from liftoff to touchdown.
        </p>
      </div>

      {/* Main View: Configuration Mode vs Live Mission Dashboard */}
      {phase === 'Configuration' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Configuration Steps */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Select Spacecraft */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  STEP 01 — SELECT SPACECRAFT
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {SPACECRAFT_LIST.length} VEHICLES READY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPACECRAFT_LIST.map(craft => {
                  const isSelected = selectedSpacecraft.id === craft.id;
                  return (
                    <button
                      key={craft.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedSpacecraft(craft);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-white">
                          {craft.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {craft.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-slate-300">
                        <span>Crew: {craft.crewCapacity}</span>
                        <span>•</span>
                        <span>Rel: {craft.reliability}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Landing Location */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  STEP 02 — CHOOSE LANDING LOCATION
                </span>
                <span className="text-xs font-mono text-slate-400">
                  SITE: {selectedLocation.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {LUNAR_LOCATIONS.slice(0, 4).concat([LUNAR_LOCATIONS[4]]).map(loc => {
                  const isSelected = selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedLocation(loc);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold text-white truncate">
                        {loc.name}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                        {loc.type}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-1">
                        {loc.coordinates}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Mission Duration */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  STEP 03 — SELECT MISSION DURATION
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  {durationDays} EARTH DAYS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { days: 3, title: 'Scout Sortie', desc: 'Short surface survey' },
                  { days: 14, title: 'Lunar Daylight', desc: 'Full solar operational cycle' },
                  { days: 30, title: 'Outpost Deployment', desc: 'Extended science residency' },
                ].map(item => (
                  <button
                    key={item.days}
                    onClick={() => {
                      playClickSound();
                      setDurationDays(item.days);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      durationDays === item.days
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="font-display font-bold text-sm text-white">
                      {item.days} Days
                    </div>
                    <div className="text-xs text-cyan-300 font-mono mt-0.5">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Scientific Objectives */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  STEP 04 — SELECT SCIENTIFIC OBJECTIVES
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedObjectives.length} SELECTED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MISSION_OBJECTIVES.map(obj => {
                  const isChecked = selectedObjectives.includes(obj.id);
                  return (
                    <button
                      key={obj.id}
                      onClick={() => toggleObjective(obj.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-purple-500/15 border-purple-400 shadow-sm shadow-purple-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/30'
                      }`}
                    >
                      <div>
                        <div className="font-display font-bold text-xs text-white">
                          {obj.title}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {obj.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] font-mono">
                          <span className="text-purple-300">+{obj.rewardPoints} XP</span>
                          <span>•</span>
                          <span className="text-slate-400">{obj.difficulty}</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-purple-500 border-purple-400 text-white' : 'border-slate-700'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Launch Overview & Readiness Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 space-y-6">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>MISSION SPECIFICATIONS</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  MISSION 01 — LUNAR LANDING
                </h3>
                <div className="text-xs font-mono text-slate-400">
                  TRAJECTORY: EARTH → MOON
                </div>
              </div>

              {/* Summary List */}
              <div className="space-y-3 text-xs font-mono bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">SPACECRAFT:</span>
                  <span className="text-white font-bold">{selectedSpacecraft.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LANDING SITE:</span>
                  <span className="text-cyan-300 font-bold">{selectedLocation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SURFACE TIME:</span>
                  <span className="text-white font-bold">{durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OBJECTIVES:</span>
                  <span className="text-purple-300 font-bold">{selectedObjectives.length} Active</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">SYSTEM RELIABILITY:</span>
                  <span className="text-emerald-400 font-bold">{selectedSpacecraft.reliability}%</span>
                </div>
              </div>

              {/* Big Launch Button */}
              <button
                id="launch-mission-btn"
                onClick={startMission}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-base tracking-widest uppercase transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 flex items-center justify-center gap-2 group"
              >
                <Rocket className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>LAUNCH MISSION</span>
              </button>

              <div className="text-[11px] font-mono text-center text-slate-500">
                * Flight computers will simulate real-time orbital injection
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Live Mission HUD & Telemetry Dashboard */
        <div className="space-y-6">
          
          {/* Mission Progress Step Indicator */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                  CURRENT PHASE: {phase.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                TRAJECTORY PROGRESS: {Math.floor(progress)}%
              </div>
            </div>

            {/* Step badges */}
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs font-mono">
              {stepsList.map(s => {
                const isPassed = progress >= s.max;
                const isCurrent = progress >= s.min && progress < s.max;
                return (
                  <div
                    key={s.label}
                    className={`p-2 rounded-lg border transition-all ${
                      isPassed
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                        : isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold animate-pulse'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="block truncate">{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Telemetry Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* 1. Fuel */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono font-bold">
                <Fuel className="w-3.5 h-3.5" />
                <span>FUEL REMAINING</span>
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1">{fuel}%</div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: `${fuel}%` }} />
              </div>
            </div>

            {/* 2. Distance */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-mono font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>DISTANCE</span>
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1">
                {distanceKm.toLocaleString()} <span className="text-xs text-slate-400">km</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Target: 384,400 km</div>
            </div>

            {/* 3. Speed */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                <Gauge className="w-3.5 h-3.5" />
                <span>VELOCITY</span>
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1">
                {speedKmH.toLocaleString()} <span className="text-xs text-slate-400">km/h</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Orbital Mach Scale</div>
            </div>

            {/* 4. Oxygen */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-mono font-bold">
                <Wind className="w-3.5 h-3.5" />
                <span>OXYGEN (O2)</span>
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1">{oxygen}%</div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-400 h-full" style={{ width: `${oxygen}%` }} />
              </div>
            </div>

            {/* 5. Temperature */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold">
                <Thermometer className="w-3.5 h-3.5" />
                <span>CABIN TEMP</span>
              </div>
              <div className="text-xl font-mono font-bold text-white mt-1">{tempC}°C</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Thermal Reg Nominal</div>
            </div>

            {/* 6. Communication */}
            <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-mono font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>COMMUNICATIONS</span>
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-1 truncate">
                {commStatus}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Deep Space Network</div>
            </div>

          </div>

          {/* Mission Animation Stage & Flight Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Stage */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-cyan-500/30 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>EARTH</span>
                <span className="text-slate-400 tracking-widest">--- DEEP SPACE CORRIDOR ---</span>
                <span>MOON ({selectedLocation.name})</span>
              </div>

              {/* Animated flight trajectory path */}
              <div className="relative my-8 flex items-center justify-between px-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                  🌍
                </div>

                {/* Rocket along path */}
                <div className="flex-1 mx-4 relative h-1 bg-slate-800 rounded">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 transform -translate-x-1/2 flex items-center"
                    style={{ left: `${Math.min(95, Math.max(5, progress))}%` }}
                  >
                    <div className="px-2 py-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-mono whitespace-nowrap shadow-md">
                      🚀 {selectedSpacecraft.name.split(' ')[0]}
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
                  🌙
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="text-slate-400">
                  VEHICLE: <span className="text-white font-bold">{selectedSpacecraft.name}</span>
                </div>
                <button
                  onClick={resetMission}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 border border-rose-500/30 px-3 py-1 rounded-lg hover:bg-rose-950/40 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ABORT / RESET</span>
                </button>
              </div>
            </div>

            {/* Flight Terminal Logs */}
            <div className="lg:col-span-4 glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                    MISSION LOG CONSOLE
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono max-h-[220px] overflow-y-auto">
                  {missionLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">{log.time}</span>
                      <span className={
                        log.type === 'success'
                          ? 'text-emerald-300'
                          : log.type === 'warn'
                          ? 'text-amber-300'
                          : 'text-slate-300'
                      }>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800/80">
                TELEMETRY ENCRYPTED • DSN 256-BIT STREAM
              </div>
            </div>

          </div>

          {/* Mission Complete Modal / Debrief Card */}
          {phase === 'Debrief' && missionOutcome && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-slate-950/90 shadow-2xl space-y-4 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                    MISSION COMPLETE
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {missionOutcome.rating}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {missionOutcome.summary}
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TOTAL SCORE</span>
                  <span className="text-emerald-400 font-bold text-base">+{missionOutcome.score} XP</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SITE REACHED</span>
                  <span className="text-white font-bold truncate">{selectedLocation.name}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ACHIEVEMENT</span>
                  <span className="text-purple-300 font-bold">🚀 First Launch</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  id="replan-mission-btn"
                  onClick={resetMission}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all"
                >
                  PLAN NEXT MISSION
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
