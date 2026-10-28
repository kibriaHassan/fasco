const brands = [
  { name: 'Chanel', className: 'tracking-[0.35em] uppercase' },
  { name: 'Louis Vuitton', className: 'italic' },
  { name: 'PRADA', className: 'tracking-[0.4em] font-semibold' },
  { name: 'Calvin Klein', className: 'tracking-widest uppercase text-lg md:text-xl' },
  { name: 'DENIM', className: 'font-bold tracking-wide' },
];

export default function BrandStrip() {
  return (
    <section className="border-y border-fasco-border bg-white py-10 md:py-14">
      <div className="container-fasco flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-between">
        {brands.map((brand) => (
          <span
            key={brand.name}
            className={`font-serif text-xl text-fasco-black/80 md:text-2xl lg:text-[26px] ${brand.className}`}
          >
            {brand.name}
          </span>
        ))}
      </div>
    </section>
  );
}
