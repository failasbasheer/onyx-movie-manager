import React, { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "/imports/api/types";


interface MovieRowProps {
    title: string;
    movies: Movie[];
    isFavorite: (id: number) => boolean;
}

export default function MovieRow({ title, movies, isFavorite }: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(false);

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = window.innerWidth * 0.7;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section
            className="mb-16 relative group/row pl-6 md:pl-16 hover:z-50 transition-all duration-300"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-white mb-2 tracking-wide flex items-center gap-4">
                {title}
                <div className="h-[1px] bg-white/10 flex-1 mr-16" />
            </h2>

            <div className="relative">
                {/* Left Gradient Control */}
                <div className={`absolute left-0 top-0 bottom-0 z-30 w-24 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />
                <button
                    onClick={() => scroll("left")}
                    className={`absolute left-0 top-0 bottom-0 z-40 w-16 flex items-center justify-center transition-all duration-300 hover:bg-white/5 ${showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                >
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
                </button>

                {/* The Grid/Row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar py-8 scroll-smooth pr-16 -mt-4"
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="min-w-[180px] md:min-w-[240px]">
                            <MovieCard movie={movie} isFavorite={isFavorite(movie.id)} />
                        </div>
                    ))}
                </div>

                {/* Right Gradient Control */}
                <div className={`absolute right-0 top-0 bottom-0 z-30 w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />
                <button
                    onClick={() => scroll("right")}
                    className={`absolute right-0 top-0 bottom-0 z-40 w-16 flex items-center justify-center transition-all duration-300 hover:bg-white/5 ${showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                >
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </section>
    );
}