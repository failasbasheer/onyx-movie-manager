import React, { createContext, useContext, useState, useEffect } from "react";
import { Actor } from "/imports/api/types";

interface ActorContextType {
    favorites: Actor[];
    addToFavorites: (actor: Actor) => void;
    removeFromFavorites: (id: number) => void;
    isFavorite: (id: number) => boolean;

    selectedActor: Actor | null;
    openActor: (actor: Actor) => void;
    closeActor: () => void;

    // Search (can be synced with MovieContext or independent, but for now keeping it here for completeness)
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ActorContext = createContext<ActorContextType | undefined>(undefined);

export const ActorProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<Actor[]>([]);
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Load favorites from localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem("actor_favorites");
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error("Failed to parse actor favorites", e);
            }
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem("actor_favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (actor: Actor) => {
        setFavorites((prev) => {
            if (prev.some((a) => a.id === actor.id)) return prev;
            return [...prev, actor];
        });
    };

    const removeFromFavorites = (id: number) => {
        setFavorites((prev) => prev.filter((actor) => actor.id !== id));
    };

    const isFavorite = (id: number) => {
        return favorites.some((actor) => actor.id === id);
    };

    const openActor = (actor: Actor) => setSelectedActor(actor);
    const closeActor = () => setSelectedActor(null);

    return (
        <ActorContext.Provider
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                selectedActor,
                openActor,
                closeActor,
                searchQuery,
                setSearchQuery,
            }}
        >
            {children}
        </ActorContext.Provider>
    );
};

export const useActorContext = () => {
    const context = useContext(ActorContext);
    if (context === undefined) {
        throw new Error("useActorContext must be used within an ActorProvider");
    }
    return context;
};