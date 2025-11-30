// /imports/ui/components/MovieModal.tsx

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import YouTube from "react-youtube";
import { useMovieContext } from "../context/MovieContext";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { useActorContext } from "../context/ActorContext";
import { fetchCast, fetchSimilar } from "../services/api";
import { Movie } from "/imports/api/types";
import WatchLaterModal from "./WatchLaterModal";

const IMG = "https://image.tmdb.org/t/p/w300";
const BACKDROP = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";

export default function MovieModal() {
    const { selectedMovie, closeMovie, getTrailerKey, openMovie } = useMovieContext();
    const { getItemByMovieId, addToWatchLater } = useWatchLaterContext();
    const { openActor } = useActorContext();

    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [cast, setCast] = useState<any[]>([]);
    const [similar, setSimilar] = useState<Movie[]>([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isWatchLaterModalOpen, setIsWatchLaterModalOpen] = useState(false);

    // Fetch data when movie changes
    useEffect(() => {
        if (!selectedMovie) {
            setTrailerKey(null);
            setCast([]);
            setSimilar([]);
            setShowTrailer(false);
            return;
        }

        getTrailerKey(selectedMovie.id)
            .then(setTrailerKey)
            .catch(console.error);

        fetchCast(selectedMovie.id)
            .then((c) => setCast(Array.isArray(c) ? c.slice(0, 10) : []))
            .catch(console.error);

        fetchSimilar(selectedMovie.id)
            .then((m) => setSimilar(Array.isArray(m) ? m.slice(0, 6) : [])) // Limit to 6 for cleaner grid
            .catch(console.error);
    }, [selectedMovie, getTrailerKey]);

    if (!selectedMovie) return null;

    const watchLaterItem = getItemByMovieId(selectedMovie.id);
    const isWatchLater = !!watchLaterItem;

    return (
        <AnimatePresence mode="wait">
            {selectedMovie && (
                <motion.div
                    key="modal-overlay"
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 1. Blurred Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
                        onClick={closeMovie}
                    />

                    {/* 2. Modal Container */}
                    <motion.div
                        className="relative w-full max-w-6xl h-[85vh] bg-[#080808] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col md:flex-row"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button (Floating) */}
                        <button
                            onClick={closeMovie}
                            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* LEFT SIDE: Media / Trailer */}
                        <div className="w-full md:w-[65%] relative bg-black flex flex-col">
                            <div
                                className="relative w-full aspect-video md:aspect-auto md:h-full cursor-pointer group overflow-hidden"
                                onMouseEnter={() => trailerKey && setShowTrailer(true)}
                                onMouseLeave={() => setShowTrailer(false)}
                            >
                                <AnimatePresence mode="wait">
                                    {showTrailer && trailerKey ? (
                                        <motion.div
                                            key="video"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black"
                                        >
                                            <YouTube
                                                videoId={trailerKey}
                                                opts={{
                                                    width: '100%',
                                                    height: '100%',
                                                    playerVars: { autoplay: 1, controls: 0, modestbranding: 1, loop: 1, playlist: trailerKey }
                                                }}
                                                className="w-full h-full"
                                                iframeClassName="w-full h-full object-cover scale-[1.35]"
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="image"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0"
                                        >
                                            <img
                                                src={selectedMovie.backdrop_path ? BACKDROP + selectedMovie.backdrop_path : POSTER + selectedMovie.poster_path}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                                                alt="Backdrop"
                                            />
                                            {/* Play Icon Overlay */}
                                            {/* Play Icon Overlay */}
                                            {trailerKey && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                                        <svg className="w-8 h-8 text-white fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Trailer Status Indicator (Fades out on hover) */}
                                            <div className="absolute top-4 left-4 z-20 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                                                {trailerKey ? (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">Trailer Available</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                                        <div className="h-2 w-2 rounded-full bg-zinc-500" />
                                                        <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">No Trailer</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Bottom Gradient for Mobile Text Integration */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808] to-transparent md:hidden" />
                            </div>
                        </div>

                        {/* RIGHT SIDE: Info & Details */}
                        <div className="w-full md:w-[35%] flex flex-col h-[50vh] md:h-full border-l border-white/5 bg-[#080808]">
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">

                                {/* Title Block */}
                                <div className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-none tracking-tight">
                                        {selectedMovie.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-2 py-1 text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 rounded uppercase tracking-wider">
                                            {Math.round((selectedMovie.vote_average ?? 0) * 10)}% Match
                                        </span>
                                        <span className="text-xs text-zinc-400 font-medium border border-zinc-800 px-2 py-1 rounded">
                                            {selectedMovie.release_date?.split('-')[0]}
                                        </span>
                                        <span className="text-xs text-zinc-400 font-medium border border-zinc-800 px-2 py-1 rounded uppercase">
                                            {selectedMovie.original_language}
                                        </span>
                                    </div>

                                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
                                        {selectedMovie.overview}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button className="flex-1 bg-white text-black py-3 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            Play Now
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (isWatchLater) {
                                                    setIsWatchLaterModalOpen(true);
                                                } else {
                                                    addToWatchLater(selectedMovie, {
                                                        status: "To-Watch",
                                                        priority: "Medium",
                                                        tags: [],
                                                        reason: "",
                                                    });
                                                }
                                            }}
                                            className={`flex-1 border py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isWatchLater ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-white/20 hover:bg-white/5 text-white'}`}
                                        >
                                            {isWatchLater ? (
                                                <>
                                                    <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                                    Added
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                    Watch Later
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-white/5" />

                                {/* Cast */}
                                {cast.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Starring</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cast.slice(0, 6).map(actor => (
                                                <div
                                                    key={actor.id}
                                                    onClick={() => {
                                                        closeMovie();
                                                        openActor(actor as any);
                                                    }}
                                                    className="flex items-center gap-2 bg-white/5 pr-3 rounded-full border border-white/5 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                                                >
                                                    {actor.profile_path ? (
                                                        <img src={IMG + actor.profile_path} className="w-8 h-8 object-cover" alt={actor.name} />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-zinc-800" />
                                                    )}
                                                    <span className="text-xs text-zinc-300 py-1">{actor.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Similar Grid */}
                                {similar.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">More Like This</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {similar.map((m) => (
                                                <div
                                                    key={m.id}
                                                    onClick={() => openMovie(m)}
                                                    className="aspect-[2/3] relative rounded-lg overflow-hidden cursor-pointer group"
                                                >
                                                    <img
                                                        src={m.poster_path ? POSTER + m.poster_path : BACKDROP + m.backdrop_path}
                                                        alt={m.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
                                                            <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </motion.div>

                    {/* Watch Later Modal */}
                    <WatchLaterModal
                        isOpen={isWatchLaterModalOpen}
                        onClose={() => setIsWatchLaterModalOpen(false)}
                        movie={selectedMovie}
                        existingItem={watchLaterItem}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}