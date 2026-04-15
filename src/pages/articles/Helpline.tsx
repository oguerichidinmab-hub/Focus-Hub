import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, ShieldCheck, Heart, Users, MessageCircle, Clock } from 'lucide-react';

interface ArticleProps {
  onBack: () => void;
}

export default function Helpline({ onBack }: ArticleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-rose-600 font-bold mb-4"
      >
        <ArrowLeft size={20} />
        Back to Support
      </button>

      <div className="bg-rose-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-rose-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
        <Phone className="absolute top-6 right-6 opacity-20" size={64} />
        <h1 className="text-3xl font-bold leading-tight relative z-10">Teen Helpline</h1>
        <p className="mt-2 text-rose-100 relative z-10 font-medium">You're never alone. We're here to help.</p>
      </div>

      <div className="space-y-8 px-2">
        <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
            Upcoming Feature
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Focus Hub Helpline</h2>
              <p className="text-sm font-bold text-slate-400">Coming Soon</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            We are working hard to bring you a dedicated 24/7 helpline where you can talk to trained professionals anonymously. Stay tuned for updates!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-rose-600" size={24} />
            When to reach out
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Sometimes life gets a bit too much. Whether it's school pressure, family stuff, or just feeling low, talking to someone can help you feel better.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-rose-600" size={24} />
            Who can you talk to?
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'School Counselor', desc: 'They are trained to help students with school and personal stuff.' },
              { title: 'Mentor', desc: 'A trusted adult who can guide you and listen without judgment.' },
              { title: 'Parent or Guardian', desc: 'They care about you and want to help you through tough times.' },
              { title: 'Teacher', desc: 'If you feel comfortable, a teacher can support you with school stress.' }
            ].map((person, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-1">{person.title}</h3>
                <p className="text-slate-500 text-sm">{person.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="text-rose-600" size={24} />
            How to ask for help
          </h2>
          <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 space-y-4">
            <p className="text-rose-900 font-medium">Try saying something like:</p>
            <div className="bg-white p-4 rounded-2xl italic text-slate-600 text-sm">
              "Hey, I've been feeling a bit overwhelmed lately and I'd really like to talk to someone about it. Do you have some time?"
            </div>
            <div className="bg-white p-4 rounded-2xl italic text-slate-600 text-sm">
              "I'm struggling with school and stress right now. Can you help me find some support?"
            </div>
          </div>
        </section>

        <section className="bg-slate-900 p-6 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle size={24} className="text-rose-400" />
            <h2 className="text-lg font-bold">Important Note</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            If you're in immediate danger or feeling like you might hurt yourself, please call emergency services or go to the nearest hospital. Your safety is the most important thing.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
