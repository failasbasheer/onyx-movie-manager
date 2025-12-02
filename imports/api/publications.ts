import { Meteor } from 'meteor/meteor';
import { WatchLaterCollection, MovieFavoritesCollection, ActorFavoritesCollection, UserInteractionsCollection } from './Collections';

Meteor.publish('watchLater', function () {
    if (!this.userId) {
        return this.ready();
    }
    return WatchLaterCollection.find({ userId: this.userId });
});

Meteor.publish('movieFavorites', function () {
    if (!this.userId) {
        return this.ready();
    }
    return MovieFavoritesCollection.find({ userId: this.userId });
});

Meteor.publish('actorFavorites', function () {
    if (!this.userId) {
        return this.ready();
    }
    return ActorFavoritesCollection.find({ userId: this.userId });
});

Meteor.publish('userInteractions', function () {
    if (!this.userId) {
        return this.ready();
    }
    return UserInteractionsCollection.find({ userId: this.userId });
});
