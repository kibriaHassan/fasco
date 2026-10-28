import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const AUTH_IMG = '/images/auth/newpass.jpg';

export default function NewPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('fasco_reset_email') || '';
  const otp = sessionStorage.getItem('fasco_reset_otp') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      sessionStorage.removeItem('fasco_reset_email');
      sessionStorage.removeItem('fasco_reset_otp');
      sessionStorage.removeItem('fasco_reset_otp_hint');
      navigate('/sign-in');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={AUTH_IMG}>
      <h1 className="text-2xl font-semibold text-fasco-black">Enter Your New Password</h1>
      <p className="mt-3 text-sm text-fasco-muted">Choose a strong password for your FASCO account.</p>
      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div>
          <label className="text-xs text-fasco-muted">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-underline"
          />
        </div>
        <div>
          <label className="text-xs text-fasco-muted">Confirm Password</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className="input-underline"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Reset Password'}
        </button>
        <p className="text-center text-sm">
          <Link to="/sign-in" className="text-fasco-blue hover:underline">
            Back to Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
