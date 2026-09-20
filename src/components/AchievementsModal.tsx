import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/lunarData';
import { Award, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface AchievementsModalProps {
  unlockedIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedIds,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-400 max-w-2xl w-full space-y-6 shadow-2xl shadow-cyan-950/60 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-2xl text-purple-300">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white">
                EXPLORER HONORS & BADGES
              </h3>
              <div className="text-xs font-mono text-cyan-400">
                ASTRONAUT CREDENTIALING SYSTEM
              </div>
            </div>
          </div>

          <button
            id="close-achievements-btn"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">EXPLORATION MASTERY</span>
            <span className="text-cyan-400 font-bold">
              {unlockedCount} OF {totalCount} BADGES UNLOCKED ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {ACHIEVEMENTS.map(badge => {
            const isUnlocked = unlockedIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-sm shadow-purple-500/10'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-purple-500/20 border border-purple-400' : 'bg-slate-950 border border-slate-800'
                }`}>
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-display font-bold text-white truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400 mt-1">
                    +{badge.xp} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            RETURN TO MISSION
          </button>
        </div>

      </div>
    </div>
  );
};
