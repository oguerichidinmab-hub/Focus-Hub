import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, BookOpen, Users, Shield, Target } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto pb-20"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-medium mb-8 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">About Focus Hub</h1>
        <div className="h-1 w-20 bg-indigo-600 rounded-full mb-6" />
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          Focus Hub is a supportive digital space created to help teenagers from single-parent households overcome the academic and emotional challenges they often face.
        </p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="text-indigo-600" size={24} />
            The "Focus Gap"
          </h2>
          <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
            <p>
              Many students in our communities experience what we call a “focus gap”—a situation where academic pressure, emotional stress, and limited support systems make it difficult to stay organized, motivated, and confident in school.
            </p>
            <p>
              For many of these students, balancing schoolwork, extracurricular activities, and personal responsibilities can feel overwhelming. Without the guidance and support that others may have readily available, they may struggle with homework deadlines, managing extramural lessons, and coping with feelings of loneliness, anxiety, or discouragement.
            </p>
          </div>
        </section>

        <section className="bg-indigo-50 rounded-[32px] p-8">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <Heart className="text-indigo-600" size={24} />
            Bridging the Gap
          </h2>
          <p className="text-indigo-800/80 leading-relaxed mb-6">
            Our platform provides a centralized hub where students can manage their academic responsibilities while also receiving emotional and peer support.
          </p>
          <div className="grid grid-cols-1 gap-4">
            {[
              "Track homework and assignment deadlines",
              "Organize daily schedules and extramural lessons",
              "Connect with peers for encouragement",
              "Check in with emotions and develop coping habits",
              "Access motivational tips and study resources"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <span className="text-sm font-semibold text-indigo-900">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="text-indigo-600" size={24} />
            Our Mission & Empowerment
          </h2>
          <p className="text-slate-600 leading-relaxed">
            At its core, Focus Hub is about empowerment. We believe that every teenager deserves the opportunity to succeed academically and emotionally, regardless of their family circumstances. By providing structure, encouragement, and community, we help students develop the confidence and discipline needed to reach their full potential.
          </p>
        </section>

        <section className="border-t border-slate-100 pt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Global Impact (SDGs)</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-bold text-slate-800">Good Health and Well-being</h3>
                <p className="text-sm text-slate-500">Supporting emotional awareness and mental wellness.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-bold text-slate-800">Quality Education</h3>
                <p className="text-sm text-slate-500">Helping students stay organized and improve academic performance.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold">10</div>
              <div>
                <h3 className="font-bold text-slate-800">Reduced Inequalities</h3>
                <p className="text-sm text-slate-500">Ensuring underserved students have access to tools that promote success.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 rounded-[40px] p-10 text-white text-center">
          <p className="text-lg font-medium mb-2">Together, we can transform challenges into focus, and focus into success.</p>
          <p className="text-slate-400 text-sm">Focus Hub is more than just an app—it is a community-driven initiative designed to uplift students.</p>
        </footer>
      </div>
    </motion.div>
  );
}
