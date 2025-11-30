import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WatchLaterItem, WatchLaterStatus, WatchLaterPriority, WatchLaterMood, Movie } from "/imports/api/types";
import { useWatchLaterContext } from "../context/WatchLaterContext";

interface WatchLaterModalProps {
    isOpen: boolean;
    onClose: () => void;
    movie: Movie;
    existingItem?: WatchLaterItem;
}

const STATUS_OPTIONS: WatchLaterStatus[] = ["To-Watch", "Watching", "Completed"];
const PRIORITY_OPTIONS: WatchLaterPriority[] = ["High", "Medium", "Low"];
const MOOD_OPTIONS: WatchLaterMood[] = ["Happy", "Sad", "Excited", "Relaxed", "Scared", "Thoughtful"];
const SUGGESTED_TAGS = ["Sci-Fi", "Action", "Drama", "Comedy", "Thriller", "Romance", "Documentary", "Classic", "Indie"];

export default function WatchLaterModal({ isOpen, onClose, movie, existingItem }: WatchLaterModalProps) {
    const { addToWatchLater, updateWatchLaterItem } = useWatchLaterContext();

    const [status, setStatus] = useState<WatchLaterStatus>("To-Watch");
    const [priority, setPriority] = useState<WatchLaterPriority>("Medium");
    const [reason, setReason] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [mood, setMood] = useState<WatchLaterMood | undefined>(undefined);

    useEffect(() => {
        if (existingItem) {
            setStatus(existingItem.status);
            setPriority(existingItem.priority);
            setReason(existingItem.reason || "");
            setTags(existingItem.tags);
            setMood(existingItem.mood);
        } else {
            // Reset form
            setStatus("To-Watch");
            setPriority("Medium");
            setReason("");
            setTags([]);
            setMood(undefined);
        }
    }, [existingItem, isOpen]);

    const handleSave = () => {
        if (existingItem) {
            updateWatchLaterItem(existingItem.id, { status, priority, reason, tags, mood });
        } else {
            addToWatchLater(movie, { status, priority, reason, tags, mood });
        }
        onClose();
    };

    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-bold text-white mb-4">
                        {existingItem ? "Edit Watch Later" : "Add to Watch Later"}
                    </h2>

                    <div className="space-y-4">
                        {/* Status */}
                        <div>
                            <label className="block text-xs text-zinc-400 uppercase font-bold mb-2">Status</label>
                            <div className="flex gap-2">
                                {STATUS_OPTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${status === s ? "bg-white text-black" : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-xs text-zinc-400 uppercase font-bold mb-2">Priority</label>
                            <div className="flex gap-2">
                                {PRIORITY_OPTIONS.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${priority === p
                                                ? p === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                    : p === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-transparent"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-xs text-zinc-400 uppercase font-bold mb-2">Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                                placeholder="Why do you want to watch this?"
                                rows={2}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs text-zinc-400 uppercase font-bold mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(tag => (
                                    <span key={tag} className="bg-white/10 text-zinc-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-white">&times;</button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && tagInput) {
                                            addTag(tagInput);
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white/30"
                                    placeholder="Add a tag..."
                                />
                                {tagInput && (
                                    <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/10 mt-1 rounded-lg z-50 max-h-32 overflow-y-auto">
                                        {SUGGESTED_TAGS.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(t)).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => addTag(t)}
                                                className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-xs text-zinc-400 uppercase font-bold mb-2">Mood</label>
                            <div className="flex flex-wrap gap-2">
                                {MOOD_OPTIONS.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m === mood ? undefined : m)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mood === m ? "bg-purple-500/20 text-purple-300 border border-purple-500/50" : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-transparent"
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-lg font-medium text-sm text-zinc-400 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-white text-black hover:bg-zinc-200 transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
