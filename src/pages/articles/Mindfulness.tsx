import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Sparkles, Brain, Clock, MessageCircle } from 'lucide-react';

interface ArticleProps {
  onBack: () => void;
}

export default function Mindfulness({ onBack }: ArticleProps) {
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
        <Heart className="absolute top-4 right-4 opacity-20" size={48} />
        <h1 className="text-3xl font-bold leading-tight">Mindfulness for Teens</h1>
        <p className="mt-2 text-indigo-100">Find your calm in the chaos.</p>
      </div>

      <div className="space-y-8 px-2">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} />
            What is mindfulness?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Mindfulness is just about being here, right now. It's noticing what's happening in your body and mind without judging it. It's like taking a break from the noise of the world.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={24} />
            A simple breathing exercise
          </h2>
          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
            <p className="text-indigo-900 font-medium mb-4">Try the "Box Breathing" method:</p>
            <ol className="space-y-2 text-indigo-800 text-sm">
              <li>1. Breathe in for 4 seconds</li>
              <li>2. Hold for 4 seconds</li>
              <li>3. Breathe out for 4 seconds</li>
              <li>4. Hold for 4 seconds</li>
              <li>5. Repeat 3 times</li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={24} />
            Reset ideas for stressful days
          </h2>
          <ul className="space-y-3">
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Notice 5 things:</strong> 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, 1 thing you taste.
            </li>
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Take a walk:</strong> Even a 5-minute walk without your phone can help you reset.
            </li>
            <li className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 text-sm">
              <strong className="text-slate-800 block mb-1">Listen to music:</strong> Put on your favorite song and just listen to the lyrics and melody.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Pause and refocus</h2>
          <p className="text-slate-600 leading-relaxed">
            When you feel school pressure building up, take a moment to pause. Remind yourself that you're doing your best, and that's enough. Take a deep breath and then start again.
          </p>
        </section>

        <section className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle size={24} className="text-indigo-400" />
            <h2 className="text-lg font-bold">You've got this!</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Mindfulness is a skill that takes practice. Be patient with yourself and try to do a little bit each day. You'll soon find it easier to stay calm and focused!
          </p>
        </section>
      </div>
    </motion.div>
  );
}
