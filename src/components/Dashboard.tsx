import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Mail, Gift, Music } from 'lucide-react';
import TimelineSection from './TimelineSection';
import InteractiveLetter from './InteractiveLetter';
import FlowerBurst from './FlowerBurst';
import PlaylistPage from './PlaylistPage';
import MusicPlayer from './MusicPlayer';
import useSound from '../hooks/useSound';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useMusic } from '../context/MusicContext';

type Tab = 'memories' | 'letter' | 'foryou' | 'playlist';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('memories');
    const playSound = useSound();
    const { t } = useLanguage();
    const { currentTrack } = useMusic();

    const handleTabChange = (tab: Tab) => {
        if (activeTab !== tab) {
            playSound('plop');
            setActiveTab(tab);
        }
    };

    return (
        <div className="flex flex-col h-dvh w-full bg-transparent relative overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'memories' && (
                        <motion.div
                            key="memories"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full"
                        >
                            <TimelineSection />
                        </motion.div>
                    )}

                    {activeTab === 'letter' && (
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full flex items-center justify-center px-4 py-6"
                        >
                            <InteractiveLetter onOpen={() => { }} />
                        </motion.div>
                    )}

                    {activeTab === 'foryou' && (
                        <motion.div
                            key="foryou"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full flex items-center justify-center px-4 py-6"
                        >
                            <FlowerBurst />
                        </motion.div>
                    )}

                    {activeTab === 'playlist' && (
                        <motion.div
                            key="playlist"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full"
                        >
                            <PlaylistPage />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Music Player (shows when a track is loaded) */}
            {currentTrack && <MusicPlayer />}

            {/* Bottom Navigation Bar */}
            <div className="flex-shrink-0 bg-white/75 backdrop-blur-2xl border-t border-rose-100/40 flex items-center justify-around px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-8px_rgba(180,120,80,0.12)] z-50">
                <NavButton
                    active={activeTab === 'memories'}
                    onClick={() => handleTabChange('memories')}
                    icon={<Image className="w-[22px] h-[22px]" />}
                    label={t('nav.memories')}
                />
                <NavButton
                    active={activeTab === 'letter'}
                    onClick={() => handleTabChange('letter')}
                    icon={<Mail className="w-[22px] h-[22px]" />}
                    label={t('nav.letter')}
                />
                <NavButton
                    active={activeTab === 'foryou'}
                    onClick={() => handleTabChange('foryou')}
                    icon={<Gift className="w-[22px] h-[22px]" />}
                    label={t('nav.foryou')}
                />
                <NavButton
                    active={activeTab === 'playlist'}
                    onClick={() => handleTabChange('playlist')}
                    icon={<Music className="w-[22px] h-[22px]" />}
                    label={t('nav.playlist')}
                />
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[48px] py-1.5 transition-all duration-300 relative group rounded-2xl active:scale-95",
                active ? "text-rose-600" : "text-rose-400/50 hover:text-rose-400"
            )}
        >
            {/* Active pill background */}
            {active && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-rose-100/50 rounded-2xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
            )}

            <div className={cn(
                "relative z-10 p-1 transition-all duration-300",
                active && "transform scale-110"
            )}>
                {icon}
            </div>

            <span className={cn(
                "relative z-10 text-[9px] sm:text-[10px] font-semibold tracking-wide transition-all duration-300 leading-none",
                active ? "text-rose-600" : "text-rose-400/40"
            )}>
                {label}
            </span>
        </button>
    );
}
