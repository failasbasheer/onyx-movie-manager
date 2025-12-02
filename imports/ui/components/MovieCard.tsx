import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";
import { useWatchLaterContext } from "../context/WatchLaterContext";
import { Movie } from "/imports/api/types";
import WatchLaterModal from "/imports/ui/components/WatchLaterModal";

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
}

function MovieCard({ movie }: MovieCardProps) {
  const {
    openMovie,
  } = useMovieContext();
  const { getItemByMovieId, addToWatchLater } = useWatchLaterContext();

  const [isWatchLaterModalOpen, setIsWatchLaterModalOpen] = useState(false);
  const watchLaterItem = getItemByMovieId(movie.id);
  const isWatchLater = !!watchLaterItem;

  const cardVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const imageVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const overlayVariants: Variants = {
    rest: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const contentVariants: Variants = {
    rest: { y: 20, opacity: 0 },
    hover: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const childVariants: Variants = {
    rest: { y: 10, opacity: 0 },
    hover: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.div
        layoutId={`movie-${movie.id}`}
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={cardVariants}
        className="group relative aspect-[2/3] rounded-none overflow-hidden cursor-pointer bg-[#050505] border border-white/5 hover:border-[#D2FF00] hover:shadow-[0_0_30px_rgba(210,255,0,0.2)] hover:z-20 transition-all duration-300"
        onClick={() => openMovie(movie)}
      >
        {/* IMAGE LAYER */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <motion.img
            variants={imageVariants}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Permanent subtle gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* HOVER OVERLAY */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-5"
        >
          <motion.div variants={contentVariants} className="space-y-3">

            {/* Title */}
            <motion.h3 variants={childVariants} className="text-white font-serif text-xl font-bold leading-tight drop-shadow-lg">
              {movie.title}
            </motion.h3>

            {/* Meta Info */}
            <motion.div variants={childVariants} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="text-[#D2FF00] bg-[#D2FF00]/10 px-2 py-1 border border-[#D2FF00]/20">
                {Math.round((movie.vote_average || 0) * 10)}% Match
              </span>
              <span className="text-zinc-400 border border-white/10 px-2 py-1">
                {movie.release_date?.split("-")[0]}
              </span>
            </motion.div>

            {/* Overview (Truncated) */}
            <motion.p variants={childVariants} className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-light">
              {movie.overview}
            </motion.p>

            {/* Action Bar */}
            <motion.div variants={childVariants} className="flex items-center justify-between pt-3 border-t border-white/10">
              <button className="text-xs font-bold text-white hover:text-[#D2FF00] transition-colors flex items-center gap-1 uppercase tracking-wider">
                View Details <span className="text-[#D2FF00]">→</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
                className={`w-8 h-8 flex items-center justify-center transition-all border ${isWatchLater
                  ? "bg-[#D2FF00] text-black border-[#D2FF00]"
                  : "bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white"
                  }`}
                title={isWatchLater ? "Edit Watch Later" : "Add to Watch Later"}
              >
                {isWatchLater ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                ) : (
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                )}
              </motion.button>
            </motion.div>

          </motion.div>
        </motion.div>
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