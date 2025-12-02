import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { MovieProvider } from './context/MovieContext';
import { WatchLaterProvider } from './context/WatchLaterContext';
import { ActorProvider } from './context/ActorContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WatchLaterPage from './pages/WatchLaterPage';
import Actors from './pages/Actors';
import BucketList from './pages/BucketList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import WatchDiary from './pages/WatchDiary';
import ProtectedRoute from './components/ProtectedRoute';

import MovieModal from './components/MovieModal';
import ActorModal from './components/ActorModal';

export const App = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return (
        <MovieProvider>
            <WatchLaterProvider>
                <ActorProvider>
                    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route
                                    path="/watch-later"
                                    element={
                                        <ProtectedRoute>
                                            <WatchLaterPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/actors" element={<Actors />} />
                                <Route
                                    path="/bucket-list"
                                    element={
                                        <ProtectedRoute>
                                            <BucketList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/diary"
                                    element={
                                        <ProtectedRoute>
                                            <WatchDiary />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </main>
                        {!isAuthPage && <Footer />}
                    </div>
                    <MovieModal />
                    <ActorModal />
                </ActorProvider>
            </WatchLaterProvider>
        </MovieProvider>
    );
};
