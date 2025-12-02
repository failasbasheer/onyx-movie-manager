import React, { createContext, useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { MovieFavoritesCollection } from "/imports/api/Collections";
import { fetchTrailer } from "../services/api";
import { Movie } from "/imports/api/types";

interface MovieContextType {
    favorites: Movie[];
    addToFavorites: (movie: Movie) => void;
    removeFromFavorites: (id: number) => void;
    isFavorite: (id: number) => boolean;
    getTrailerKey: (id: number) => Promise<string | null>;

    selectedMovie: Movie | null;
    openMovie: (movie: Movie) => void;
    closeMovie: () => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const userId = useTracker(() => Meteor.userId());

    const { favorites } = useTracker(() => {
        Meteor.subscribe("movieFavorites");
        const favoriteDocs = MovieFavoritesCollection.find({}, { sort: { addedAt: -1 } }).fetch();
        return {
            favorites: favoriteDocs.map(doc => doc.movie),
        };
    });

    const addToFavorites = (movie: Movie) => {
        if (!userId) {
            alert("Please login to add to Favorites");
            return;
        }
        Meteor.call("favorites.addMovie", movie, (err: Error) => {
            if (err) console.error("Failed to add favorite", err);
        });
    };

    const removeFromFavorites = (id: number) => {
        if (!userId) return;
        Meteor.call("favorites.removeMovie", id, (err: Error) => {
            if (err) console.error("Failed to remove favorite", err);
        });
    };

    const isFavorite = (id: number) => {
        return favorites.some((movie) => movie.id === id);
    };

    const getTrailerKey = async (id: number) => {
        try {
            return (await fetchTrailer(id)) as string | null;
        } catch (error) {
            console.error("Failed to fetch trailer", error);
            return null;
        }
    };

    const openMovie = (movie: Movie) => setSelectedMovie(movie);
    const closeMovie = () => setSelectedMovie(null);

    return (
        <MovieContext.Provider
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                getTrailerKey,
                selectedMovie,
                openMovie,
                closeMovie,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => {
    const context = useContext(MovieContext);
    if (context === undefined) {
        throw new Error("useMovieContext must be used within a MovieProvider");
    }
    return context;
};
