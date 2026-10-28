import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { scrollToIdWhenReady } from '../utils/scrollToId';
import MiniCart from './MiniCart';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/#deals', label: 'Deals', hash: 'deals' },
  { to: '/#arrivals', label: 'New Arrivals', hash: 'arrivals' },
  { to: '/shop', label: 'Packages' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  const [query, setQuery] = useState('');

  const goHash = async (sectionId) => {
    setOpen(false);
    if (pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    // Already on home — update hash + scroll
    if (hash !== `#${sectionId}`) {
      navigate(`/#${sectionId}`, { replace: true });
    }
    await scrollToIdWhenReady(sectionId);
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-fasco-border/70 bg-white">
        <div className="container-fasco flex h-[72px] items-center justify-between lg:h-20">
          <Link to="/" className="font-serif text-[28px] tracking-wide text-fasco-black lg:text-[32px]">
            FASCO
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {links.map((link) =>
              link.hash ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => goHash(link.hash)}
                  className={`text-sm transition hover:text-fasco-black ${
                    pathname === '/' && hash === `#${link.hash}`
                      ? 'font-medium text-fasco-black'
                      : 'text-fasco-muted'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `text-sm transition hover:text-fasco-black ${
                      isActive && pathname === '/' && !hash
                        ? 'font-medium text-fasco-black'
                        : isActive && link.to !== '/'
                          ? 'font-medium text-fasco-black'
                          : 'text-fasco-muted'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-4 md:flex">
              {!isAuthenticated ? (
                <>
                  <Link to="/sign-in" className="text-sm text-fasco-black hover:opacity-70">
                    Sign in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="rounded-md bg-fasco-black px-5 py-2 text-sm font-medium text-white shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:bg-neutral-800"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm text-fasco-muted">Hi, {user?.firstName}</span>
                  <button type="button" onClick={logout} className="text-sm text-fasco-black hover:opacity-70">
                    Logout
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label="Search"
              className="text-fasco-black hover:opacity-70"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={20} />
            </button>
            <Link to="/sign-in" className="text-fasco-black hover:opacity-70 md:hidden" aria-label="Account">
              <User size={20} />
            </Link>
            <button type="button" className="hidden text-fasco-black hover:opacity-70 sm:block" aria-label="Wishlist">
              <Heart size={20} />
            </button>
            <button
              type="button"
              onClick={() => setMiniOpen(true)}
              className="relative text-fasco-black hover:opacity-70"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-fasco-black px-0.5 text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <button type="button" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={onSearch} className="border-t border-fasco-border px-4 py-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="input-underline mx-auto block max-w-xl"
            />
          </form>
        )}

        {open && (
          <div className="border-t border-fasco-border bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) =>
                link.hash ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => goHash(link.hash)}
                    className="text-left text-sm text-fasco-gray"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-sm text-fasco-gray"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <Link to="/sign-in" onClick={() => setOpen(false)} className="text-sm text-fasco-gray">
                Sign in
              </Link>
              <Link to="/sign-up" onClick={() => setOpen(false)} className="text-sm font-medium text-fasco-black">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>
      <MiniCart open={miniOpen} onClose={() => setMiniOpen(false)} />
    </>
  );
}
