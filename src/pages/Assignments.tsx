import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Task } from '../types';
import { Plus, CheckCircle2, Circle, Trash2, X, Calendar as CalendarIcon, BookOpen, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function Assignments() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'assignment' | 'classwork'>('all');
  const [newTask, setNewTask] = useState({ title: '', subject: '', description: '', deadline: '', type: 'assignment' as 'assignment' | 'classwork' });
  const [editTask, setEditTask] = useState({ title: '', subject: '', description: '', deadline: '', type: 'assignment' as 'assignment' | 'classwork' });

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('deadline', 'asc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTask.title || !newTask.subject || !newTask.deadline) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: newTask.title,
        subject: newTask.subject,
        description: newTask.description,
        deadline: new Date(newTask.deadline).toISOString(),
        completed: false,
        type: newTask.type,
        createdAt: new Date().toISOString()
      });
      setNewTask({ title: '', subject: '', description: '', deadline: '', type: 'assignment' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!task.id) return;
    try {
      const newCompleted = !task.completed;
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: newCompleted
      });
      if (selectedTask?.id === task.id) {
        setSelectedTask({ ...selectedTask, completed: newCompleted });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      if (selectedTask?.id === id) {
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask?.id || !editTask.title || !editTask.subject || !editTask.deadline) return;

    try {
      await updateDoc(doc(db, 'tasks', selectedTask.id), {
        title: editTask.title,
        subject: editTask.subject,
        description: editTask.description,
        deadline: new Date(editTask.deadline).toISOString(),
        type: editTask.type
      });
      setIsEditing(false);
      setSelectedTask({ ...selectedTask, ...editTask, deadline: new Date(editTask.deadline).toISOString() } as Task);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setEditTask({
      title: task.title,
      subject: task.subject,
      description: task.description || '',
      deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : '',
      type: task.type
    });
    setIsDetailModalOpen(true);
    setIsEditing(false);
  };

  const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Other'];

  const filteredTasks = tasks.filter(task => 
    activeTab === 'all' ? true : task.type === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Class Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new task"
          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <Plus size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl" role="tablist">
        {(['all', 'assignment', 'classwork'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl transition-all ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'all' ? 'All Tasks' : tab + 's'}
          </button>
        ))}
      </div>

      <div className="space-y-4" role="list" aria-label="Task list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              role="listitem"
              className={`bg-white p-4 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${
                task.completed ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'
              }`}
              onClick={() => openDetail(task)}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task);
                  }}
                  aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                  aria-pressed={task.completed}
                  className={`mt-1 transition-colors outline-none focus:ring-2 focus:ring-indigo-500 rounded-full ${
                    task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'
                  }`}
                >
                  {task.completed ? <CheckCircle2 size={24} aria-hidden="true" /> : <Circle size={24} aria-hidden="true" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                        task.type === 'assignment' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}
                      aria-label={`Task type: ${task.type}`}
                    >
                      {task.type}
                    </span>
                    <h4 className={`font-semibold text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full" aria-label={`Subject: ${task.subject}`}>
                      {task.subject}
                    </span>
                    <span className="text-slate-400 text-[10px] flex items-center gap-1" aria-label={`Deadline: ${format(new Date(task.deadline), 'MMM d, h:mm a')}`}>
                      <CalendarIcon size={12} aria-hidden="true" />
                      {format(new Date(task.deadline), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    task.id && deleteTask(task.id);
                  }}
                  aria-label={`Delete task: ${task.title}`}
                  className="text-slate-300 hover:text-rose-500 transition-colors outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12" role="status">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400" aria-hidden="true">
              <ClipboardList size={32} />
            </div>
            <p className="text-slate-500 font-medium">No {activeTab === 'all' ? 'tasks' : activeTab + 's'} yet.</p>
            <p className="text-slate-400 text-xs mt-1">Add your first one to stay on track!</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 id="detail-modal-title" className="text-xl font-bold text-slate-800">
                  {isEditing ? 'Edit Task' : 'Task Details'}
                </h3>
                <button 
                  onClick={() => setIsDetailModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 outline-none focus:ring-2 focus:ring-slate-200 rounded-full"
                  aria-label="Close modal"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateTask} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Type</label>
                    <div className="flex gap-4">
                      {(['assignment', 'classwork'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setEditTask({ ...editTask, type })}
                          className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                            editTask.type === type ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                    <input
                      type="text"
                      required
                      value={editTask.title}
                      onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea
                      value={editTask.description}
                      onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-none"
                      placeholder="Add more details about this task..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                    <div className="grid grid-cols-3 gap-2">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEditTask({ ...editTask, subject: s })}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            editTask.subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</label>
                    <input
                      type="datetime-local"
                      required
                      value={editTask.deadline}
                      onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${
                      selectedTask.type === 'assignment' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedTask.type === 'assignment' ? <ClipboardList size={32} /> : <BookOpen size={32} />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">
                        {selectedTask.type}
                      </span>
                      <h4 className="text-2xl font-bold text-slate-800 leading-tight">
                        {selectedTask.title}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                      <p className="font-bold text-slate-700">{selectedTask.subject}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                      <p className={`font-bold ${selectedTask.completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedTask.completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</p>
                      <p className="font-bold text-slate-700">
                        {format(new Date(selectedTask.deadline), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-xs text-slate-500">
                        at {format(new Date(selectedTask.deadline), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {selectedTask.description && (
                    <div className="bg-slate-50 p-6 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {selectedTask.description}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => toggleTask(selectedTask)}
                      className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                        selectedTask.completed 
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                          : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
                      }`}
                    >
                      {selectedTask.completed ? <Circle size={20} /> : <CheckCircle2 size={20} />}
                      {selectedTask.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => selectedTask.id && deleteTask(selectedTask.id)}
                        className="w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-all"
                        aria-label="Delete task"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 id="modal-title" className="text-xl font-bold text-slate-800">New Task</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 outline-none focus:ring-2 focus:ring-slate-200 rounded-full"
                  aria-label="Close modal"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Type</label>
                  <div className="flex gap-4" role="radiogroup" aria-label="Select task type">
                    {(['assignment', 'classwork'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        role="radio"
                        aria-checked={newTask.type === type}
                        onClick={() => setNewTask({ ...newTask, type })}
                        className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                          newTask.type === type ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="task-title" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
                  <input
                    id="task-title"
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="e.g., Math Homework Chapter 4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="task-description" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description (Optional)</label>
                  <textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none min-h-[80px] resize-none"
                    placeholder="Add notes or instructions..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select subject">
                    {subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={newTask.subject === s}
                        onClick={() => setNewTask({ ...newTask, subject: s })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
                          newTask.subject === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="task-deadline" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</label>
                  <input
                    id="task-deadline"
                    type="datetime-local"
                    required
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
