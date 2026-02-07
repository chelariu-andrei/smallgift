import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TrapLanding from './components/TrapLanding';
import Dashboard from './components/Dashboard';
import useSound from './hooks/useSound';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Define the stages of the journey
type ViewState = 'landing' | 'app';

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
      className="fixed top-4 right-4 z-50 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-rose-600 shadow-sm border border-rose-200 hover:bg-white/80 transition-all"
    >
      {language === 'ro' ? '🇷🇴 RO' : '🇬🇧 EN'}
    </button>
  );
}

function MainApp() {
  const [view, setView] = useState<ViewState>('landing');
  const playSound = useSound();

  const handleEnterApp = () => {
    playSound('success'); // Play a nice sound on entry
    setView('app');
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.5
  } as const;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">
      <LanguageToggle />

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-yellow-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-[40vw] h-[40vw] rounded-full bg-pink-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full flex items-center justify-center p-4 z-10"
          >
            <TrapLanding onYes={handleEnterApp} />
          </motion.div>
        )}

        {view === 'app' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full z-10"
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
