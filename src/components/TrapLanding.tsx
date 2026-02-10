import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useLanguage } from '../context/LanguageContext';

interface TrapLandingProps {
    onYes: () => void;
}

export default function TrapLanding({ onYes }: TrapLandingProps) {
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [hoverCount, setHoverCount] = useState(0);
    const [minimized, setMinimized] = useState(false);
    const playSound = useSound();
    const { t } = useLanguage();

    const noTexts = t('trap.no_messages') as unknown as string[];

    const handleNoInteraction = () => {
        // Constrain movement to stay on-screen
        const maxX = Math.min(window.innerWidth * 0.3, 150);
        const maxY = Math.min(window.innerHeight * 0.2, 100);
        const x = (Math.random() - 0.5) * maxX * 2;
        const y = (Math.random() - 0.5) * maxY * 2;
        setNoBtnPos({ x, y });
        setHoverCount(c => c + 1);
        playSound('hover');
    };

    return (
        <AnimatePresence mode="wait">
            {minimized ? (
                <motion.button
                    key="minimized"
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => { setMinimized(false); playSound('plop'); }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-rose-200/50 hover:bg-white transition-colors active:scale-95"
                >
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-heartbeat" />
                    <span className="text-sm font-semibold text-rose-800">{t('trap.valentine')}</span>
                    <Maximize2 className="w-4 h-4 text-rose-400" />
                </motion.button>
            ) : (
                <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-6 p-5 sm:p-8 bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 relative overflow-hidden"
                >
                    {/* Minimize button */}
                    <button
                        onClick={() => { setMinimized(true); playSound('plop'); }}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors active:scale-90"
                        title="Minimize"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>

                    {/* Decorative sparkles */}
                    <Sparkles className="absolute top-4 left-4 w-4 h-4 sm:w-5 sm:h-5 text-amber-400/70 animate-pulse" />

                    {/* Subtitle first — the lead-in */}
                    <p className="text-rose-800/70 font-medium text-xs sm:text-sm pt-1">
                        {t('trap.subtitle')}
                    </p>

                    {/* Valentine Heart Hero — smaller on mobile */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                    >
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-xl shadow-rose-400/30">
                            <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-white fill-white drop-shadow-sm" />
                        </div>
                        <div className="absolute -inset-3 rounded-full bg-rose-400/20 blur-xl -z-10" />
                    </motion.div>

                    {/* Main question */}
                    <h1 className="text-2xl sm:text-4xl font-bold text-rose-950 tracking-wide drop-shadow-sm font-display leading-tight">
                        {t('trap.title')} <br />
                        <span className="text-rose-500 text-3xl sm:text-5xl">{t('trap.valentine')}</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full relative min-h-[5rem] sm:min-h-[6rem]">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                playSound('success');
                                onYes();
                            }}
                            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-bold text-base sm:text-lg shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)] active:shadow-inner transition-all flex items-center gap-2.5 z-20 border border-rose-400 min-w-[180px] sm:min-w-[200px] justify-center"
                        >
                            <Heart className="fill-current w-5 h-5 animate-heartbeat" />
                            {t('trap.yes')}
                        </motion.button>

                        <motion.button
                            animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onHoverStart={handleNoInteraction}
                            onTouchStart={handleNoInteraction}
                            onClick={handleNoInteraction}
                            className="px-6 py-2.5 bg-white/50 backdrop-blur-sm text-gray-500 rounded-full font-medium shadow-sm border border-white/60 absolute sm:relative z-10 cursor-not-allowed select-none active:scale-95 transition-colors text-xs sm:text-sm"
                        >
                            {noTexts[Math.min(hoverCount, noTexts.length - 1)]}
                        </motion.button>
                    </div>

                    {/* Bottom decorative hearts */}
                    <div className="flex gap-2 opacity-40">
                        {['💕', '🤍', '💗', '🤍', '💕'].map((h, i) => (
                            <motion.span
                                key={i}
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                className="text-xs sm:text-sm"
                            >
                                {h}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
