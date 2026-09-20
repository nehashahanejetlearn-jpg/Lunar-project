import React, { useState } from 'react';
import { ResourceInfo } from '../types';
import { LUNAR_RESOURCES } from '../data/lunarData';
import { 
  Layers, 
  Droplet, 
  Zap, 
  Sparkles, 
  Sun, 
  X, 
  CheckCircle2, 
  Compass, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface LunarResourcesProps {
  onUnlockAchievement: (id: string) => void;
}

export const LunarResources: React.FC<LunarResourcesProps> = ({ onUnlockAchievement }) => {
  const [selectedResource, setSelectedResource] = useState<ResourceInfo>(LUNAR_RESOURCES[0]);
  const [modalOpen, setModalOpen] = useState(false);

  // Mini In-Situ Resource Utilization (ISRU) calculator
  const [harvestTons, setHarvestTons] = useState<number>(100);

  const handleCardClick = (res: ResourceInfo) => {
    playClickSound();
    setSelectedResource(res);
    setModalOpen(true);

    if (res.id === 'water_ice' || res.id === 'psr_cold_traps') {
      onUnlockAchievement('ice_hunter');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>IN-SITU RESOURCE UTILIZATION (ISRU) & LUNAR MINING</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          WHAT CAN WE FIND ON THE MOON?
        </h2>
        <p className="text-sm text-slate-400">
          The Moon is an extraordinary treasure chest of scientific history, raw metals, rocket propellant, and future clean fusion energy.
        </p>
      </div>

      {/* Interactive 5 Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LUNAR_RESOURCES.map(res => {
          const isCurrent = selectedResource.id === res.id;
          return (
            <div
              key={res.id}
              onClick={() => handleCardClick(res)}
              className={`glass-panel glass-panel-hover p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                isCurrent
                  ? 'border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:scale-110 transition-transform">
                    {res.icon}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    CLICK FOR INTEL
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {res.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 mt-0.5">
                    {res.subtitle}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {res.whatItIs}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="truncate">{res.abundanceEstimate}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lunar In-Situ Resource Utilization (ISRU) Conversion Model */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-gradient-to-r from-[#07132a] via-[#091834] to-[#040c1d]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              ISRU REFINERY CALCULATOR
            </span>
            <h3 className="text-xl font-display font-bold text-white">
              WHAT CAN 100 TONS OF LUNAR REGOLITH PRODUCE?
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-400">
            MINING SCALE: {harvestTons} METRIC TONS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">BREATHABLE OXYGEN (O2)</span>
            <span className="text-2xl font-bold text-cyan-300 mt-1 block">
              {(harvestTons * 0.42).toFixed(1)} Tons
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Extracted via molten regolith electrolysis (42% of soil is oxygen)
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">METALLIC SILICON & IRON</span>
            <span className="text-2xl font-bold text-blue-300 mt-1 block">
              {(harvestTons * 0.35).toFixed(1)} Tons
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Direct feedstocks for 3D-printing habitat domes and solar panels
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">POLAR WATER-ICE YIELD</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {(harvestTons * 0.055).toFixed(1)} Tons
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Split into Liquid Hydrogen & Oxygen rocket fuel (LH2/LOX)
            </span>
          </div>
        </div>
      </div>

      {/* Deep-Dive Resource Modal Dialog */}
      {modalOpen && selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-400 max-w-2xl w-full space-y-6 shadow-2xl shadow-cyan-950/40 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {selectedResource.icon}
                </span>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {selectedResource.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400">
                    {selectedResource.subtitle}
                  </div>
                </div>
              </div>

              <button
                id="close-resource-modal-btn"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Required Student-Friendly Sections */}
            <div className="space-y-4 text-xs font-mono">
              
              {/* 1. What it is */}
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>❓ WHAT IT IS</span>
                </div>
                <p className="text-slate-200 font-sans text-sm leading-relaxed">
                  {selectedResource.whatItIs}
                </p>
              </div>

              {/* 2. Where found */}
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-blue-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>📍 WHERE IT CAN BE FOUND</span>
                </div>
                <p className="text-slate-200 font-sans text-sm leading-relaxed">
                  {selectedResource.whereFound}
                </p>
              </div>

              {/* 3. Why scientists interested */}
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-purple-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>🔬 WHY SCIENTISTS ARE INTERESTED</span>
                </div>
                <p className="text-slate-200 font-sans text-sm leading-relaxed">
                  {selectedResource.whyImportant}
                </p>
              </div>

              {/* 4. Potential future applications */}
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>🚀 POTENTIAL FUTURE APPLICATIONS</span>
                </div>
                <p className="text-slate-200 font-sans text-sm leading-relaxed">
                  {selectedResource.futureApplications}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">
                RESOURCE CLASSIFICATION: <strong className="text-white">ISRU GRADE-1</strong>
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
              >
                GOT IT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
