import { supabase } from '@lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UserProfile {
  user: User;
  profile: Profile;
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
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
 * Checks if a nick is available
 */
export async function isNickAvailable(nick: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('nick')
    .eq('nick', nick)
    .single();

  return !data;
}

/**
 * Signs out the user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Signs in with email and password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Updates the user's profile
 */
export async function updateProfile(
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);
}
