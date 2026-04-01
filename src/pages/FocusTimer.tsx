import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Timer, 
  Coffee, Brain, Sparkles, CheckCircle2, 
  Settings, Volume2, VolumeX, Bell, BellOff,
  ArrowLeft
} from 'lucide-react';

interface FocusTimerProps {
  onBack: () => void;
}

export default function FocusTimer({ onBack }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState({
    focus: 25,
    break: 5,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (soundEnabled) {
      // Play sound logic here (optional)
    }
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft(settings[nextMode] * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (settings[mode] * 60);

  return (
    <div className="space-y-8 flex flex-col items-center">
      <header className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Focus Timer</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-indigo-600 transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-indigo-600 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
        <button
          onClick={() => { setMode('focus'); setTimeLeft(settings.focus * 60); setIsActive(false); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'focus' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Brain size={16} />
          Focus
        </button>
        <button
          onClick={() => { setMode('break'); setTimeLeft(settings.break * 60); setIsActive(false); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            mode === 'break' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Coffee size={16} />
          Break
        </button>
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress) }}
            transition={{ duration: 1, ease: 'linear' }}
            className={mode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black text-slate-800 tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
            {mode === 'focus' ? 'Stay Focused' : 'Time to Rest'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:text-rose-500 transition-all active:scale-90"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
            mode === 'focus' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-emerald-500 shadow-emerald-200'
          }`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <div className="w-14 h-14" /> {/* Spacer for symmetry */}
      </div>

      {/* Encouragement Card */}
      <div className="w-full bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <p className="text-indigo-900 font-bold text-sm leading-tight">
            {mode === 'focus' 
              ? "You're doing amazing! Every minute counts toward your dreams." 
              : "Great job focusing! Use this time to stretch and breathe."}
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Timer Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focus Duration</label>
                    <span className="text-indigo-600 font-bold">{settings.focus} min</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    value={settings.focus}
                    onChange={(e) => setSettings({ ...settings, focus: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Break Duration</label>
                    <span className="text-emerald-500 font-bold">{settings.break} min</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1"
                    value={settings.break}
                    onChange={(e) => setSettings({ ...settings, break: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowSettings(false);
                  resetTimer();
                }}
                className="w-full mt-10 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
              >
                Save Settings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
