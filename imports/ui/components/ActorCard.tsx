import React from 'react';
import { Actor } from '/imports/api/types';
import { motion, Variants } from 'framer-motion';
import { useActorContext } from '../context/ActorContext';

interface ActorCardProps {
    actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
    const { openActor } = useActorContext();
    const cardVariants: Variants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const imageVariants: Variants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const overlayVariants: Variants = {
        rest: { opacity: 0 },
        hover: {
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const contentVariants: Variants = {
        rest: { y: 20, opacity: 0 },
        hover: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.05 }
        }
    };

    const childVariants: Variants = {
        rest: { y: 10, opacity: 0 },
        hover: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardVariants}
            className="relative w-full aspect-[2/3] rounded-none overflow-hidden cursor-pointer group bg-[#050505] border border-white/5 hover:border-[#D2FF00] hover:shadow-[0_0_30px_rgba(210,255,0,0.2)] transition-colors duration-300"
            onClick={() => openActor(actor)}
        >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {actor.profile_path ? (
                    <motion.img
                        variants={imageVariants}
                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                        No Image
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <motion.div
                variants={overlayVariants}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-5"
            >
                <motion.div variants={contentVariants} className="space-y-2">
                    <motion.h3 variants={childVariants} className="text-white font-serif text-xl font-bold leading-tight drop-shadow-lg">
                        {actor.name}
                    </motion.h3>

                    {actor.place_of_birth && (
                        <motion.div variants={childVariants}>
                            <span className="text-[#D2FF00] text-[10px] font-bold uppercase tracking-wider border border-[#D2FF00]/20 bg-[#D2FF00]/10 px-2 py-1">
                                {actor.place_of_birth.split(',').pop()?.trim()} Actor
                            </span>
                        </motion.div>
                    )}

                    <motion.p variants={childVariants} className="text-zinc-400 text-xs line-clamp-2 font-light">
                        Known for: {actor.known_for?.map(m => m.title).join(', ')}
                    </motion.p>

                    <motion.div variants={childVariants} className="pt-3 border-t border-white/10">
                        <span className="text-xs font-bold text-white flex items-center gap-1 uppercase tracking-wider group-hover:text-[#D2FF00] transition-colors">
                            View Profile <span>→</span>
                        </span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}