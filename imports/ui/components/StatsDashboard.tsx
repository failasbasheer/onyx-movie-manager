import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserInteractionsCollection } from '../../api/Collections';

export default function StatsDashboard() {
    const stats = useTracker(() => {
        Meteor.subscribe('userInteractions');
        const interactions = UserInteractionsCollection.find({}).fetch();

        const totalWatched = interactions.filter(i => i.isWatched).length;
        const totalRated = interactions.filter(i => i.rating).length;
        const totalReviews = interactions.filter(i => i.review).length;

        const ratings = interactions.filter(i => i.rating).map(i => i.rating!);
        const averageRating = ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : '0.0';

        return { totalWatched, totalRated, totalReviews, averageRating };
    });

    const statItems = [
        {
            label: 'Movies Watched',
            value: stats.totalWatched,
            icon: (
                <svg className="w-6 h-6 text-[#D2FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            gradient: 'from-[#D2FF00]/20 to-transparent'
        },
        {
            label: 'Avg Rating',
            value: stats.averageRating,
            icon: (
                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            gradient: 'from-yellow-500/20 to-transparent'
        },
        {
            label: 'Ratings Given',
            value: stats.totalRated,
            icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            gradient: 'from-blue-400/20 to-transparent'
        },
        {
            label: 'Reviews Written',
            value: stats.totalReviews,
            icon: (
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11l5-5h9a2 2 0 002-2V7a2 2 0 00-2-2h-5zm0 0V3a2 2 0 012-2h2a2 2 0 012 2v2M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                </svg>
            ),
            gradient: 'from-purple-400/20 to-transparent'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
                <div key={index} className="relative overflow-hidden bg-[#080808] p-5 rounded-2xl border border-white/10 group hover:border-white/20 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="mb-4 p-2 bg-white/5 w-fit rounded-lg border border-white/5 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tight">{item.value}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{item.label}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
