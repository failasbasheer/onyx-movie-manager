import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { genConfig } from 'react-nice-avatar';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        const avatarConfig = genConfig();

        Accounts.createUser({
            username,
            email,
            password,
            profile: {
                name: username,
                avatarConfig
            }
        }, (err) => {
            if (err) {
                setError(err.message || 'Signup failed');
            } else {
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(106,0,244,0.15)]">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-zinc-400">Join the cinematic universe</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)] transition-all font-medium"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)] transition-all font-medium"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)] transition-all font-medium"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D2FF00] focus:shadow-[0_0_15px_rgba(210,255,0,0.2)] transition-all font-medium"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-none text-sm font-black text-black bg-[#D2FF00] hover:bg-[#E8FF00] hover:shadow-[0_0_20px_rgba(210,255,0,0.4)] focus:outline-none transition-all transform hover:scale-[1.02] uppercase tracking-wider"
                    >
                        Sign Up
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-zinc-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-white hover:underline">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
