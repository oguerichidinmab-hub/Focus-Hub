import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, Clock, CheckCircle2, 
  Circle, Trash2, Star, BookOpen, 
  ChevronRight, Filter, Search, X
} from 'lucide-react';
import { 
  collection, query, where, orderBy, 
  onSnapshot, addDoc, updateDoc, deleteDoc, 
  doc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { Task } from '../types';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

export default function Planner() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'homework' | 'test' | 'extramural'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    type: 'homework' as 'homework' | 'test' | 'extramural',
    dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.title || !newTask.subject) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: newTask.title,
        subject: newTask.subject,
        type: newTask.type,
        dueDate: Timestamp.fromDate(new Date(newTask.dueDate)),
        completed: false,
        createdAt: serverTimestamp(),
      });
      setShowAddModal(false);
      setNewTask({
        title: '',
        subject: '',
        type: 'homework',
        dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!task.id) return;
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.type === filter);

  const getDueDateLabel = (date: Timestamp) => {
    const d = date.toDate();
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Overdue';
    return format(d, 'MMM d');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Planner</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'homework', 'test', 'extramural'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-widest ${
              filter === f 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <motion.div 
              layout
              key={task.id} 
              className={`bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm transition-opacity ${task.completed ? 'opacity-60' : ''}`}
            >
              <button 
                onClick={() => toggleTask(task)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                }`}
              >
                {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-slate-800 text-sm truncate ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                    {task.subject}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    task.type === 'test' ? 'text-rose-500' : task.type === 'extramural' ? 'text-amber-500' : 'text-indigo-500'
                  }`}>
                    {task.type === 'test' ? <Star size={10} /> : <BookOpen size={10} />}
                    {task.type}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 justify-end ${
                  isPast(task.dueDate.toDate()) && !isToday(task.dueDate.toDate()) && !task.completed ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  <Clock size={10} />
                  {getDueDateLabel(task.dueDate)}
                </div>
                <button 
                  onClick={() => task.id && deleteTask(task.id)}
                  className="mt-2 text-slate-200 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Calendar size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">No tasks found in this category.</p>
            <p className="text-slate-300 text-xs mt-1">Tap the + button to add your first goal!</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
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
              <h3 className="text-2xl font-bold text-slate-800 mb-8">New Task</h3>
              
              <form onSubmit={handleAddTask} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What's the task?</label>
                  <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Finish Math Homework"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={newTask.subject}
                      onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                      placeholder="e.g. Maths"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                    <select 
                      value={newTask.type}
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                    >
                      <option value="homework">Homework</option>
                      <option value="test">Test/Exam</option>
                      <option value="extramural">Extramural</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Due Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
