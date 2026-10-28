export function scrollToId(id, offset = 90) {
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  return true;
}

/** Retry briefly — Home sections may mount after navigate */
export function scrollToIdWhenReady(id, { offset = 90, tries = 20, delay = 50 } = {}) {
  return new Promise((resolve) => {
    let n = 0;
    const tick = () => {
      if (scrollToId(id, offset) || n >= tries) {
        resolve(n < tries);
        return;
      }
      n += 1;
      setTimeout(tick, delay);
    };
    tick();
  });
}
