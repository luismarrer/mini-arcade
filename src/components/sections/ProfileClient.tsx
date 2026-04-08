import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getUserProfile, signOut, type UserProfile } from '../../lib/auth';

export default function ProfileClient() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      setUserProfile(profile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-xl mb-4">You are not logged in.</p>
        <a href="/login" className="text-blue-400 hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#222f49] rounded-xl shadow-2xl overflow-hidden p-8 border border-white/10">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white uppercase border-4 border-blue-400/30 overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105">
            {userProfile.profile.avatar ? (
              <img
                src={userProfile.profile.avatar.startsWith('avatar') 
                  ? `/images/avatars/${userProfile.profile.avatar}.png`
                  : `/images/avatars/${userProfile.profile.avatar}.avif`}
                alt={userProfile.profile.nick}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{userProfile.profile.nick.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-[#222f49] rounded-full shadow-lg"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            {userProfile.profile.nick}
          </h2>
          <p className="text-slate-400 text-sm">
            {userProfile.user.email}
          </p>
        </div>

        <div className="w-full h-px bg-white/10 my-2"></div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center flex flex-col items-center justify-center">
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Avatar</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium capitalize">{userProfile.profile.avatar.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Joined</span>
            <span className="text-white font-medium">
              {new Date(userProfile.profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full mt-4 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-base font-medium transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/10"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
