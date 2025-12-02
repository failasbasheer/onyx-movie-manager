import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserInteractionsCollection } from '../../api/Collections';

const IMG = "https://image.tmdb.org/t/p/w200";

export default function ActivityHistory() {
    const activities = useTracker(() => {
        Meteor.subscribe('userInteractions');
        return UserInteractionsCollection.find(
            {},
            { sort: { updatedAt: -1 }, limit: 10 }
        ).fetch();
    });

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">No recent activity found.</p>
                <p className="text-xs mt-1 opacity-60">Start watching movies to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full" />
                    Recent Activity
                </h3>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last 10 Actions</span>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity._id} className="group flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="w-16 h-24 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden shadow-lg group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-shadow">
                            {activity.posterPath ? (
                                <img src={IMG + activity.posterPath} alt={activity.movieTitle} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-start justify-between gap-4">
                                <h4 className="text-white font-bold text-base truncate group-hover:text-[#D2FF00] transition-colors">
                                    {activity.movieTitle || 'Unknown Movie'}
                                </h4>
                                <span className="text-[10px] font-medium text-zinc-500 whitespace-nowrap bg-black/30 px-2 py-1 rounded-full border border-white/5">
                                    {activity.updatedAt ? new Date(activity.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {activity.isWatched && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Watched
                                    </span>
                                )}
                                {activity.rating && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                        Rated {activity.rating}
                                    </span>
                                )}
                                {activity.review && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11l5-5h9a2 2 0 002-2V7a2 2 0 00-2-2h-5zm0 0V3a2 2 0 012-2h2a2 2 0 012 2v2M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
                                        Reviewed
                                    </span>
                                )}
                            </div>

                            {activity.review && (
                                <p className="mt-3 text-sm text-zinc-400 line-clamp-2 italic border-l-2 border-white/10 pl-3">
                                    "{activity.review}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
