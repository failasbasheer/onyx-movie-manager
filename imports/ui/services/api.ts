// /imports/ui/services/api.ts (or your path)

import { Meteor } from "meteor/meteor";
import { Movie, Actor } from "/imports/api/types";

export const fetchPopularMovies = async (): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.popular");
};

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.search", query);
};

export const fetchTrailer = async (movieId: number): Promise<string | null> => {
    return await Meteor.callAsync("tmdb.trailer", movieId);
};

// 🔥 NEW: cast via Meteor
export const fetchCast = async (id: number) => {
    return await Meteor.callAsync("tmdb.cast", id); // returns array from server
};

// 🔥 NEW: similar via Meteor
export const fetchSimilar = async (id: number): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.similar", id);
};

export const fetchByGenre = async (genreId: number): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.genreMovies", genreId);
};


export const fetchMovieByActorName = async (actorName: string): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.actorMovies", actorName);
};

export const fetchPopularActors = async (): Promise<Actor[]> => {
    return await Meteor.callAsync("tmdb.popularActors");
};

export const fetchActors = async (query: string): Promise<Actor[]> => {
    return await Meteor.callAsync("tmdb.searchActors", query);
};

export const fetchActorCredits = async (actorId: number): Promise<Movie[]> => {
    return await Meteor.callAsync("tmdb.actorCredits", actorId);
};

export const fetchActorsByLanguage = async (language: string): Promise<Actor[]> => {
    return await Meteor.callAsync("tmdb.getActorsByLanguage", language);
};