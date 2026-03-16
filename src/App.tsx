import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
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
        // User closed the popup, no need to show an error
        console.log('Login popup closed by user');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Multiple popup requests, ignore
        console.log('Popup request cancelled');
      } else {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
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
      <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
        <Login />
      </AuthContext.Provider>
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
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      <Layout 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setActivePage(null); }}
        onPageChange={setActivePage}
      >
        {renderContent()}
      </Layout>
    </AuthContext.Provider>
  );
}
