import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Heart, Share2, Star } from 'lucide-react';
import api from '../api/axios';
import Countdown from '../components/Countdown';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import SafeImage from '../components/SafeImage';
import { useCart } from '../context/CartContext';
import { DEMO_PRODUCTS, getDemoProduct } from '../utils/catalog';

export default function ProductDetail() {
  const { slug } = useParams();
  const { state: navigationState } = useLocation();
  const requestedSize = navigationState?.size;
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [loadedSlug, setLoadedSlug] = useState(null);
  const loading = loadedSlug !== slug;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        const p = data.product || data || getDemoProduct(slug);
        if (cancelled) return;
        if (!p?._id) throw new Error('Product not found');
        setProduct(p);
        setSize(
          p.sizes?.includes(requestedSize)
            ? requestedSize
            : p.sizes?.[0] || '',
        );
        setColor(p.colors?.[0] || null);
        setActiveImg(0);
        setLoadedSlug(slug);

        if (p.isDemo) {
          setRelated(
            DEMO_PRODUCTS.filter(
              (item) => item.category === p.category && item.slug !== p.slug,
            ).slice(0, 4),
          );
          return;
        }

        try {
          const rel = await api.get(`/products?limit=4&category=${p.category}`);
          if (!cancelled) {
            const relatedProducts = (rel.data.products || [])
              .filter((item) => item.slug !== p.slug)
              .slice(0, 4);
            setRelated(
              relatedProducts.length
                ? relatedProducts
                : DEMO_PRODUCTS.filter(
                    (item) => item.category === p.category && item.slug !== p.slug,
                  ).slice(0, 4),
            );
          }
        } catch {
          if (!cancelled) {
            setRelated(
              DEMO_PRODUCTS.filter(
                (item) => item.category === p.category && item.slug !== p.slug,
              ).slice(0, 4),
            );
          }
        }
      } catch (requestError) {
        if (cancelled) return;
        const demoProduct = getDemoProduct(slug);
        if (demoProduct) {
          setProduct(demoProduct);
          setSize(
            demoProduct.sizes?.includes(requestedSize)
              ? requestedSize
              : demoProduct.sizes?.[0] || '',
          );
          setColor(demoProduct.colors?.[0] || null);
          setActiveImg(0);
          setRelated(
            DEMO_PRODUCTS.filter(
              (item) =>
                item.category === demoProduct.category &&
                item.slug !== demoProduct.slug,
            ).slice(0, 4),
          );
          setError('');
        } else {
          setProduct(null);
          setError(
            requestError.response?.status === 404
              ? 'Product not found.'
              : 'Could not load this product. Please try again.',
          );
        }
        setLoadedSlug(slug);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, requestedSize]);

  if (loading) {
    return (
      <main className="container-fasco py-20 text-center text-sm text-fasco-muted">
        Loading product...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container-fasco py-20 text-center">
        <p className="text-sm text-fasco-muted">{error}</p>
        <Link to="/shop" className="btn-primary mt-6 inline-block w-auto px-10">
          Back to Shop
        </Link>
      </main>
    );
  }

  const onAdd = async () => {
    if (!size) {
      setError('Please select a size');
      return;
    }
    if (!color?.name) {
      setError('Please select a color');
      return;
    }
    setError('');
    setAdding(true);
    try {
      const success = await addItem({
        productId: product._id || product.slug,
        product,
        quantity: qty,
        size,
        color: color.name,
        price: product.price,
        title: product.title,
        image: product.images?.[0],
      });
      if (!success) {
        setError('Could not add this item to your cart. Please try again.');
        return;
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <main>
      <div className="container-fasco py-8">
        <nav className="text-sm text-fasco-muted">
          <Link to="/" className="hover:text-fasco-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-fasco-black">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fasco-black">{product.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[80px_1fr_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
            {(product.images || []).map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`h-20 w-16 shrink-0 overflow-hidden border ${
                  activeImg === i ? 'border-fasco-black' : 'border-transparent'
                }`}
              >
                <SafeImage src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="order-1 aspect-[3/4] overflow-hidden bg-neutral-100 lg:order-2">
            <SafeImage
              src={product.images?.[activeImg]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="order-3">
            <h1 className="font-serif text-3xl text-fasco-black md:text-4xl">{product.title}</h1>
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
                />
              ))}
              <span className="text-xs text-fasco-muted">({product.reviewCount} reviews)</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-medium text-fasco-black">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-fasco-muted line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="bg-fasco-black px-2 py-0.5 text-[10px] uppercase text-white">Sale</span>
                </>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-fasco-muted">{product.description}</p>

            <div className="mt-8">
              <p className="text-sm font-medium text-fasco-black">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.sizes || []).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] rounded border px-3 py-2 text-sm ${
                      size === s
                        ? 'border-fasco-black bg-fasco-black text-white'
                        : 'border-fasco-border hover:border-fasco-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-fasco-black">Color — {color?.name}</p>
              <div className="mt-2 flex gap-2">
                {(product.colors || []).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      color?.name === c.name ? 'border-fasco-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-fasco-border">
                <button type="button" className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="min-w-[40px] text-center text-sm">{qty}</span>
                <button type="button" className="px-3 py-2" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
              <button type="button" onClick={onAdd} disabled={adding} className="btn-primary flex-1 scroll-mt-28">
                {adding ? 'Adding...' : added ? 'Added!' : 'Add to cart'}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-fasco-muted">
              <button type="button" className="flex items-center gap-1 hover:text-fasco-black">
                <Heart size={16} /> Add to wishlist
              </button>
              <button type="button" className="flex items-center gap-1 hover:text-fasco-black">
                <Share2 size={16} /> Share
              </button>
            </div>
            <p className="mt-4 text-xs text-fasco-muted">
              Free shipping on orders over $100 · Easy 30-day returns
            </p>
          </div>
        </div>
      </div>

      <PromoBanner />

      <section className="container-fasco my-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">People Also Loved</h2>
            <p className="mt-2 text-sm text-fasco-muted">Hurry up! Limited stock available.</p>
          </div>
          <Countdown />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {related.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
