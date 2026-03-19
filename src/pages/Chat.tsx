import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ChatMessage } from '../types';
import { Send, User as UserIcon, Shield, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export default function Chat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For simplicity, we use a single global group "Peer Support"
    const messagesQuery = query(
      collection(db, 'chatGroups', 'global', 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgList);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chatGroups/global/messages');
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'chatGroups', 'global', 'messages'), {
        groupId: 'global',
        senderId: user.uid,
        senderName: isAnonymous ? 'Anonymous Peer' : profile?.displayName || 'Peer',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isAnonymous
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chatGroups/global/messages');
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Peer Support</h2>
          <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
            <Shield size={10} /> Moderated Space
          </div>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
          <Info size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-slate-300">
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </span>
              </div>
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Message Input */}
      <div className="mt-4 bg-white rounded-3xl p-4 shadow-lg border border-slate-100">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isAnonymous ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${isAnonymous ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`} />
              Post Anonymously
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
