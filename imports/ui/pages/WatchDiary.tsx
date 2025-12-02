import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserInteractionsCollection } from '../../api/Collections';

const IMG = "https://image.tmdb.org/t/p/w300";

export default function WatchDiary() {
    const interactions = useTracker(() => {
        Meteor.subscribe('userInteractions');
        return UserInteractionsCollection.find(
            { $or: [{ isWatched: true }, { rating: { $exists: true } }, { review: { $exists: true } }, { notes: { $exists: true } }] },
            { sort: { updatedAt: -1 } }
        ).fetch();
    });

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <header>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2">Watch Diary</h1>
                    <p className="text-zinc-400">Your history of watched movies, ratings, and reviews.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interactions.map((interaction) => (
                        <div key={interaction._id} className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-none overflow-hidden flex flex-col hover:border-[#D2FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.2)] transition-all group">
                            <div className="flex">
                                <div className="w-1/3 aspect-[2/3] relative">
                                    {interaction.posterPath ? (
                                        <img
                                            src={IMG + interaction.posterPath}
                                            alt={interaction.movieTitle}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#D2FF00] transition-colors">{interaction.movieTitle || 'Unknown Movie'}</h3>
                                        <p className="text-xs text-zinc-500 mb-3">
                                            {interaction.updatedAt ? new Date(interaction.updatedAt).toLocaleDateString() : 'Unknown Date'}
                                        </p>

                                        <div className="space-y-2">
                                            {interaction.rating && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-white font-bold">{interaction.rating}/10</span>
                                                </div>
                                            )}
                                            {interaction.isWatched && (
                                                <div className="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                                    Watched
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(interaction.review || interaction.notes) && (
                                <div className="p-4 border-t border-white/5 bg-black/20 flex-1">
                                    {interaction.review && (
                                        <div className="mb-3">
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Review</h4>
                                            <p className="text-sm text-zinc-300 italic">"{interaction.review}"</p>
                                        </div>
                                    )}
                                    {interaction.notes && (
                                        <div>
                                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Private Notes</h4>
                                            <p className="text-sm text-zinc-400">{interaction.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {interactions.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-zinc-500 text-lg">No interactions yet. Start watching and rating movies!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
