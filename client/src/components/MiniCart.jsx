import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SafeImage from './SafeImage';

export default function MiniCart({ open, onClose }) {
  const { items, removeItem, updateQty, subtotal, cartError } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close cart" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-fasco-border px-5 py-4">
          <h2 className="font-serif text-xl text-fasco-black">Shopping Cart</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartError && <p role="alert" className="mb-4 text-sm text-red-500">{cartError}</p>}
          {items.length === 0 ? (
            <p className="text-sm text-fasco-muted">Your cart is empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <SafeImage
                    src={item.image || item.product?.images?.[0]}
                    alt=""
                    className="h-20 w-16 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fasco-black">
                      {item.title || item.product?.title}
                    </p>
                    <p className="text-xs text-fasco-muted">
                      {item.size}
                      {item.color ? ` / ${item.color}` : ''}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-fasco-border text-xs">
                        <button type="button" className="px-2 py-1" onClick={() => updateQty(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="min-w-[24px] text-center">{item.quantity}</span>
                        <button type="button" className="px-2 py-1" onClick={() => updateQty(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-1 text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-fasco-border px-5 py-4">
          <div className="mb-4 flex justify-between text-sm">
            <span className="text-fasco-muted">Subtotal</span>
            <span className="font-medium text-fasco-black">${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/cart" onClick={onClose} className="btn-outline mb-2 block w-full text-center">
            View Cart
          </Link>
          <Link to="/checkout" onClick={onClose} className="btn-primary block text-center">
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
