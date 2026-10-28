import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToIdWhenReady } from '../utils/scrollToId';

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      if (pathname !== '/') window.scrollTo(0, 0);
      return;
    }
    const id = hash.replace('#', '');
    scrollToIdWhenReady(id);
  }, [pathname, hash]);

  return null;
}
