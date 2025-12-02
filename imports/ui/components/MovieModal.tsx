import React from "react";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import YouTube from "react-youtube";
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useMovieContext } from "../context/MovieContext";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { useActorContext } from "../context/ActorContext";
import { UserInteractionsCollection } from '../../api/Collections';
import { fetchCast, fetchSimilar } from "../services/api";
import { Movie } from '../../api/types';
import WatchLaterModal from '/imports/ui/components/WatchLaterModal';

const IMG = "https://image.tmdb.org/t/p/w300";
const BACKDROP = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";

export default function MovieModal() {
    const { selectedMovie, closeMovie, getTrailerKey, openMovie, favorites, addToFavorites, removeFromFavorites } = useMovieContext();
    const { getItemByMovieId, addToWatchLater, removeFromWatchLater } = useWatchLaterContext();
    const { openActor } = useActorContext();

    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [cast, setCast] = useState<any[]>([]);
    const [similar, setSimilar] = useState<Movie[]>([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isWatchLaterModalOpen, setIsWatchLaterModalOpen] = useState(false);

    const interaction = useTracker(() => {
        if (!selectedMovie) return null;
        Meteor.subscribe('userInteractions');
        return UserInteractionsCollection.findOne({ movieId: selectedMovie.id });
    });

    const handleRating = (rating: number) => {
        if (!selectedMovie) return;
        Meteor.call('user.interact', {
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            posterPath: selectedMovie.poster_path,
            releaseDate: selectedMovie.release_date,
            rating
        });
    };

    const toggleWatched = () => {
        if (!selectedMovie) return;
        Meteor.call('user.interact', {
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            posterPath: selectedMovie.poster_path,
            releaseDate: selectedMovie.release_date,
            isWatched: !interaction?.isWatched
        });
    };

    const handleReview = (review: string) => {
        if (!selectedMovie) return;
        Meteor.call('user.interact', {
            movieId: selectedMovie.id,
            movieTitle: selectedMovie.title,
            posterPath: selectedMovie.poster_path,
            releaseDate: selectedMovie.release_date,
            review
        });
    };

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
    const isFavorite = favorites.some((fav) => fav.id === selectedMovie.id);

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
                        className="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-[#080808]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(106,0,244,0.2)] border border-white/10 flex flex-col md:flex-row"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button (Floating) */}
                        <button
                            onClick={closeMovie}
                            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#D2FF00] hover:text-black transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* LEFT SIDE: Media / Trailer */}
                        <div className="w-full md:w-[65%] relative bg-black flex flex-col shrink-0">
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
                                                iframeClassName="w-full h-full object-cover scale-[1.8] md:scale-[1.35]"
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
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D2FF00] opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D2FF00]"></span>
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
                        <div className="w-full md:w-[35%] flex flex-col flex-1 md:h-full border-l border-white/5 bg-[#080808] overflow-hidden">
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">

                                {/* Title Block */}
                                <div className="space-y-4">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-none tracking-tight">
                                        {selectedMovie.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-2 py-1 text-[10px] font-bold bg-[#D2FF00]/10 text-[#D2FF00] border border-[#D2FF00]/20 rounded-none uppercase tracking-wider">
                                            {Math.round((selectedMovie.vote_average ?? 0) * 10)}% Match
                                        </span>
                                        <span className="text-xs text-zinc-400 font-medium border border-zinc-800 px-2 py-1 rounded-none">
                                            {selectedMovie.release_date?.split('-')[0]}
                                        </span>
                                        <span className="text-xs text-zinc-400 font-medium border border-zinc-800 px-2 py-1 rounded-none uppercase">
                                            {selectedMovie.original_language}
                                        </span>
                                    </div>

                                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
                                        {selectedMovie.overview}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">


                                        <button
                                            onClick={() => {
                                                if (isWatchLater && watchLaterItem) {
                                                    removeFromWatchLater(watchLaterItem.id);
                                                } else {
                                                    addToWatchLater(selectedMovie, {
                                                        status: "To-Watch",
                                                        priority: "Medium",
                                                        tags: [],
                                                        reason: "",
                                                    });
                                                }
                                            }}
                                            className={`flex-1 py-3 px-4 font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider border overflow-hidden relative ${isWatchLater
                                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                                : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white'}`}
                                        >
                                            <AnimatePresence mode="wait" initial={false}>
                                                {isWatchLater ? (
                                                    <motion.div
                                                        key="added"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -20, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <motion.svg
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                                                            className="w-4 h-4 text-[#D2FF00] fill-current"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                        </motion.svg>
                                                        <span>Added</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="add"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -20, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                        <span>List</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => isFavorite ? removeFromFavorites(selectedMovie.id) : addToFavorites(selectedMovie)}
                                                className={`w-12 h-full flex items-center justify-center border transition-all ${isFavorite
                                                    ? 'bg-[#FF007A]/10 border-[#FF007A] text-[#FF007A]'
                                                    : 'bg-transparent border-white/20 text-zinc-400 hover:text-white hover:border-white'}`}
                                                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={toggleWatched}
                                                className={`w-12 h-full flex items-center justify-center border transition-all ${interaction?.isWatched
                                                    ? 'bg-[#D2FF00]/10 border-[#D2FF00] text-[#D2FF00]'
                                                    : 'bg-transparent border-white/20 text-zinc-400 hover:text-white hover:border-white'}`}
                                                title={interaction?.isWatched ? "Marked as Watched" : "Mark as Watched"}
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-white/5" />

                                {/* Cast - MOVED UP */}
                                {cast.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 bg-[#D2FF00] rounded-full"></span>
                                            Starring
                                        </h3>
                                        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mask-linear-fade">
                                            {cast.slice(0, 10).map(actor => (
                                                <div
                                                    key={actor.id}
                                                    onClick={() => {
                                                        closeMovie();
                                                        openActor(actor as any);
                                                    }}
                                                    className="flex-shrink-0 w-20 group cursor-pointer"
                                                >
                                                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 group-hover:border-[#D2FF00] transition-colors mb-2">
                                                        {actor.profile_path ? (
                                                            <img src={IMG + actor.profile_path} className="w-full h-full object-cover" alt={actor.name} />
                                                        ) : (
                                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-600">N/A</div>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-center text-zinc-400 group-hover:text-white truncate">{actor.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Similar Grid - MOVED UP */}
                                {similar.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 bg-[#D2FF00] rounded-full"></span>
                                            More Like This
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {similar.map((m) => (
                                                <div
                                                    key={m.id}
                                                    onClick={() => openMovie(m)}
                                                    className="aspect-[2/3] relative rounded-none overflow-hidden cursor-pointer group border border-white/5 hover:border-[#D2FF00] transition-colors"
                                                >
                                                    <img
                                                        src={m.poster_path ? POSTER + m.poster_path : BACKDROP + m.backdrop_path}
                                                        alt={m.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-60"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <hr className="border-white/5" />

                                {/* User Interactions (Rating & Review) - MOVED DOWN */}
                                <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Review</h3>
                                        <span className="text-xs text-zinc-500">{interaction?.updatedAt ? new Date(interaction.updatedAt).toLocaleDateString() : 'Not reviewed yet'}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRating(star)}
                                                className={`text-xl transition-transform hover:scale-125 ${(interaction?.rating || 0) >= star ? 'text-[#D2FF00]' : 'text-zinc-700 hover:text-[#D2FF00]/50'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                        <span className="ml-3 text-lg font-bold text-white tabular-nums">{interaction?.rating || 0}<span className="text-zinc-600 text-sm">/10</span></span>
                                    </div>

                                    {/* Review Text */}
                                    <textarea
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D2FF00]/50 focus:ring-1 focus:ring-[#D2FF00]/20 transition-all resize-none"
                                        rows={3}
                                        placeholder="Write your thoughts..."
                                        defaultValue={interaction?.review || ''}
                                        onBlur={(e) => handleReview(e.target.value)}
                                    />
                                </div>
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