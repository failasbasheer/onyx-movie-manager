import { Mongo } from 'meteor/mongo';
import { WatchLaterItem, Movie, Actor, UserInteraction } from './types';

export interface FavoriteMovie {
    _id?: string;
    userId: string;
    movieId: number;
    movie: Movie;
    addedAt: number;
}

export interface FavoriteActor {
    _id?: string;
    userId: string;
    actorId: number;
    actor: Actor;
    addedAt: number;
}

// Extend WatchLaterItem to include userId
export interface DBWatchLaterItem extends WatchLaterItem {
    userId: string;
}

export const WatchLaterCollection = new Mongo.Collection<WatchLaterItem>('watchLater');
export const MovieFavoritesCollection = new Mongo.Collection<{ userId: string; movieId: number; movie: Movie; addedAt: number }>('movieFavorites');
export const ActorFavoritesCollection = new Mongo.Collection<{ userId: string; actorId: number; actor: Actor; addedAt: number }>('actorFavorites');
export const UserInteractionsCollection = new Mongo.Collection<UserInteraction>('userInteractions');
