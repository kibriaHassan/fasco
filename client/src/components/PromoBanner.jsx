import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import { getDemoProduct } from '../utils/catalog';

const product = getDemoProduct('peaky-blinders-wool-flat-cap');

export default function PromoBanner() {
  const [size, setSize] = useState(product.sizes[0]);

  return (
    <section className="my-16 bg-[#F4F0EA] md:my-20">
      <div className="container-fasco grid md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[420px]">
          <SafeImage
            src="/images/home/peaky.jpg"
            alt="Peaky Blinders collection"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-12 md:px-14 lg:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-fasco-muted">Accessories Collection</p>
          <h2 className="mt-3 font-serif text-4xl text-fasco-black md:text-5xl">{product.title}</h2>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-fasco-black">Description</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-fasco-muted">
            Heritage-inspired details meet modern everyday style in this edit of tailored layers and signature
            accessories.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-fasco-black">Size:</span>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`min-w-[36px] rounded border px-2 py-1 text-xs ${
                    size === s
                      ? 'border-fasco-black bg-fasco-black text-white'
                      : 'border-fasco-border text-fasco-gray'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-5 text-2xl font-medium text-fasco-black">${product.price.toFixed(2)}</p>
          <Link
            to={`/product/${product.slug}`}
            state={{ size }}
            className="btn-primary mt-6 w-fit px-10"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
}
