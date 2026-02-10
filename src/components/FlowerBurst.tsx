import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flower, Minimize2, Maximize2, Gift } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useLanguage } from '../context/LanguageContext';

export default function FlowerBurst() {
    const playSound = useSound();
    const { t } = useLanguage();
    const [minimized, setMinimized] = useState(false);

    const triggerConfetti = () => {
        const scalar = window.innerWidth < 640 ? 3 : 4;
        const C = confetti as any;
        const flowers = [
            C.shapeFromText({ text: '🌸', scalar }),
            C.shapeFromText({ text: '🌹', scalar }),
            C.shapeFromText({ text: '🌷', scalar }),
            C.shapeFromText({ text: '🌺', scalar }),
            C.shapeFromText({ text: '🌻', scalar }),
            C.shapeFromText({ text: '💐', scalar }),
        ];

        const isMobile = window.innerWidth < 640;
        const count = isMobile ? 60 : 100;

        confetti({
            particleCount: count,
            spread: 180,
            origin: { y: 0.8 },
            shapes: flowers,
            scalar: isMobile ? 2 : 3,
            gravity: 0.4,
            drift: 0,
            startVelocity: isMobile ? 45 : 60,
            ticks: 400
        });

        setTimeout(() => {
            confetti({
                particleCount: isMobile ? 50 : 80,
                angle: 60,
                spread: 100,
                origin: { x: 0, y: 0.8 },
                shapes: flowers,
                scalar: isMobile ? 2 : 3,
                gravity: 0.5,
                drift: 1,
                startVelocity: isMobile ? 50 : 70,
                ticks: 300
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: isMobile ? 50 : 80,
                angle: 120,
                spread: 100,
                origin: { x: 1, y: 0.8 },
                shapes: flowers,
                scalar: isMobile ? 2 : 3,
                gravity: 0.5,
                drift: -1,
                startVelocity: isMobile ? 50 : 70,
                ticks: 300
            });
        }, 400);

        setTimeout(() => {
            confetti({
                particleCount: isMobile ? 100 : 200,
                spread: 360,
                origin: { x: 0.5, y: 0 },
                colors: ['#FFD700', '#FFFACD', '#FB7185'],
                shapes: ['circle', 'square'],
                scalar: 1,
                gravity: 0.2,
                startVelocity: isMobile ? 20 : 30,
                ticks: 500
            });
        }, 600);
    };

    useEffect(() => {
        const timer = setTimeout(triggerConfetti, 500);
        return () => clearTimeout(timer);
    }, []);

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
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-rose-200/50 hover:bg-white transition-colors active:scale-95"
                >
                    <Gift className="w-5 h-5 text-rose-500" />
                    <span className="text-sm font-semibold text-rose-800">{t('nav.foryou')}</span>
                    <Maximize2 className="w-4 h-4 text-rose-400" />
                </motion.button>
            ) : (
                <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/40 w-full max-w-md mx-auto relative"
                >
                    {/* Minimize button */}
                    <button
                        onClick={() => { setMinimized(true); playSound('plop'); }}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors active:scale-90"
                        title="Minimize"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>

                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-5xl sm:text-6xl"
                    >
                        💐
                    </motion.div>

                    <h1 className="text-2xl sm:text-4xl font-display font-bold text-rose-800 drop-shadow-sm text-center">
                        {t('end.title')}
                    </h1>

                    <p className="text-base sm:text-xl text-rose-950/70 max-w-xs mx-auto text-center">
                        {t('end.subtitle')}
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            playSound('success');
                            triggerConfetti();
                        }}
                        className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-full font-bold text-base sm:text-lg shadow-xl shadow-rose-300/50 flex items-center gap-2.5 active:shadow-inner"
                    >
                        <Flower className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
                        {t('end.button')}
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
