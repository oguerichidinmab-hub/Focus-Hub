import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PomodoroTimerProps {
  onClose?: () => void;
}

type TimerMode = 'focus' | 'break';

export default function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
    setIsActive(false);
  }, [focusDuration, breakDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(mode === 'focus' ? 'Focus Session Complete!' : 'Break Over!', {
          body: mode === 'focus' ? 'Time for a break.' : 'Ready to focus again?',
        });
      }
      
      // Auto switch mode after a short delay or just stop
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setTimeout(() => switchMode(nextMode), 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? focusDuration * 60 : breakDuration * 60)) * 100;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${mode === 'focus' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {mode === 'focus' ? <Target size={20} /> : <Coffee size={20} />}
          </div>
          <h3 className="text-xl font-bold text-slate-800 capitalize">{mode} Session</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center mb-10">
        {/* Progress Circle (Simplified SVG) */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-50"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="754"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
              transition={{ duration: 1, ease: "linear" }}
              className={mode === 'focus' ? 'text-indigo-600' : 'text-emerald-600'}
            />
          </svg>
          <div className="text-center z-10">
            <span className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Remaining
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={resetTimer}
          className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
          aria-label="Reset timer"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
            mode === 'focus' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
          aria-label="Timer settings"
        >
          <Bell size={24} />
        </button>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            mode === 'focus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            mode === 'break' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Break
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase">Focus (min)</label>
                <input
                  type="number"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="w-16 bg-slate-50 border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase">Break (min)</label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  className="w-16 bg-slate-50 border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (Notification.permission !== 'granted') {
                    Notification.requestPermission();
                  }
                }}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Enable Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
