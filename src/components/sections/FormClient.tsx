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
      if (!supabase) {
        throw new Error('Authentication is not configured for this deployment.');
      }

      // Check if nick already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('nick')
        .eq('nick', formData.nick)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingProfile) {
        setError('This nickname is already in use. Please choose another.');
        setLoading(false);
        return;
      }

      // Register user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nick: formData.nick,
            avatar: formData.avatar,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Could not create user');
      }

      setSuccess(true);
      
      // Redirect after a moment
      setTimeout(() => {
        window.location.href = '/';
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
      className="form-panel !m-0 !max-w-none flex flex-col gap-5"
    >
      {error && (
        <div className="notice">
          {error}
        </div>
      )}
      
      {success && (
        <div className="notice notice--success">
          Profile created. Taking you back to the arcade...
        </div>
      )}

      <label className="field">
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
          className="input"
        />
      </label>

      <label className="field">
        Email
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="mail@example.com"
          aria-label="Email"
          className="input"
        />
      </label>

      <label className="field">
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
          className="input"
        />
      </label>

      <label className="field">
        Avatar
        <select
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="input"
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
        className="button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>

      <p className="mb-0 text-center text-sm text-[#b9a9c5]">
        Already have an account?{' '}
        <a href="/login" className="text-link">
          Sign in
        </a>
      </p>
    </form>
  );
}
