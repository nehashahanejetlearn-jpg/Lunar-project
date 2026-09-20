import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  MessageSquare, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { playClickSound, playHoverBeep } from '../utils/sound';

interface LunaAssistantProps {
  onUnlockAchievement?: (id: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Why is there no wind on the Moon?',
  'How did the Moon form?',
  'Can plants grow in Moon soil?',
  'What is the dark side of the Moon?',
  'Why do footprints stay forever on the Moon?',
];

export const LunaAssistant: React.FC<LunaAssistantProps> = ({ onUnlockAchievement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Greetings explorer! I'm LUNA AI, your personal Artemis flight computer and planetary science guide. Ask me anything about Moon geology, gravity, Apollo history, or future lunar bases!",
      time: 'T-00:00',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    playClickSound();
    const userMsg: Message = {
      role: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Telemetry link active. The Moon has no atmosphere to sustain weather systems.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      playHoverBeep();
    } catch (err) {
      // Fallback offline responses for students
      const fallback = getOfflineFallback(textToSend);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Student friendly offline knowledge database
  const getOfflineFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('wind') || q.includes('weather') || q.includes('air')) {
      return "There is no wind on the Moon because it lacks an atmosphere! Without air pressure or weather systems, the lunar sky is perpetual black space, and dust only moves when disturbed by meteorites, rocket thrusters, or rover wheels.";
    }
    if (q.includes('form') || q.includes('origin') || q.includes('created')) {
      return "The leading theory is the 'Giant Impact Hypothesis': roughly 4.5 billion years ago, a Mars-sized protoplanet named Theia collided with the young Earth. The molten debris ejected into orbit coalesced into our Moon over thousands of years!";
    }
    if (q.includes('plant') || q.includes('grow') || q.includes('soil')) {
      return "Yes! In 2022, scientists at the University of Florida successfully sprouted Arabidopsis thaliana (thale cress) seeds in genuine Apollo lunar regolith! While plants experienced stress from the abrasive volcanic glass, with hydroponic enrichment, lunar farming is very promising.";
    }
    if (q.includes('dark side') || q.includes('far side')) {
      return "The 'dark side' is actually a misnomer—it should be called the Far Side! The Moon is tidally locked with Earth, meaning it rotates on its axis at the same rate it orbits us. The far side gets just as much sunlight as the near side!";
    }
    if (q.includes('footprint') || q.includes('stay') || q.includes('forever')) {
      return "Neil Armstrong and Buzz Aldrin's footprints will last for millions of years because there is no wind, rain, or flowing water to erode them. Only micrometeorite erosion will slowly smooth them over vast geological eras!";
    }
    return "Fascinating query! The Moon orbits Earth at an average distance of 384,400 km. Its surface is covered in fine powdery regolith created by billions of years of asteroid impacts. What specific topic would you like to investigate next?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="open-luna-ai-btn"
          onClick={() => {
            playClickSound();
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all border border-cyan-300 group animate-bounce hover:animate-none"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>ASK LUNA AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel rounded-2xl border border-cyan-400 w-[92vw] sm:w-[400px] h-[520px] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-bold text-sm text-white">LUNA AI</h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 rounded">
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ARTEMIS MISSION COPILOT
                </div>
              </div>
            </div>

            <button
              id="close-luna-ai-btn"
              onClick={() => {
                playClickSound();
                setIsOpen(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-sans">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>LUNA AI analyzing lunar telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] font-mono whitespace-nowrap transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question about the Moon..."
              disabled={loading}
              className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
