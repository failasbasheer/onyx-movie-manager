import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { ExtendedUser } from '../../api/types';
import Avatar, { genConfig } from 'react-nice-avatar';

interface EditProfileModalProps {
    user: ExtendedUser;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
    const [name, setName] = useState(user.profile?.name || user.username || '');
    const [avatarUrl] = useState(user.profile?.avatar || '');
    const [selectedConfig, setSelectedConfig] = useState(user.profile?.avatarConfig || null);
    const [avatarOptions, setAvatarOptions] = useState<any[]>([]);
    // const [email, setEmail] = useState(user.emails?.[0]?.address || '');
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Generate avatar options on open
    useEffect(() => {
        if (isOpen) {
            const options = Array.from({ length: 5 }, () => genConfig());
            // Add current config if exists, or generate one
            const current = user.profile?.avatarConfig || genConfig();
            setAvatarOptions([current, ...options]);
            setSelectedConfig(current);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        Meteor.users.update(user._id, {
            $set: {
                'profile.name': name,
                'profile.avatar': avatarUrl,
                'profile.avatarConfig': selectedConfig
            }
        }, {}, (err: any) => {
            if (err) {
                setError(err.message);
            } else {
                setSuccess('Profile updated successfully!');
                setTimeout(onClose, 1500);
            }
        });

        // Update Email (if changed)
        // Note: Changing email usually requires server-side method for security and verification, 
        // but for this MVP we might need a method. 
        // Meteor.users.update client-side only works for 'profile' by default.
        // I'll need a method for email and password.
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-serif font-bold text-white mb-6">Edit Profile</h2>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg mb-4 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-3">Choose Avatar</label>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {avatarOptions.map((config, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedConfig(config)}
                                    className={`aspect-square rounded-full overflow-hidden cursor-pointer border-2 transition-all ${JSON.stringify(selectedConfig) === JSON.stringify(config)
                                        ? 'border-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.5)] scale-105'
                                        : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <Avatar className="w-full h-full" {...config} />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setAvatarOptions(Array.from({ length: 6 }, () => genConfig()))}
                            className="text-xs text-[#D2FF00] hover:text-white font-bold transition-colors uppercase tracking-wider"
                        >
                            Generate New Options
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-2 text-white focus:outline-none focus:border-[#D2FF00] transition-colors"
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-white font-bold mb-4">Security</h3>
                        {/* Email and Password fields would go here, but require server methods */}
                        <p className="text-xs text-zinc-500">Email and Password updates coming soon.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#D2FF00] text-black font-black py-3 rounded-none hover:bg-[#E8FF00] hover:shadow-[0_0_15px_rgba(210,255,0,0.4)] transition-all mt-6 uppercase tracking-wider"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
