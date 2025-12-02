import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-nice-avatar';
import EditProfileModal from '../components/EditProfileModal';
import UserPreferences from '../components/UserPreferences';
import StatsDashboard from '../components/StatsDashboard';
import ActivityHistory from '../components/ActivityHistory';

import { ExtendedUser } from '../../api/types';

export default function Profile() {
    const user = useTracker(() => Meteor.user()) as ExtendedUser | null;
    const navigate = useNavigate();

    const handleLogout = () => {
        Meteor.logout(() => {
            navigate('/login');
        });
    };

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : 'Unknown';

    const displayName = user?.profile?.name || user?.emails?.[0]?.address?.split('@')[0] || 'User';

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black pb-12">
            {/* 1. Hero / Banner Section */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black/50 to-black z-10" />
                {/* Abstract Background or User Cover */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2831&auto=format&fit=crop')] bg-cover bg-center opacity-40" />

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-30 -mt-32">
                {/* 2. Profile Header Card */}
                <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#D2FF00] shadow-[0_0_30px_rgba(210,255,0,0.3)] bg-black">
                            {user?.profile?.avatarConfig ? (
                                <Avatar className="w-full h-full" {...user.profile.avatarConfig} />
                            ) : (
                                <img
                                    src={user?.profile?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="absolute bottom-2 right-2 w-10 h-10 bg-[#D2FF00] text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-2 mb-2">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                            {displayName}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-zinc-400 font-medium uppercase tracking-wider">
                            <span>Member since {memberSince}</span>
                            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                            <span className="text-[#D2FF00]">Pro Member</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-all uppercase tracking-wider hover:border-[#D2FF00] hover:text-[#D2FF00] flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-[#D2FF00] text-black rounded-lg text-sm font-black hover:bg-[#E8FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.4)] transition-all uppercase tracking-wider flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* 3. Stats Section (Full Width) */}
                <div className="mt-12 mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#D2FF00] rounded-full" />
                        Overview
                    </h2>
                    <StatsDashboard />
                </div>

                {/* 4. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                    {/* Left Column: Activity (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-[#080808] border border-white/5 rounded-2xl p-6 md:p-8 h-full">
                            <ActivityHistory />
                        </section>
                    </div>

                    {/* Right Column: Preferences (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-[#080808] border border-white/5 rounded-2xl p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-zinc-700 rounded-full" />
                                Preferences
                            </h2>
                            {user && <UserPreferences user={user} />}
                        </section>
                    </div>
                </div>

                {user && (
                    <EditProfileModal
                        user={user}
                        isOpen={isEditProfileOpen}
                        onClose={() => setIsEditProfileOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
