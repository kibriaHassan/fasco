import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const AUTH_IMG = '/images/auth/otp.jpg';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('fasco_reset_email') || '';
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const onDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 4) {
      setError('Enter the 4-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      sessionStorage.setItem('fasco_reset_otp', otp);
      navigate('/new-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={AUTH_IMG}>
      <h1 className="text-2xl font-semibold text-fasco-black">Enter The Confirmation Code</h1>
      <p className="mt-3 text-sm text-fasco-muted">
        We sent a code to <span className="text-fasco-black">{email || 'your email'}</span>
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-8">
        <div className="flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => onDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              maxLength={1}
              className="h-14 w-14 rounded-lg border border-fasco-border text-center text-xl font-semibold text-fasco-black"
              inputMode="numeric"
            />
          ))}
        </div>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Recover Password'}
        </button>
        <p className="text-center text-sm text-fasco-muted">
          Didn&apos;t receive a code?{' '}
          <Link to="/forgot-password" className="text-fasco-blue hover:underline">
            Resend
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
