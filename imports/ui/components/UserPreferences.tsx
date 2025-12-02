import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { ExtendedUser } from '../../api/types';

interface UserPreferencesProps {
    user: ExtendedUser;
}

const GENRES = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
];

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
];

const MOODS = ['Happy', 'Sad', 'Excited', 'Relaxed', 'Scared', 'Thoughtful', 'Adventurous'];

export default function UserPreferences({ user }: UserPreferencesProps) {
    const [selectedGenres, setSelectedGenres] = useState<number[]>(user.profile?.preferences?.genres || []);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(user.profile?.preferences?.language || 'en');
    const [selectedMood, setSelectedMood] = useState<string>(user.profile?.preferences?.mood || '');
    const [darkMode, setDarkMode] = useState<boolean>(user.profile?.preferences?.darkMode ?? true);
    const [success, setSuccess] = useState('');

    const handleSave = () => {
        setSuccess('');
        Meteor.call('user.updatePreferences', {
            genres: selectedGenres,
            language: selectedLanguage,
            mood: selectedMood,
            darkMode
        }, (err: Error) => {
            if (err) {
                console.error(err);
                return;
            }
            setSuccess('Preferences saved!');
            setTimeout(() => setSuccess(''), 3000);
        });
    };

    const toggleGenre = (id: number) => {
        if (selectedGenres.includes(id)) {
            setSelectedGenres(selectedGenres.filter(g => g !== id));
        } else {
            setSelectedGenres([...selectedGenres, id]);
        }
    };

    return (
        <div className="space-y-10">
            {/* Genres */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Favorite Genres</label>
                    <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-1 rounded">Select all that apply</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {GENRES.map(genre => {
                        const isSelected = selectedGenres.includes(genre.id);
                        return (
                            <button
                                key={genre.id}
                                onClick={() => toggleGenre(genre.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border ${isSelected
                                        ? 'bg-[#D2FF00] text-black border-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.3)] scale-105'
                                        : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                    }`}
                            >
                                {genre.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Language & Mood */}
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Preferred Language</label>
                    <div className="relative group">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full appearance-none bg-[#0A0A0A] border border-zinc-800 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all cursor-pointer hover:border-zinc-700"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-[#D2FF00] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Current Mood</label>
                    <div className="flex flex-wrap gap-2">
                        {MOODS.map(mood => {
                            const isSelected = selectedMood === mood;
                            return (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${isSelected
                                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105'
                                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                        }`}
                                >
                                    {mood}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-white font-bold text-base">Dark Mode</span>
                    <span className="text-xs text-zinc-500">Adjust the interface appearance</span>
                </div>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-300 border ${darkMode ? 'bg-zinc-900 border-[#D2FF00]' : 'bg-zinc-800 border-zinc-700'
                        }`}
                >
                    <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${darkMode ? 'translate-x-6 bg-[#D2FF00]' : 'translate-x-0 bg-zinc-500'
                        }`}>
                        {darkMode && (
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </div>
                </button>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-[#D2FF00] text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#E8FF00] hover:shadow-[0_0_30px_rgba(210,255,0,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                    <span>Save Preferences</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
                {success && (
                    <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-2 text-[#D2FF00] font-bold text-sm bg-[#D2FF00]/10 px-4 py-2 rounded-full border border-[#D2FF00]/20 animate-fade-in">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {success}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
