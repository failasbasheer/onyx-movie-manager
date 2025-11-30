import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BucketList from './pages/BucketList'
import WatchLaterPage from './pages/WatchLaterPage'
import Navbar from './components/Navbar'
import { MovieProvider } from './context/MovieContext'
import { WatchLaterProvider } from './context/WatchLaterContext'
import { ActorProvider } from './context/ActorContext'
import Actors from './pages/Actors'

export function App() {

  return (
    <MovieProvider>
      <WatchLaterProvider>
        <ActorProvider>
          <div className='min-h-screen flex flex-col bg-black text-white font-sans'>
            <Navbar />
            <main className='flex-grow'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/bucket-list' element={<BucketList />} />
                <Route path='/watch-later' element={<WatchLaterPage />} />
                <Route path='/actors' element={<Actors />} />
              </Routes>
            </main>
          </div>
        </ActorProvider>
      </WatchLaterProvider>
    </MovieProvider>
  )
}
