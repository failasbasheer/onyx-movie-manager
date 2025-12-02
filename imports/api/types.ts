import { Meteor } from 'meteor/meteor';

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average?: number;
    vote_count?: number;
    backdrop_path?: string;
    genre_ids?: number[];
    original_language?: string;
    original_title?: string;
    popularity?: number;
    video?: boolean;
    adult?: boolean;
    runtime?: number;
}

export interface TMDBResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export type WatchLaterStatus = 'To-Watch' | 'Watching' | 'Completed';
export type WatchLaterPriority = 'High' | 'Medium' | 'Low';
export type WatchLaterMood = 'Happy' | 'Sad' | 'Excited' | 'Relaxed' | 'Scared' | 'Thoughtful';

export interface WatchLaterItem {
    id: string; // Unique ID for the list item
    movieId: number;
    movieTitle: string;
    posterPath: string;
    status: WatchLaterStatus;
    priority: WatchLaterPriority;
    reason?: string;
    tags: string[];
    mood?: WatchLaterMood;
    addedAt: number;
    runtime?: number;
}

export interface Actor {
    id: number;
    name: string;
    profile_path: string;
    known_for: Movie[];
    place_of_birth?: string;
}

export interface ExtendedUser extends Meteor.User {
    profile?: {
        name?: string;
        avatar?: string; // Legacy URL
        avatarConfig?: any; // react-nice-avatar config
        preferences?: {
            genres: number[];
            language: string;
            mood: string;
            darkMode: boolean;
        };
    };
}

export interface UserInteraction {
    _id?: string;
    userId: string;
    movieId: number;
    movieTitle?: string;
    posterPath?: string;
    releaseDate?: string;
    rating?: number; // 1-10
    review?: string; // Max 150 chars
    notes?: string; // Private watch diary
    watchedAt?: number;
    isWatched?: boolean;
    createdAt?: number;
    updatedAt: number;
}
