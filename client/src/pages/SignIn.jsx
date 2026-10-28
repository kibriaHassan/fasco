import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const AUTH_IMG = '/images/auth/signin.jpg';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={AUTH_IMG} imageAlt="Model against colorful mural">
      <h1 className="text-center text-[22px] font-semibold tracking-wide text-fasco-black sm:text-[26px]">
        Sign In To FASCO
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-fasco-border px-2 py-3 text-[11px] text-fasco-gray shadow-sm hover:bg-neutral-50 sm:text-xs"
        >
          <img src="/images/google.svg" alt="" className="h-4 w-4" />
          Sign up with Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-fasco-border px-2 py-3 text-[11px] text-fasco-gray shadow-sm hover:bg-neutral-50 sm:text-xs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16v12H4V6z" stroke="#EF4444" strokeWidth="1.6" />
            <path d="M4 7l8 6 8-6" stroke="#EF4444" strokeWidth="1.6" />
          </svg>
          Sign up with Email
        </button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-fasco-border" />
        <span className="text-lg font-bold tracking-[0.2em] text-[#838383]">OR</span>
        <div className="h-px flex-1 bg-fasco-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-7">
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="input-underline"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          required
          value={form.password}
          onChange={onChange}
          className="input-underline"
          placeholder="Password"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <Link to="/sign-up" className="btn-secondary block text-center">
          Register Now
        </Link>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-bold tracking-wide text-fasco-blue hover:underline">
            Forget Password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
