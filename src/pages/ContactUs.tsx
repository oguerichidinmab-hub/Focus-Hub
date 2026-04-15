import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactUsProps {
  onBack: () => void;
}

export default function ContactUs({ onBack }: ContactUsProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you soon. ✨');
  };

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
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Mail size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contact Us</h1>
        </div>
        <p className="text-slate-600 leading-relaxed font-medium">
          Have questions or need support? We're here to help you on your journey.
        </p>
      </header>

      {!submitted ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-slate-800">officialnnennamary@gmail.com</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                Upcoming
              </div>
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Helpline</p>
                <p className="text-sm font-bold text-slate-400">Coming Soon</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
            <div className="space-y-2 pt-2">
              <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Your Name</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 p-5 rounded-3xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="How should we call you?"
              />
            </div>
            <div className="space-y-2">
              <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 p-5 rounded-3xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Where can we reach you?"
              />
            </div>
            <div className="space-y-2">
              <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 p-5 rounded-3xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Message Received!</h2>
          <p className="text-slate-500 leading-relaxed">
            Thank you for reaching out, {formData.name}. Our team will review your message and get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-indigo-600 font-bold text-sm hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
