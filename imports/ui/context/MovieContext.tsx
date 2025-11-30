// /imports/ui/context/MovieContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
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
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Load favorites from localStorage on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie: Movie) => {
        setFavorites((prev) => {
            if (prev.some((m) => m.id === movie.id)) return prev;
            return [...prev, movie];
        });
    };

    const removeFromFavorites = (id: number) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== id));
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
