import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import BrandStrip from '../components/BrandStrip';
import Countdown from '../components/Countdown';
import FeatureStrip from '../components/FeatureStrip';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import SafeImage from '../components/SafeImage';
import { DEMO_PRODUCTS } from '../utils/catalog';

const heroImgs = ['/images/home/hero-1.jpg', '/images/home/hero-2.jpg', '/images/home/hero-3.jpg'];

const igImgs = [
  '/images/home/ig-1.jpg',
  '/images/home/ig-2.jpg',
  '/images/home/ig-3.jpg',
  '/images/home/ig-4.jpg',
  '/images/home/ig-5.jpg',
  '/images/home/ig-6.jpg',
  '/images/home/ig-7.jpg',
];

const testimonials = [
  {
    name: 'James K.',
    role: 'Traveler',
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    avatar: '/images/home/avatar-1.jpg',
  },
  {
    name: 'Sarah M.',
    role: 'Designer',
    text: 'Great quality and fast shipping. FASCO has become my go-to for everyday fashion essentials.',
    avatar: '/images/home/avatar-2.jpg',
  },
  {
    name: 'Emily R.',
    role: 'Stylist',
    text: 'The denim jacket fits perfectly. Love the editorial look of the site and the clothes!',
    avatar: '/images/home/avatar-3.jpg',
  },
];

