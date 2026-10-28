import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const AUTH_IMG = '/images/auth/signup.jpg';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not connect to the server. Check the VITE_API_URL and backend CORS settings.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={AUTH_IMG} imageAlt="Model in red blazer">
      <h1 className="text-center text-[22px] font-semibold tracking-wide text-fasco-black sm:text-[26px]">
        Create Account
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

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-fasco-border" />
        <span className="text-lg font-bold tracking-[0.2em] text-[#838383]">OR</span>
        <div className="h-px flex-1 bg-fasco-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <input name="firstName" required value={form.firstName} onChange={onChange} className="input-underline" placeholder="First Name" />
          <input name="lastName" required value={form.lastName} onChange={onChange} className="input-underline" placeholder="Last Name" />
          <input name="email" type="email" required value={form.email} onChange={onChange} className="input-underline" placeholder="Email Address" />
          <input name="phone" value={form.phone} onChange={onChange} className="input-underline" placeholder="Phone Number" />
          <input name="password" type="password" required minLength={6} value={form.password} onChange={onChange} className="input-underline" placeholder="Password" />
          <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={onChange} className="input-underline" placeholder="Confirm Password" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-fasco-muted">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-fasco-black hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
