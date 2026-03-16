import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Wind, 
  CloudRain, 
  Coffee,
  Headphones
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  color: string;
}

export default function MusicSpace() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(50);

  const tracks: Track[] = [
    { id: '1', title: 'Deep Focus', artist: 'Lofi Study', duration: '3:45', color: 'bg-purple-500' },
    { id: '2', title: 'Rainy Night', artist: 'Ambient Sounds', duration: '5:12', color: 'bg-blue-500' },
    { id: '3', title: 'Morning Coffee', artist: 'Jazz Vibes', duration: '4:20', color: 'bg-orange-500' },
    { id: '4', title: 'Forest Walk', artist: 'Nature Meditation', duration: '6:30', color: 'bg-emerald-500' },
  ];

  const ambientSounds = [
    { id: 'rain', icon: CloudRain, label: 'Rain', color: 'text-blue-500' },
    { id: 'wind', icon: Wind, label: 'Wind', color: 'text-slate-400' },
    { id: 'cafe', icon: Coffee, label: 'Cafe', color: 'text-amber-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto pb-20"
      role="main"
      aria-label="Music Relaxation Space"
    >
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl" aria-hidden="true">
            <Headphones size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Music Space</h1>
        </div>
        <p className="text-slate-500">Relax, focus, and find your rhythm with curated sounds.</p>
      </header>

      <div className="space-y-8">
        {/* Now Playing Card */}
        <section className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Now Playing</span>
              <Music size={20} className="text-indigo-400" />
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className={`w-24 h-24 rounded-3xl ${currentTrack?.color || 'bg-indigo-600'} flex items-center justify-center shadow-lg`}>
                <Music size={40} className="text-white/50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentTrack?.title || 'Select a track'}</h2>
                <p className="text-slate-400 text-sm">{currentTrack?.artist || 'Relaxation awaits'}</p>
              </div>
            </div>

            {/* Progress Bar Placeholder */}
            <div className="h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: isPlaying ? '45%' : '0%' }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div className="flex items-center justify-center gap-8">
              <button className="text-white/50 hover:text-white transition-colors" aria-label="Previous track">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-white/50 hover:text-white transition-colors" aria-label="Next track">
                <SkipForward size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Track List */}
        <section aria-label="Available Tracks">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Focus Tracks</h3>
          <div className="space-y-3">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all ${
                  currentTrack?.id === track.id ? 'bg-indigo-50 border-2 border-indigo-100' : 'bg-white border border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${track.color} flex items-center justify-center text-white`}>
                    <Music size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm">{track.title}</p>
                    <p className="text-slate-400 text-[10px]">{track.artist}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-medium">{track.duration}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Ambient Sounds */}
        <section aria-label="Ambient Sounds">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ambient Mix</h3>
          <div className="grid grid-cols-3 gap-4">
            {ambientSounds.map((sound) => {
              const Icon = sound.icon;
              return (
                <button
                  key={sound.id}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col items-center gap-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className={`p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform ${sound.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{sound.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Volume Control */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-100">
          <div className="flex items-center gap-4">
            <Volume2 size={20} className="text-slate-400" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
              aria-label="Volume Control"
            />
            <span className="text-[10px] font-bold text-slate-400 w-8">{ambientVolume}%</span>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
