import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, GraduationCap, Target, 
  Settings, Bell, Shield, LogOut, 
  ChevronRight, Edit2, Sparkles, Heart,
  Flame, Trophy, BookOpen, Phone, Brain,
  Check, X, Plus
} from 'lucide-react';
import { useAuth } from '../App';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

interface ProfileProps {
  onOpenSupport: () => void;
  onOpenArticle: (id: string) => void;
}

export default function Profile({ onOpenSupport, onOpenArticle }: ProfileProps) {
  const { profile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    nickname: profile?.nickname || '',
    grade: profile?.grade || '',
    strugglingSubjects: profile?.strugglingSubjects || [],
  });
  const [newSubject, setNewSubject] = useState('');

  // Settings states
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    communityUpdates: true,
    weeklyReport: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showStreak: true,
    anonymousCommunity: false
  });

  const handleSave = async () => {
    if (!profile?.uid) return;
    try {
      const docRef = doc(db, 'users', profile.uid);
      await updateDoc(docRef, {
        nickname: editedProfile.nickname,
        grade: editedProfile.grade,
        strugglingSubjects: editedProfile.strugglingSubjects,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully! ✨');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const addSubject = () => {
    if (newSubject.trim() && !editedProfile.strugglingSubjects.includes(newSubject.trim())) {
      setEditedProfile({
        ...editedProfile,
        strugglingSubjects: [...editedProfile.strugglingSubjects, newSubject.trim()]
      });
      setNewSubject('');
    }
  };

  const removeSubject = (sub: string) => {
    setEditedProfile({
      ...editedProfile,
      strugglingSubjects: editedProfile.strugglingSubjects.filter(s => s !== sub)
    });
  };

  const stats = [
    { label: 'Homework Streak', value: profile?.streak?.current || '0', icon: Flame, color: 'text-orange-600 bg-orange-50' },
    { label: 'Tasks Done', value: '24', icon: Target, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const supportResources = [
    { id: 'exam-stress', title: 'Managing Exam Stress', icon: Brain, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'helpline', title: 'Teen Helpline', icon: Phone, color: 'text-rose-600 bg-rose-50' },
    { id: 'study-habits', title: 'Study Habits', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'mindfulness', title: 'Mindfulness', icon: Heart, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {activeSetting ? (
          <motion.div
            key="settings-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <header className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => setActiveSetting(null)}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeSetting.replace('-', ' ')}</h2>
            </header>

            {activeSetting === 'notifications' && (
              <div className="space-y-4">
                {[
                  { id: 'studyReminders', label: 'Study Reminders', desc: 'Get notified when it\'s time to focus.' },
                  { id: 'communityUpdates', label: 'Community Updates', desc: 'Know when someone likes your wins.' },
                  { id: 'weeklyReport', label: 'Weekly Progress Report', desc: 'A summary of your focus hours and streaks.' },
                ].map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                      <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: notifications[item.id as keyof typeof notifications] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSetting === 'privacy-safety' && (
              <div className="space-y-4">
                {[
                  { id: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your nickname and grade.' },
                  { id: 'showStreak', label: 'Show Streak', desc: 'Display your homework streak in the community.' },
                  { id: 'anonymousCommunity', label: 'Anonymous Posting', desc: 'Hide your identity when posting in community.' },
                ].map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                      <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setPrivacy(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof privacy] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${privacy[item.id as keyof typeof privacy] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: privacy[item.id as keyof typeof privacy] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
                <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start gap-4 mt-4">
                  <Shield size={24} className="text-indigo-600 shrink-0" />
                  <p className="text-indigo-900 text-xs leading-relaxed">
                    We take your safety seriously. Your real name and email are <strong>never</strong> shared with other students.
                  </p>
                </div>
              </div>
            )}

            {activeSetting === 'app-settings' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold text-sm">App Theme</span>
                    <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Light Mode</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold text-sm">Language</span>
                    <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">English</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold text-sm">Storage Used</span>
                    <span className="text-slate-400 font-bold text-xs">1.2 MB</span>
                  </div>
                </div>
                <button className="w-full py-4 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-2xl transition-colors">
                  Clear Cache
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setActiveSetting(null);
                toast.success('Settings saved! ✨');
              }}
              className="w-full bg-slate-900 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-slate-100 flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Check size={20} />
              Done
            </button>
          </motion.div>
        ) : !isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <header className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="relative">
                <div className="w-28 h-28 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full rounded-[2.5rem] object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 border border-slate-100 hover:scale-110 transition-transform"
                >
                  <Edit2 size={18} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{profile?.nickname || profile?.displayName || 'Student'}</h2>
                <p className="text-slate-400 font-medium text-sm">{profile?.email}</p>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Milestones & Badges */}
            {profile?.streak?.milestones && profile.streak.milestones.length > 0 && (
              <section className="space-y-3">
                <h3 className="px-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Milestones & Badges</h3>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-4">
                  {profile.streak.milestones.map((m, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
                        <Trophy size={28} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-center max-w-[60px]">
                        {m.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Support Resources */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-4">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Support & Resources</h3>
                <button onClick={onOpenSupport} className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">View All</button>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {supportResources.map((res) => (
                  <button 
                    key={res.id}
                    onClick={() => onOpenArticle(res.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${res.color}`}>
                        <res.icon size={20} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{res.title}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </section>

            {/* Profile Info */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <GraduationCap size={20} className="text-indigo-600" />
                  Academic Profile
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Grade</span>
                  <span className="text-slate-800 font-bold">{profile?.grade || 'Not set'}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-slate-400 text-sm font-medium">Struggling Subjects</span>
                  <div className="flex flex-wrap gap-2">
                    {profile?.strugglingSubjects?.map((sub, i) => (
                      <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {sub}
                      </span>
                    )) || <span className="text-slate-300 text-xs">None listed</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* Settings List */}
            <section className="space-y-3">
              <h3 className="px-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Settings</h3>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {[
                  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-indigo-600' },
                  { id: 'privacy-safety', label: 'Privacy & Safety', icon: Shield, color: 'text-emerald-500' },
                  { id: 'app-settings', label: 'App Settings', icon: Settings, color: 'text-slate-400' },
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveSetting(item.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </section>

            <button 
              onClick={logout}
              className="w-full bg-rose-50 text-rose-600 font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-rose-100 transition-all active:scale-95"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <header className="flex items-center justify-between px-2 pt-4">
              <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nickname</label>
                <input 
                  type="text"
                  value={editedProfile.nickname}
                  onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })}
                  placeholder="Your cool nickname"
                  className="w-full bg-white p-5 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Grade / Form</label>
                <input 
                  type="text"
                  value={editedProfile.grade}
                  onChange={(e) => setEditedProfile({ ...editedProfile, grade: e.target.value })}
                  placeholder="e.g. Grade 10"
                  className="w-full bg-white p-5 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Struggling Subjects</label>
                <div className="flex gap-2 px-2">
                  <input 
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    placeholder="Add a subject..."
                    className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  />
                  <button 
                    onClick={addSubject}
                    className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {editedProfile.strugglingSubjects.map((sub, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold flex items-center gap-2 border border-rose-100"
                    >
                      {sub}
                      <button onClick={() => removeSubject(sub)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Check size={20} />
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Focus Hub v1.0.0</p>
      </div>
    </div>
  );
}
