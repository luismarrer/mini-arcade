import { useEffect, useState } from 'react';
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
      <div className="flex justify-center items-center py-20" aria-label="Loading profile">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#665175] border-t-[#a857ff]"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="surface max-w-xl p-8 text-center">
        <p className="text-lg font-semibold mb-2 text-[#f8f5fb]">There is no active player profile.</p>
        <p className="mb-5 text-sm text-[#b9a9c5]">Sign in to see your nickname and avatar.</p>
        <a href="/login" className="button">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl overflow-hidden rounded-[1.35rem] border border-[#443451] bg-[#21172e] p-6 text-[#f8f5fb] shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-[#8b2cff] flex items-center justify-center text-3xl font-bold text-white uppercase border-2 border-[#665175] overflow-hidden shadow-[0_0_24px_rgba(139,44,255,0.2)] transition-transform duration-300 group-hover:scale-105">
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
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#82dc3d] border-4 border-[#21172e] rounded-full shadow-[0_0_10px_rgba(130,220,61,0.45)]"></div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#f8f5fb] mb-1">
            {userProfile.profile.nick}
          </h2>
          <p className="text-[#b9a9c5] text-sm">
            {userProfile.user.email}
          </p>
        </div>

        <div className="w-full h-px bg-[#443451] my-2"></div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-[#191022] p-4 rounded-lg border border-[#443451] text-center flex flex-col items-center justify-center">
            <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-[#82728f] mb-1">Avatar</span>
            <div className="flex items-center gap-2">
              <span className="text-[#f8f5fb] font-medium capitalize">{userProfile.profile.avatar.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <div className="bg-[#191022] p-4 rounded-lg border border-[#443451] text-center">
            <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-[#82728f] mb-1">Joined</span>
            <span className="text-[#f8f5fb] font-medium">
              {new Date(userProfile.profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full mt-4 px-6 py-3 bg-[#2a1724] text-[#ff9aa9] border border-[#874052] rounded-lg font-mono text-xs font-semibold uppercase tracking-[0.05em] transition-all duration-200 hover:bg-[#3a1b2b] hover:text-[#ffc5ce] focus:outline-none focus:ring-4 focus:ring-red-500/10"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
