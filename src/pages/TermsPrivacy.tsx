import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, FileText, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

interface TermsPrivacyProps {
  onBack: () => void;
}

export default function TermsPrivacy({ onBack }: TermsPrivacyProps) {
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
          <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Terms & Privacy</h1>
        </div>
        <p className="text-slate-600 leading-relaxed font-medium">
          We are committed to protecting your privacy and ensuring a safe, supportive environment for all our users.
        </p>
      </header>

      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-indigo-600" size={24} />
            Privacy Policy
          </h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Data Protection</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your personal information (email, real name) is encrypted and never shared with third parties or other users.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Transparency</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We only collect data that helps improve your focus and academic journey, such as task completion and streaks.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-indigo-600" size={24} />
            Terms of Service
          </h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            {[
              "You must be at least 13 years old to use Focus Hub.",
              "Respectful behavior is mandatory in all community spaces.",
              "You are responsible for maintaining the security of your account.",
              "We reserve the right to remove content that violates our safety guidelines.",
              "Focus Hub is provided 'as is' for educational and supportive purposes."
            ].map((term, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600 leading-relaxed">{term}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Last Updated</p>
          <p className="text-sm font-bold text-slate-600">April 1, 2026</p>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            By using Focus Hub, you agree to these terms and our privacy policy. If you have any questions, please contact us.
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
