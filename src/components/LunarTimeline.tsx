import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { TIMELINE_EVENTS } from '../data/lunarData';
import { 
  History, 
  Globe2, 
  ChevronRight, 
  X, 
  Sparkles, 
  Target,
  Rocket
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface LunarTimelineProps {
  onUnlockAchievement: (id: string) => void;
}

export const LunarTimeline: React.FC<LunarTimelineProps> = ({ onUnlockAchievement }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const tags = ['ALL', 'Origin', 'Discovery', 'Robotic', 'Crewed', 'Science', 'Future'];

  const filteredEvents = TIMELINE_EVENTS.filter(e => {
    if (filter === 'ALL') return true;
    return e.tag.toLowerCase() === filter.toLowerCase();
  });

  const handleOpenEvent = (event: TimelineEvent) => {
    playClickSound();
    setSelectedEvent(event);
    onUnlockAchievement('history_buff');
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'origin': return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'discovery': return 'text-purple-300 bg-purple-950/60 border-purple-500/30';
      case 'crewed': return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30';
      case 'robotic': return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30';
      case 'future': return 'text-rose-300 bg-rose-950/60 border-rose-500/30';
      default: return 'text-blue-300 bg-blue-950/60 border-blue-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <History className="w-4 h-4 text-cyan-400" />
          <span>CHRONOLOGY OF HUMAN & ROBOTIC EXPLORATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          LUNAR EXPLORATION TIMELINE
        </h2>
        <p className="text-sm text-slate-400">
          From the cosmic origin impact 4.5 billion years ago, through Apollo 11, to Chandrayaan-3 and the Artemis permanent outpost.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              playClickSound();
              setFilter(tag);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
              filter === tag
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Interactive Timeline Track */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-cyan-500/30 space-y-8 my-4 ml-4">
        {filteredEvents.map((event, idx) => (
          <div
            key={idx}
            className="relative group cursor-pointer"
            onClick={() => handleOpenEvent(event)}
          >
            {/* Timeline Dot Node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center group-hover:scale-125 group-hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-300 group-hover:bg-slate-950" />
            </div>

            {/* Event Card */}
            <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 hover:border-cyan-400/50 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {event.title}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getTagColor(event.tag)}`}>
                    {event.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    {event.year}
                  </span>
                  <span className="text-slate-400 truncate max-w-[200px]">{event.countryOrOrg}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {event.description}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 flex items-center gap-1 truncate">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Significance: {event.significance}</span>
                </span>
                <span className="flex items-center gap-1 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all shrink-0">
                  <span>EXPAND DOSSIER</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Detail Dossier */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-400 max-w-xl w-full space-y-6 shadow-2xl shadow-cyan-950/40 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase ${getTagColor(selectedEvent.tag)}`}>
                  {selectedEvent.tag}
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  {selectedEvent.title}
                </h3>
                <div className="text-xs font-mono text-cyan-400 mt-1">
                  {selectedEvent.countryOrOrg} • {selectedEvent.year}
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  MISSION NARRATIVE
                </span>
                <p className="text-sm text-slate-200 font-sans leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="p-4 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-cyan-200 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>HISTORICAL & SCIENTIFIC SIGNIFICANCE:</span>
                </div>
                <p className="text-sm font-sans leading-relaxed text-slate-200">
                  {selectedEvent.significance}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs uppercase tracking-wider"
              >
                CLOSE DOSSIER
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
