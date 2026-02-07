import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Mail, Gift } from 'lucide-react';
import TimelineSection from './TimelineSection';
import InteractiveLetter from './InteractiveLetter';
import FlowerBurst from './FlowerBurst';
import useSound from '../hooks/useSound';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'memories' | 'letter' | 'foryou';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('memories');
    const playSound = useSound();
    const { t } = useLanguage();

    const handleTabChange = (tab: Tab) => {
        if (activeTab !== tab) {
            playSound('plop');
            setActiveTab(tab);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-transparent relative overflow-hidden">
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
                            className="h-full w-full flex items-center justify-center p-4"
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
                            className="h-full w-full flex items-center justify-center p-4"
                        >
                            <FlowerBurst />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation Bar - Expert Design Refinement */}
            <div className="h-24 bg-white/80 backdrop-blur-2xl border-t border-rose-100/50 flex items-center justify-around px-6 pb-6 pt-2 shadow-[0_-20px_40px_-15px_rgba(251,113,133,0.15)] z-50 rounded-t-[32px] mx-2 mb-2">
                <NavButton
                    active={activeTab === 'memories'}
                    onClick={() => handleTabChange('memories')}
                    icon={<Image className={cn("w-6 h-6", activeTab === 'memories' && "fill-rose-500")} />}
                    label={t('nav.memories')}
                />
                <NavButton
                    active={activeTab === 'letter'}
                    onClick={() => handleTabChange('letter')}
                    icon={<Mail className={cn("w-6 h-6", activeTab === 'letter' && "fill-rose-500")} />}
                    label={t('nav.letter')}
                />
                <NavButton
                    active={activeTab === 'foryou'}
                    onClick={() => handleTabChange('foryou')}
                    icon={<Gift className={cn("w-6 h-6", activeTab === 'foryou' && "fill-rose-500")} />}
                    label={t('nav.foryou')}
                />
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode, label?: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 relative group",
                active ? "text-rose-500" : "text-rose-300/70 hover:text-rose-400"
            )}
        >
            <div className={cn(
                "p-3 rounded-2xl transition-all duration-300 transform",
                active ? "bg-rose-50 shadow-sm scale-110 translate-y-[-2px]" : "bg-transparent group-hover:bg-rose-50/50"
            )}>
                {icon}
            </div>
            {active && (
                <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-2 w-1 h-1 bg-rose-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </button>
    );
}
