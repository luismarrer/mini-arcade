import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // Or a skeleton if needed
  }

  return (
    <li>
      {user ? (
        <a href="/profile" className="hover:text-blue-400 transition-colors">
          Profile
        </a>
      ) : (
        <a href="/signup" className="hover:text-blue-400 transition-colors">
          Sign Up
        </a>
      )}
    </li>
  );
}
