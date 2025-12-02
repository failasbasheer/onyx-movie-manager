import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { WatchLaterStatus, WatchLaterItem } from "/imports/api/types";
import WatchLaterModal from "/imports/ui/components/WatchLaterModal";
import { Movie } from "/imports/api/types";
import Footer from "../components/Footer";

const STATUS_GROUPS: { status: WatchLaterStatus; label: string }[] = [
    { status: "To-Watch", label: "To Watch" },
    { status: "Watching", label: "Watching" },
    { status: "Completed", label: "Completed" },
];

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function WatchLaterPage() {
    const { watchLater: items, removeFromWatchLater } = useWatchLaterContext();
    const [editingItem, setEditingItem] = useState<WatchLaterItem | null>(null);

    // Helper to reconstruct a minimal Movie object for the modal
    const getMovieFromItem = (item: WatchLaterItem): Movie => ({
        id: item.movieId,
        title: item.movieTitle,
        poster_path: item.posterPath,
        overview: "", // Not needed for edit
        release_date: "", // Not needed for edit
    });

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Watch Later</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Your personal curated list of movies. Track what you want to see, what you're watching, and what you've finished.
                    </p>
                </header>

                <div className="space-y-16">
                    {STATUS_GROUPS.map((group) => {
                        const groupItems = items.filter((item) => item.status === group.status);

                        if (groupItems.length === 0) return null;

                        return (
                            <section key={group.status}>
                                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-bold">{group.label}</h2>
                                    <span className="bg-white/10 text-zinc-400 text-xs px-2 py-1 rounded-full">
                                        {groupItems.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-none overflow-hidden hover:border-[#D2FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.2)] transition-all group"
                                        >
                                            <div className="flex h-48">
                                                {/* Poster */}
                                                <div className="w-32 flex-shrink-0 relative">
                                                    <img
                                                        src={IMG_BASE + item.posterPath}
                                                        alt={item.movieTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-2 left-2">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-wider border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${item.priority === 'High' ? 'bg-[#FF007A] text-white border-[#FF007A]' :
                                                            item.priority === 'Medium' ? 'bg-[#D2FF00] text-black border-[#D2FF00]' :
                                                                'bg-white text-black border-white'
                                                            }`}>
                                                            {item.priority}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 p-4 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-white group-hover:text-[#D2FF00] transition-colors">
                                                            {item.movieTitle}
                                                        </h3>

                                                        {item.mood && (
                                                            <div className="mb-2">
                                                                <span className="text-[10px] text-zinc-300 bg-white/10 border border-white/20 px-2 py-0.5 rounded-none uppercase">
                                                                    {item.mood}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {item.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                {item.tags.slice(0, 3).map(tag => (
                                                                    <span key={tag} className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded-none">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {item.tags.length > 3 && (
                                                                    <span className="text-[10px] text-zinc-500 px-1.5 py-0.5">
                                                                        +{item.tags.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                        <button
                                                            onClick={() => setEditingItem(item)}
                                                            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromWatchLater(item.id)}
                                                            className="text-zinc-600 hover:text-[#FF007A] transition-colors"
                                                            title="Remove"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {item.reason && (
                                                <div className="px-4 pb-4 pt-2">
                                                    <p className="text-xs text-zinc-400 italic border-l-2 border-[#D2FF00]/30 pl-3 line-clamp-2">
                                                        "{item.reason}"
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}

                    {items.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-xl text-zinc-500">Your list is empty.</p>
                            <p className="text-sm text-zinc-600 mt-2">Start adding movies to track them here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <WatchLaterModal
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                    movie={getMovieFromItem(editingItem)}
                    existingItem={editingItem}
                />
            )}
        </div>
    );
}
