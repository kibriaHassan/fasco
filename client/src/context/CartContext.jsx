import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CART_KEY = 'fasco_cart';

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function normalizeLineItem(item) {
  const price = item.price ?? item.product?.price ?? 0;
  return { ...item, price: Number(price) || 0 };
}

function mapApiCart(cart = []) {
  return cart.map((entry) =>
    normalizeLineItem({
      id: entry._id,
      productId: entry.product?._id ?? entry.product,
      product: entry.product,
      quantity: entry.quantity,
      size: entry.size,
      color: entry.color,
      price: entry.product?.price,
      title: entry.product?.title,
      image: entry.product?.images?.[0],
    }),
  );
}

function getRequestErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(loadCartFromStorage);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const syncCartFromApi = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get('/cart');
      setItems((previous) => [
        ...previous.filter((item) => item.isDemo),
        ...mapApiCart(data.cart),
      ]);
      setCartError('');
    } catch (error) {
      setCartError(getRequestErrorMessage(error, 'Could not load your saved cart.'));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    syncCartFromApi();
  }, [syncCartFromApi]);

  const addItem = useCallback(
    async (item) => {
      const normalized = normalizeLineItem(item);
      setCartError('');

      if (isAuthenticated && !normalized.product?.isDemo) {
        try {
          const { data } = await api.post('/cart', {
            productId: normalized.productId,
            quantity: normalized.quantity,
            size: normalized.size,
            color: normalized.color,
          });
          setItems(mapApiCart(data.cart));
          return true;
        } catch (error) {
          setCartError(getRequestErrorMessage(error, 'Could not add this item to your cart.'));
          return false;
        }
      }

      setItems((prev) => {
        const idx = prev.findIndex(
          (line) =>
            line.productId === normalized.productId &&
            line.size === normalized.size &&
            line.color?.toLowerCase() === normalized.color?.toLowerCase(),
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + normalized.quantity,
          };
          return next;
        }
        const id = normalized.product?.isDemo
          ? `demo-cart:${normalized.product.slug}:${normalized.size}:${normalized.color}`
          : normalized.id ?? crypto.randomUUID();
        return [...prev, { ...normalized, id, isDemo: Boolean(normalized.product?.isDemo) }];
      });
      return true;
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (id) => {
      if (isAuthenticated && !String(id).startsWith('demo-cart:')) {
        try {
          const { data } = await api.delete(`/cart/${id}`);
          setItems(mapApiCart(data.cart));
          setCartError('');
        } catch (error) {
          setCartError(getRequestErrorMessage(error, 'Could not remove this item.'));
        }
        return;
      }
      setItems((prev) => prev.filter((line) => line.id !== id));
    },
    [isAuthenticated],
  );

  const updateQty = useCallback(
    async (id, quantity) => {
      const qty = Math.max(1, quantity);
      if (isAuthenticated && !String(id).startsWith('demo-cart:')) {
        try {
          const { data } = await api.put(`/cart/${id}`, { quantity: qty });
          setItems(mapApiCart(data.cart));
          setCartError('');
        } catch (error) {
          setCartError(getRequestErrorMessage(error, 'Could not update this item.'));
        }
        return;
      }
      setItems((prev) =>
        prev.map((line) => (line.id === id ? { ...line, quantity: qty } : line)),
      );
    },
    [isAuthenticated],
  );

  const clear = useCallback(async () => {
    setItems([]);
    setCartError('');
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (error) {
        setCartError(getRequestErrorMessage(error, 'Could not clear your saved cart.'));
      }
    }
  }, [isAuthenticated]);

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      cartError,
      clearCartError: () => setCartError(''),
      subtotal,
      itemCount: items.reduce((n, line) => n + line.quantity, 0),
    }),
    [items, addItem, removeItem, updateQty, clear, cartError, subtotal],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
