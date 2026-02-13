import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, X, Quote, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

// Hook for managing likes in localStorage
function useLikes() {
    const [likes, setLikes] = useState<Record<number, boolean>>(() => {
        try {
            const saved = localStorage.getItem('memory_likes');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    const toggleLike = (id: number) => {
        setLikes(prev => {
            const newLikes = { ...prev, [id]: !prev[id] };
            localStorage.setItem('memory_likes', JSON.stringify(newLikes));
            return newLikes;
        });
    };

    return { likes, toggleLike };
}

export default function TimelineSection() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: containerRef });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const { likes, toggleLike } = useLikes();
    const [selectedMemory, setSelectedMemory] = useState<any>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop > 300) {
            setShowBackToTop(true);
        } else {
            setShowBackToTop(false);
        }
    };

    // Image files available: 1-9, 11-18 (no 10.jpeg)
    const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18];

    const memories = imageNumbers.map((imgNum, idx) => ({
        id: idx + 1,
        image: `${import.meta.env.BASE_URL}${imgNum}.jpeg`,
        date: t(`memory.${idx + 1}.date`),
        text: t(`memory.${idx + 1}.text`),
    }));

    return (
        <div className="h-full w-full relative flex flex-col bg-transparent">
            {/* Header / Sticky Top */}
            <div className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-5 z-20 backdrop-blur-xl bg-white/80 border-b border-rose-100/30 relative">
                <h2 className="text-lg sm:text-2xl font-bold text-rose-950 font-display tracking-tight">
                    {t('timeline.title')}
                </h2>
                <p className="text-[11px] sm:text-sm text-rose-800/50 mt-0.5 font-medium">
                    {t('timeline.subtitle')}
                </p>

                {/* Elegant Progress Line */}
                <motion.div
                    style={{ scaleX }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-300 via-rose-500 to-rose-300 origin-left"
                />
            </div>

            {/* Scrollable Content */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-8 scroll-smooth overscroll-contain"
            >
                {memories.map((memory) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-10%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onClick={() => setSelectedMemory(memory)}
                        className="cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        {/* Card — Stacked on mobile, Split on md+ */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-[18px] sm:rounded-[24px] shadow-[0_6px_24px_-4px_rgba(180,120,80,0.1)] overflow-hidden border border-white/40 flex flex-col md:flex-row md:h-72 transition-shadow hover:shadow-[0_12px_40px_-5px_rgba(251,113,133,0.2)]">

                            {/* Image — Full width on mobile, 55% on desktop */}
                            <div className="w-full md:w-[55%] p-2 sm:p-3 relative">
                                <div className="w-full h-44 sm:h-56 md:h-full relative overflow-hidden rounded-xl sm:rounded-2xl">
                                    <img
                                        src={memory.image}
                                        alt={memory.text}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Date Badge */}
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-sm border border-white/50">
                                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 fill-rose-500" />
                                        <span className="text-[9px] sm:text-[11px] font-bold text-rose-950 uppercase tracking-wider font-body">
                                            {memory.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Text & Actions — Below on mobile, right side on desktop */}
                            <div className="w-full md:w-[45%] px-3.5 pb-3.5 pt-1.5 sm:px-4 sm:pb-5 sm:pt-3 md:p-4 flex flex-col justify-between">
                                <div className="overflow-hidden flex-1">
                                    <p className="text-rose-950/85 font-medium text-[13px] sm:text-[15px] leading-relaxed font-body line-clamp-3 sm:line-clamp-5 md:line-clamp-[8]">
                                        {memory.text}
                                    </p>
                                </div>

                                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-rose-100/60 flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] text-rose-400 font-semibold tracking-wide">
                                        {t('timeline.readmore') || 'Read More →'}
                                    </span>

                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(memory.id);
                                        }}
                                        className={cn(
                                            "p-1.5 sm:p-2 rounded-full transition-colors duration-300",
                                            likes[memory.id] ? "bg-rose-100 text-rose-500" : "bg-rose-50/50 text-rose-300"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", likes[memory.id] && "fill-current")} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* "Best is yet to come" Section */}
                <div className="pt-6 sm:pt-10 pb-6 flex flex-col items-center text-center">
                    <div className="bg-white/85 backdrop-blur-xl rounded-2xl px-6 sm:px-8 py-5 sm:py-6 shadow-lg border border-white/40 flex flex-col items-center space-y-3 sm:space-y-4">
                        <div className="w-12 sm:w-16 h-[2px] bg-rose-200 rounded-full opacity-60" />

                        <p className="text-base sm:text-xl font-display italic text-rose-800/90 max-w-sm leading-relaxed">
                            {t('timeline.tocome')}
                        </p>

                        <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 animate-heartbeat fill-rose-100" />
                    </div>
                </div>
            </div>

            {/* Floating Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="absolute bottom-4 right-3 sm:right-4 z-30 p-2 sm:p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-rose-100/50 text-rose-500 active:bg-rose-50 transition-colors"
                    >
                        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Memory Detail Modal */}
            <AnimatePresence>
                {selectedMemory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMemory(null)}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full sm:max-w-md max-h-[90dvh] sm:max-h-[85dvh] rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            {/* Drag handle on mobile */}
                            <div className="sm:hidden flex justify-center pt-2 pb-1">
                                <div className="w-10 h-1 bg-gray-300 rounded-full" />
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMemory(null)}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors active:scale-90"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Full Image */}
                            <div className="w-full h-[200px] sm:h-[280px] relative flex-shrink-0">
                                <img
                                    src={selectedMemory.image}
                                    alt={selectedMemory.text}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white to-transparent" />
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-rose-500/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                                    <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider font-body">
                                        {selectedMemory.date}
                                    </span>
                                </div>
                            </div>

                            {/* Full Content */}
                            <div className="p-5 sm:p-8 pb-6 sm:pb-10 flex-1 overflow-y-auto bg-white relative -mt-3 sm:-mt-4 rounded-t-[20px] sm:rounded-t-[24px]">
                                <Quote className="w-5 h-5 sm:w-7 sm:h-7 text-rose-200 mb-2 sm:mb-3 fill-current" />
                                <p className="text-rose-950 text-sm sm:text-lg leading-relaxed font-display">
                                    {selectedMemory.text}
                                </p>

                                <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-rose-100 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-rose-200" style={{ backgroundColor: `hsl(${340 + i * 15}, 80%, ${85 - i * 5}%)` }} />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => toggleLike(selectedMemory.id)}
                                        className={cn(
                                            "px-4 sm:px-5 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm active:scale-95",
                                            likes[selectedMemory.id]
                                                ? "bg-rose-500 text-white shadow-lg shadow-rose-300/50"
                                                : "bg-rose-50 text-rose-600"
                                        )}
                                    >
                                        <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", likes[selectedMemory.id] && "fill-current")} />
                                        {likes[selectedMemory.id] ? t('timeline.adored') : t('timeline.adore')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
