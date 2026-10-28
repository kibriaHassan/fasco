import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-fasco-border bg-white">
      <div className="container-fasco py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="font-serif text-2xl text-fasco-black">
            FASCO
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-fasco-muted">
            <Link to="/" className="hover:text-fasco-black">
              Support Center
            </Link>
            <Link to="/shop" className="hover:text-fasco-black">
              Invoicing
            </Link>
            <Link to="/#newsletter" className="hover:text-fasco-black">
              Contract
            </Link>
            <Link to="/shop" className="hover:text-fasco-black">
              Careers
            </Link>
            <Link to="/" className="hover:text-fasco-black">
              Blog
            </Link>
            <Link to="/" className="hover:text-fasco-black">
              FAQ,s
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-fasco-muted">
          Copyright © {new Date().getFullYear()} FASCO. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
