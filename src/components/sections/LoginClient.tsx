import { useState } from 'react';
import { signIn } from '../../lib/auth';
import PlayerSlotHeader from './PlayerSlotHeader';

export default function LoginClient() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await signIn(
        formData.email,
        formData.password
      );

      if (signInError) throw signInError;

      // Redirect to game
      window.location.href = '/memory';
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form-panel !m-0 flex flex-col gap-5"
    >
      <PlayerSlotHeader label="Player slot // sign in" />

      {error && (
        <div className="notice">
          {error}
        </div>
      )}

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
          placeholder="********"
          aria-label="Password"
          className="input"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="mb-0 text-center text-sm text-[#b9a9c5]">
        Don't have an account?{' '}
        <a href="/signup" className="text-link">
          Sign up
        </a>
      </p>
    </form>
  );
}
