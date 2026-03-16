import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Task, CheckIn } from '../types';
import { LogOut, Award, TrendingUp, Settings, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Profile() {
  const { profile, logout, user } = useAuth();
  const [stats, setStats] = useState({ completed: 0, pending: 0 });
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const allTasks = snapshot.docs.map(doc => doc.data() as Task);
      const completed = allTasks.filter(t => t.completed).length;
      setStats({ completed, pending: allTasks.length - completed });
    });

    const checkinsQuery = query(
      collection(db, 'checkins'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(7)
    );
    const unsubscribeCheckins = onSnapshot(checkinsQuery, (snapshot) => {
      const history = snapshot.docs.map(doc => {
        const data = doc.data() as CheckIn;
        return {
          mood: data.mood,
          value: data.mood === 'Happy' ? 4 : data.mood === 'Neutral' ? 3 : data.mood === 'Sad' ? 2 : 1
        };
      }).reverse();
      setMoodHistory(history);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeCheckins();
    };
  }, [user]);

  const taskData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 p-1 shadow-xl rotate-3">
            <div className="w-full h-full rounded-[1.8rem] bg-white overflow-hidden -rotate-3">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {profile?.displayName?.[0]}
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white">
            <Award size={14} />
          </div>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-800">{profile?.displayName}</h2>
        <p className="text-slate-400 text-sm font-medium">{profile?.role === 'student' ? 'High School Student' : 'Mentor'}</p>
      </div>

      {/* Progress Summary */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800">Weekly Progress</h3>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 items-center">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-indigo-500">{stats.pending}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Well-being Chart */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Mood Tracker</h3>
          <Heart size={20} className="text-rose-500" />
        </div>
        <div className="h-32 w-full">
          {moodHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodHistory}>
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                          {payload[0].payload.mood}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Check in daily to see your mood trends.
            </div>
          )}
        </div>
      </section>

      {/* Settings & Actions */}
      <div className="space-y-3">
        <button className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
              <Settings size={20} />
            </div>
            <span className="font-semibold text-slate-700">Account Settings</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>

        <button
          onClick={logout}
          className="w-full bg-rose-50 p-5 rounded-2xl flex items-center justify-center gap-3 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Focus Hub v1.0</p>
      </div>
    </div>
  );
}
