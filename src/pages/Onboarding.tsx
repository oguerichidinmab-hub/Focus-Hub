import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles, Book, Target, Clock, Calendar, Heart } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    grade: '',
    strugglingSubjects: [] as string[],
    studyGoals: [] as string[],
    reminderTimes: [] as string[],
    hasExtramural: false,
    supportPreferences: [] as string[],
  });

  const subjects = ['Maths', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE'];
  const goals = ['Better Grades', 'Manage Stress', 'Stay Organized', 'Find Friends', 'Feel More Confident'];
  const supportTypes = ['Motivation Reminders', 'Peer Support', 'Study Planner', 'Wellness Check-ins'];

  const handleToggle = (list: string[], item: string, key: string) => {
    const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setFormData({ ...formData, [key]: newList });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFinish = async () => {
    if (!profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      ...formData,
      onboarded: true,
    };

    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        ...formData,
        onboarded: true,
      });
      onComplete(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Welcome!</h2>
              <p className="text-slate-500 mt-2">Let's get to know you a bit better.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">What should we call you?</label>
                <input 
                  type="text" 
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Your nickname"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">What grade are you in?</label>
                <input 
                  type="text" 
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. Grade 10"
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Book size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">School Life</h2>
              <p className="text-slate-500 mt-2">Which subjects do you find tricky?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => handleToggle(formData.strugglingSubjects, subject, 'strugglingSubjects')}
                  className={`py-4 px-4 rounded-2xl border-2 transition-all text-sm font-bold flex items-center justify-between ${
                    formData.strugglingSubjects.includes(subject) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {subject}
                  {formData.strugglingSubjects.includes(subject) && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Target size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Your Goals</h2>
              <p className="text-slate-500 mt-2">What would you like to achieve?</p>
            </div>
            
            <div className="space-y-3">
              {goals.map(goal => (
                <button
                  key={goal}
                  onClick={() => handleToggle(formData.studyGoals, goal, 'studyGoals')}
                  className={`w-full py-4 px-6 rounded-2xl border-2 transition-all text-left font-bold flex items-center justify-between ${
                    formData.studyGoals.includes(goal) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {goal}
                  {formData.studyGoals.includes(goal) && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Heart size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Support</h2>
              <p className="text-slate-500 mt-2">How can we help you best?</p>
            </div>
            
            <div className="space-y-3">
              {supportTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleToggle(formData.supportPreferences, type, 'supportPreferences')}
                  className={`w-full py-4 px-6 rounded-2xl border-2 transition-all text-left font-bold flex items-center justify-between ${
                    formData.supportPreferences.includes(type) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {type}
                  {formData.supportPreferences.includes(type) && <Check size={16} />}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setFormData({ ...formData, hasExtramural: !formData.hasExtramural })}
                className={`w-full py-4 px-6 rounded-2xl border-2 transition-all text-left font-bold flex items-center justify-between ${
                  formData.hasExtramural 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                Do you attend extra lessons?
                <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasExtramural ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.hasExtramural ? 'left-7' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-12">
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all ${step === i ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
          >
            Back
          </button>
        )}
        <button 
          onClick={step === 4 ? handleFinish : nextStep}
          disabled={step === 1 && !formData.nickname}
          className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {step === 4 ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
