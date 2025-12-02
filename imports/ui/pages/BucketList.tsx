import React from 'react'
import { useMovieContext } from '../context/MovieContext'
import MovieCard from '../components/MovieCard'

function BucketList() {
  const { favorites } = useMovieContext()

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">My Bucket List</h1>
        <p className="text-gray-400 mb-12 font-light">Your personally curated collection of must-watch cinema.</p>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-2 font-serif">Your list is empty</h2>
            <p className="text-zinc-400 mb-8">Start adding movies to your bucket list.</p>
            <a
              href="/"
              className="px-6 py-3 bg-[#D2FF00] hover:bg-[#E8FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.4)] text-black rounded-none font-black uppercase tracking-wider transition-all"
            >
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div >
  )
}

export default BucketList;
