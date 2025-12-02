import React, { createContext, useContext } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { WatchLaterCollection } from "/imports/api/Collections";
import { WatchLaterItem, Movie } from "/imports/api/types";

interface WatchLaterContextType {
    watchLater: WatchLaterItem[];
    addToWatchLater: (movie: Movie, details: Omit<WatchLaterItem, "id" | "movieId" | "movieTitle" | "posterPath" | "addedAt">) => void;
    updateWatchLaterItem: (id: string, updates: Partial<WatchLaterItem>) => void;
    removeFromWatchLater: (id: string) => void;
    getItemByMovieId: (movieId: number) => WatchLaterItem | undefined;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const WatchLaterProvider = ({ children }: { children: React.ReactNode }) => {
    const userId = useTracker(() => Meteor.userId());

    const { watchLater } = useTracker(() => {
        Meteor.subscribe("watchLater");
        return {
            watchLater: WatchLaterCollection.find({}, { sort: { addedAt: -1 } }).fetch(),
        };
    });

    const addToWatchLater = (movie: Movie, details: Omit<WatchLaterItem, "id" | "movieId" | "movieTitle" | "posterPath" | "addedAt">) => {
        if (!userId) {
            alert("Please login to add to Watch Later");
            return;
        }

        const item = {
            movieId: movie.id,
            movieTitle: movie.title,
            posterPath: movie.poster_path,
            runtime: movie.runtime,
            ...details,
        };

        Meteor.call("watchLater.add", item, (err: Error) => {
            if (err) console.error("Failed to add to watch later", err);
        });
    };

    const updateWatchLaterItem = (id: string, updates: Partial<WatchLaterItem>) => {
        if (!userId) return;
        Meteor.call("watchLater.update", id, updates, (err: Error) => {
            if (err) console.error("Failed to update watch later item", err);
        });
    };

    const removeFromWatchLater = (id: string) => {
        if (!userId) return;
        Meteor.call("watchLater.remove", id, (err: Error) => {
            if (err) console.error("Failed to remove from watch later", err);
        });
    };

    const getItemByMovieId = (movieId: number) => {
        return watchLater.find((item) => item.movieId === movieId);
    };

    return (
        <WatchLaterContext.Provider value={{ watchLater, addToWatchLater, updateWatchLaterItem, removeFromWatchLater, getItemByMovieId }}>
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
