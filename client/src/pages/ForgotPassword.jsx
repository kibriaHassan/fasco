import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const AUTH_IMG = '/images/auth/forgot.jpg';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setInfo(data.otp ? `Demo OTP: ${data.otp}` : data.message);
      sessionStorage.setItem('fasco_reset_email', email);
      if (data.otp) sessionStorage.setItem('fasco_reset_otp_hint', data.otp);
      setTimeout(() => navigate('/verify-otp'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={AUTH_IMG}>
      <h1 className="text-center text-[22px] font-semibold tracking-wide text-fasco-black sm:text-[26px]">
        Forget Password
      </h1>
      <p className="mt-3 text-sm text-fasco-muted">
        Enter your email and we&apos;ll send a verification code to reset your password.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div>
          <label className="text-xs text-fasco-muted">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-underline"
            placeholder="Email Address"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Code'}
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
