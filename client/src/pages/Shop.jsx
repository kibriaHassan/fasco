import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import SafeImage from '../components/SafeImage';
import { getDemoCatalog } from '../utils/catalog';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Indigo', hex: '#3F5277' },
  { name: 'Rose', hex: '#E8A598' },
  { name: 'Navy', hex: '#1B2838' },
  { name: 'Khaki', hex: '#C3B091' },
];
const CATEGORIES = ['MEN', 'WOMEN', 'ACCESSORIES', 'FOOTWEAR', 'KIDS'];
const TAGS = ['denim', 'dress', 'new', 'bestseller', 'summer', 'casual'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || '');
  const q = searchParams.get('q') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '9',
          sort,
        });
        if (size) params.set('size', size);
        if (color) params.set('color', color);
        if (category) params.set('category', category);
        if (tag) params.set('tag', tag);
        if (q) params.set('q', q);
        const { data } = await api.get(`/products?${params}`);
        const total = data.pagination?.total ?? data.total ?? data.products?.length ?? 0;
        if (total > 0) {
          if (!cancelled) {
            setProducts(data.products || []);
            setTotal(total);
            setDemoMode(Boolean(data.products?.some((product) => product.isDemo)));
          }
          return;
        }

        const hasFilters = Boolean(size || color || category || tag || q);
        if (hasFilters) {
          const { data: catalogData } = await api.get('/products?limit=1');
          const catalogTotal =
            catalogData.pagination?.total ??
            catalogData.total ??
            catalogData.products?.length ??
            0;
          if (catalogTotal > 0) {
            if (!cancelled) {
              setProducts([]);
              setTotal(0);
              setDemoMode(false);
            }
            return;
          }
        }

        const demo = getDemoCatalog({ page, limit: 9, sort, size, color, category, tag, q });
        if (!cancelled) {
          setProducts(demo.products);
          setTotal(demo.total);
          setDemoMode(true);
        }
      } catch {
        const demo = getDemoCatalog({ page, limit: 9, sort, size, color, category, tag, q });
        if (!cancelled) {
          setProducts(demo.products);
          setTotal(demo.total);
          setDemoMode(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, sort, size, color, category, tag, q]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / 9)), [total]);

  const clearFilters = () => {
    setSize('');
    setColor('');
    setCategory('');
    setTag('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <main>
      <div className="container-fasco py-8">
        <nav className="text-sm text-fasco-muted">
          <Link to="/" className="hover:text-fasco-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fasco-black">Fashion</span>
        </nav>
        <h1 className="mt-4 font-serif text-4xl text-fasco-black">Fashion</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Filters */}
          <aside className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-fasco-black">Filters</h2>
              <button type="button" onClick={clearFilters} className="text-xs text-fasco-blue hover:underline">
                Clear
              </button>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-fasco-black">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(size === s ? '' : s);
                      setPage(1);
                    }}
                    className={`min-w-[40px] rounded border px-3 py-1.5 text-xs ${
                      size === s
                        ? 'border-fasco-black bg-fasco-black text-white'
                        : 'border-fasco-border text-fasco-gray hover:border-fasco-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-fasco-black">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => {
                      setColor(color === c.name ? '' : c.name);
                      setPage(1);
                    }}
                    className={`h-7 w-7 rounded-full border-2 ${
                      color === c.name ? 'border-fasco-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex, boxShadow: c.name === 'White' ? 'inset 0 0 0 1px #ddd' : undefined }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-fasco-black">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(category === c ? '' : c);
                        setPage(1);
                      }}
                      className={`text-sm ${category === c ? 'font-medium text-fasco-black' : 'text-fasco-muted hover:text-fasco-black'}`}
                    >
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-fasco-black">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTag(tag === t ? '' : t);
                      setPage(1);
                    }}
                    className={`rounded px-2 py-1 text-xs ${
                      tag === t ? 'bg-fasco-black text-white' : 'bg-neutral-100 text-fasco-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fasco-muted">
                Showing {products.length} of {total} results
                {q ? ` for “${q}”` : ''}
              </p>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded border border-fasco-border px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {demoMode && (
              <p className="mb-4 text-xs text-fasco-muted">
                Showing the built-in demo catalog because the database has no products yet.
              </p>
            )}

            {loading ? (
              <p className="text-sm text-fasco-muted">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-fasco-muted">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`h-2.5 w-2.5 rounded-full ${page === i + 1 ? 'bg-fasco-black' : 'bg-neutral-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PromoBanner />
      <div className="container-fasco my-10 grid grid-cols-2 gap-3 sm:grid-cols-5 md:gap-4">
        {[
          '/images/home/ig-1.jpg',
          '/images/home/ig-2.jpg',
          '/images/home/ig-3.jpg',
          '/images/home/ig-4.jpg',
          '/images/home/ig-5.jpg',
        ].map((src) => (
          <div key={src} className="aspect-square overflow-hidden">
            <SafeImage src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <Newsletter />
    </main>
  );
}
