import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { WatchLaterCollection, MovieFavoritesCollection, ActorFavoritesCollection, UserInteractionsCollection } from './Collections';
import { WatchLaterItem, Movie, Actor } from './types';

Meteor.methods({
    // Watch Later Methods
    async 'watchLater.add'(item: Omit<WatchLaterItem, 'id' | 'userId'>) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }

        const newItem = {
            ...item,
            id: Random.id(),
            userId: this.userId,
            addedAt: Date.now(),
        };

        await WatchLaterCollection.insertAsync(newItem);
    },

    async 'watchLater.remove'(itemId: string) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }

        await WatchLaterCollection.removeAsync({ id: itemId, userId: this.userId });
    },

    async 'watchLater.update'(itemId: string, updates: Partial<WatchLaterItem>) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized');
        }

        await WatchLaterCollection.updateAsync(
            { id: itemId, userId: this.userId },
            { $set: updates }
        );
    },

    // Movie Favorites Methods
    async 'favorites.addMovie'(movie: Movie) {
        if (!this.userId) throw new Meteor.Error('Not authorized');
        const existing = await MovieFavoritesCollection.findOneAsync({ userId: this.userId, movieId: movie.id });
        if (!existing) {
            await MovieFavoritesCollection.insertAsync({
                userId: this.userId,
                movieId: movie.id,
                movie,
                addedAt: Date.now(),
            });
        }
    },

    async 'favorites.removeMovie'(movieId: number) {
        if (!this.userId) throw new Meteor.Error('Not authorized');
        await MovieFavoritesCollection.removeAsync({ userId: this.userId, movieId });
    },

    async 'user.interact'(interaction: { movieId: number; movieTitle?: string; posterPath?: string; releaseDate?: string; rating?: number; review?: string; notes?: string; isWatched?: boolean }) {
        if (!this.userId) throw new Meteor.Error('Not authorized');

        const { movieId, ...updates } = interaction;
        const existing = await UserInteractionsCollection.findOneAsync({ userId: this.userId, movieId });

        if (existing) {
            await UserInteractionsCollection.updateAsync(
                { _id: existing._id },
                { $set: { ...updates, updatedAt: Date.now() } }
            );
        } else {
            await UserInteractionsCollection.insertAsync({
                userId: this.userId,
                movieId,
                ...updates,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }
    },

    // Actor Favorites Methods
    async 'favorites.addActor'(actor: Actor) {
        if (!this.userId) throw new Meteor.Error('Not authorized');
        const existing = await ActorFavoritesCollection.findOneAsync({ userId: this.userId, actorId: actor.id });
        if (!existing) {
            await ActorFavoritesCollection.insertAsync({
                userId: this.userId,
                actorId: actor.id,
                actor,
                addedAt: Date.now(),
            });
        }
    },

    async 'favorites.removeActor'(actorId: number) {
        if (!this.userId) throw new Meteor.Error('Not authorized');
        await ActorFavoritesCollection.removeAsync({ userId: this.userId, actorId });
    },
});
