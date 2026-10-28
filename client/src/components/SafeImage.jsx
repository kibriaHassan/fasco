const FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect fill="#f0f0f0" width="800" height="1000"/>
      <text x="400" y="490" text-anchor="middle" fill="#999" font-family="Arial,sans-serif" font-size="28">FASCO</text>
      <text x="400" y="530" text-anchor="middle" fill="#bbb" font-family="Arial,sans-serif" font-size="16">Image</text>
    </svg>`,
  );

export default function SafeImage({ src, alt = '', className = '', ...rest }) {
  return (
    <img
      key={src || 'fallback'}
      src={src || FALLBACK}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (e.currentTarget.src !== FALLBACK) {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK;
        }
      }}
      {...rest}
    />
  );
}
