import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Minimize2, Maximize2 } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveLetterProps {
    onOpen: () => void;
}

export default function InteractiveLetter({ onOpen }: InteractiveLetterProps) {
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const playSound = useSound();
    const { t } = useLanguage();

    const startPress = () => {
        setIsPressing(true);
        playSound('hover');
        intervalRef.current = window.setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current!);
                    setIsOpen(true);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
    };

    const endPress = () => {
        setIsPressing(false);
        if (!isOpen) {
            setProgress(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    const [isThrowing, setIsThrowing] = useState(false);

    const handleClose = () => {
        setIsThrowing(true);
        playSound('magic');
        setTimeout(() => {
            setIsOpen(false);
            setIsThrowing(false);
            setProgress(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
            onOpen();
        }, 800);
    };

    // Minimized pill bar
    if (minimized) {
        return (
            <motion.button
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => { setMinimized(false); playSound('plop'); }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-amber-200/50 hover:bg-white transition-colors active:scale-95"
            >
                <Mail className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-semibold text-rose-800">{t('letter.title')}</span>
                <Maximize2 className="w-4 h-4 text-rose-400" />
            </motion.button>
        );
    }

    if (isOpen) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isThrowing ?
                    { x: 500, y: -500, rotate: 720, opacity: 0, scale: 0.5 } :
                    { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }
                }
                transition={isThrowing ? { duration: 0.8, ease: "backIn" } : { duration: 0.5 }}
                className="bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-xl border-2 border-amber-100 w-full max-w-md mx-auto text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300"></div>

                {/* Minimize button */}
                <button
                    onClick={() => { setMinimized(true); playSound('plop'); }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors active:scale-90"
                    title="Minimize"
                >
                    <Minimize2 className="w-4 h-4" />
                </button>

                {/* Funny text that appears when throwing */}
                {isThrowing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm"
                    >
                        <span className="text-3xl sm:text-4xl font-bold text-rose-600 rotate-12 drop-shadow-md">
                            YEET! 🗑️
                        </span>
                    </motion.div>
                )}

                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 absolute top-3 left-3 sm:top-4 sm:left-4 animate-pulse" />

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-rose-950 mb-4 sm:mb-6 mt-2">{t('letter.modal_title')}</h3>

                <div className="text-left space-y-3 sm:space-y-4 text-rose-950/90 text-sm sm:text-base leading-relaxed font-body">
                    <p>{t('letter.p1')}</p>
                    <p>{t('letter.p2')}</p>
                    <p className="font-semibold text-rose-600">{t('letter.signature')}</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="mt-6 sm:mt-8 px-8 py-3 bg-amber-400 text-white rounded-full font-bold shadow-md hover:bg-amber-500 transition-colors w-full active:bg-amber-600"
                >
                    {t('letter.close')}
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/40 w-full max-w-md mx-auto relative">
            {/* Minimize button */}
            <button
                onClick={() => { setMinimized(true); playSound('plop'); }}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-rose-50/80 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors active:scale-90"
                title="Minimize"
            >
                <Minimize2 className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-rose-900 font-display">{t('letter.title')}</h2>
                <p className="text-sm sm:text-base text-rose-800/70">{t('letter.instruction')}</p>
            </div>

            <div className="relative">
                {/* Progress Ring / Glow */}
                <motion.div
                    className="absolute -inset-4 rounded-full bg-rose-200 blur-xl opacity-50"
                    animate={{ scale: isPressing ? 1.5 : 1, opacity: isPressing ? 0.8 : 0.3 }}
                />

                <motion.button
                    onMouseDown={startPress}
                    onMouseUp={endPress}
                    onMouseLeave={endPress}
                    onTouchStart={startPress}
                    onTouchEnd={endPress}
                    className="relative bg-white p-8 sm:p-8 rounded-full shadow-2xl border-4 border-rose-100 cursor-pointer select-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Mail className={`w-16 h-16 sm:w-16 sm:h-16 ${isPressing ? 'text-rose-500' : 'text-gray-400'} transition-colors duration-500`} />

                    {/* Progress Overlay */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                        <circle
                            cx="50%" cy="50%" r="46%"
                            fill="none"
                            stroke="#fb7185"
                            strokeWidth="4"
                            strokeDasharray="300"
                            strokeDashoffset={300 - (300 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-75 ease-linear"
                        />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}
