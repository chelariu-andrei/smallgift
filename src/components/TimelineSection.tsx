import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, X, Quote, ArrowUp } from 'lucide-react';
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

    // Generate 15 memories
    const memories = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        image: `https://images.unsplash.com/photo-${[
            '1522673607200-1645062cd495', '1529634597503-139d372668c4', '1522778526097-ce0a22ce718d',
            '1518199266791-5375a83190b7', '1516589178581-89878103f307', '1520854222965-038538ad769a',
            '1515934751635-c81c6bc9a2d8', '1523438885216-934c256bbc48', '1513279922550-250c2129b13a',
            '1529634597503-139d372668c4', '1522673607200-1645062cd495', '1522778526097-ce0a22ce718d',
            '1518199266791-5375a83190b7', '1516589178581-89878103f307', '1520854222965-038538ad769a'
        ][i % 15]}?q=80&w=800&auto=format&fit=crop`,
        date: t(`memory.${(i % 3) + 1}.date`), // Recycling translations for demo since we don't have 15 unique keys
        text: t(`memory.${(i % 3) + 1}.text`) + (i % 2 === 0 ? " This is a longer description to test the truncation logic. We want to make sure long text doesn't break the layout but can be expanded." : "")
    }));

    return (
        <div className="h-full w-full relative flex flex-col bg-transparent">
            {/* Header / Sticky Top */}
            <div className="px-6 py-6 z-20 backdrop-blur-xl bg-white/60 sticky top-0 border-b border-rose-100/50">
                <h2 className="text-2xl font-bold text-rose-950 font-display tracking-tight">
                    {t('timeline.title')}
                </h2>
                <p className="text-sm text-rose-800/60 mt-1 font-medium">
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
                className="flex-1 overflow-y-auto px-4 py-6 space-y-8 pb-32 scroll-smooth"
            >
                {memories.map((memory) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-10%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onClick={() => setSelectedMemory(memory)}
                        className="cursor-pointer"
                    >
                        {/* Split Card Design */}
                        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_-5px_rgba(251,113,133,0.15)] overflow-hidden border border-white/50 flex flex-row h-52 md:h-72 transition-all hover:shadow-[0_15px_40px_-5px_rgba(251,113,133,0.25)] hover:scale-[1.01]">
                            {/* Left: Image (Larger 60%, Framed) */}
                            <div className="w-[55%] p-3 relative">
                                <div className="w-full h-full relative overflow-hidden rounded-2xl shadow-inner">
                                    <img
                                        src={memory.image}
                                        alt={memory.text}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    {/* Date Badge - Small & Glass */}
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/50">
                                        <Calendar className="w-3 h-3 text-rose-500" />
                                        <span className="text-[10px] font-bold text-rose-950 uppercase tracking-wider font-body">
                                            {memory.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text & Actions */}
                            <div className="w-[45%] p-4 flex flex-col justify-between bg-gradient-to-br from-white to-rose-50/50">
                                <div className="space-y-2 overflow-hidden h-full">
                                    <p className="text-rose-950/90 font-medium text-sm leading-relaxed font-body line-clamp-[6] md:line-clamp-[8]">
                                        {memory.text}
                                    </p>
                                </div>

                                <div className="mt-2 pt-3 border-t border-rose-100 flex items-center justify-between">
                                    <span className="text-[10px] text-rose-400 font-semibold tracking-wide">
                                        Read More
                                    </span>

                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(memory.id);
                                        }}
                                        className={cn(
                                            "p-2 rounded-full transition-colors duration-300",
                                            likes[memory.id] ? "bg-rose-100 text-rose-500" : "bg-gray-50 text-gray-300 hover:text-rose-300"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", likes[memory.id] && "fill-current")} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* "Best is yet to come" Section */}
                <div className="pt-12 pb-24 flex flex-col items-center text-center space-y-6">
                    <div className="w-24 h-[2px] bg-rose-200 rounded-full opacity-50" />

                    <p className="text-xl font-display italic text-rose-800/90 max-w-sm px-6 leading-relaxed">
                        {t('timeline.tocome')}
                    </p>

                    <Heart className="w-8 h-8 text-rose-400 animate-pulse fill-rose-100" />
                </div>
            </div>

            {/* Floating Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.1, translateY: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="absolute bottom-26 right-5 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_20px_-2px_rgba(251,113,133,0.4)] border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                        <ArrowUp className="w-6 h-6" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMemory(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Full Image */}
                            <div className="w-full h-1/2 min-h-[300px] relative">
                                <img
                                    src={selectedMemory.image}
                                    alt={selectedMemory.text}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                                <div className="absolute top-4 left-4 bg-rose-500/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider font-body">
                                        {selectedMemory.date}
                                    </span>
                                </div>
                            </div>

                            {/* Full Content */}
                            <div className="p-8 pb-10 flex-1 overflow-y-auto bg-white relative -mt-6 rounded-t-[32px]">
                                <Quote className="w-8 h-8 text-rose-200 mb-4 fill-current" />
                                <p className="text-rose-950 text-lg leading-relaxed font-display">
                                    {selectedMemory.text}
                                </p>

                                <div className="mt-8 pt-6 border-t border-rose-100 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {/* Fake avatars for "others liked this" feel */}
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-rose-${i * 100 + 100}`} />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => toggleLike(selectedMemory.id)}
                                        className={cn(
                                            "px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2",
                                            likes[selectedMemory.id]
                                                ? "bg-rose-500 text-white shadow-lg shadow-rose-300/50"
                                                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4", likes[selectedMemory.id] && "fill-current")} />
                                        {likes[selectedMemory.id] ? "Adored" : "Adore"}
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
