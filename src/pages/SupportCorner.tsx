import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Phone, MessageSquare, BookOpen, 
  ChevronRight, ExternalLink, ShieldCheck, 
  AlertCircle, Info, Sparkles, Star, ArrowLeft
} from 'lucide-react';
import { SupportResource } from '../types';

interface SupportCornerProps {
  onOpenArticle: (id: string) => void;
  onBack: () => void;
}

export default function SupportCorner({ onOpenArticle, onBack }: SupportCornerProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'stress' | 'study' | 'mental-health'>('all');

  const resources: SupportResource[] = [
    {
      id: 'exam-stress',
      title: 'Managing Exam Stress',
      description: 'Simple breathing exercises and study tips to keep your cool during finals.',
      category: 'stress',
      type: 'article',
      url: '#',
      icon: 'Sparkles'
    },
    {
      id: 'helpline',
      title: 'Teen Helpline',
      description: 'Free, confidential support for teenagers. Available 24/7.',
      category: 'mental-health',
      type: 'helpline',
      url: '#',
      icon: 'Phone'
    },
    {
      id: 'study-habits',
      title: 'Effective Study Habits',
      description: 'Learn how to organize your study space and manage your time better.',
      category: 'study',
      type: 'article',
      url: '#',
      icon: 'BookOpen'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness for Teens',
      description: 'A guide to staying present and reducing daily anxiety.',
      category: 'mental-health',
      type: 'article',
      url: '#',
      icon: 'Heart'
    }
  ];

  const filteredResources = resources.filter(r => activeCategory === 'all' || r.category === activeCategory);

  return (
    <div className="space-y-8 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-bold mb-4"
      >
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Support Corner</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          You're never alone. Here are some resources to help you through tough times.
        </p>
      </header>

      {/* Emergency Contact Banner */}
      <div className="bg-rose-50 p-6 rounded-[2.5rem] border border-rose-100 space-y-4 shadow-sm shadow-rose-50">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle size={24} />
          <h3 className="font-black text-sm uppercase tracking-widest">Need help right now?</h3>
        </div>
        <p className="text-rose-900 text-sm font-medium leading-relaxed">
          If you're in immediate danger or feeling overwhelmed, please reach out to a trusted adult or call emergency services.
        </p>
        <button 
          onClick={() => onOpenArticle('helpline')}
          className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all active:scale-95"
        >
          <Phone size={20} />
          Call Emergency Helpline
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'stress', 'study', 'mental-health'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest ${
              activeCategory === cat 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4">
        {filteredResources.map((resource) => (
          <motion.div
            layout
            key={resource.id}
            onClick={() => onOpenArticle(resource.id)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors shrink-0">
              {resource.icon === 'Phone' ? <Phone size={24} /> : 
               resource.icon === 'Sparkles' ? <Sparkles size={24} /> : 
               resource.icon === 'BookOpen' ? <BookOpen size={24} /> : 
               <Heart size={24} />}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  {resource.type}
                </span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                {resource.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {resource.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Privacy Note */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4">
        <ShieldCheck size={24} className="text-slate-400 shrink-0" />
        <div className="space-y-1">
          <h5 className="font-bold text-slate-700 text-sm">Your Privacy Matters</h5>
          <p className="text-slate-500 text-xs leading-relaxed">
            Accessing these resources is private. We don't share your activity with anyone. Your safety and well-being are our top priority.
          </p>
        </div>
      </div>
    </div>
  );
}
