import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  VolumeX,
  BookOpen, 
  Users, 
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';

interface InclusiveHubProps {
  onBack: () => void;
}

export default function InclusiveHub({ onBack }: InclusiveHubProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Announce changes to screen readers
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    setAnnouncement(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
    setAnnouncement(`Large text mode ${!largeText ? 'enabled' : 'disabled'}`);
  };

  const toggleDyslexiaFont = () => {
    setDyslexiaFont(!dyslexiaFont);
    setAnnouncement(`Dyslexia friendly font ${!dyslexiaFont ? 'enabled' : 'disabled'}`);
  };

  // Apply accessibility classes to a wrapper div
  const accessibilityClasses = `
    ${highContrast ? 'bg-black text-yellow-400' : 'bg-white text-slate-800'}
    ${largeText ? 'text-lg' : 'text-base'}
    ${dyslexiaFont ? 'font-dyslexic' : 'font-sans'}
  `;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`max-w-2xl mx-auto pb-20 px-4 min-h-screen transition-all duration-300 ${accessibilityClasses}`}
      role="main"
      aria-label="Inclusive Hub"
    >
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="py-4">
        <button 
          onClick={onBack}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 font-medium mb-8 hover:opacity-80 transition-opacity focus:ring-2 focus:ring-indigo-500 rounded-lg outline-none p-2"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          Back to Dashboard
        </button>

        <header className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-100 text-indigo-600'}`} aria-hidden="true">
                <Accessibility size={32} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Inclusive Hub</h1>
            </div>
            <button 
              onClick={() => isSpeaking ? stopSpeaking() : speak("Inclusive Hub. A dedicated space designed to make Focus Hub accessible and supportive for everyone. Adjust your experience or find specialized resources below.")}
              className={`p-3 rounded-2xl transition-colors ${highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              aria-label={isSpeaking ? "Stop reading page overview" : "Read page overview aloud"}
            >
              {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
          <p className={`leading-relaxed ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
            A dedicated space designed to make Focus Hub accessible and supportive for everyone. Adjust your experience or find specialized resources below.
          </p>
        </header>

        <div className="space-y-8">
          {/* Accessibility Controls */}
          <section 
            className={`rounded-[32px] p-6 shadow-sm border transition-colors ${highContrast ? 'bg-zinc-900 border-yellow-400' : 'bg-white border-slate-100'}`} 
            aria-labelledby="accessibility-controls-title"
          >
            <h2 id="accessibility-controls-title" className="text-lg font-bold mb-6 flex items-center gap-2">
              <Sparkles className={highContrast ? 'text-yellow-400' : 'text-indigo-600'} size={20} aria-hidden="true" />
              Personalize Your View
            </h2>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-2xl ${highContrast ? 'bg-black border border-yellow-400/30' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shadow-sm ${highContrast ? 'bg-zinc-800' : 'bg-white'}`} aria-hidden="true">
                    <Eye size={20} className={highContrast ? 'text-yellow-400' : 'text-slate-600'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">High Contrast</p>
                    <p className={`text-xs ${highContrast ? 'text-yellow-400/70' : 'text-slate-500'}`}>Easier to read for visual impairments</p>
                  </div>
                </div>
                <button 
                  onClick={toggleHighContrast}
                  aria-label="Toggle High Contrast"
                  aria-pressed={highContrast}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:ring-2 focus:ring-indigo-500 outline-none ${highContrast ? 'bg-yellow-400' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${highContrast ? 'left-7 bg-black' : 'left-1 bg-white'}`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl ${highContrast ? 'bg-black border border-yellow-400/30' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shadow-sm ${highContrast ? 'bg-zinc-800' : 'bg-white'}`} aria-hidden="true">
                    <Type size={20} className={highContrast ? 'text-yellow-400' : 'text-slate-600'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Large Text</p>
                    <p className={`text-xs ${highContrast ? 'text-yellow-400/70' : 'text-slate-500'}`}>Increase font size across the app</p>
                  </div>
                </div>
                <button 
                  onClick={toggleLargeText}
                  aria-label="Toggle Large Text"
                  aria-pressed={largeText}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:ring-2 focus:ring-indigo-500 outline-none ${largeText ? (highContrast ? 'bg-yellow-400' : 'bg-indigo-600') : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${largeText ? `left-7 ${highContrast ? 'bg-black' : 'bg-white'}` : `left-1 ${highContrast ? 'bg-yellow-400/50' : 'bg-white'}`}`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl ${highContrast ? 'bg-black border border-yellow-400/30' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl shadow-sm ${highContrast ? 'bg-zinc-800' : 'bg-white'}`} aria-hidden="true">
                    <Volume2 size={20} className={highContrast ? 'text-yellow-400' : 'text-slate-600'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dyslexia Friendly Font</p>
                    <p className={`text-xs ${highContrast ? 'text-yellow-400/70' : 'text-slate-500'}`}>Specialized font for easier reading</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDyslexiaFont}
                  aria-label="Toggle Dyslexia Friendly Font"
                  aria-pressed={dyslexiaFont}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:ring-2 focus:ring-indigo-500 outline-none ${dyslexiaFont ? (highContrast ? 'bg-yellow-400' : 'bg-indigo-600') : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${dyslexiaFont ? `left-7 ${highContrast ? 'bg-black' : 'bg-white'}` : `left-1 ${highContrast ? 'bg-yellow-400/50' : 'bg-white'}`}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Specialized Resources */}
          <section className="grid grid-cols-1 gap-4" aria-label="Specialized Resources">
            <div className={`p-6 rounded-[32px] border transition-colors ${highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <BookOpen size={20} aria-hidden="true" />
                Learning Support
              </h3>
              <p className={`text-sm mb-4 ${highContrast ? 'text-yellow-400/80' : 'text-emerald-800/70'}`}>Access tools like screen readers, speech-to-text, and simplified study guides.</p>
              <button 
                className={`font-bold text-sm flex items-center gap-1 hover:underline focus:ring-2 rounded-lg outline-none ${highContrast ? 'text-yellow-400 focus:ring-yellow-400' : 'text-emerald-700 focus:ring-emerald-500'}`}
                aria-label="Explore Learning Support Tools"
              >
                Explore Tools <ChevronLeft size={16} className="rotate-180" aria-hidden="true" />
              </button>
            </div>

            <div className={`p-6 rounded-[32px] border transition-colors ${highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-400' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Users size={20} aria-hidden="true" />
                Peer Support Network
              </h3>
              <p className={`text-sm mb-4 ${highContrast ? 'text-yellow-400/80' : 'text-blue-800/70'}`}>Connect with other students who share similar journeys in a safe, moderated space.</p>
              <button 
                className={`font-bold text-sm flex items-center gap-1 hover:underline focus:ring-2 rounded-lg outline-none ${highContrast ? 'text-yellow-400 focus:ring-yellow-400' : 'text-blue-700 focus:ring-blue-500'}`}
                aria-label="Join Peer Support Community"
              >
                Join Community <ChevronLeft size={16} className="rotate-180" aria-hidden="true" />
              </button>
            </div>
          </section>

          {/* Support Message */}
          <footer className={`rounded-[40px] p-8 text-center transition-colors ${highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-900 text-white'}`} role="contentinfo">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${highContrast ? 'bg-black text-yellow-400' : 'bg-indigo-600 text-white'}`} aria-hidden="true">
              <Accessibility size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">You Belong Here</h3>
            <p className={`text-sm leading-relaxed ${highContrast ? 'text-black/80' : 'text-slate-400'}`}>
              Focus Hub is committed to ensuring that every student, regardless of their physical or cognitive abilities, has the tools they need to succeed.
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
