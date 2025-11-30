import React, { useRef } from 'react';
import { Actor } from '/imports/api/types';
import ActorCard from './ActorCard';
import { motion } from 'framer-motion';

interface ActorRowProps {
    title: string;
    actors: Actor[];
}

export default function ActorRow({ title, actors }: ActorRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const validActors = actors.filter(actor => actor.profile_path);

    if (!validActors || validActors.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white pl-1 border-l-4 border-white/20">
                {title}
            </h2>

            <div className="relative group">
                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory no-scrollbar"
                >
                    {validActors.map((actor, index) => (
                        <motion.div
                            key={actor.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="min-w-[160px] md:min-w-[200px] snap-start"
                        >
                            <ActorCard actor={actor} />
                        </motion.div>
                    ))}
                </div>

                {/* Fade Gradients */}
                <div className="absolute top-0 bottom-8 left-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-8 right-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
