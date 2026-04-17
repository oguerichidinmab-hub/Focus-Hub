import React, { useState } from 'react';
import { Home, Calendar, Timer, Users, Heart, User, Menu, X, LogOut, Info, ShieldCheck, Mail, FileText, Accessibility, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../App';
import AIAssistant from './AIAssistant';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const menuItems = [
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'inclusive', label: 'Inclusive Hub', icon: Accessibility },
    { id: 'music', label: 'Music Space', icon: Music },
    { id: 'safety', label: 'Safety Guidelines', icon: ShieldCheck },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'terms', label: 'Terms & Privacy', icon: FileText },
  ];

  const handleMenuClick = (id: string) => {
    onTabChange(id);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">Focus Hub</h1>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] max-w-md mx-auto"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 bg-white z-[70] shadow-2xl p-8 flex flex-col max-w-[320px]"
              role="dialog"
              aria-modal="true"
              aria-label="Side Menu"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 rounded-lg"
                  aria-label="Close Menu"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 space-y-2" aria-label="Side menu navigation">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={item.label}
                    >
                      <Icon size={20} aria-hidden="true" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all font-bold outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Log Out"
              >
                <LogOut size={20} aria-hidden="true" />
                Log Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center max-w-md mx-auto z-50"
        aria-label="Main Navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200 relative flex-1 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1",
                isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-3 w-1 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
