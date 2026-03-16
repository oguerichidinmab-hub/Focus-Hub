import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Task, CheckIn, Mood, AiChatMessage } from '../types';
import { getMotivationalTip, askAIAssistant, generateExamPrepSuggestions } from '../services/geminiService';
import { Smile, Meh, Frown, AlertCircle, Calendar, CheckCircle2, ChevronRight, Sparkles, Music, BookOpen, GraduationCap, X, Send, Loader2, Search, Accessibility, Volume2, VolumeX, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import PomodoroTimer from '../components/PomodoroTimer';

interface DashboardProps {
  onPageChange: (page: string) => void;
  onTabChange: (tab: string) => void;
}

export default function Dashboard({ onPageChange, onTabChange }: DashboardProps) {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tip, setTip] = useState<string>('Loading your daily boost...');
  const [mood, setMood] = useState<Mood | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // AI Assistant State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<AiChatMessage[]>([]);

  // Exam Prep State
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [examSubject, setExamSubject] = useState('');
  const [examSuggestions, setExamSuggestions] = useState<string | null>(null);
  const [isExamLoading, setIsExamLoading] = useState(false);

  // Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!user) return;

    // Fetch today's tasks
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      where('completed', '==', false),
      orderBy('deadline', 'asc'),
      limit(3)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(taskList);
    });

    // Fetch all tasks for context
    const allTasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('deadline', 'desc'),
      limit(20)
    );

    const unsubscribeAllTasks = onSnapshot(allTasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setAllTasks(taskList);
    });

    // Fetch latest tip
    getMotivationalTip().then(setTip);

    // Fetch AI Chat History
    const aiChatQuery = query(
      collection(db, 'ai_chats'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribeAiChat = onSnapshot(aiChatQuery, (snapshot) => {
      const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AiChatMessage));
      setAiChatHistory(history);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeAllTasks();
      unsubscribeAiChat();
    };
  }, [user]);

  const handleMoodCheckIn = async (selectedMood: Mood) => {
    if (!user) return;
    setMood(selectedMood);
    try {
      await addDoc(collection(db, 'checkins'), {
        userId: user.uid,
        mood: selectedMood,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAiLoading || !user) return;

    const currentQuestion = question;
    setQuestion('');
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const response = await askAIAssistant(currentQuestion);
      setAiResponse(response);
      
      // Save to Firestore
      await addDoc(collection(db, 'ai_chats'), {
        userId: user.uid,
        question: currentQuestion,
        answer: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setAiResponse("Sorry, I'm having trouble thinking right now. Try again?");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateExamPrep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim() || isExamLoading) return;

    setIsExamLoading(true);
    setExamSuggestions(null);
    
    const taskHistory = allTasks
      .map(t => `- ${t.title} (${t.subject}): ${t.completed ? 'Completed' : 'Pending'}`)
      .join('\n');

    try {
      const response = await generateExamPrepSuggestions(examSubject, taskHistory);
      setExamSuggestions(response);
    } catch (error) {
      setExamSuggestions("I couldn't create your study plan. Please try again.");
    } finally {
      setIsExamLoading(false);
    }
  };

  const moodOptions: { type: Mood; icon: any; color: string; bg: string }[] = [
    { type: 'Happy', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { type: 'Neutral', icon: Meh, color: 'text-amber-600', bg: 'bg-amber-100' },
    { type: 'Sad', icon: Frown, color: 'text-blue-600', bg: 'bg-blue-100' },
    { type: 'Anxious', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const quickActions = [
    { id: 'ai', label: 'AI Assistance', icon: Sparkles, color: 'bg-purple-100 text-purple-600', onClick: () => setIsAiOpen(true) },
    { id: 'inclusive', label: 'Inclusive Hub', icon: Accessibility, color: 'bg-emerald-100 text-emerald-600', onClick: () => onPageChange('inclusive') },
    { id: 'music', label: 'Music Space', icon: Music, color: 'bg-rose-100 text-rose-600', onClick: () => onPageChange('music') },
    { id: 'tasks', label: 'Class Tasks', icon: BookOpen, color: 'bg-blue-100 text-blue-600', onClick: () => onTabChange('study') },
    { id: 'timer', label: 'Study Timer', icon: Timer, color: 'bg-indigo-100 text-indigo-600', onClick: () => setIsTimerOpen(true) },
    { id: 'exam', label: 'Exam Prep', icon: GraduationCap, color: 'bg-orange-100 text-orange-600', onClick: () => setIsExamOpen(true) },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hi, {profile?.displayName?.split(' ')[0] || 'Friend'}!</h2>
          <p className="text-slate-500 text-sm">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold">
              {profile?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
      </header>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              onClick={action.onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={action.label}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start gap-3 text-left focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <div className={`p-3 rounded-2xl ${action.color}`}>
                <Icon size={24} />
              </div>
              <span className="font-bold text-slate-700 text-sm leading-tight">{action.label}</span>
            </motion.button>
          );
        })}
      </section>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isAiOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-[40px] shadow-2xl p-8 max-w-md mx-auto max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">AI Tutor</h3>
                </div>
                <button 
                  onClick={() => setIsAiOpen(false)} 
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"
                  aria-label="Close AI Tutor"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ask me anything about your homework, upcoming exams, or just how to stay focused!
                </p>

                <form onSubmit={handleAskAI} className="relative" role="search">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., How do I solve quadratic equations?"
                    aria-label="Ask a question"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !question.trim()}
                    aria-label="Send question"
                    className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-all"
                  >
                    {isAiLoading ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
                  </button>
                </form>

                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 p-6 rounded-3xl border border-purple-100"
                    role="region"
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Latest Response</span>
                      <button 
                        onClick={() => isSpeaking ? stopSpeaking() : speak(aiResponse)}
                        className="p-2 bg-white rounded-lg text-purple-600 shadow-sm hover:bg-purple-100 transition-colors"
                        aria-label={isSpeaking ? "Stop reading" : "Read response aloud"}
                      >
                        {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  </motion.div>
                )}

                {/* Chat History */}
                {aiChatHistory.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Conversations</h4>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {aiChatHistory.map((chat) => (
                        <div key={chat.id} className="space-y-2">
                          <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">You asked:</p>
                            <p className="text-slate-700 text-sm font-medium">{chat.question}</p>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-bold text-purple-400 uppercase">AI Tutor:</p>
                              <button 
                                onClick={() => isSpeaking ? stopSpeaking() : speak(chat.answer)}
                                className="p-1.5 text-purple-400 hover:text-purple-600 transition-colors"
                                aria-label="Read answer aloud"
                              >
                                <Volume2 size={14} />
                              </button>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{chat.answer}</p>
                            <p className="text-[9px] text-slate-300 mt-2 text-right">
                              {format(new Date(chat.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exam Prep Modal */}
      <AnimatePresence>
        {isExamOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExamOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-[40px] shadow-2xl p-8 max-w-md mx-auto max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Exam Prep</h3>
                </div>
                <button 
                  onClick={() => setIsExamOpen(false)} 
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"
                  aria-label="Close Exam Prep"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Tell me which subject you're preparing for, and I'll create a personalized study plan based on your recent work.
                </p>

                <form onSubmit={handleGenerateExamPrep} className="relative" role="search">
                  <input
                    type="text"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Biology, History..."
                    aria-label="Enter subject for exam prep"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isExamLoading || !examSubject.trim()}
                    aria-label="Generate study plan"
                    className="absolute right-2 top-2 p-2 bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:bg-slate-300 transition-all"
                  >
                    {isExamLoading ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
                  </button>
                </form>

                {examSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-50 p-6 rounded-3xl border border-orange-100"
                    role="region"
                    aria-live="polite"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Your Study Plan</span>
                      <button 
                        onClick={() => isSpeaking ? stopSpeaking() : speak(examSuggestions)}
                        className="p-2 bg-white rounded-lg text-orange-600 shadow-sm hover:bg-orange-100 transition-colors"
                        aria-label={isSpeaking ? "Stop reading" : "Read plan aloud"}
                      >
                        {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                    <div className="markdown-body text-slate-700 text-sm leading-relaxed prose prose-sm prose-orange max-w-none">
                      <Markdown>{examSuggestions}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pomodoro Timer Modal */}
      <AnimatePresence>
        {isTimerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTimerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[70] max-w-md mx-auto"
            >
              <PomodoroTimer onClose={() => setIsTimerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">How are you feeling?</h3>
        <div className="flex justify-between gap-2">
          {moodOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = mood === option.type;
            return (
              <button
                key={option.type}
                onClick={() => handleMoodCheckIn(option.type)}
                aria-label={`Mood: ${option.type}`}
                aria-pressed={isSelected}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
                  isSelected ? `${option.bg} scale-105 ring-2 ring-offset-2 ring-slate-100` : 'hover:bg-slate-50'
                }`}
              >
                <Icon size={28} className={isSelected ? option.color : 'text-slate-400'} />
                <span className={`text-[10px] font-bold ${isSelected ? option.color : 'text-slate-400'}`}>
                  {option.type}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Motivational Tip */}
      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden" role="complementary" aria-label="Motivational Tip">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-300 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Daily Boost</span>
            </div>
            <button 
              onClick={() => isSpeaking ? stopSpeaking() : speak(tip)}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              aria-label={isSpeaking ? "Stop reading" : "Read tip aloud"}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          <p className="text-lg font-medium leading-relaxed italic">"{tip}"</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </section>

      {/* Today's Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Today's Focus</h3>
          <button className="text-indigo-600 text-xs font-bold flex items-center gap-1" aria-label="View all tasks">
            View All <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
        
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{task.title}</h4>
                  <p className="text-slate-400 text-xs">{task.subject} • {format(new Date(task.deadline), 'h:mm a')}</p>
                </div>
                <button className="text-slate-300 hover:text-emerald-500 transition-colors" aria-label={`Mark ${task.title} as complete`}>
                  <CheckCircle2 size={24} aria-hidden="true" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-slate-400 text-sm font-medium">All caught up! Add a new task to stay focused.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
