import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Newsletter from '../components/Newsletter';
import SafeImage from '../components/SafeImage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contactEmail: user?.email || '',
    country: 'United States',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: '',
    saveInfo: false,
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expiration: '',
    securityCode: '',
    cardholderName: '',
  });

  const shipping = subtotal - discount > 100 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (code === 'FASCO10') {
      setDiscount(subtotal * 0.1);
      setAppliedDiscountCode(code);
      setError('');
    } else if (code === 'WELCOME15') {
      setDiscount(subtotal * 0.15);
      setAppliedDiscountCode(code);
      setError('');
    } else {
      setDiscount(0);
      setAppliedDiscountCode('');
      setError('Invalid discount code');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError('Cart is empty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const demoOrder = items.some((item) => item.isDemo);
      if (isAuthenticated && !demoOrder) {
        // Sync local cart to server before placing order
        await api.delete('/cart').catch(() => {});
        for (const item of items) {
          await api.post('/cart', {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          });
        }
        const { data } = await api.post('/orders', {
          contactEmail: form.contactEmail,
          delivery: {
            country: form.country,
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            saveInfo: form.saveInfo,
          },
          payment: {
            method: form.paymentMethod,
            cardNumber: form.cardNumber,
            expiration: form.expiration,
            securityCode: form.securityCode,
            cardholderName: form.cardholderName,
          },
          discountCode: appliedDiscountCode || undefined,
        });
        await clear();
        navigate('/thank-you', { state: { orderId: data.order?._id || data._id } });
      } else {
        await clear();
        navigate('/thank-you', {
          state: {
            orderId: `DEMO-${Date.now().toString(36).toUpperCase()}`,
            guest: !isAuthenticated,
            demo: true,
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <main className="container-fasco py-20 text-center">
        <p className="text-fasco-muted">Nothing to checkout.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-block w-auto px-10">
          Shop Now
        </Link>
      </main>
    );
  }

  return (
    <main>
      <div className="container-fasco py-8 md:py-12">
        <h1 className="font-serif text-3xl text-fasco-black md:text-4xl">FASCO Demo Checkout</h1>
        {items.some((item) => item.isDemo) && (
          <p className="mt-3 text-sm text-fasco-muted">
            Demo catalog checkout: no payment will be charged and this order will not be saved to the live database.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-fasco-black">Contact</h2>
              <input
                name="contactEmail"
                type="email"
                required
                value={form.contactEmail}
                onChange={onChange}
                placeholder="Email"
                className="input-underline mt-4"
              />
              {!isAuthenticated && (
                <p className="mt-2 text-sm text-fasco-muted">
                  Have an account?{' '}
                  <Link to="/sign-in" className="text-fasco-blue hover:underline">
                    Create Account
                  </Link>
                </p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-fasco-black">Delivery</h2>
              <div className="mt-4 space-y-4">
                <select name="country" value={form.country} onChange={onChange} className="input-underline">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Bangladesh</option>
                  <option>Canada</option>
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="firstName" required placeholder="First Name" value={form.firstName} onChange={onChange} className="input-underline" />
                  <input name="lastName" required placeholder="Last Name" value={form.lastName} onChange={onChange} className="input-underline" />
                </div>
                <input name="address" required placeholder="Address" value={form.address} onChange={onChange} className="input-underline" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="city" required placeholder="City" value={form.city} onChange={onChange} className="input-underline" />
                  <input name="postalCode" required placeholder="Postal Code" value={form.postalCode} onChange={onChange} className="input-underline" />
                </div>
                <label className="flex items-center gap-2 text-sm text-fasco-muted">
                  <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={onChange} />
                  Save this information for next time
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-fasco-black">Payment</h2>
              <div className="mt-4 space-y-4">
                <select name="paymentMethod" value={form.paymentMethod} onChange={onChange} className="input-underline">
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Cash on Delivery</option>
                </select>
                {form.paymentMethod === 'Credit Card' && (
                  <>
                    <input name="cardNumber" required placeholder="Card Number" value={form.cardNumber} onChange={onChange} className="input-underline" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input name="expiration" required placeholder="Expiration (MM/YY)" value={form.expiration} onChange={onChange} className="input-underline" />
                      <input name="securityCode" required placeholder="Security Code" value={form.securityCode} onChange={onChange} className="input-underline" />
                    </div>
                    <input name="cardholderName" required placeholder="Cardholder Name" value={form.cardholderName} onChange={onChange} className="input-underline" />
                  </>
                )}
              </div>
            </section>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <aside className="h-fit rounded-lg border border-fasco-border bg-neutral-50 p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative">
                    <SafeImage
                      src={item.image || item.product?.images?.[0]}
                      alt=""
                      className="h-16 w-14 rounded object-cover"
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-fasco-black text-[10px] text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fasco-black">
                      {item.title || item.product?.title}
                    </p>
                    <p className="text-xs text-fasco-muted">
                      {item.size} {item.color ? `/ ${item.color}` : ''}
                    </p>
                  </div>
                  <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setAppliedDiscountCode('');
                  setDiscount(0);
                }}
                placeholder="Discount code"
                className="input-underline flex-1"
              />
              <button type="button" onClick={applyDiscount} className="btn-outline shrink-0 px-4 py-2">
                Apply
              </button>
            </div>
            <p className="mt-2 text-[11px] text-fasco-muted">Try FASCO10 or WELCOME15</p>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fasco-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-fasco-muted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t border-fasco-border pt-3 text-base font-semibold text-fasco-black">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
      <Newsletter />
    </main>
  );
}
