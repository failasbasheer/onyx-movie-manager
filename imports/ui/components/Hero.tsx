import React, { useState, useEffect, useRef } from "react";
import { Movie } from "/imports/api/types";
import { useMovieContext } from "../context/MovieContext";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { motion, AnimatePresence } from "framer-motion";
import WatchLaterModal from "/imports/ui/components/WatchLaterModal";
import YouTube from "react-youtube";

interface HeroProps {
    movie: Movie | null;
}

export default function Hero({ movie }: HeroProps) {
    const { openMovie, getTrailerKey } = useMovieContext();
    const { getItemByMovieId, addToWatchLater } = useWatchLaterContext();

    const [isWatchLaterModalOpen, setIsWatchLaterModalOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [userSkipped, setUserSkipped] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset state when movie changes
    useEffect(() => {
        if (!movie) return;

        setTrailerKey(null);
        setShowTrailer(false);
        setUserSkipped(false);

        if (timerRef.current) clearTimeout(timerRef.current);

        // Fetch trailer
        getTrailerKey(movie.id).then(key => {
            if (key) {
                setTrailerKey(key);
                // Start timer only if we have a trailer
                timerRef.current = setTimeout(() => {
                    setShowTrailer(true);
                }, 5000);
            }
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [movie?.id, getTrailerKey]);

    // If user skips, ensure we don't auto-play again for this movie session
    const handleSkip = () => {
        setShowTrailer(false);
        setUserSkipped(true);
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    if (!movie) {
        return <div className="h-screen w-full bg-[#050505]" />;
    }

    const watchLaterItem = getItemByMovieId(movie.id);
    const isWatchLater = !!watchLaterItem;

    return (
        <div className="relative h-screen w-full overflow-hidden group">
            {/* Background Media */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    {showTrailer && trailerKey && !userSkipped ? (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <YouTube
                                videoId={trailerKey}
                                opts={{
                                    width: '100%',
                                    height: '100%',
                                    playerVars: {
                                        autoplay: 1,
                                        controls: 0,
                                        modestbranding: 1,
                                        loop: 1,
                                        playlist: trailerKey,
                                        mute: 1 // Autoplay usually requires mute
                                    }
                                }}
                                className="w-full h-full"
                                iframeClassName="w-full h-full object-cover scale-[3.5] md:scale-[1.35] pointer-events-none"
                                onEnd={handleSkip} // Go back to image when video ends
                            />
                            {/* Overlay to prevent interaction with iframe */}
                            <div className="absolute inset-0 bg-transparent" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                alt={movie.title}
                                className="h-full w-full object-cover opacity-60"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Cinematic Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none transition-opacity duration-1000 ${showTrailer && !userSkipped ? 'opacity-40' : 'opacity-100'}`} />
            <div className={`absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent pointer-events-none transition-opacity duration-1000 ${showTrailer && !userSkipped ? 'opacity-40' : 'opacity-100'}`} />

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Skip Button - Only visible when trailer is playing */}
            <AnimatePresence>
                {showTrailer && !userSkipped && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={handleSkip}
                        className="absolute bottom-32 right-8 z-50 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold tracking-wide hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        SKIP TRAILER
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 w-full pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl space-y-6 pointer-events-auto"
                    >
                        {/* Meta Tags */}
                        <div className={`flex items-center gap-3 transition-opacity duration-1000 ${showTrailer && !userSkipped ? 'opacity-60' : 'opacity-100'}`}>
                            <span className="px-2 py-1 bg-[#D2FF00]/10 border border-[#D2FF00]/50 text-[10px] font-bold tracking-widest uppercase text-[#D2FF00] rounded-sm">
                                Trending
                            </span>
                            <span className="flex items-center gap-1 text-[#D2FF00] text-sm font-medium">
                                ★ {movie.vote_average?.toFixed(1)}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-6xl md:text-8xl font-serif font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl transition-all duration-1000 ${showTrailer && !userSkipped ? 'opacity-60 scale-90 origin-left' : 'opacity-100 scale-100'}`}>
                            {movie.title}
                        </h1>

                        {/* Overview */}
                        <p className={`text-lg md:text-xl text-zinc-300/90 line-clamp-3 leading-relaxed max-w-2xl font-light transition-all duration-1000 ${showTrailer && !userSkipped ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                            {movie.overview}
                        </p>

                        {/* Actions */}
                        <div className={`flex items-center gap-4 pt-4 transition-all duration-1000 ${showTrailer && !userSkipped ? 'opacity-80' : 'opacity-100'}`}>
                            <button
                                onClick={() => openMovie(movie)}
                                className="group relative px-8 py-4 bg-[#D2FF00] text-black font-black tracking-wide rounded-none overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(210,255,0,0.4)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    WATCH NOW
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    if (isWatchLater) {
                                        setIsWatchLaterModalOpen(true);
                                    } else {
                                        addToWatchLater(movie, {
                                            status: "To-Watch",
                                            priority: "Medium",
                                            tags: [],
                                            reason: "",
                                        });
                                    }
                                }}
                                className={`px-8 py-4 backdrop-blur-md border font-bold tracking-wide rounded-none transition-all flex items-center gap-2 ${isWatchLater
                                    ? "bg-zinc-800/80 border-zinc-600 text-white hover:bg-zinc-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-[#D2FF00] hover:text-[#D2FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.2)]"
                                    }`}
                            >
                                {isWatchLater ? (
                                    <>
                                        <svg className="w-5 h-5 text-[#D2FF00] fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        ADDED TO LIST
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        ADD TO WATCH LATER
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Watch Later Modal */}
            <WatchLaterModal
                isOpen={isWatchLaterModalOpen}
                onClose={() => setIsWatchLaterModalOpen(false)}
                movie={movie}
                existingItem={watchLaterItem}
            />
        </div>
    );
}