import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import SafeImage from './SafeImage';

export default function ProductCard({ product }) {
  if (!product) return null;
  const img = product.images?.[0];
  const reviews =
    product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1)}k`
      : String(product.reviewCount || 0);
  const lowStock = (product.stock ?? 0) < 20;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <SafeImage
          src={img}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1.5 text-center">
        <h3 className="text-[15px] font-medium text-fasco-black">{product.title}</h3>
        <p className="text-xs text-fasco-muted">
          {product.category === 'WOMEN'
            ? 'FASCO'
            : product.category?.charAt(0) + product.category?.slice(1).toLowerCase()}
        </p>
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.round(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}
            />
          ))}
        </div>
        <p className="text-[11px] text-fasco-muted">({reviews}) Customer Reviews</p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <p className="text-sm font-semibold text-fasco-black">${product.price.toFixed(2)}</p>
          {lowStock && <span className="text-[11px] font-medium text-red-500">Almost Sold Out</span>}
        </div>
        {product.colors?.length > 0 && (
          <div className="flex justify-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
