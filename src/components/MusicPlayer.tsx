import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { cn } from '../lib/utils';

function formatTime(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
    const { currentTrack, isPlaying, progress, duration, volume, toggle, next, prev, setVolume, seekTo, autoplayFailed } = useMusic();

    if (!currentTrack) return null;

    const pct = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-shrink-0 bg-white/80 backdrop-blur-2xl border-t border-rose-100/40 px-3 sm:px-4 py-2 z-40"
        >
            {/* Progress bar (clickable) */}
            <div
                className="w-full h-1.5 bg-rose-100/60 rounded-full mb-2 cursor-pointer relative group"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const ratio = x / rect.width;
                    seekTo(ratio * duration);
                }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full relative"
                    style={{ width: `${pct}%` }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Dot indicator */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Thumbnail */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-rose-100/30">
                    <img
                        src={`https://img.youtube.com/vi/${currentTrack.videoId}/mqdefault.jpg`}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-rose-950 truncate leading-tight">
                        {currentTrack.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-rose-600/60 truncate leading-tight">
                        {currentTrack.artist}
                    </p>
                </div>

                {/* Time */}
                <span className="text-[9px] sm:text-[10px] text-rose-400 tabular-nums font-medium hidden sm:block">
                    {formatTime(progress)} / {formatTime(duration)}
                </span>

                {/* Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                        onClick={prev}
                        className="p-1.5 text-rose-400 hover:text-rose-600 active:scale-90 transition-all"
                    >
                        <SkipBack className="w-4 h-4 fill-current" />
                    </button>

                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={toggle}
                        className={cn(
                            "p-2 rounded-full transition-all shadow-sm relative",
                            isPlaying
                                ? "bg-rose-500 text-white shadow-rose-300/50"
                                : "bg-rose-100 text-rose-600"
                        )}
                    >
                        {/* Pulse ring when autoplay failed */}
                        {autoplayFailed && !isPlaying && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-rose-400/40" />
                        )}
                        {isPlaying
                            ? <Pause className="w-4 h-4 fill-current" />
                            : <Play className="w-4 h-4 fill-current" />
                        }
                    </motion.button>

                    <button
                        onClick={next}
                        className="p-1.5 text-rose-400 hover:text-rose-600 active:scale-90 transition-all"
                    >
                        <SkipForward className="w-4 h-4 fill-current" />
                    </button>
                </div>

                {/* Volume (desktop only) */}
                <div className="hidden sm:flex items-center gap-1.5 ml-1">
                    <Volume2 className="w-3.5 h-3.5 text-rose-300" />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-16 h-1 accent-rose-500 cursor-pointer"
                    />
                </div>
            </div>
        </motion.div>
    );
}
