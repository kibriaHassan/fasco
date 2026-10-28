import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

export default function AuthLayout({ image, imageAlt = 'FASCO fashion', children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDEDED] px-4 py-8">
      <div className="grid w-full max-w-[1100px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:min-h-[720px] lg:grid-cols-2">
        <div className="relative hidden min-h-[320px] lg:block">
          <SafeImage src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-14 lg:py-12">
          <Link to="/" className="font-serif text-[32px] leading-none tracking-wide text-fasco-black">
            FASCO
          </Link>
          <div className="flex-1 py-8">{children}</div>
          <p className="text-right text-[11px] text-fasco-muted">FASCO Terms &amp; Conditions</p>
        </div>
      </div>
    </div>
  );
}
