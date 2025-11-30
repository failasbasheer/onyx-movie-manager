import React from 'react'
import { useMovieContext } from '../context/MovieContext'
import MovieCard from '../components/MovieCard'

function BucketList() {
  const { favorites, isFavorite } = useMovieContext()

  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">My Bucket List</h1>
        <p className="text-gray-400 mb-12 font-light">Your personally curated collection of must-watch cinema.</p>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            <h2 className="text-2xl font-bold text-white mb-2 font-serif">Your list is empty</h2>
            <p className="text-gray-400">Start adding movies to your bucket list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Start building your collection by clicking the heart icon on any movie card.
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Browse Movies
            </a>
          </div>
        )}
      </div>
    </div >
  )
}

export default BucketList;
