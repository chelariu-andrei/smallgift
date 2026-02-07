import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flower } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useLanguage } from '../context/LanguageContext';

export default function FlowerBurst() {
    const playSound = useSound();
    const { t } = useLanguage();

    const triggerConfetti = () => {
        // Massive Flower-like confetti
        const scalar = 4; // Much larger icons
        const C = confetti as any;
        const flowers = [
            C.shapeFromText({ text: '🌸', scalar }),
            C.shapeFromText({ text: '🌹', scalar }),
            C.shapeFromText({ text: '🌷', scalar }),
            C.shapeFromText({ text: '🌺', scalar }),
            C.shapeFromText({ text: '🌻', scalar }),
            C.shapeFromText({ text: '💐', scalar }),
        ];

        // First huge burst
        confetti({
            particleCount: 100,
            spread: 180,
            origin: { y: 0.8 },
            shapes: flowers,
            scalar: 3,
            gravity: 0.4,
            drift: 0,
            startVelocity: 60,
            ticks: 400
        });

        // Second wave - left
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 100,
                origin: { x: 0, y: 0.8 },
                shapes: flowers,
                scalar: 3,
                gravity: 0.5,
                drift: 1,
                startVelocity: 70,
                ticks: 300
            });
        }, 200);

        // Third wave - right
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 100,
                origin: { x: 1, y: 0.8 },
                shapes: flowers,
                scalar: 3,
                gravity: 0.5,
                drift: -1,
                startVelocity: 70,
                ticks: 300
            });
        }, 400);

        // Gold dust rain from top
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 360,
                origin: { x: 0.5, y: 0 },
                colors: ['#FFD700', '#FFFACD', '#FB7185'],
                shapes: ['circle', 'square'],
                scalar: 1,
                gravity: 0.2,
                startVelocity: 30,
                ticks: 500
            });
        }, 600);
    };

    useEffect(() => {
        // Initial burst on mount
        const timer = setTimeout(triggerConfetti, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl mb-4"
            >
                💐
            </motion.div>

            <h1 className="text-4xl font-display font-bold text-rose-800 drop-shadow-sm">
                {t('end.title')}
            </h1>

            <p className="text-xl text-gray-600 max-w-xs mx-auto">
                {t('end.subtitle')}
            </p>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    playSound('success');
                    triggerConfetti();
                }}
                className="px-8 py-4 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-full font-bold text-lg shadow-xl shadow-rose-300/50 flex items-center gap-3"
            >
                <Flower className="w-6 h-6 animate-spin-slow" />
                {t('end.button')}
            </motion.button>
        </div>
    );
}
