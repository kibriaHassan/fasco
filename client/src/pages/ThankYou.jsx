import { Link, useLocation } from 'react-router-dom';

export default function ThankYou() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <main className="container-fasco flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-fasco-black text-2xl text-white">
        ✓
      </div>
      <h1 className="font-serif text-4xl text-fasco-black">Thank You!</h1>
      <p className="mt-4 max-w-md text-sm text-fasco-muted">
        {state?.demo
          ? 'Your demo order is complete. No payment was taken and nothing was saved to the live database.'
          : state?.guest
            ? 'Your demo order is complete. Sign in is required to save orders to your account.'
            : 'Your order has been placed successfully. We’ll send a confirmation email shortly.'}
      </p>
      {orderId && (
        <p className="mt-4 text-sm text-fasco-black">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/shop" className="btn-primary w-auto px-10">
          Continue Shopping
        </Link>
        <Link to="/" className="btn-outline px-10">
          Back Home
        </Link>
      </div>
    </main>
  );
}
