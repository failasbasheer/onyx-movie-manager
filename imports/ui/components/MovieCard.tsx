import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { Movie } from "/imports/api/types";
import WatchLaterModal from "./WatchLaterModal";

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
}

function MovieCard({ movie }: MovieCardProps) {
  const {
    openMovie,
  } = useMovieContext();
  const { getItemByMovieId, addToWatchLater } = useWatchLaterContext();

  const [hover, setHover] = useState(false);
  const [isWatchLaterModalOpen, setIsWatchLaterModalOpen] = useState(false);

  const watchLaterItem = getItemByMovieId(movie.id);
  const isWatchLater = !!watchLaterItem;

  return (
    <>
      <motion.div
        layout
        className="relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-zinc-900"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => openMovie(movie)}
        whileHover={{ scale: 1.02, zIndex: 10 }}
        transition={{ duration: 0.3 }}
      >
        {/* IMAGE LAYER */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Subtle dark gradient always present for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* GLASS OVERLAY (Only visible on hover) */}
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/90 to-transparent"
            >
              <div className="space-y-3">
                <h3 className="text-white font-serif text-xl font-bold leading-tight drop-shadow-md">
                  {movie.title}
                </h3>

                <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                  {movie.overview}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    <span className="text-green-400">{Math.round((movie.vote_average || 0) * 10)}% match</span>
                    <span>{movie.release_date?.split("-")[0]}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isWatchLater) {
                        setIsWatchLaterModalOpen(true);
                      } else {
                        addToWatchLater(movie, {
                          status: "To-Watch",
                          priority: "Medium",
                          tags: [],
                          reason: "",
                        });
                      }
                    }}
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isWatchLater
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-white/10 text-white hover:bg-white hover:text-black"
                      }`}
                    title={isWatchLater ? "Edit Watch Later" : "Add to Watch Later"}
                  >
                    {isWatchLater ? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    ) : (
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Watch Later Modal */}
      <WatchLaterModal
        isOpen={isWatchLaterModalOpen}
        onClose={() => setIsWatchLaterModalOpen(false)}
        movie={movie}
        existingItem={watchLaterItem}
      />
    </>
  );
}

export default MovieCard;