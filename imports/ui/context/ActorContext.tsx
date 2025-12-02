import React, { createContext, useContext, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { ActorFavoritesCollection } from "/imports/api/Collections";
import { Actor } from "/imports/api/types";

interface ActorContextType {
    favorites: Actor[];
    addToFavorites: (actor: Actor) => void;
    removeFromFavorites: (id: number) => void;
    isFavorite: (id: number) => boolean;

    selectedActor: Actor | null;
    openActor: (actor: Actor) => void;
    closeActor: () => void;
}

const ActorContext = createContext<ActorContextType | undefined>(undefined);

export const ActorProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const userId = useTracker(() => Meteor.userId());

    const { favorites } = useTracker(() => {
        Meteor.subscribe("actorFavorites");
        const favoriteDocs = ActorFavoritesCollection.find({}, { sort: { addedAt: -1 } }).fetch();
        return {
            favorites: favoriteDocs.map(doc => doc.actor),
        };
    });

    const addToFavorites = (actor: Actor) => {
        if (!userId) {
            alert("Please login to add to Favorites");
            return;
        }
        Meteor.call("favorites.addActor", actor, (err: Error) => {
            if (err) console.error("Failed to add favorite actor", err);
        });
    };

    const removeFromFavorites = (id: number) => {
        if (!userId) return;
        Meteor.call("favorites.removeActor", id, (err: Error) => {
            if (err) console.error("Failed to remove favorite actor", err);
        });
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