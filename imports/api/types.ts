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
}

export interface Actor {
    id: number;
    name: string;
    profile_path: string;
    known_for: Movie[];
    place_of_birth?: string;
}
