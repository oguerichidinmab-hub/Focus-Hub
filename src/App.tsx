import React, { useState, useEffect, createContext, useContext, Component, ErrorInfo, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import FocusTimer from './pages/FocusTimer';
import Community from './pages/Community';
import SupportCorner from './pages/SupportCorner';
import Profile from './pages/Profile';
import About from './pages/About';
import InclusiveHub from './pages/InclusiveHub';
import MusicSpace from './pages/MusicSpace';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ContactUs from './pages/ContactUs';
import TermsPrivacy from './pages/TermsPrivacy';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import ExamStress from './pages/articles/ExamStress';
import Helpline from './pages/articles/Helpline';
import StudyHabits from './pages/articles/StudyHabits';
import Mindfulness from './pages/articles/Mindfulness';
import { AlertCircle, RefreshCw, LogOut, X } from 'lucide-react';
import { Toaster } from 'sonner';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try refreshing the page.";
      try {
        // Check if it's a Firestore error JSON
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          errorMessage = `Database Error: ${parsed.error} (Operation: ${parsed.operationType})`;
        }
      } catch (e) {
        // Not a JSON error, use the raw message if it's simple
        if (this.state.error?.message && this.state.error.message.length < 100) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl border border-rose-100 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Oops!</h2>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Refresh App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [currentArticle, setCurrentArticle] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              role: 'student',
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'An unknown error occurred';
      if (error.code?.includes('invalid-credential') || error.code?.includes('user-not-found') || error.code?.includes('wrong-password')) {
        message = 'Invalid email or password. Please try again.';
      } else if (error.code?.includes('too-many-requests')) {
        message = 'Too many failed attempts. Please try again later.';
      } else {
        message = error.message || message;
      }
      setError(message);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create profile in Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        photoURL: null,
        role: 'student',
        createdAt: new Date().toISOString(),
      };
      await setDoc(docRef, newProfile);
      setProfile(newProfile);
    } catch (error: any) {
      console.error('Signup error:', error);
      let message = 'An unknown error occurred';
      if (error.code?.includes('email-already-in-use')) {
        message = 'This email is already registered. Please sign in instead.';
      } else if (error.code?.includes('weak-password')) {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code?.includes('invalid-email')) {
        message = 'Invalid email address format.';
      } else {
        message = error.message || message;
      }
      setError(message);
    }
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await signOut(auth);
    setActiveTab('home');
    setShowLogoutModal(false);
  };

  const resetPassword = async (email: string) => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      // Using sonner toast instead of alert
    } catch (error: any) {
      console.error('Reset error:', error);
      throw error; // Let the login page handle the error message
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <AuthContext.Provider value={{ user, profile, loading, error, setError, loginWithEmail, signUpWithEmail, logout, resetPassword }}>
          <Login />
        </AuthContext.Provider>
      </ErrorBoundary>
    );
  }

  if (profile && !profile.onboarded) {
    return (
      <ErrorBoundary>
        <AuthContext.Provider value={{ user, profile, loading, error, setError, loginWithEmail, signUpWithEmail, logout, resetPassword }}>
          <Onboarding onComplete={(updatedProfile) => setProfile(updatedProfile)} />
        </AuthContext.Provider>
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    if (currentArticle) {
      switch (currentArticle) {
        case 'exam-stress': return <ExamStress onBack={() => setCurrentArticle(null)} />;
        case 'helpline': return <Helpline onBack={() => setCurrentArticle(null)} />;
        case 'study-habits': return <StudyHabits onBack={() => setCurrentArticle(null)} />;
        case 'mindfulness': return <Mindfulness onBack={() => setCurrentArticle(null)} />;
        default: return <Dashboard onTabChange={setActiveTab} onOpenArticle={setCurrentArticle} onOpenFocus={() => setActiveTab('focus')} />;
      }
    }

    switch (activeTab) {
      case 'home': return <Dashboard onTabChange={setActiveTab} onOpenArticle={setCurrentArticle} onOpenFocus={() => setActiveTab('focus')} />;
      case 'planner': return <Planner />;
      case 'focus': return <FocusTimer onBack={() => setActiveTab('home')} />;
      case 'community': return <Community />;
      case 'profile': return <Profile onOpenSupport={() => setActiveTab('support')} onOpenArticle={setCurrentArticle} />;
      case 'support': return <SupportCorner onOpenArticle={setCurrentArticle} onBack={() => setActiveTab('profile')} />;
      case 'about': return <About onBack={() => setActiveTab('home')} />;
      case 'inclusive': return <InclusiveHub onBack={() => setActiveTab('home')} />;
      case 'music': return <MusicSpace onBack={() => setActiveTab('home')} />;
      case 'safety': return <SafetyGuidelines onBack={() => setActiveTab('home')} />;
      case 'contact': return <ContactUs onBack={() => setActiveTab('home')} />;
      case 'terms': return <TermsPrivacy onBack={() => setActiveTab('home')} />;
      default: return <Dashboard onTabChange={setActiveTab} onOpenArticle={setCurrentArticle} onOpenFocus={() => setActiveTab('focus')} />;
    }
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, profile, loading, error, setError, loginWithEmail, signUpWithEmail, logout, resetPassword }}>
        <Toaster position="top-center" richColors />
        <Layout 
          activeTab={activeTab} 
          onTabChange={(tab) => { setActiveTab(tab); setCurrentArticle(null); }}
        >
          {renderContent()}
        </Layout>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {showLogoutModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LogOut size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Log Out</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Are you sure you want to log out?
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmLogout}
                    className="flex-1 bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                  >
                    Log Out
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}
