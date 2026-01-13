import { useState } from 'react';
import { signIn } from '../../lib/auth';

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
      window.location.href = '/memory/game';
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
      className="mx-auto mt-16 bg-[#222f49] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-6"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
          placeholder="********"
          aria-label="Password"
          className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-500"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-200 mt-3 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-white text-sm">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-400 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}
