import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import SafeImage from '../components/SafeImage';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, cartError } = useCart();

  return (
    <main>
      <div className="container-fasco py-8 md:py-12">
        <nav className="text-sm text-fasco-muted">
          <Link to="/" className="hover:text-fasco-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fasco-black">Shopping Cart</span>
        </nav>
        <h1 className="mt-4 font-serif text-4xl text-fasco-black">Shopping Cart</h1>
        {cartError && <p role="alert" className="mt-4 text-sm text-red-500">{cartError}</p>}

        {items.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-fasco-muted">Your cart is empty.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-block w-auto px-10">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-fasco-border text-fasco-muted">
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Quantity</th>
                    <th className="pb-4 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const title = item.title || item.product?.title || 'Product';
                    const image = item.image || item.product?.images?.[0];
                    const lineTotal = item.price * item.quantity;
                    return (
                      <tr key={item.id} className="border-b border-fasco-border">
                        <td className="py-6">
                          <div className="flex gap-4">
                            <SafeImage src={image} alt="" className="h-24 w-20 object-cover" />
                            <div>
                              <p className="font-medium text-fasco-black">{title}</p>
                              {item.color && (
                                <p className="mt-1 text-xs text-fasco-muted">Color: {item.color}</p>
                              )}
                              {item.size && (
                                <p className="text-xs text-fasco-muted">Size: {item.size}</p>
                              )}
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="mt-2 text-xs text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">${item.price.toFixed(2)}</td>
                        <td className="py-6">
                          <div className="inline-flex items-center border border-fasco-border">
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="min-w-[32px] text-center">{item.quantity}</span>
                            <button
                              type="button"
                              className="px-2 py-1"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-6 font-medium">${lineTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <aside className="h-fit rounded-lg border border-fasco-border p-6">
              <label className="flex items-start gap-2 text-sm text-fasco-gray">
                <input type="checkbox" className="mt-1" />
                Wrap The Product
              </label>
              <div className="mt-6 flex justify-between text-sm">
                <span className="text-fasco-muted">Subtotal</span>
                <span className="font-medium text-fasco-black">${subtotal.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-6 block text-center">
                Checkout
              </Link>
              <Link to="/cart" className="mt-3 block text-center text-sm text-fasco-muted hover:text-fasco-black">
                View Cart
              </Link>
            </aside>
          </div>
        )}
      </div>
      <Newsletter />
    </main>
  );
}
