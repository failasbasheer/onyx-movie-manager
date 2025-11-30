// /server/tmdbMethods.ts (or wherever this file is)

import { Meteor } from "meteor/meteor";
import axios from "axios";
import { Movie, TMDBResponse, Actor } from "/imports/api/types";

const API_KEY = "091e233c8c6c204c84f2fc7c8e5e368c";
const BASE_URL = "https://api.themoviedb.org/3";

Meteor.methods({
    async "tmdb.popular"(): Promise<Movie[]> {
        try {
            const res = await axios.get<TMDBResponse>(
                `${BASE_URL}/movie/popular?api_key=${API_KEY}`
            );
            return res.data.results;
        } catch (error) {
            throw new Meteor.Error("tmdb.popular.error", "Failed to fetch popular movies");
        }
    },

    async "tmdb.search"(query: string): Promise<Movie[]> {
        try {
            const res = await axios.get<TMDBResponse>(
                `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                    query
                )}`
            );
            return res.data.results;
        } catch (error) {

            throw new Meteor.Error("tmdb.search.error", "Failed to search movies");
        }
    },

    async "tmdb.details"(movieId: number): Promise<Movie> {
        try {
            const res = await axios.get<Movie>(
                `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
            );
            return res.data;
        } catch (error) {
            throw new Meteor.Error("tmdb.details.error", "Failed to fetch movie details");
        }
    },

    async "tmdb.trailer"(movieId: number): Promise<string | null> {
        try {
            const res = await axios.get(
                `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
            );
            const videos = res.data.results || [];
            const trailer = videos.find(
                (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
            );
            return trailer ? trailer.key : null;
        } catch (error) {
            throw new Meteor.Error("tmdb.trailer.error", "Failed to fetch trailer");
        }
    },

    // 🔥 NEW: CAST
    async "tmdb.cast"(movieId: number) {
        try {
            const res = await axios.get(
                `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
            );
            return res.data.cast; // array
        } catch (error) {
            throw new Meteor.Error("tmdb.cast.error", "Failed to fetch cast");
        }
    },

    // 🔥 NEW: SIMILAR MOVIES
    async "tmdb.similar"(movieId: number): Promise<Movie[]> {
        try {
            const res = await axios.get<TMDBResponse>(
                `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
            );
            return res.data.results;
        } catch (error) {
            throw new Meteor.Error("tmdb.similar.error", "Failed to fetch similar movies");
        }
    },


    async "tmdb.genreMovies"(genreId: number): Promise<Movie[]> {
        try {
            const res = await axios.get(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
            );
            return res.data.results;
        } catch (error) {
            throw new Meteor.Error("tmdb.genreMovies.error", "Failed to fetch movies by genre");
        }
    },

    async "tmdb.actorMovies"(actorName: string): Promise<Movie[]> {
        try {
            // First find the person ID
            const personRes = await axios.get(
                `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actorName)}`
            );
            const person = personRes.data.results[0];

            if (!person) return [];

            // Then fetch their movie credits
            const creditsRes = await axios.get(
                `${BASE_URL}/person/${person.id}/movie_credits?api_key=${API_KEY}`
            );
            return creditsRes.data.cast;
        } catch (error) {
            throw new Meteor.Error("tmdb.actorMovies.error", "Failed to fetch movies by actor");
        }
    },

    async "tmdb.actorCredits"(actorId: number): Promise<Movie[]> {
        try {
            const res = await axios.get(
                `${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`
            );
            // Sort by popularity or release date if needed, for now just return cast
            const cast = res.data.cast as Movie[];
            // Filter out movies without posters or low popularity if desired
            return cast.filter(m => m.poster_path).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } catch (error) {
            throw new Meteor.Error("tmdb.actorCredits.error", "Failed to fetch actor credits");
        }
    },

    async "tmdb.searchActors"(query: string): Promise<Actor[]> {
        try {
            const res = await axios.get(
                `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
            );
            const actors = res.data.results;

            // Fetch details for each actor to get place_of_birth
            const actorsWithDetails = await Promise.all(actors.map(async (actor: any) => {
                try {
                    const details = await axios.get(`${BASE_URL}/person/${actor.id}?api_key=${API_KEY}`);
                    return { ...actor, place_of_birth: details.data.place_of_birth };
                } catch (e) {
                    return actor;
                }
            }));

            return actorsWithDetails;
        } catch (error) {
            throw new Meteor.Error("tmdb.searchActors.error", "Failed to search actors");
        }
    },
    async "tmdb.popularActors"(): Promise<Actor[]> {
        try {
            const res = await axios.get(
                `${BASE_URL}/person/popular?api_key=${API_KEY}`
            );
            const actors = res.data.results;

            // Fetch details for each actor to get place_of_birth
            const actorsWithDetails = await Promise.all(actors.map(async (actor: any) => {
                try {
                    const details = await axios.get(`${BASE_URL}/person/${actor.id}?api_key=${API_KEY}`);
                    return { ...actor, place_of_birth: details.data.place_of_birth };
                } catch (e) {
                    return actor;
                }
            }));

            return actorsWithDetails;
        } catch (error) {
            throw new Meteor.Error("tmdb.popularActors.error", "Failed to fetch popular actors");
        }
    },

    async "tmdb.getActorsByLanguage"(language: string): Promise<Actor[]> {
        try {
            // 1. Fetch popular movies in this language
            const moviesRes = await axios.get(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=${language}&sort_by=popularity.desc&page=1`
            );
            const movies = moviesRes.data.results.slice(0, 5); // Top 5 movies

            // 2. Fetch cast for these movies
            let allActors: any[] = [];

            await Promise.all(movies.map(async (movie: any) => {
                try {
                    const creditsRes = await axios.get(
                        `${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
                    );
                    // Take top 5 cast members from each movie
                    const cast = creditsRes.data.cast.slice(0, 5);
                    allActors = [...allActors, ...cast];
                } catch (e) {
                    // ignore error for single movie
                }
            }));

            // 3. Deduplicate by ID
            const uniqueActors = Array.from(new Map(allActors.map(item => [item.id, item])).values());

            // 4. Fetch details for place_of_birth (optional, but good for consistency)
            // Limiting to top 20 to avoid rate limits/slowness
            const topActors = uniqueActors.slice(0, 20);

            const actorsWithDetails = await Promise.all(topActors.map(async (actor: any) => {
                try {
                    const details = await axios.get(`${BASE_URL}/person/${actor.id}?api_key=${API_KEY}`);
                    return { ...actor, place_of_birth: details.data.place_of_birth };
                } catch (e) {
                    return actor;
                }
            }));

            return actorsWithDetails;

        } catch (error) {
            throw new Meteor.Error("tmdb.getActorsByLanguage.error", "Failed to fetch actors by language");
        }
    },
});



