import React, { useEffect, useState } from "react";
import { Actor } from "/imports/api/types";
import { fetchPopularActors, fetchActorsByLanguage } from "../services/api";
import ActorRow from "../components/ActorRow";
import ActorModal from "../components/ActorModal";

export default function Actors() {
    const [popularActors, setPopularActors] = useState<Actor[]>([]);
    const [hollywoodActors, setHollywoodActors] = useState<Actor[]>([]);
    const [bollywoodActors, setBollywoodActors] = useState<Actor[]>([]);
    const [koreanActors, setKoreanActors] = useState<Actor[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchPopularActors(),
            fetchActorsByLanguage('en'), // Hollywood
            fetchActorsByLanguage('hi'), // Bollywood
            fetchActorsByLanguage('ko'), // K-Drama
        ])
            .then(([popular, hollywood, bollywood, korean]) => {
                setPopularActors(popular);
                setHollywoodActors(hollywood);
                setBollywoodActors(bollywood);
                setKoreanActors(korean);
            })
            .catch(() => setError("Failed to load actors."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Actors</h1>
                    <p className="text-zinc-400">Discover stars from around the world.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-400">{error}</div>
                ) : (
                    <div className="space-y-12">
                        <ActorRow title="Trending Worldwide" actors={popularActors} />
                        <ActorRow title="Hollywood Stars" actors={hollywoodActors} />
                        <ActorRow title="Bollywood & Indian Cinema" actors={bollywoodActors} />
                        <ActorRow title="K-Drama Stars" actors={koreanActors} />
                    </div>
                )}
            </div>
            <ActorModal />
        </div>
    );
}