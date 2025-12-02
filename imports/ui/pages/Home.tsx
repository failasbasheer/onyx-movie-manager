import React, { useEffect, useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import ActorCard from "../components/ActorCard";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";
import ActorModal from "../components/ActorModal";
import Hero from "../components/Hero";
import {
  fetchMovies,
  fetchPopularMovies,
  fetchByGenre,
  fetchActors,
} from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import { Movie, Actor } from "/imports/api/types";
import { motion } from "framer-motion";

const GENRE_SECTIONS = [
  { id: 28, title: "Action & Adventure" },
  { id: 35, title: "Comedy Hits" },
  { id: 18, title: "Dramatic Cinema" },
  { id: 878, title: "Sci-Fi & Cyberpunk" },
  { id: 27, title: "Horror & Thriller" },
  { id: 99, title: "Documentaries" },
];

type SearchTab = "all" | "movies" | "actors";

export default function Home() {
  const { isFavorite, searchQuery } = useMovieContext();

  const [popular, setPopular] = useState<Movie[]>([]);
  const [genreRows, setGenreRows] = useState<Record<number, Movie[]>>({});
  const [loadingPopular, setLoadingPopular] = useState(true);

  // Search State
  const [searchMovies, setSearchMovies] = useState<Movie[]>([]);
  const [searchActors, setSearchActors] = useState<Actor[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");

  // 1. Load Trending / Popular (Used for Hero + First Row)
  useEffect(() => {
    setLoadingPopular(true);
    fetchPopularMovies()
      .then((res) => setPopular(res))
      .catch(() => setError("Failed to load trending movies."))
      .finally(() => setLoadingPopular(false));
  }, []);

  // 2. Load Genre Rows
  useEffect(() => {
    GENRE_SECTIONS.forEach((genre) => {
      fetchByGenre(genre.id).then((res) => {
        setGenreRows((prev) => ({
          ...prev,
          [genre.id]: res,
        }));
      });
    });
  }, []);

  // 3. Handle Search (Debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMovies([]);
      setSearchActors([]);
      return;
    }

    const debounce = setTimeout(() => {
      setLoadingSearch(true);
      Promise.all([
        fetchMovies(searchQuery),
        fetchActors(searchQuery)
      ])
        .then(([movies, actors]) => {
          setSearchMovies(movies || []);
          setSearchActors(actors || []);
          setError(null);
        })
        .catch(() => setError("Search failed."))
        .finally(() => setLoadingSearch(false));
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // 4. Select Random Hero Movie
  const heroMovie = useMemo(() => {
    if (popular.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * Math.min(5, popular.length)); // Pick from top 5
    return popular[randomIndex];
  }, [popular]);

  const hasResults = searchMovies.length > 0 || searchActors.length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pb-20 font-sans">

      {/* ---------------- SEARCH VIEW ---------------- */}
      {searchQuery ? (
        <div className="pt-40 px-6 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-white">
                Search Results
              </h2>
              <p className="text-zinc-500 text-lg pb-1">
                for "{searchQuery}"
              </p>
            </div>

            {/* Tabs */}
            {hasResults && (
              <div className="flex gap-4 md:ml-auto">
                {(['all', 'movies', 'actors'] as SearchTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab
                      ? "bg-[#D2FF00] text-black shadow-[0_0_15px_rgba(210,255,0,0.4)]"
                      : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"
                      } capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loadingSearch ? (
            <div className="flex justify-center py-40">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : !hasResults ? (
            <div className="text-center py-40">
              <h3 className="text-2xl font-serif text-white mb-2">No matches found</h3>
              <p className="text-zinc-500">Try checking your spelling or use different keywords.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Movies Section */}
              {(activeTab === 'all' || activeTab === 'movies') && searchMovies.length > 0 && (
                <div className="space-y-6">
                  {activeTab === 'all' && <h3 className="text-2xl font-serif text-white">Movies</h3>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                    {searchMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isFavorite={isFavorite(movie.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actors Section */}
              {(activeTab === 'all' || activeTab === 'actors') && searchActors.length > 0 && (
                <div className="space-y-6">
                  {activeTab === 'all' && <h3 className="text-2xl font-serif text-white">Actors</h3>}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                    {searchActors.map((actor) => (
                      <div key={actor.id} className="w-full">
                        <ActorCard actor={actor} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ---------------- HOME VIEW ---------------- */
        <>
          {/* Main Hero Component */}
          <Hero movie={heroMovie} />

          {/* Content Rows (Overlapping the Hero) */}
          <div className="relative z-20 -mt-32 space-y-4 md:space-y-8 bg-gradient-to-b from-transparent via-[#050505] to-[#050505]">

            {/* Trending Row */}
            <MovieRow
              title="Trending Now"
              movies={popular}
              isFavorite={isFavorite}
            />

            {/* Genre Rows */}
            {GENRE_SECTIONS.map((g) => (
              <MovieRow
                key={g.id}
                title={g.title}
                movies={genreRows[g.id] || []}
                isFavorite={isFavorite}
              />
            ))}


          </div>
        </>
      )}

      {/* Global Modals */}
      <MovieModal />
      <ActorModal />
    </div>
  );
}