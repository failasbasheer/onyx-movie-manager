import React, { createContext, useContext, useState, useEffect } from "react";
import { WatchLaterItem, Movie } from "/imports/api/types";

interface WatchLaterContextType {
    items: WatchLaterItem[];
    addToWatchLater: (movie: Movie, details: Omit<WatchLaterItem, "id" | "movieId" | "movieTitle" | "posterPath" | "addedAt">) => void;
    updateWatchLaterItem: (id: string, updates: Partial<WatchLaterItem>) => void;
    removeFromWatchLater: (id: string) => void;
    getItemByMovieId: (movieId: number) => WatchLaterItem | undefined;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const WatchLaterProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<WatchLaterItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedItems = localStorage.getItem("watchLater");
        if (storedItems) {
            try {
                setItems(JSON.parse(storedItems));
            } catch (e) {
                console.error("Failed to parse watchLater items", e);
            }
        }
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem("watchLater", JSON.stringify(items));
    }, [items]);

    const addToWatchLater = (movie: Movie, details: Omit<WatchLaterItem, "id" | "movieId" | "movieTitle" | "posterPath" | "addedAt">) => {
        const newItem: WatchLaterItem = {
            id: crypto.randomUUID(),
            movieId: movie.id,
            movieTitle: movie.title,
            posterPath: movie.poster_path,
            addedAt: Date.now(),
            ...details,
        };
        setItems((prev) => [...prev, newItem]);
    };

    const updateWatchLaterItem = (id: string, updates: Partial<WatchLaterItem>) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    };

    const removeFromWatchLater = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const getItemByMovieId = (movieId: number) => {
        return items.find((item) => item.movieId === movieId);
    };

    return (
        <WatchLaterContext.Provider value={{ items, addToWatchLater, updateWatchLaterItem, removeFromWatchLater, getItemByMovieId }}>
            {children}
        </WatchLaterContext.Provider>
    );
};

export const useWatchLaterContext = () => {
    const context = useContext(WatchLaterContext);
    if (context === undefined) {
        throw new Error("useWatchLaterContext must be used within a WatchLaterProvider");
    }
    return context;
};
