import { useState, useEffect } from 'react';
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
      className="fixed top-[max(12px,env(safe-area-inset-top,12px))] right-3 z-50 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-rose-700 shadow-lg border border-white/40 hover:bg-white/80 transition-all active:scale-95"
    >
      {language === 'ro' ? '🇷🇴 RO' : '🇬🇧 EN'}
    </button>
  );
}

// Floating hearts decoration
function FloatingHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number; duration: number; emoji: string }>>([]);

  useEffect(() => {
    const emojis = ['❤️', '💕', '💗', '🤍', '💖'];
    // Fewer hearts on mobile to avoid clutter and perf issues
    const count = window.innerWidth < 640 ? 5 : 8;
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(generated);
  }, []);

  return (
    <>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            bottom: '-2rem',
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            animationIterationCount: 'infinite',
          }}
        >
          {h.emoji}
        </div>
      ))}
    </>
  );
}

function MainApp() {
  const [view, setView] = useState<ViewState>('landing');
  const playSound = useSound();

  const handleEnterApp = () => {
    playSound('success');
    setView('app');
  };

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
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Image — Mobile */}
      <div
        className="fixed inset-0 z-0 block md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg_mobile.jpeg')" }}
      />
      {/* Background Image — Desktop */}
      <div
        className="fixed inset-0 z-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg_laptop.jpeg')" }}
      />

      {/* Warm overlay for readability */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-amber-950/50 via-rose-950/40 to-amber-950/55" />

      {/* Floating Hearts */}
      <FloatingHearts />

      <LanguageToggle />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full flex-1 flex items-center justify-center px-4 py-6 z-10"
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
            className="w-full h-dvh z-10"
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
