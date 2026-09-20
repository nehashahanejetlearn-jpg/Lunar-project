import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/lunarData';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ArrowRight,
  Trophy
} from 'lucide-react';
import { playClickSound, playSuccessChime, playWrongBuzzer } from '../utils/sound';

interface LunarQuizProps {
  onUnlockAchievement: (id: string) => void;
}

export const LunarQuiz: React.FC<LunarQuizProps> = ({ onUnlockAchievement }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    playClickSound();
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctIndex) {
      playSuccessChime();
      setScore(s => s + 1);
    } else {
      playWrongBuzzer();
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      onUnlockAchievement('quiz_master');
      playSuccessChime();
    }
  };

  const restartQuiz = () => {
    playClickSound();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const getRank = (finalScore: number, total: number) => {
    const ratio = finalScore / total;
    if (ratio === 1) return { title: 'MASTER ASTRONAUT', badge: '👨‍🚀', color: 'text-amber-400 border-amber-400' };
    if (ratio >= 0.75) return { title: 'FLIGHT SCIENTIST', badge: '🛰️', color: 'text-cyan-400 border-cyan-400' };
    if (ratio >= 0.5) return { title: 'MISSION SPECIALIST', badge: '🚀', color: 'text-blue-400 border-blue-400' };
    return { title: 'LUNAR CADET', badge: '🪐', color: 'text-purple-400 border-purple-400' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>ASTRONAUT CANDIDATE CERTIFICATION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide mt-1">
          MISSION KNOWLEDGE CHECK
        </h2>
        <p className="text-sm text-slate-400">
          Test your planetary science, lunar history, and space exploration mastery.
        </p>
      </div>

      {!isCompleted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-6 shadow-xl shadow-cyan-950/20">
          
          {/* Progress bar and Score counter */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">
              QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">CATEGORY: <strong className="text-white">{question.category.toUpperCase()}</strong></span>
              <span className="text-emerald-400 font-bold">SCORE: {score}</span>
            </div>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
            {question.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white';
              let icon = null;

              if (isAnswered) {
                if (idx === question.correctIndex) {
                  btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/20';
                  icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                } else if (idx === selectedOption) {
                  btnClass = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/20';
                  icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                } else {
                  btnClass = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between gap-3 text-sm sm:text-base ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
              selectedOption === question.correctIndex
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : 'bg-rose-950/40 border-rose-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  selectedOption === question.correctIndex ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedOption === question.correctIndex ? '✓ CORRECT ANSWER!' : '✗ INCORRECT'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                id="quiz-next-btn"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
              >
                <span>{currentIdx + 1 === QUIZ_QUESTIONS.length ? 'FINISH QUIZ & GET RANK' : 'NEXT QUESTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Complete Card */
        <div className="glass-panel p-8 rounded-2xl border border-cyan-400 text-center space-y-6 shadow-2xl shadow-cyan-950/40 animate-in zoom-in-95 duration-200">
          {(() => {
            const rank = getRank(score, QUIZ_QUESTIONS.length);
            return (
              <>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20">
                  {rank.badge}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                    CERTIFICATION COMPLETE
                  </span>
                  <h3 className={`text-3xl font-display font-bold ${rank.color}`}>
                    {rank.title}
                  </h3>
                  <div className="text-sm text-slate-400 font-mono">
                    FINAL SCORE: <strong className="text-white text-lg">{score}</strong> / {QUIZ_QUESTIONS.length} CORRECT
                  </div>
                </div>

                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {score >= 5
                    ? 'Exceptional lunar comprehension! You demonstrated stellar knowledge across orbital mechanics, geology, and human spaceflight history.'
                    : 'Good exploration attempt! Review the Lunar Science Lab and Interactive Map to brush up on craters and polar ice before your next flight.'}
                </p>

                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    id="restart-quiz-btn"
                    onClick={restartQuiz}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>RETRY QUIZ</span>
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
};
