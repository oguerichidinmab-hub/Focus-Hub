import React from 'react';
import { motion } from 'motion/react';
import { Heart, BookOpen } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center px-6 text-white relative overflow-hidden max-w-md mx-auto shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center relative z-10 flex-1 flex flex-col justify-center w-full"
      >
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/30"
        >
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-inner relative">
            <BookOpen className="text-indigo-600" size={28} strokeWidth={2.5} />
            <div className="absolute -bottom-1 -right-1 bg-rose-100 rounded-full p-1 shadow-sm">
              <Heart className="text-rose-500 fill-rose-500" size={10} />
            </div>
          </div>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-black tracking-tight mb-3"
        >
          Focus Hub
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-indigo-100 text-lg font-medium"
        >
          Your supportive space for growth.
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 z-10"
      >
        <div className="flex items-center gap-2 text-indigo-100 text-[10px] font-bold uppercase tracking-widest">
          <span>Made with</span>
          <Heart size={12} className="text-rose-400 fill-rose-400" />
          <span>by team FEMTEK</span>
        </div>
      </motion.div>
    </div>
  );
}
