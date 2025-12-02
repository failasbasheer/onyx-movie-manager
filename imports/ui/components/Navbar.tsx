import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMovieContext } from '../context/MovieContext';
import { motion } from 'framer-motion';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Avatar from 'react-nice-avatar';
import { ExtendedUser } from '../../api/types';
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useMovieContext();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const user = useTracker(() => Meteor.user()) as ExtendedUser | null;
  const userId = useTracker(() => Meteor.userId());

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate('/login');
    });
  };

  // Detect scroll for UI changes and close search
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (searchOpen) setSearchOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchOpen]);

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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/50 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-white hover:text-[#D2FF00] transition-colors"
            onClick={() => setSearchQuery('')}>
            ONYX
          </Link>

          {/* Center Links - Desktop */}
          <div className={`hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${searchOpen || searchQuery ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {['/', '/watch-later', '/actors'].map((path) => (
              <Link
                key={path}
                to={path}
                onClick={() => {
                  if (path === '/') setSearchQuery('');
                }}
                className="relative text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors py-2"
              >
                {path === '/' ? 'Discover' : path === '/watch-later' ? 'Watch Later' : 'Actors'}
                {isActive(path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D2FF00] shadow-[0_0_10px_#D2FF00]"
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
              className={`flex items-center overflow-hidden transition-all duration-300 ${searchOpen || searchQuery ? 'w-80 md:w-96 bg-white/5 border border-white/20 rounded-none px-4 py-2' : 'w-10 py-2'}`}
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
                className="text-zinc-300 hover:text-[#D2FF00] shrink-0 transition-colors"
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
                className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-base text-white ml-3 placeholder-zinc-500 font-bold ${searchOpen || searchQuery ? 'opacity-100' : 'opacity-0'}`}
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

            {userId ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-[#D2FF00] transition-colors">
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
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {user?.profile?.name || user?.username}
                  </span>
                </Link>
                <button onClick={handleLogout} className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors uppercase tracking-wider">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar