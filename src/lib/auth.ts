import { supabase } from '@lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type GameSession = Database['public']['Tables']['game_sessions']['Row'];

export interface UserProfile {
  user: User;
  profile: Profile;
}

export interface PlayerProgress {
  totalPoints: number;
  gamesPlayed: number;
  bestScores: Array<{
    gameId: string;
    mode: string;
    score: number;
  }>;
  recentSessions: GameSession[];
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }

  return data;
}

/**
 * Gets the user and their profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  if (!profile) return null;

  return { user, profile };
}

/**
 * Signs out the user
 */
export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Signs in with email and password
 */
export async function signIn(email: string, password: string) {
  if (!supabase) {
    return { error: new Error('Authentication is not configured for this deployment.') };
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Updates the user's profile
 */
export async function updateProfile(
  updates: Database['public']['Tables']['profiles']['Update']
) {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Authentication is not configured for this deployment.'),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      data: null,
      error: new Error('You need to sign in before updating your profile.'),
    };
  }

  return await supabase
    .from('profiles')
    .update({
      nick: updates.nick?.trim(),
      avatar: updates.avatar,
    })
    .eq('user_id', user.id)
    .select()
    .single();
}

export async function getPlayerProgress(): Promise<PlayerProgress> {
  const emptyProgress: PlayerProgress = {
    totalPoints: 0,
    gamesPlayed: 0,
    bestScores: [],
    recentSessions: [],
  };

  if (!supabase) return emptyProgress;

  const [{ data: summary, error: summaryError }, { data: sessions, error: sessionsError }] =
    await Promise.all([
      supabase.rpc('get_my_progress'),
      supabase
        .from('game_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  if (summaryError || sessionsError) {
    console.error('Error getting player progress:', summaryError || sessionsError);
    return emptyProgress;
  }

  const playerSummary = summary?.[0];
  const rawBestScores = Array.isArray(playerSummary?.best_scores)
    ? playerSummary.best_scores
    : [];
  const bestScores = rawBestScores.flatMap((best) => {
    if (
      typeof best !== 'object' ||
      best === null ||
      !('game_id' in best) ||
      !('mode' in best) ||
      !('score' in best)
    ) return [];

    return [{
      gameId: String(best.game_id),
      mode: String(best.mode),
      score: Number(best.score),
    }];
  });

  return {
    totalPoints: playerSummary?.total_points ?? 0,
    gamesPlayed: playerSummary?.games_played ?? 0,
    bestScores,
    recentSessions: sessions ?? [],
  };
}
