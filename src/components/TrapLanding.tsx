import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useLanguage } from '../context/LanguageContext';

interface TrapLandingProps {
    onYes: () => void;
}

export default function TrapLanding({ onYes }: TrapLandingProps) {
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [hoverCount, setHoverCount] = useState(0);
    const playSound = useSound();
    const { t } = useLanguage();

    const noTexts = t('trap.no_messages') as unknown as string[];

    const handleNoInteraction = () => {
        // Calculate random position within a reasonable range
        // Using simple logic relative to current position or absolute? 
        // Absolute is better to avoid going off screen, but requires window dimensions.
        // For simplicity, we'll shift it randomly by +/- 100-200px.
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        setNoBtnPos({ x, y });
        setHoverCount(c => c + 1);
        playSound('hover');
    };

    return (
        <div className="flex flex-col items-center text-center space-y-8 p-6 bg-white/30 backdrop-blur-md rounded-3xl shadow-xl border border-white/50">
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <img
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop"
                    alt="Romantic Flowers"
                    className="w-64 h-64 object-cover rounded-full shadow-lg border-4 border-white"
                />
            </motion.div>

            <h1 className="text-4xl font-bold text-rose-950 tracking-wide drop-shadow-sm font-display">
                {t('trap.title')} <span className="text-rose-500">{t('trap.valentine')}</span>
            </h1>

            <p className="text-rose-800/80 font-medium opacity-90">
                {t('trap.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full relative h-24">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playSound('success');
                        onYes();
                    }}
                    className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-bold text-lg shadow-[0_10px_30px_-10px_rgba(244,63,94,0.6)] hover:shadow-[0_15px_35px_-10px_rgba(244,63,94,0.7)] active:shadow-inner transition-all flex items-center gap-3 z-20 border border-rose-400"
                >
                    <Heart className="fill-current w-6 h-6 animate-pulse" />
                    {t('trap.yes')}
                </motion.button>

                <motion.button
                    animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onHoverStart={handleNoInteraction}
                    onTouchStart={handleNoInteraction}
                    onClick={handleNoInteraction}
                    className="px-8 py-3 bg-white/50 backdrop-blur-sm text-gray-500 rounded-full font-medium shadow-sm hover:bg-white/80 border border-white/60 absolute sm:relative z-10 cursor-not-allowed select-none active:scale-95 transition-colors"
                >
                    {noTexts[Math.min(hoverCount, noTexts.length - 1)]}
                </motion.button>
            </div>
        </div>
    );
}
