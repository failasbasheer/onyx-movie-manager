import React from 'react';
import { Actor } from '/imports/api/types';
import { motion } from 'framer-motion';
import { useActorContext } from '../context/ActorContext';

interface ActorCardProps {
    actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
    const { openActor } = useActorContext();
    return (
        <motion.div
            className="relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group bg-zinc-900"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => openActor(actor)}
        >
            {actor.profile_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                    No Image
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg leading-tight">{actor.name}</h3>
                {actor.place_of_birth && (
                    <p className="text-zinc-400 text-xs mt-1 font-medium">
                        {actor.place_of_birth.split(',').pop()?.trim()} Actor
                    </p>
                )}
                <p className="text-zinc-500 text-[10px] mt-1 line-clamp-1">
                    {actor.known_for?.map(m => m.title).join(', ')}
                </p>
            </div>
        </motion.div>
    );
}