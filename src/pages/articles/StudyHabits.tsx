import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle2, Sparkles } from 'lucide-react';

interface ArticleProps {
  onBack: () => void;
}

export default function StudyHabits({ onBack }: ArticleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 font-bold mb-4"
      >
        <ArrowLeft size={20} />
        Back to Support
      </button>

      <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <BookOpen className="absolute top-4 right-4 opacity-20" size={48} />
        <h1 className="text-3xl font-bold leading-tight">Effective Study Habits</h1>
        <p className="mt-2 text-emerald-100">Study smarter, not harder.</p>
      </div>

      <div className="space-y-8 px-2">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="text-emerald-600" size={24} />
            Break it down
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Don't look at a whole project or exam at once. Break it into smaller, manageable tasks. It's much easier to finish "Read 5 pages" than "Study for History."
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-emerald-600" size={24} />
            Use short focus sessions
          </h2>
          <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
            <p className="text-emerald-900 font-medium mb-4">Try the Pomodoro technique:</p>
            <ol className="space-y-2 text-emerald-800 text-sm">
              <li>1. Study for 25 minutes</li>
              <li>2. Take a 5-minute break</li>
              <li>3. Repeat 4 times, then take a longer break</li>
            </ol>
            <p className="mt-4 text-emerald-700 text-xs italic italic">Tip: Use the Focus Timer in the Home dashboard!</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={24} />
            Avoid cramming
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Cramming the night before a test might help you pass, but you'll forget everything the next day. Reviewing your notes regularly helps your brain store information long-term.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-emerald-600" size={24} />
            Plan by priority
          </h2>
          <ul className="space-y-3">
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Most important first:</strong> Tackle the hardest or most important task when your energy is highest.
            </li>
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Regular review:</strong> Spend 10 minutes each week reviewing what you learned in each subject.
            </li>
          </ul>
        </section>

        <section className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <h2 className="text-lg font-bold mb-3">Your study space</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Find a quiet, well-lit spot to study. Keep your phone in another room or use "Do Not Disturb" mode to avoid distractions. A clean space leads to a focused mind!
          </p>
        </section>
      </div>
    </motion.div>
  );
}
