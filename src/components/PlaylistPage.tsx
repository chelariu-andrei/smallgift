import { motion } from 'framer-motion';
import { Play, Pause, Music2 } from 'lucide-react';
import { useMusic, type Track } from '../context/MusicContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export default function PlaylistPage() {
    const { tracks, currentTrack, isPlaying, selectTrack, toggle } = useMusic();
    const { t } = useLanguage();

    const handleTrackClick = (track: Track) => {
        if (currentTrack?.videoId === track.videoId) {
            toggle();
        } else {
            selectTrack(track);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-transparent">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-5 z-20 backdrop-blur-xl bg-white/80 border-b border-rose-100/30">
                <h2 className="text-lg sm:text-2xl font-bold text-rose-950 font-display tracking-tight flex items-center gap-2">
                    <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                    {t('playlist.title')}
                </h2>
                <p className="text-[11px] sm:text-sm text-rose-800/50 mt-0.5 font-medium">
                    {t('playlist.subtitle')}
                </p>
            </div>

            {/* Song Grid */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 pb-8 overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {tracks.map((track, idx) => {
                        const isCurrent = currentTrack?.videoId === track.videoId;
                        const isActive = isCurrent && isPlaying;

                        return (
                            <motion.button
                                key={track.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08, duration: 0.4 }}
                                onClick={() => handleTrackClick(track)}
                                className={cn(
                                    "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 active:scale-[0.97]",
                                    "bg-white/90 backdrop-blur-sm border shadow-[0_4px_16px_-4px_rgba(180,120,80,0.1)]",
                                    isCurrent
                                        ? "border-rose-300/60 shadow-[0_8px_30px_-5px_rgba(251,113,133,0.25)] ring-2 ring-rose-200/40"
                                        : "border-white/40 hover:shadow-[0_8px_24px_-5px_rgba(251,113,133,0.15)]"
                                )}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video w-full">
                                    <img
                                        src={`https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg`}
                                        alt={track.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Play/Pause overlay */}
                                    <div className={cn(
                                        "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                        isActive
                                            ? "bg-black/30"
                                            : "bg-black/0 group-hover:bg-black/20"
                                    )}>
                                        <motion.div
                                            initial={false}
                                            animate={isActive || isCurrent ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
                                            whileHover={{ scale: 1, opacity: 1 }}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:opacity-100 group-hover:scale-100 transition-all text-rose-600"
                                        >
                                            {isActive
                                                ? <Pause className="w-5 h-5 fill-current" />
                                                : <Play className="w-5 h-5 fill-current ml-0.5" />
                                            }
                                        </motion.div>
                                    </div>

                                    {/* Now playing indicator */}
                                    {isActive && (
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-rose-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                            <div className="flex items-end gap-[2px] h-3">
                                                {[1, 2, 3].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-[3px] bg-white rounded-full"
                                                        animate={{
                                                            height: ['4px', '12px', '6px', '10px', '4px'],
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: i * 0.15,
                                                            ease: 'easeInOut',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                                                {t('playlist.playing')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Track number badge */}
                                    {!isActive && (
                                        <div className="absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/50">
                                            <span className="text-[10px] sm:text-xs font-bold text-rose-600">
                                                {idx + 1}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Track Info */}
                                <div className="p-2.5 sm:p-3">
                                    <p className={cn(
                                        "text-xs sm:text-sm font-semibold leading-tight truncate",
                                        isCurrent ? "text-rose-600" : "text-rose-950"
                                    )}>
                                        {track.title}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-rose-600/50 mt-0.5 truncate">
                                        {track.artist}
                                    </p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Footer message */}
                <div className="mt-6 sm:mt-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl py-4 px-5 border border-rose-100/30 shadow-sm">
                    <p className="text-xs sm:text-sm text-rose-500 font-medium italic">
                        {t('playlist.footer')} 🎵💕
                    </p>
                </div>
            </div>
        </div>
    );
}
