import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie, WatchLaterItem, WatchLaterStatus, WatchLaterPriority, WatchLaterMood } from "/imports/api/types";
import { useWatchLaterContext } from "../context/WatchLaterContext";

interface WatchLaterModalProps {
    isOpen: boolean;
    onClose: () => void;
    movie: Movie;
    existingItem?: WatchLaterItem | null;
}

const STATUS_OPTIONS: WatchLaterStatus[] = ["To-Watch", "Watching", "Completed"];
const PRIORITY_OPTIONS: WatchLaterPriority[] = ["High", "Medium", "Low"];
const MOOD_OPTIONS: WatchLaterMood[] = ["Happy", "Sad", "Excited", "Relaxed", "Scared", "Thoughtful"];

export default function WatchLaterModal({ isOpen, onClose, movie, existingItem }: WatchLaterModalProps) {
    const { addToWatchLater, updateWatchLaterItem } = useWatchLaterContext();

    const [status, setStatus] = useState<WatchLaterStatus>(existingItem?.status || "To-Watch");
    const [priority, setPriority] = useState<WatchLaterPriority>(existingItem?.priority || "Medium");
    const [mood, setMood] = useState<WatchLaterMood | undefined>(existingItem?.mood);
    const [reason, setReason] = useState(existingItem?.reason || "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(existingItem?.tags || []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSave = () => {
        if (existingItem) {
            updateWatchLaterItem(existingItem.id, {
                status,
                priority,
                mood,
                reason,
                tags,
            });
        } else {
            addToWatchLater(movie, {
                status,
                priority,
                mood,
                reason,
                tags,
            });
        }
        onClose();
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(106,0,244,0.2)]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            {existingItem ? "Edit Watch Later" : "Add to Watch Later"}
                        </h2>
                        <p className="text-sm text-zinc-400">{movie.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Status
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setStatus(opt)}
                                    className={`px-3 py-2 rounded-none text-sm font-bold transition-all ${status === opt
                                        ? "bg-[#D2FF00] text-black"
                                        : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Priority
                        </label>
                        <div className="flex gap-3">
                            {PRIORITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setPriority(opt)}
                                    className={`px-4 py-1.5 rounded-none text-sm font-bold border transition-all ${priority === opt
                                        ? opt === 'High' ? 'bg-[#FF007A] text-white border-[#FF007A]'
                                            : opt === 'Medium' ? 'bg-[#D2FF00] text-black border-[#D2FF00]'
                                                : 'bg-white text-black border-white'
                                        : "bg-transparent border-white/10 text-zinc-500 hover:border-white/30"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Mood (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {MOOD_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setMood(mood === opt ? undefined : opt)}
                                    className={`px-3 py-1 rounded-none text-xs font-bold transition-all ${mood === opt
                                        ? "bg-white text-black"
                                        : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Tags
                        </label>
                        <div className="bg-white/5 border border-white/10 rounded-none p-2 flex flex-wrap gap-2 focus-within:border-[#D2FF00] transition-colors">
                            {tags.map((tag) => (
                                <span key={tag} className="bg-white/10 text-zinc-300 text-xs px-2 py-1 rounded-none flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-[#FF007A]">
                                        ×
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-600 flex-1 min-w-[120px]"
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Why do you want to watch this?
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Add a note..."
                            className="w-full bg-white/5 border border-white/10 rounded-none p-3 text-sm text-white placeholder-zinc-600 focus:border-[#D2FF00] focus:outline-none transition-colors min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#D2FF00] text-black text-sm font-black rounded-none hover:bg-[#E8FF00] hover:shadow-[0_0_15px_rgba(210,255,0,0.5)] transition-all uppercase tracking-wider"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
