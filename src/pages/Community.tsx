import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, Heart, Share2, Plus, 
  Search, Filter, Sparkles, Star, 
  ShieldCheck, AlertCircle, X, Send
} from 'lucide-react';
import { 
  collection, query, orderBy, limit, 
  onSnapshot, addDoc, updateDoc, doc, 
  serverTimestamp, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../App';
import { CommunityPost } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    category: 'encouragement' as 'encouragement' | 'win' | 'tip' | 'question',
  });

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost)));
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.content) return;

    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        authorName: profile?.nickname || 'Anonymous',
        content: newPost.content,
        category: newPost.category,
        likes: [],
        createdAt: serverTimestamp(),
      });
      setShowAddModal(false);
      setNewPost({ content: '', category: 'encouragement' });
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleLike = async (post: CommunityPost) => {
    if (!user || !post.id) return;
    const isLiked = post.likes.includes(user.uid);
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'win': return 'bg-emerald-50 text-emerald-600';
      case 'tip': return 'bg-amber-50 text-amber-600';
      case 'question': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-rose-50 text-rose-600';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Community</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Safety Banner */}
      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-center gap-3">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
        <p className="text-emerald-900 text-xs font-bold leading-tight">
          Safe Space: Be kind, supportive, and respectful to your peers.
        </p>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {posts.map(post => (
          <motion.div 
            layout
            key={post.id} 
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{post.authorName}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={() => handleLike(post)}
                className={`flex items-center gap-2 transition-colors ${post.likes.includes(user?.uid || '') ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
              >
                <Heart size={18} fill={post.likes.includes(user?.uid || '') ? 'currentColor' : 'none'} />
                <span className="text-xs font-bold">{post.likes.length}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <MessageCircle size={18} />
                <span className="text-xs font-bold">Reply</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Post Modal */}
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
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Share Something</h3>
              
              <form onSubmit={handleAddPost} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['encouragement', 'win', 'tip', 'question'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, category: cat })}
                        className={`py-3 px-4 rounded-2xl border-2 transition-all text-xs font-bold uppercase tracking-widest ${
                          newPost.category === cat 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-slate-100 bg-white text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="What's on your mind? Share a win, a tip, or some encouragement!"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
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
                    className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Post Now
                    <Send size={18} />
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