const categories = [
  { id: 'mens', label: "Men's Fashion", category: 'MEN' },
  { id: 'womens', label: "Women's Fashion", category: 'WOMEN' },
  { id: 'wacc', label: 'Women Accessories', category: 'ACCESSORIES' },
  { id: 'macc', label: 'Men Accessories', category: 'ACCESSORIES' },
  { id: 'deals', label: 'Discount Deals', category: 'DEALS' },
];

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [filter, setFilter] = useState('womens');
  const [dealIndex, setDealIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [d, a] = await Promise.all([
          api.get('/products/deals/month'),
          api.get('/products/new-arrivals'),
        ]);
        if (cancelled) return;
        const apiArrivals = a.data.products || [];
        const catalog = apiArrivals.length ? apiArrivals : DEMO_PRODUCTS;
        setDemoMode(!apiArrivals.length || Boolean(apiArrivals[0]?.isDemo));
        setDeals(
          (d.data.products || []).length
            ? d.data.products
            : catalog.filter((product) => product.dealOfMonth).slice(0, 6),
        );
        setArrivals(catalog);
        setError('');
      } catch {
        try {
          const { data } = await api.get('/products?limit=50');
          if (cancelled) return;
          const list = data.products?.length ? data.products : DEMO_PRODUCTS;
          setDemoMode(
            !data.products?.length || Boolean(data.products[0]?.isDemo),
          );
          setDeals(list.filter((product) => product.dealOfMonth).slice(0, 6));
          setArrivals(list);
          setError('');
        } catch {
          if (!cancelled) {
            setDeals(DEMO_PRODUCTS.filter((product) => product.dealOfMonth).slice(0, 6));
            setArrivals(DEMO_PRODUCTS);
            setDemoMode(true);
            setError('');
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const active = categories.find((c) => c.id === filter);
  const filtered = arrivals.filter((p) => {
    if (!active) return true;
    if (active.category === 'DEALS') return p.originalPrice > p.price;
    return p.category === active.category;
  });

  const visibleDeals =
    deals.length > 0
      ? [0, 1, 2].map((i) => deals[(dealIndex + i) % deals.length]).filter(Boolean)
      : [];

  return (
    <main>
      {/* Hero — 3-up collage */}
      <section className="container-fasco py-6 md:py-10">
        <div className="grid gap-3 md:grid-cols-[1fr_1.35fr_1fr] md:gap-4">
          <div className="relative hidden aspect-[3/4] overflow-hidden md:block">
            <SafeImage src={heroImgs[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden md:min-h-[560px]">
            <SafeImage src={heroImgs[1]} alt="Ultimate sale" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative z-10 px-6 text-center text-white">
              <p className="text-sm font-medium tracking-[0.45em] uppercase">Ultimate</p>
              <h1 className="mt-1 font-serif text-6xl tracking-wide md:text-7xl lg:text-8xl">SALE</h1>
              <p className="mt-2 text-xs font-medium tracking-[0.35em] uppercase">New Collection</p>
              <Link
                to="/shop"
                className="mt-8 inline-block bg-white px-10 py-3 text-sm font-medium text-fasco-black shadow-lg transition hover:bg-neutral-100"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[3/4] overflow-hidden md:block">
            <SafeImage src={heroImgs[2]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <BrandStrip />

      {/* Deals Of The Month */}
      <section id="deals" className="container-fasco my-16 scroll-mt-24 md:my-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Deals Of The Month</h2>
            {demoMode && (
              <p className="mt-2 text-xs text-fasco-muted">
                Showing the built-in demo catalog.
              </p>
            )}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fasco-muted">
              Explore this month&apos;s most-loved pieces, selected for standout style and everyday versatility.
            </p>
            <Link to="/shop" className="btn-primary mt-6 w-fit px-10">
              Buy Now
            </Link>
            <p className="mt-10 text-sm font-medium text-fasco-black">Hurry, Before It&apos;s Too Late!</p>
            <div className="mt-4">
              <Countdown />
            </div>
          </div>
          <div className="relative">
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {visibleDeals.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
              ))}
              {!visibleDeals.length && !error && (
                <p className="col-span-3 text-sm text-fasco-muted">Loading deals...</p>
              )}
            </div>
            {deals.length > 1 && (
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-fasco-border bg-white p-2 shadow-sm hover:bg-neutral-50"
                  onClick={() => setDealIndex((i) => (i - 1 + deals.length) % deals.length)}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="rounded-full border border-fasco-border bg-white p-2 shadow-sm hover:bg-neutral-50"
                  onClick={() => setDealIndex((i) => (i + 1) % deals.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="arrivals" className="container-fasco my-16 scroll-mt-24 md:my-20">
        <div className="text-center">
          <h2 className="section-title">New Arrivals</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-fasco-muted">
            Fresh wardrobe staples and new-season favorites, selected to make everyday dressing feel effortless.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`rounded px-4 py-2.5 text-xs transition sm:text-sm ${
                  filter === c.id
                    ? 'bg-fasco-black text-white shadow-[0_6px_16px_rgba(0,0,0,0.2)]'
                    : 'bg-[#F0F0F0] text-fasco-muted hover:bg-neutral-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {filtered.slice(0, 8).map((p) => (
            <ProductCard key={p._id || p.slug} product={p} />
          ))}
          {!filtered.length && (
            <p className="col-span-full py-10 text-sm text-fasco-muted">
              No products in this collection yet. Explore the full shop for more styles.
            </p>
          )}
        </div>
        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-primary inline-block w-auto px-12">
            View More
          </Link>
        </div>
      </section>

      <PromoBanner />
      <FeatureStrip />

      {/* Instagram */}
      <section className="container-fasco my-16 text-center md:my-20">
        <h2 className="section-title">Follow Us On Instagram</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-fasco-muted">
          A little inspiration from the FASCO community, featuring new looks and everyday favorites.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7 md:gap-3">
          {igImgs.map((src) => (
            <div key={src} className="aspect-square overflow-hidden">
              <SafeImage src={src} alt="" className="h-full w-full object-cover transition hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-fasco my-16 md:my-20">
        <div className="text-center">
          <h2 className="section-title">This Is What Our Customers Say</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-fasco-muted">
            Real style is personal. Here are a few notes from shoppers who made FASCO part of their wardrobe.
          </p>
        </div>
        <div className="relative mx-auto mt-12 max-w-xl rounded-lg bg-white p-8 shadow-[0_16px_48px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <SafeImage
              src={testimonials[testimonialIndex].avatar}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-fasco-black">{testimonials[testimonialIndex].name}</p>
              <p className="text-xs text-fasco-muted">{testimonials[testimonialIndex].role}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-fasco-gray">
            &ldquo;{testimonials[testimonialIndex].text}&rdquo;
          </p>
          <div className="mt-3 flex text-amber-400">{'★★★★★'}</div>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTestimonialIndex(i)}
                className={`h-2 w-2 rounded-full ${i === testimonialIndex ? 'bg-fasco-black' : 'bg-neutral-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
