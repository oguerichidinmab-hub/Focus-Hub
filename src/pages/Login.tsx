import React, { useState } from 'react';
import { useAuth } from '../App';
import { LogIn, Mail, Lock, User as UserIcon, ArrowRight, RefreshCw, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface LoginProps {
  initialIsSignUp?: boolean;
  onBackToOnboarding?: () => void;
}

export default function Login({ initialIsSignUp = false, onBackToOnboarding }: LoginProps) {
  const { loginWithEmail, signUpWithEmail, resetPassword, error, setError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setResetSent(true);
        toast.success('Password reset link sent to your email! ✨');
      } else if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      if (isForgotPassword) {
        setError(err.message || 'Could not send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = (view: 'login' | 'signup' | 'forgot') => {
    setError(null);
    setResetSent(false);
    setIsSignUp(view === 'signup');
    setIsForgotPassword(view === 'forgot');
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center px-6 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/30">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner relative">
            <BookOpen className="text-indigo-600" size={24} strokeWidth={2.5} />
            <div className="absolute -bottom-1 -right-1 bg-rose-100 rounded-full p-1 shadow-sm">
              <Heart className="text-rose-500 fill-rose-500" size={10} />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Focus Hub</h1>
        <p className="text-indigo-100 text-lg">Your supportive space for growth and focus.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-6 relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isForgotPassword ? 'forgot' : isSignUp ? 'signup' : 'login'}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-center mb-4">
                {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-rose-500/20 border border-rose-500/50 p-3 rounded-xl text-[11px] text-rose-100 text-center"
                >
                  {error}
                </motion.div>
              )}

              {resetSent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/20 border border-emerald-500/50 p-3 rounded-xl text-[11px] text-emerald-100 text-center"
                >
                  Reset link sent! Check your email.
                </motion.div>
              )}
              
              {isSignUp && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="relative"
                >
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm placeholder:text-indigo-200 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                  />
                </motion.div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm placeholder:text-indigo-200 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                />
              </div>

              {!isForgotPassword && (
                <>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm placeholder:text-indigo-200 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                    />
                  </div>

                  {isSignUp && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="relative"
                    >
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm placeholder:text-indigo-200 focus:ring-2 focus:ring-white/50 outline-none transition-all"
                      />
                    </motion.div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <>
                    {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex flex-col gap-3 pt-2">
                {!isForgotPassword ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleView(isSignUp ? 'login' : 'signup')}
                      className="text-xs text-indigo-100 hover:text-white transition-colors"
                    >
                      {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => toggleView('forgot')}
                        className="text-xs text-indigo-200/70 hover:text-indigo-100 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleView('login')}
                    className="text-xs text-indigo-100 hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </button>
                )}
                
                {onBackToOnboarding && !isForgotPassword && (
                  <button
                    type="button"
                    onClick={onBackToOnboarding}
                    className="text-xs text-indigo-200/70 hover:text-indigo-100 transition-colors mt-2"
                  >
                    Back to Onboarding
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
        
        <div className="space-y-4">
          <p className="text-center text-[10px] text-indigo-200 px-8">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">
              <span>Made with</span>
              <Heart size={10} className="text-rose-400 fill-rose-400" />
              <span>by team FEMTEK</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-indigo-200/50 text-[10px] uppercase tracking-[0.2em] z-10">
        SDG 3 • SDG 4 • SDG 10
      </div>
    </div>
  );
}
