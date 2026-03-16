import React from 'react';
import { useAuth } from '../App';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center px-6 text-white max-w-md mx-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Focus Hub</h1>
        <p className="text-indigo-100 text-lg">Your supportive space for growth and focus.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-4"
      >
        <button
          onClick={login}
          className="w-full bg-white text-indigo-600 font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 hover:bg-indigo-50 transition-colors"
        >
          <LogIn size={20} />
          Continue with Google
        </button>
        
        <p className="text-center text-xs text-indigo-200 px-8">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </motion.div>

      <div className="absolute bottom-12 text-indigo-200/50 text-[10px] uppercase tracking-[0.2em]">
        SDG 3 • SDG 4 • SDG 10
      </div>
    </div>
  );
}
