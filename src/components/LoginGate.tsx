import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ACCESS_CODE = '21022025';
const LS_KEY = 'smallgift_auth';

interface LoginGateProps {
    onSuccess: () => void;
}

export default function LoginGate({ onSuccess }: LoginGateProps) {
    const { t } = useLanguage();
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus the input on mount
        setTimeout(() => inputRef.current?.focus(), 400);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (code.trim() === ACCESS_CODE) {
            setError(false);
            setSuccess(true);
            // Store auth in localStorage
            localStorage.setItem(
                LS_KEY,
                JSON.stringify({
                    authenticated: true,
                    timestamp: new Date().toISOString(),
                    code: '***',
                })
            );
            // Delay before transitioning so the success animation plays
            setTimeout(() => {
                onSuccess();
            }, 1200);
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const val = e.target.value.replace(/\D/g, '');
        setCode(val);
        if (error) setError(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center px-4 py-6 z-10"
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                className="w-full max-w-sm"
            >
                {/* Card */}
                <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/20 shadow-2xl shadow-black/10">
                    {/* Decorative top emoji */}
                    <motion.div
                        className="text-5xl sm:text-6xl text-center mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        💕
                    </motion.div>

                    {/* Question */}
                    <h1 className="text-center font-display text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
                        {t('login.question')}
                    </h1>

                    {/* Hint emoji row */}
                    <p className="text-center text-sm text-white/60 mb-6">
                        {t('login.hint')} 💍✨
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Code Input */}
                        <motion.div
                            animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <input
                                ref={inputRef}
                                id="otp-input"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={8}
                                value={code}
                                onChange={handleChange}
                                placeholder={t('login.placeholder')}
                                autoComplete="off"
                                className={`
                  w-full text-center text-2xl sm:text-3xl tracking-[0.35em] font-bold
                  bg-white/10 backdrop-blur-sm
                  border-2 ${error ? 'border-red-400/80' : 'border-white/25'}
                  rounded-2xl px-4 py-4
                  text-white placeholder:text-white/30
                  focus:outline-none focus:border-rose-400/70 focus:ring-4 focus:ring-rose-400/20
                  transition-all duration-300
                `}
                            />
                        </motion.div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="text-center text-sm font-medium text-red-300"
                                >
                                    😢 {t('login.error')}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={code.length === 0 || success}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`
                w-full py-3.5 rounded-2xl font-bold text-base sm:text-lg
                transition-all duration-300 cursor-pointer
                ${success
                                    ? 'bg-green-500/80 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-40 disabled:cursor-not-allowed'
                                }
              `}
                        >
                            {success ? (
                                <span className="flex items-center justify-center gap-2">
                                    ✅ {t('login.success')}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    🔓 {t('login.submit')}
                                </span>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer emoji */}
                    <p className="text-center text-xs text-white/40 mt-6">
                        {t('login.footer')} 💖
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export { LS_KEY };
