import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, Frown, Meh, Zap, Moon, Heart, 
  CheckCircle2, Clock, Calendar, ChevronRight, 
  Plus, MessageCircle, Star, Sparkles, BookOpen,
  Flame, Trophy, Timer
} from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Task, Mood, CheckIn } from '../types';
import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

interface DashboardProps {
  onTabChange: (tab: string) => void;
  onOpenArticle: (id: string) => void;
  onOpenFocus: () => void;
}

export default function Dashboard({ onTabChange, onOpenArticle, onOpenFocus }: DashboardProps) {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedHomeworkToday, setCompletedHomeworkToday] = useState(false);
  const [recentCheckIn, setRecentCheckIn] = useState<CheckIn | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [streak, setStreak] = useState({ current: 0, milestones: [] as string[] });

  const moods: { type: Mood; icon: any; color: string; label: string }[] = [
    { type: 'Motivated', icon: Zap, color: 'bg-amber-100 text-amber-600', label: 'Great' },
    { type: 'Happy', icon: Smile, color: 'bg-emerald-100 text-emerald-600', label: 'Good' },
    { type: 'Stressed', icon: Meh, color: 'bg-indigo-100 text-indigo-600', label: 'Okay' },
    { type: 'Tired', icon: Moon, color: 'bg-slate-100 text-slate-600', label: 'Tired' },
    { type: 'Lonely', icon: Frown, color: 'bg-rose-100 text-rose-600', label: 'Sad' },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    if (!user) return;

    // Fetch today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      where('completed', '==', false),
      orderBy('dueDate', 'asc'),
      limit(3)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });

    // Fetch latest check-in
    const checkInQuery = query(
      collection(db, 'checkins'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribeCheckIn = onSnapshot(checkInQuery, (snapshot) => {
      if (!snapshot.empty) {
        setRecentCheckIn({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CheckIn);
      }
    });

    // Check for completed homework today for streak
    const completedHomeworkQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      where('completed', '==', true),
      where('type', '==', 'homework')
    );

    const unsubscribeCompleted = onSnapshot(completedHomeworkQuery, (snapshot) => {
      const completedTasks = snapshot.docs.map(doc => doc.data() as Task);
      const hasCompletedToday = completedTasks.some(t => isToday(t.dueDate.toDate()));
      setCompletedHomeworkToday(hasCompletedToday);
      updateStreak(hasCompletedToday);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeCheckIn();
      unsubscribeCompleted();
    };
  }, [user]);

  const updateStreak = (hasCompletedToday: boolean) => {
    const storedStreak = localStorage.getItem(`streak_${user?.uid}`);
    let streakData = storedStreak ? JSON.parse(storedStreak) : { current: 0, lastDate: null, milestones: [] };
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastDate = streakData.lastDate;

    if (hasCompletedToday) {
      if (lastDate !== today) {
        if (lastDate && differenceInDays(new Date(), parseISO(lastDate)) === 1) {
          streakData.current += 1;
        } else if (!lastDate || differenceInDays(new Date(), parseISO(lastDate)) > 1) {
          streakData.current = 1;
        }
        streakData.lastDate = today;
        
        // Check milestones
        const newMilestones = [...streakData.milestones];
        if (streakData.current >= 3 && !newMilestones.includes('3-day')) {
          newMilestones.push('3-day');
          toast.success('🔥 3-Day Streak! You earned the "Consistency Starter" badge!');
        }
        if (streakData.current >= 7 && !newMilestones.includes('7-day')) {
          newMilestones.push('7-day');
          toast.success('⭐ 7-Day Streak! You earned the "Focus Master" badge!');
        }
        if (streakData.current >= 14 && !newMilestones.includes('14-day')) {
          newMilestones.push('14-day');
          toast.success('🏆 14-Day Streak! You earned the "Academic Warrior" badge!');
        }
        streakData.milestones = newMilestones;
        
        localStorage.setItem(`streak_${user?.uid}`, JSON.stringify(streakData));
        
        // Sync with Firestore if profile exists
        if (user) {
          updateDoc(doc(db, 'users', user.uid), {
            streak: {
              current: streakData.current,
              lastCompletedDate: today,
              milestones: streakData.milestones
            }
          }).catch(console.error);
        }
      }
    } else {
      // Check if streak should reset (if more than 1 day since last completion)
      if (lastDate && differenceInDays(new Date(), parseISO(lastDate)) > 1) {
        streakData.current = 0;
        localStorage.setItem(`streak_${user?.uid}`, JSON.stringify(streakData));
        if (user) {
          updateDoc(doc(db, 'users', user.uid), {
            'streak.current': 0
          }).catch(console.error);
        }
      }
    }
    setStreak(streakData);
  };

  const handleMoodCheckIn = async (mood: Mood) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'checkins'), {
        userId: user.uid,
        mood,
        timestamp: serverTimestamp(),
      });
      setShowMoodModal(false);
    } catch (error) {
      console.error('Error adding check-in:', error);
    }
  };

  const getMoodMessage = (mood: Mood) => {
    switch (mood) {
      case 'Motivated': return "You're on fire! Let's crush those goals today. 🔥";
      case 'Happy': return "Love that energy! Keep shining bright. ✨";
      case 'Stressed': return "Take a deep breath. You've got this, one step at a time. 🧘‍♂️";
      case 'Tired': return "It's okay to rest. A short break can do wonders. 💤";
      case 'Lonely': return "You're not alone. We're all in this together. ❤️";
      default: return "How are you feeling today?";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Greeting */}
      <section className="relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            {greeting}, <span className="text-indigo-600">{profile?.nickname || 'Friend'}</span>
          </h2>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Sparkles size={24} />
          </div>
        </div>
        <p className="text-slate-500 font-medium">Ready to focus on your growth today?</p>
      </section>

      {/* Streak & Badges Section */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-[2.5rem] text-white shadow-lg shadow-orange-100 relative overflow-hidden">
          <Flame className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={120} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} fill="currentColor" />
              <span className="text-sm font-bold uppercase tracking-wider opacity-90">Homework Streak</span>
            </div>
            <h3 className="text-4xl font-black mb-2">{streak.current}-Day Streak</h3>
            <p className="text-orange-50 font-medium text-sm">
              {streak.current > 0 
                ? `You've completed homework ${streak.current} days in a row! Keep it up! 🚀`
                : "Complete a homework task today to start your streak! 🔥"}
            </p>
            
            {streak.milestones.length > 0 && (
              <div className="flex gap-2 mt-6">
                {streak.milestones.map(m => (
                  <div key={m} className="bg-white/20 backdrop-blur-md p-2 rounded-xl flex items-center justify-center border border-white/30" title={m}>
                    <Trophy size={18} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mood Check-in Card */}
      <section>
        <button 
          onClick={() => setShowMoodModal(true)}
          className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-left relative overflow-hidden group transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${recentCheckIn ? moods.find(m => m.type === recentCheckIn.mood)?.color : 'bg-indigo-50 text-indigo-600'}`}>
              {recentCheckIn ? React.createElement(moods.find(m => m.type === recentCheckIn.mood)?.icon || Heart, { size: 28 }) : <Heart size={28} />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Emotional Check-in</h3>
              <p className="text-slate-500 text-sm font-medium">
                {recentCheckIn ? `Feeling ${recentCheckIn.mood} today` : "How's your heart today?"}
              </p>
            </div>
          </div>
          <p className="text-slate-600 italic text-sm leading-relaxed">
            {recentCheckIn ? getMoodMessage(recentCheckIn.mood) : "Sharing how you feel is the first step to feeling supported."}
          </p>
          <div className="absolute top-6 right-6 text-slate-300 group-hover:text-indigo-400 transition-colors">
            <ChevronRight size={24} />
          </div>
        </button>
      </section>

      {/* Today's Tasks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            Today's Focus
          </h3>
          <button className="text-indigo-600 text-sm font-bold flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.type === 'test' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {task.type === 'test' ? <Star size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{task.subject}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    {task.dueDate ? format(task.dueDate.toDate(), 'HH:mm') : 'No time'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-slate-400 font-medium text-sm">No tasks for today. Enjoy your free time! 🌈</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions / Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onTabChange('planner')}
          className="bg-indigo-600 p-6 rounded-[2rem] text-white space-y-3 shadow-lg shadow-indigo-200 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={24} />
          </div>
          <h4 className="font-bold text-sm leading-tight">Add New Task</h4>
        </button>
        <button 
          onClick={onOpenFocus}
          className="bg-slate-900 p-6 rounded-[2rem] text-white space-y-3 shadow-lg shadow-slate-200 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Timer size={24} />
          </div>
          <h4 className="font-bold text-sm leading-tight">Focus Timer</h4>
        </button>
        <button 
          onClick={() => onTabChange('community')}
          className="bg-emerald-500 p-6 rounded-[2rem] text-white space-y-3 shadow-lg shadow-emerald-200 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <h4 className="font-bold text-sm leading-tight">Community Win</h4>
        </button>
        <button 
          onClick={() => onOpenArticle('study-habits')}
          className="bg-amber-500 p-6 rounded-[2rem] text-white space-y-3 shadow-lg shadow-amber-200 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h4 className="font-bold text-sm leading-tight">Study Tips</h4>
        </button>
      </section>

      {/* Mood Modal */}
      <AnimatePresence>
        {showMoodModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoodModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">How are you feeling?</h3>
              <p className="text-slate-500 text-center mb-10 font-medium">Your feelings matter to us.</p>
              
              <div className="grid grid-cols-5 gap-4 mb-10">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <button
                      key={mood.type}
                      onClick={() => handleMoodCheckIn(mood.type)}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 ${mood.color}`}>
                        <Icon size={28} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mood.label}</span>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowMoodModal(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
