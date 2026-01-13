import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FormData {
  nick: string;
  email: string;
  password: string;
  avatar: string;
}

export default function FormClient() {
  const [formData, setFormData] = useState<FormData>({
    nick: '',
    email: '',
    password: '',
    avatar: 'batman',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      // Check if nick already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('nick')
        .eq('nick', formData.nick)
        .single();

      if (existingProfile) {
        setError('This nickname is already in use. Please choose another.');
        setLoading(false);
        return;
      }

      // Register user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Could not create user');
      }

      // Create user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: authData.user.id,
        nick: formData.nick,
        avatar: formData.avatar,
      });

      if (profileError) throw profileError;

      setSuccess(true);
      
      // Redirect after a moment
      setTimeout(() => {
        window.location.href = '/memory/game';
      }, 2000);
    } catch (err: any) {
      console.error('Error registering:', err);
      setError(err.message || 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-16 bg-[#222f49] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-6"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Registration successful! Redirecting...
        </div>
      )}

      <label className="flex flex-col gap-2 font-medium text-white text-base">
        Nick
        <input
          type="text"
          name="nick"
          value={formData.nick}
          onChange={handleChange}
          required
          placeholder="Hero123"
          pattern="[a-zA-Z][a-zA-Z0-9]{2,14}"
          aria-label="Nick"
          className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-500"
        />
      </label>

      <label className="flex flex-col gap-2 font-medium text-white text-base">
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="mail@example.com"
          aria-label="Email"
          className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-500"
        />
      </label>

      <label className="flex flex-col gap-2 font-medium text-white text-base">
        Password
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          placeholder="********"
          aria-label="Password"
          className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-500"
        />
      </label>

      <label className="flex flex-col gap-2 font-medium text-white text-base">
        Avatar
        <select
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
        >
          <option value="batman">Batman</option>
          <option value="superman">Superman</option>
          <option value="wonder-woman">Wonder Woman</option>
          <option value="the-flash">The Flash</option>
          <option value="green-lantern">Green Lantern</option>
          <option value="supergirl">Supergirl</option>
          <option value="cyborg">Cyborg</option>
          <option value="catwoman">Catwoman</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-200 mt-3 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>

      <p className="text-center text-white text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-400 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
