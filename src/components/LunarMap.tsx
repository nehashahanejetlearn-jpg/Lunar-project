import React, { useState } from 'react';
import { LunarLocation, LunarFeatureType } from '../types';
import { LUNAR_LOCATIONS } from '../data/lunarData';
import { ThreeMoonCanvas } from './ThreeMoonCanvas';
import { 
  Search, 
  MapPin, 
  Layers, 
  Volume2, 
  Sparkles, 
  Compass, 
  Info, 
  X, 
  ExternalLink,
  Target,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { playClickSound, playHoverBeep } from '../utils/sound';

interface LunarMapProps {
  selectedLocation: LunarLocation | null;
  onSelectLocation: (loc: LunarLocation) => void;
  onUnlockAchievement: (id: string) => void;
}

export const LunarMap: React.FC<LunarMapProps> = ({
  selectedLocation,
  onSelectLocation,
  onUnlockAchievement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'3d' | 'flat'>('3d');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inspectedCount, setInspectedCount] = useState<Set<string>>(new Set());

  const featureTypes = ['ALL', 'Crater', 'Mare', 'Landing Site', 'Polar Region'];

  const filteredLocations = LUNAR_LOCATIONS.filter(loc => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || loc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleLocationClick = (loc: LunarLocation) => {
    playClickSound();
    onSelectLocation(loc);
    
    // Track count for achievements
    const newSet = new Set(inspectedCount);
    newSet.add(loc.id);
    setInspectedCount(newSet);
    if (newSet.size >= 3) {
      onUnlockAchievement('moon_explorer');
    }
  };

  const handleSpeakBriefing = (loc: LunarLocation) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    playClickSound();
    const text = `${loc.name}. ${loc.type}. ${loc.description} Scientific importance: ${loc.scientificImportance}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>ORBITAL RECONNAISSANCE & CARTOGRAPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
            INTERACTIVE MOON MAP
          </h2>
          <p className="text-sm text-slate-400">
            Rotate the 3D Moon sphere, click orbital pins, or browse high-resolution geological records below.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800">
            <button
              id="map-viewmode-3d-btn"
              onClick={() => {
                playClickSound();
                setViewMode('3d');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D GLOBE
            </button>
            <button
              id="map-viewmode-flat-btn"
              onClick={() => {
                playClickSound();
                setViewMode('flat');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                viewMode === 'flat'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CHART GRID
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3 rounded-xl border border-cyan-500/20">
        
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
          <input
            id="lunar-search-input"
            type="text"
            placeholder="Search craters, maria, Apollo sites..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {featureTypes.map(type => (
            <button
              key={type}
              id={`filter-type-${type.toLowerCase().replace(' ', '-')}`}
              onClick={() => {
                playClickSound();
                setSelectedType(type);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Main Map Visualizer & Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Center / Left: Map Display Canvas */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          <div className="relative glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden min-h-[460px] sm:min-h-[520px] flex items-center justify-center bg-gradient-to-b from-[#060e22] to-[#02050f]">
            
            {/* HUD Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>SENSOR: LRO-RADAR HD</span>
                </div>
                <div>FOV: 45° • RES: 0.5m/px</div>
              </div>

              {/* Coordinates targeter */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div>
                  TARGET: {selectedLocation ? selectedLocation.coordinates : 'LAT 00°00\' • LNG 00°00\''}
                </div>
                <div className="text-cyan-400/90 font-bold">
                  {selectedLocation ? selectedLocation.name.toUpperCase() : 'SELECT A LOCATION'}
                </div>
              </div>
            </div>

            {/* View Mode: 3D Globe */}
            {viewMode === '3d' ? (
              <div className="w-full h-[460px] sm:h-[520px]">
                <ThreeMoonCanvas
                  onSelectLocation={handleLocationClick}
                  selectedLocationId={selectedLocation?.id}
                  autoRotateSpeed={0.0018}
                  showPins={true}
                  enableZoom={true}
                />
              </div>
            ) : (
              /* View Mode: Flat Chart Surface with Coordinates Markers */
              <div className="w-full h-[460px] sm:h-[520px] p-6 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-72 h-72 rounded-full border border-cyan-500/40 border-dashed animate-spin-slow" />
                  <div className="w-96 h-96 rounded-full border border-slate-700" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="text-center font-mono text-xs text-cyan-400 bg-slate-900/80 py-1 px-4 rounded-full max-w-xs mx-auto border border-cyan-500/30">
                    LUNAR SURFACE CARTOGRAPHIC GRID
                  </div>

                  {/* Grid of locations */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[360px] p-2">
                    {filteredLocations.map(loc => {
                      const isSelected = selectedLocation?.id === loc.id;
                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleLocationClick(loc)}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40'
                          }`}
                        >
                          <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                            <span className="text-sm">📍</span>
                            <span className="truncate">{loc.name}</span>
                          </div>
                          <div className="text-[10px] font-mono text-cyan-300/80 mt-1">{loc.type}</div>
                          <div className="text-[10px] text-slate-400 truncate">{loc.coordinates}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-center text-[11px] font-mono text-slate-500">
                    Showing {filteredLocations.length} locations matching filter
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">POPULAR:</span>
            {LUNAR_LOCATIONS.slice(0, 5).map(loc => (
              <button
                key={loc.id}
                onClick={() => handleLocationClick(loc)}
                onMouseEnter={playHoverBeep}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                  selectedLocation?.id === loc.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>

        </div>

        {/* Right: Detailed Location Information Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          {selectedLocation ? (
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 space-y-5 animate-in fade-in duration-300 shadow-xl shadow-cyan-950/20">
              
              {/* Location Card Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                    <Target className="w-3 h-3 text-cyan-400" />
                    {selectedLocation.type.toUpperCase()}
                  </span>
                  
                  {/* Audio Briefing Button */}
                  <button
                    id="listen-briefing-btn"
                    onClick={() => handleSpeakBriefing(selectedLocation)}
                    title={isSpeaking ? 'Stop Audio Briefing' : 'Listen to Audio Briefing'}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                      isSpeaking
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-500/40'
                    }`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                    <span>{isSpeaking ? 'MUTE' : 'AUDIO BRIEF'}</span>
                  </button>
                </div>

                <h3 className="text-2xl font-display font-bold text-white tracking-wide pt-1">
                  {selectedLocation.name}
                </h3>
                <div className="text-xs font-mono text-cyan-400">
                  COORDINATES: {selectedLocation.coordinates}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {selectedLocation.diameter && (
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">DIAMETER</span>
                    <span className="text-white font-semibold">{selectedLocation.diameter}</span>
                  </div>
                )}
                {selectedLocation.depth && (
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">DEPTH / SCALE</span>
                    <span className="text-white font-semibold">{selectedLocation.depth}</span>
                  </div>
                )}
                {selectedLocation.age && (
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 col-span-2">
                    <span className="text-slate-400 block text-[10px]">ESTIMATED AGE</span>
                    <span className="text-cyan-300 font-semibold">{selectedLocation.age}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  DESCRIPTION
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {selectedLocation.description}
                </p>
              </div>

              {/* Formation & Geology */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                  FORMATION & GEOLOGY
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {selectedLocation.formation}
                </p>
              </div>

              {/* Scientific Importance */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  SCIENTIFIC IMPORTANCE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {selectedLocation.scientificImportance}
                </p>
              </div>

              {/* Historical mission badge if applicable */}
              {selectedLocation.historicalMission && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-blue-500/30 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <span className="text-[10px] font-mono text-blue-300 block font-bold uppercase">
                      HISTORIC MISSIONS
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {selectedLocation.historicalMission}
                    </span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Blank state prompting click */
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Target className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                SELECT A LUNAR FEATURE
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Click any crater pin on the 3D Moon or select from the list to examine geological descriptions, formation mechanics, and mission data.
              </p>
              <button
                onClick={() => handleLocationClick(LUNAR_LOCATIONS[0])}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-all"
              >
                VIEW TYCHO CRATER
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
