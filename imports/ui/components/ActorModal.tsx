import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActorContext } from "../context/ActorContext";
import MovieCard from "./MovieCard";
import { fetchActorCredits } from "../services/api";
import { Movie } from "/imports/api/types";

export default function ActorModal() {
    const { selectedActor, closeActor } = useActorContext();
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedActor) {
            setLoading(true);
            fetchActorCredits(selectedActor.id)
                .then(setAllMovies)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setAllMovies([]);
        }
    }, [selectedActor]);

    if (!selectedActor) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeActor}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    layoutId={`actor-${selectedActor.id}`}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-6xl h-[85vh] bg-[#080808] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button
                        onClick={closeActor}
                        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* LEFT SIDE: Image */}
                    <div className="w-full md:w-[40%] relative bg-black flex flex-col">
                        <div className="relative w-full h-full">
                            {selectedActor.profile_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${selectedActor.profile_path}`}
                                    alt={selectedActor.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#080808]/50" />
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content */}
                    <div className="w-full md:w-[60%] flex flex-col h-[50vh] md:h-full border-l border-white/5 bg-[#080808]">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">

                            {/* Header */}
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-none tracking-tight">
                                    {selectedActor.name}
                                </h2>
                                {selectedActor.place_of_birth && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 text-xs font-bold bg-white/10 text-white border border-white/10 rounded-full uppercase tracking-wider">
                                            {selectedActor.place_of_birth.split(',').pop()?.trim()} Actor
                                        </span>
                                    </div>
                                )}
                            </div>

                            <hr className="border-white/5" />

                            {/* Known For Grid */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                    Filmography ({loading ? "..." : allMovies.length})
                                </h3>

                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {allMovies.map((movie) => (
                                            <MovieCard key={movie.id} movie={movie} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}