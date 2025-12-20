import { supabase } from '@lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UserProfile {
  user: User;
  profile: Profile;
}

/**
 * Obtiene el usuario actual autenticado
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Obtiene el perfil del usuario actual
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
    console.error('Error al obtener perfil:', error);
    return null;
  }

  return data;
}

/**
 * Obtiene el usuario y su perfil
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  if (!profile) return null;

  return { user, profile };
}

/**
 * Verifica si un nick está disponible
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
 * Cierra la sesión del usuario
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Inicia sesión con email y password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Actualiza el perfil del usuario
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
