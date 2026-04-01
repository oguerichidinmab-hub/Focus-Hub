import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Brain, Clock, Heart, MessageCircle } from 'lucide-react';

interface ArticleProps {
  onBack: () => void;
}

export default function ExamStress({ onBack }: ArticleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-bold mb-4"
      >
        <ArrowLeft size={20} />
        Back to Support
      </button>

      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 opacity-20" size={48} />
        <h1 className="text-3xl font-bold leading-tight">Managing Exam Stress</h1>
        <p className="mt-2 text-indigo-100">Keep your cool and do your best.</p>
      </div>

      <div className="space-y-8 px-2">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} />
            Why it happens
          </h2>
          <p className="text-slate-600 leading-relaxed">
            It's totally normal to feel nervous before a big test. Your brain is just trying to make sure you're ready! But when that stress gets too big, it can make it hard to focus.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={24} />
            Prepare without panic
          </h2>
          <ul className="space-y-3">
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Start early:</strong> Even 20 minutes a day is better than a 5-hour cram session.
            </li>
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Active recall:</strong> Don't just read notes. Quiz yourself or explain a topic to a friend.
            </li>
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Organize:</strong> Use the Planner to break down what you need to study each day.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="text-indigo-600" size={24} />
            Quick reset techniques
          </h2>
          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
            <p className="text-indigo-900 font-medium mb-4">Try the 4-7-8 breathing method:</p>
            <ol className="space-y-2 text-indigo-800 text-sm">
              <li>1. Breathe in for 4 seconds</li>
              <li>2. Hold your breath for 7 seconds</li>
              <li>3. Breathe out slowly for 8 seconds</li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">The night before</h2>
          <p className="text-slate-600 leading-relaxed">
            Stop studying at least an hour before bed. Pack your bag, pick your outfit, and get a good night's sleep. Your brain needs rest to remember everything you've learned!
          </p>
        </section>

        <section className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle size={24} className="text-indigo-400" />
            <h2 className="text-lg font-bold">When to ask for help</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            If you're feeling so stressed that you can't eat, sleep, or you're feeling hopeless, please talk to a teacher, parent, or school counselor. You don't have to carry this alone.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
