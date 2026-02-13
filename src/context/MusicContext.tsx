import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ───────── Types ───────── */
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export interface Track {
    id: string;
    videoId: string;
    title: string;
    artist: string;
}

interface MusicContextType {
    tracks: Track[];
    currentTrack: Track | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    volume: number;
    playerReady: boolean;
    play: (track?: Track) => void;
    pause: () => void;
    toggle: () => void;
    next: () => void;
    prev: () => void;
    setVolume: (v: number) => void;
    seekTo: (seconds: number) => void;
    selectTrack: (track: Track) => void;
    startAutoplay: () => void;
}

/* ───────── Track list ───────── */
export const TRACKS: Track[] = [
    { id: '1', videoId: 'jU3rsWxvm-U', title: 'Mai mult de-o viață', artist: 'Smiley' },
    { id: '2', videoId: 'UWDRn0soLQI', title: 'Pentru Totdeauna', artist: 'Trupa Zero' },
    { id: '3', videoId: 'uiNwD3WIpuo', title: 'O viață și încă o zi', artist: 'Cipri Popescu' },
    { id: '4', videoId: 'RSLcimvjbbE', title: 'Cel puțin o veșnicie', artist: 'Cleopatra Stratan & Edward Sanda' },
];

const DEFAULT_VOLUME = 15; // Low volume out of 100

/* ───────── Context ───────── */
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    const [apiReady, setApiReady] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
    const playerRef = useRef<any>(null);
    const progressInterval = useRef<number | null>(null);
    const pendingAutoplay = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setApiReady(true);
            return;
        }
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            setApiReady(true);
        };
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }, []);

    // Create YT Player when API is ready
    useEffect(() => {
        if (!apiReady || playerRef.current) return;

        playerRef.current = new window.YT.Player('yt-hidden-player', {
            height: '1',
            width: '1',
            host: 'https://www.youtube-nocookie.com',
            videoId: TRACKS[0].videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                iv_load_policy: 3,
                origin: window.location.origin,
            },
            events: {
                onReady: (event: any) => {
                    event.target.setVolume(DEFAULT_VOLUME);
                    setPlayerReady(true);
                    setCurrentTrack(TRACKS[0]);
                    if (pendingAutoplay.current) {
                        pendingAutoplay.current = false;
                        event.target.playVideo();
                    }
                },
                onStateChange: (event: any) => {
                    const state = event.data;
                    if (state === window.YT.PlayerState.PLAYING) {
                        setIsPlaying(true);
                        setDuration(playerRef.current?.getDuration?.() || 0);
                        startProgressTracking();
                    } else if (state === window.YT.PlayerState.PAUSED) {
                        setIsPlaying(false);
                        stopProgressTracking();
                    } else if (state === window.YT.PlayerState.ENDED) {
                        // Auto-next
                        nextTrack();
                    }
                },
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiReady]);

    const startProgressTracking = useCallback(() => {
        stopProgressTracking();
        progressInterval.current = window.setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                setProgress(playerRef.current.getCurrentTime());
                setDuration(playerRef.current.getDuration() || 0);
            }
        }, 500);
    }, []);

    const stopProgressTracking = useCallback(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    }, []);

    useEffect(() => () => stopProgressTracking(), [stopProgressTracking]);

    /* ───────── Controls ───────── */
    const play = useCallback((track?: Track) => {
        const p = playerRef.current;
        if (!p) return;
        if (track) {
            p.loadVideoById(track.videoId);
            setCurrentTrack(track);
        } else {
            p.playVideo();
        }
    }, []);

    const pause = useCallback(() => {
        playerRef.current?.pauseVideo();
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) pause();
        else play();
    }, [isPlaying, play, pause]);

    const nextTrack = useCallback(() => {
        const idx = TRACKS.findIndex(t => t.videoId === currentTrack?.videoId);
        const next = TRACKS[(idx + 1) % TRACKS.length];
        play(next);
    }, [currentTrack, play]);

    const prevTrack = useCallback(() => {
        const idx = TRACKS.findIndex(t => t.videoId === currentTrack?.videoId);
        const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
        play(prev);
    }, [currentTrack, play]);

    const setVolume = useCallback((v: number) => {
        setVolumeState(v);
        playerRef.current?.setVolume(v);
    }, []);

    const seekTo = useCallback((seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
    }, []);

    const selectTrack = useCallback((track: Track) => {
        play(track);
    }, [play]);

    const startAutoplay = useCallback(() => {
        if (playerReady && playerRef.current) {
            setCurrentTrack(TRACKS[0]);
            // Just play — the video is already cued from init, no need to reload
            playerRef.current.playVideo();
        } else {
            pendingAutoplay.current = true;
        }
    }, [playerReady]);

    return (
        <MusicContext.Provider value={{
            tracks: TRACKS,
            currentTrack,
            isPlaying,
            progress,
            duration,
            volume,
            playerReady,
            play,
            pause,
            toggle,
            next: nextTrack,
            prev: prevTrack,
            setVolume,
            seekTo,
            selectTrack,
            startAutoplay,
        }}>
            {/* Hidden YouTube player container */}
            <div
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: -100,
                    left: -100,
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1,
                }}
            >
                <div id="yt-hidden-player" />
            </div>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within MusicProvider');
    return context;
}
