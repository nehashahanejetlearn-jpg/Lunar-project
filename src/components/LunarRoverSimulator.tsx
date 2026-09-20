import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  BatteryCharging, 
  Gauge, 
  Compass, 
  Camera, 
  CheckCircle2, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { playClickSound, playRoverMotor, playSuccessChime } from '../utils/sound';

interface LunarRoverSimulatorProps {
  onUnlockAchievement: (id: string) => void;
}

interface RoverMission {
  id: number;
  title: string;
  desc: string;
  targetX: number;
  targetY: number;
  targetRadius: number;
  icon: string;
  completed: boolean;
}

export const LunarRoverSimulator: React.FC<LunarRoverSimulatorProps> = ({ onUnlockAchievement }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rover state
  const roverPos = useRef({ x: 400, y: 300, angle: 0, speed: 0 });
  const [battery, setBattery] = useState(100);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [signal, setSignal] = useState(98);
  const [speedDisplay, setSpeedDisplay] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [isBoost, setIsBoost] = useState(false);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [photoSavedMessage, setPhotoSavedMessage] = useState<string | null>(null);

  // Missions
  const [missions, setMissions] = useState<RoverMission[]>([
    {
      id: 1,
      title: 'Mission 1: Collect Rock Sample',
      desc: 'Drive to the basalt formation at Grid Alpha and deploy robotic arm.',
      targetX: 200,
      targetY: 180,
      targetRadius: 40,
      icon: '🪨',
      completed: false,
    },
    {
      id: 2,
      title: 'Mission 2: Reach the Crater Rim',
      desc: 'Ascend the elevated northern rim of Shackleton-B crater.',
      targetX: 620,
      targetY: 160,
      targetRadius: 50,
      icon: '🏔️',
      completed: false,
    },
    {
      id: 3,
      title: 'Mission 3: Locate Water-Ice Deposit',
      desc: 'Scan the permanently shadowed frost depression at Grid Gamma.',
      targetX: 600,
      targetY: 460,
      targetRadius: 45,
      icon: '💧',
      completed: false,
    },
    {
      id: 4,
      title: 'Mission 4: Photograph Lunar Terrain',
      desc: 'Capture a high-resolution orbital panoramic photograph of the ridge.',
      targetX: 240,
      targetY: 440,
      targetRadius: 45,
      icon: '📸',
      completed: false,
    },
  ]);

  // Keys active state
  const keysDown = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === ' ') {
        setIsBoost(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
      if (e.key === ' ') {
        setIsBoost(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const width = (canvas.width = 800);
    const height = (canvas.height = 600);

    // Static craters & rock hazards
    const hazards = [
      { x: 340, y: 220, r: 35 },
      { x: 460, y: 380, r: 40 },
      { x: 120, y: 340, r: 28 },
      { x: 700, y: 320, r: 48 },
    ];

    // Surface tracks trail
    const tracks: { x: number; y: number }[] = [];

    const gameLoop = () => {
      // 1. Update Physics
      const keys = keysDown.current;
      const maxSpeed = isBoost ? 4.5 : 2.5;
      const turnSpeed = 0.05;

      let accelerating = false;
      if (keys['w'] || keys['arrowup']) {
        roverPos.current.speed = Math.min(maxSpeed, roverPos.current.speed + 0.15);
        accelerating = true;
      } else if (keys['s'] || keys['arrowdown']) {
        roverPos.current.speed = Math.max(-maxSpeed * 0.6, roverPos.current.speed - 0.15);
        accelerating = true;
      } else {
        roverPos.current.speed *= 0.92; // friction
      }

      if (keys['a'] || keys['arrowleft']) {
        roverPos.current.angle -= turnSpeed;
      }
      if (keys['d'] || keys['arrowright']) {
        roverPos.current.angle += turnSpeed;
      }

      // Move rover
      if (Math.abs(roverPos.current.speed) > 0.05) {
        roverPos.current.x += Math.cos(roverPos.current.angle) * roverPos.current.speed;
        roverPos.current.y += Math.sin(roverPos.current.angle) * roverPos.current.speed;

        // Boundary constraints
        roverPos.current.x = Math.max(30, Math.min(width - 30, roverPos.current.x));
        roverPos.current.y = Math.max(30, Math.min(height - 30, roverPos.current.y));

        // Track odometer
        setDistanceTraveled(prev => prev + Math.abs(roverPos.current.speed) * 0.15);
        // Battery drain
        setBattery(prev => Math.max(5, prev - (isBoost ? 0.02 : 0.008)));

        if (tracks.length === 0 || Math.hypot(tracks[tracks.length - 1].x - roverPos.current.x, tracks[tracks.length - 1].y - roverPos.current.y) > 12) {
          tracks.push({ x: roverPos.current.x, y: roverPos.current.y });
          if (tracks.length > 200) tracks.shift();
        }
      }

      setSpeedDisplay(parseFloat((Math.abs(roverPos.current.speed) * 3.6).toFixed(1)));

      // 2. Check Mission Proximity
      missions.forEach(m => {
        if (!m.completed) {
          const dist = Math.hypot(roverPos.current.x - m.targetX, roverPos.current.y - m.targetY);
          if (dist < m.targetRadius) {
            completeMission(m.id);
          }
        }
      });

      // 3. Render Canvas
      // Lunar regolith background
      ctx.fillStyle = '#111726';
      ctx.fillRect(0, 0, width, height);

      // Regolith grid dots
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      for (let x = 20; x < width; x += 40) {
        for (let y = 20; y < height; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw craters
      hazards.forEach(h => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0e18';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Crater rim shadow
        ctx.beginPath();
        ctx.arc(h.x - 2, h.y - 2, h.r * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.stroke();
        ctx.restore();
      });

      // Draw Rover wheel tracks
      ctx.save();
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 4;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      tracks.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();

      // Draw Mission Target Zones
      missions.forEach(m => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.targetX, m.targetY, m.targetRadius, 0, Math.PI * 2);
        if (m.completed) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.strokeStyle = '#10b981';
        } else {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
          ctx.strokeStyle = '#06b6d4';
        }
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.fill();
        ctx.stroke();

        // Icon in center
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m.icon, m.targetX, m.targetY);

        // Label
        ctx.font = '10px monospace';
        ctx.fillStyle = m.completed ? '#34d399' : '#38bdf8';
        ctx.fillText(m.completed ? 'OBJECTIVE SECURED' : m.title.split(':')[0], m.targetX, m.targetY + m.targetRadius + 14);
        ctx.restore();
      });

      // Draw Controllable Rover
      ctx.save();
      ctx.translate(roverPos.current.x, roverPos.current.y);
      ctx.rotate(roverPos.current.angle);

      // Headlight beams
      const lightGrad = ctx.createRadialGradient(0, 0, 10, 80, 0, 90);
      lightGrad.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
      lightGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(15, -6);
      ctx.lineTo(85, -28);
      ctx.lineTo(85, 28);
      ctx.lineTo(15, 6);
      ctx.closePath();
      ctx.fill();

      // 6-wheel rover chassis
      // Wheels
      ctx.fillStyle = '#334155';
      [
        { x: -14, y: -16 }, { x: 0, y: -16 }, { x: 14, y: -16 },
        { x: -14, y: 16 }, { x: 0, y: 16 }, { x: 14, y: 16 },
      ].forEach(w => {
        ctx.fillRect(w.x - 4, w.y - 3, 8, 6);
      });

      // Main body
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-16, -12, 32, 24, 4);
      ctx.fill();
      ctx.stroke();

      // Solar panel roof
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-10, -8, 16, 16);

      // High-gain antenna dish
      ctx.beginPath();
      ctx.arc(-8, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();

      // Front sensor mast
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(10, -3, 6, 6);

      ctx.restore();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  }, [missions, isBoost]);

  const completeMission = (missionId: number) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId && !m.completed) {
          playSuccessChime();
          if (missionId === 1) {
            setSampleCount(c => c + 1);
          }
          onUnlockAchievement('rover_commander');
          return { ...m, completed: true };
        }
        return m;
      })
    );
  };

  const handleTakePhoto = () => {
    playClickSound();
    setPhotoFlash(true);
    setTimeout(() => setPhotoFlash(false), 200);

    // Complete photo mission if close to target 4
    completeMission(4);
    setPhotoSavedMessage(`LUNAR RECON SNAPSHOT SAVED: GRID [${Math.floor(roverPos.current.x)}, ${Math.floor(roverPos.current.y)}]`);
    setTimeout(() => setPhotoSavedMessage(null), 3500);
  };

  // On-screen direction handlers for mobile / touch
  const handleMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    playRoverMotor();
    const keyMap = {
      up: 'arrowup',
      down: 'arrowdown',
      left: 'arrowleft',
      right: 'arrowright',
    };
    keysDown.current[keyMap[dir]] = true;
    setTimeout(() => {
      keysDown.current[keyMap[dir]] = false;
    }, 180);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>AUTONOMOUS SURFACE RECONNAISSANCE & ROVER OPERATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          LUNAR ROVER SIMULATOR
        </h2>
        <p className="text-sm text-slate-400">
          Pilot the 6-wheel explorer across the regolith surface. Use keyboard (W,A,S,D / Arrows) or the on-screen tactile flight pad.
        </p>
      </div>

      {/* Rover Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-mono font-bold">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>BATTERY</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-1">
            {Math.round(battery)}%
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-mono font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>DISTANCE</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-1">
            {Math.round(distanceTraveled)} <span className="text-xs text-slate-400">m</span>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>SIGNAL</span>
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
            {signal}%
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold">
            <Gauge className="w-3.5 h-3.5" />
            <span>SPEED</span>
          </div>
          <div className="text-lg font-mono font-bold text-white mt-1">
            {speedDisplay} <span className="text-xs text-slate-400">km/h</span>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl border border-cyan-500/20 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SAMPLE COUNT</span>
          </div>
          <div className="text-lg font-mono font-bold text-purple-300 mt-1">
            {sampleCount} BASALT CORES
          </div>
        </div>
      </div>

      {/* Main Simulation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Canvas Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative glass-panel rounded-2xl border border-cyan-500/40 overflow-hidden bg-slate-950 shadow-xl shadow-cyan-950/20">
            
            {/* Camera Flash Animation */}
            {photoFlash && (
              <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-100" />
            )}

            {/* Photo Notification Message */}
            {photoSavedMessage && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold shadow-lg shadow-emerald-500/20">
                {photoSavedMessage}
              </div>
            )}

            {/* Top HUD Overlay */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-cyan-400/80 pointer-events-none z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>ROVER HUD: ARTEMIS SCOUT-7</span>
              </div>
              <div className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                WASD / ARROWS TO DRIVE • SPACE TO BOOST
              </div>
            </div>

            {/* Rover Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-[400px] sm:h-[480px] block cursor-crosshair"
            />

            {/* Bottom HUD Bar on Canvas */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <button
                id="rover-camera-trigger-btn"
                onClick={handleTakePhoto}
                className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-400 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>SNAP RECON PHOTO</span>
              </button>

              <button
                onClick={() => setIsBoost(!isBoost)}
                className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  isBoost
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/80 text-amber-300 border-slate-700 hover:border-amber-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isBoost ? 'BOOST ACTIVE (TURBO)' : 'SPEED BOOST'}</span>
              </button>
            </div>

          </div>

          {/* On-screen touch D-Pad for mobile & easy accessibility */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center sm:hidden">
            <span className="text-[10px] font-mono text-slate-400 mb-2">TOUCH NAVIGATION PAD</span>
            <div className="grid grid-cols-3 gap-2 w-44">
              <div />
              <button
                onClick={() => handleMove('up')}
                className="p-3 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded-lg flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />

              <button
                onClick={() => handleMove('left')}
                className="p-3 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded-lg flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleMove('down')}
                className="p-3 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded-lg flex items-center justify-center"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleMove('right')}
                className="p-3 bg-slate-800 hover:bg-cyan-500 text-white hover:text-slate-950 rounded-lg flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Rover Missions Checklist & Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  SURFACE OBJECTIVES
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  ROVER EXPEDITION LOG
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {missions.filter(m => m.completed).length}/{missions.length} COMPLETED
              </span>
            </div>

            {/* Mission items */}
            <div className="space-y-3">
              {missions.map(m => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    m.completed
                      ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-xs font-display font-bold text-white">
                        {m.title}
                      </span>
                    </div>
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 pl-7">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Achievement callout */}
            <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-xs font-mono text-purple-200 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Drive rover to complete objectives and unlock the Rover Commander badge!</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
