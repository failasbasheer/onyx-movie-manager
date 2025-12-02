import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-white rounded-none flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(210,255,0,0.6)] group-hover:scale-110 transition-all duration-300">
                                <div className="w-3 h-3 bg-black rounded-none" />
                            </div>
                            <span className="text-2xl font-serif font-bold tracking-tighter text-white group-hover:text-[#D2FF00] transition-all">
                                ONYX
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Your personal cinematic universe. Discover, track, and curate your movie journey with a premium experience designed for film lovers.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Explore</h3>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li>
                                <Link to="/" className="hover:text-[#D2FF00] transition-colors">Discover Movies</Link>
                            </li>
                            <li>
                                <Link to="/watch-later" className="hover:text-[#D2FF00] transition-colors">Watch Later</Link>
                            </li>
                            <li>
                                <Link to="/actors" className="hover:text-[#D2FF00] transition-colors">Popular Actors</Link>
                            </li>
                            <li>
                                <Link to="/bucket-list" className="hover:text-[#D2FF00] transition-colors">My Bucket List</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Genres */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Genres</h3>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li>
                                <a href="#" className="hover:text-[#D2FF00] transition-colors">Action & Adventure</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#D2FF00] transition-colors">Sci-Fi & Cyberpunk</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#D2FF00] transition-colors">Drama & Thriller</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-[#D2FF00] transition-colors">Comedy Hits</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Stay Updated</h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest movie trends and updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-none px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)] w-full transition-all"
                            />
                            <button className="bg-[#D2FF00] text-black px-4 py-2 rounded-none text-sm font-black hover:bg-[#E8FF00] hover:shadow-[0_0_15px_rgba(210,255,0,0.4)] transition-all uppercase tracking-wider">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">
                        &copy; {new Date().getFullYear()} Onyx Movie Manager. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-zinc-600 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
