import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShieldCheck, Eye, Lock, MessageSquare, AlertTriangle } from 'lucide-react';

interface SafetyGuidelinesProps {
  onBack: () => void;
}

export default function SafetyGuidelines({ onBack }: SafetyGuidelinesProps) {
  const guidelines = [
    {
      title: 'Keep it Kind',
      icon: Heart,
      desc: 'Treat everyone with respect. Bullying, harassment, or hate speech is not allowed in our community.',
      color: 'text-rose-600 bg-rose-50'
    },
    {
      title: 'Protect Your Privacy',
      icon: Lock,
      desc: 'Never share your real name, address, phone number, or school location with strangers online.',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Report Concerns',
      icon: AlertTriangle,
      desc: 'If you see something that makes you uncomfortable, use the report button or contact our support team.',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Safe Sharing',
      icon: MessageSquare,
      desc: 'Share wins and tips, but avoid sharing sensitive personal struggles that are better discussed with a professional.',
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto pb-20 px-4"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-medium mb-8 hover:text-indigo-600 transition-colors pt-4"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Safety Guidelines</h1>
        </div>
        <p className="text-slate-600 leading-relaxed font-medium">
          Your safety is our top priority. Focus Hub is designed to be a safe, supportive, and positive space for all students.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {guidelines.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 rounded-[40px] p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          If you are in immediate danger or experiencing a crisis, please contact your local emergency services or a trusted adult immediately.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Emergency Contacts
          </button>
          <button className="bg-white/10 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/20 transition-colors">
            Talk to a Counselor
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { Heart } from 'lucide-react';
