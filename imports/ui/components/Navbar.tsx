import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMovieContext } from '../context/MovieContext';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useMovieContext();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Detect scroll for UI changes
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (!searchQuery) {
          setSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Auto-close on inactivity (10 seconds)
  useEffect(() => {
    if (searchOpen && !searchQuery) {
      const timer = setTimeout(() => {
        setSearchOpen(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [searchOpen, searchQuery]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}
    >
      <div className={`
        relative flex items-center justify-between px-6 transition-all duration-500
        ${scrolled
          ? 'w-[90%] max-w-6xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-full h-16 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
          : 'w-full max-w-7xl h-20 bg-transparent border-transparent'
        }
      `}>

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setSearchQuery('')}
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tighter text-white">
            ONYX
          </span>
        </Link>

        {/* Center Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {['/', '/watch-later', '/actors'].map((path) => (
            <Link
              key={path}
              to={path}
              onClick={() => {
                if (path === '/') setSearchQuery('');
              }}
              className="relative text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors py-2"
            >
              {path === '/' ? 'Discover' : path === '/watch-later' ? 'Watch Later' : 'Actors'}
              {isActive(path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_10px_white]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Animated Search */}
          <div
            ref={searchContainerRef}
            className={`flex items-center overflow-hidden transition-all duration-300 ${searchOpen || searchQuery ? 'w-80 md:w-96 bg-white/10 border border-white/20 rounded-full px-4 py-2' : 'w-10 py-2'}`}
          >
            <button
              onClick={() => {
                if (!searchOpen) {
                  setSearchOpen(true);
                  setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
                } else if (!searchQuery) {
                  setSearchOpen(false);
                }
              }}
              className="text-zinc-300 hover:text-white shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              id="searchInput"
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base text-white ml-3 placeholder-zinc-500 font-medium ${searchOpen || searchQuery ? 'opacity-100' : 'opacity-0'}`}
            />
            {(searchQuery || searchOpen) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  document.getElementById('searchInput')?.focus();
                }}
                className={`text-zinc-500 hover:text-white transition-opacity ${searchQuery ? 'opacity-100' : 'opacity-0'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-white/20 flex items-center justify-center text-xs font-bold text-zinc-400">
            A
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar