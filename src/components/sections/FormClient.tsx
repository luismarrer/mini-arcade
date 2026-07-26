import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AVATARS } from '../../constants/avatars';
import PlayerSlotHeader from './PlayerSlotHeader';

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

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nick: formData.nick.trim(),
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
    } catch (err: unknown) {
      console.error('Error registering:', err);
      const message = err instanceof Error ? err.message : 'Error registering user';
      setError(
        /nickname|database error saving new user/i.test(message)
          ? 'This nickname is invalid or already in use.'
          : message
      );
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
      <PlayerSlotHeader label="Player slot // new" />

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

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-arcade-muted">
          Avatar
        </legend>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Choose an avatar">
          {AVATARS.map((avatar) => (
            <label
              key={avatar.value}
              className="group relative grid min-w-0 cursor-pointer place-items-center"
              title={avatar.label}
            >
              <input
                type="radio"
                name="avatar"
                value={avatar.value}
                checked={formData.avatar === avatar.value}
                onChange={handleChange}
                className="peer sr-only"
              />
              <img
                src={`/images/avatars/${avatar.value}.avif`}
                alt=""
                width={72}
                height={72}
                className="aspect-square w-full rounded-lg border-2 border-arcade-border bg-arcade-bg-soft object-cover p-0.5 transition-all duration-150 group-hover:border-arcade-border-bright peer-checked:border-arcade-yellow peer-checked:shadow-[0_0_18px_rgba(244,196,48,0.2)] peer-focus-visible:ring-2 peer-focus-visible:ring-arcade-yellow peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-arcade-surface"
              />
              <span className="sr-only">{avatar.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
