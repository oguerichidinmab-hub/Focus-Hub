import React, { useState, useEffect, createContext, useContext, Component, ErrorInfo, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import MusicSpace from './pages/MusicSpace';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import About from './pages/About';
import InclusiveHub from './pages/InclusiveHub';
import Layout from './components/Layout';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
  login: () => Promise<void>;
  logout: () => Promise<void>;
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
  const [activeTab, setActiveTab] = useState('home');
  const [activePage, setActivePage] = useState<string | null>(null);

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

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Login popup closed by user');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request cancelled');
      } else if (error.code === 'auth/unauthorized-domain') {
        console.error('Unauthorized domain:', window.location.hostname);
        alert(`Login failed: This domain (${window.location.hostname}) is not authorized in your Firebase Console. Please add it to Authentication > Settings > Authorized domains.`);
      } else {
        console.error('Login error:', error);
        alert(`Login error: ${error.message || 'An unknown error occurred'}`);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setActiveTab('dashboard');
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
        <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
          <Login />
        </AuthContext.Provider>
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    if (activePage) {
      switch (activePage) {
        case 'about': return <About onBack={() => setActivePage(null)} />;
        case 'inclusive': return <InclusiveHub onBack={() => setActivePage(null)} />;
        case 'music': return <MusicSpace />;
        case 'safety': return <div className="p-6"> <h2 className="text-2xl font-bold mb-4">Safety Guidelines</h2> <p>Your safety is our priority. Always be respectful in chatrooms.</p> <button onClick={() => setActivePage(null)} className="mt-4 text-indigo-600 font-bold">Back</button> </div>;
        case 'contact': return <div className="p-6"> <h2 className="text-2xl font-bold mb-4">Contact Us</h2> <p>Email: support@focushub.app</p> <button onClick={() => setActivePage(null)} className="mt-4 text-indigo-600 font-bold">Back</button> </div>;
        case 'terms': return <div className="p-6"> <h2 className="text-2xl font-bold mb-4">Terms & Privacy</h2> <p>We value your privacy and data security.</p> <button onClick={() => setActivePage(null)} className="mt-4 text-indigo-600 font-bold">Back</button> </div>;
        default: return <Dashboard onPageChange={setActivePage} onTabChange={setActiveTab} />;
      }
    }

    switch (activeTab) {
      case 'home': return <Dashboard onPageChange={setActivePage} onTabChange={setActiveTab} />;
      case 'study': return <Assignments />;
      case 'chatroom': return <Chat />;
      case 'mentoring': return <div className="p-6 text-center"> <h2 className="text-2xl font-bold mb-4">Mentoring</h2> <p className="text-slate-500">Connect with mentors who understand your journey. Coming soon!</p> </div>;
      case 'profile': return <Profile />;
      default: return <Dashboard onPageChange={setActivePage} onTabChange={setActiveTab} />;
    }
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
        <Layout 
          activeTab={activeTab} 
          onTabChange={(tab) => { setActiveTab(tab); setActivePage(null); }}
          onPageChange={setActivePage}
        >
          {renderContent()}
        </Layout>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}
