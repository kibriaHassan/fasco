import { useState } from 'react';
import api from '../api/axios';
import SafeImage from './SafeImage';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setDone(false);
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      setDone(true);
      setEmail('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="container-fasco my-16 md:my-24">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_1.4fr_1fr]">
        <div className="hidden overflow-hidden md:block">
          <SafeImage src="/images/home/news-1.jpg" alt="" className="h-64 w-full object-cover lg:h-80" />
        </div>
        <div className="px-2 text-center md:px-8">
          <h2 className="section-title">Subscribe To Our Newsletter</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fasco-muted">
            Get new arrivals, seasonal style highlights, and exclusive FASCO offers in your inbox.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="michael@ymail.com"
              className="input-underline text-center shadow-sm"
              required
            />
            <button type="submit" className="btn-primary mt-6 max-w-xs" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </button>
            {done && <p role="status" className="mt-3 text-sm text-green-600">Thanks for subscribing!</p>}
            {error && <p role="alert" className="mt-3 text-sm text-red-500">{error}</p>}
          </form>
        </div>
        <div className="hidden overflow-hidden md:block">
          <SafeImage src="/images/home/news-2.jpg" alt="" className="h-64 w-full object-cover lg:h-80" />
        </div>
      </div>
    </section>
  );
}
