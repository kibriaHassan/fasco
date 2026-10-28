import { Headphones, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'High Quality', desc: 'crafted from top materials' },
  { icon: ShieldCheck, title: 'Warranty Protection', desc: 'Over 2 years' },
  { icon: Truck, title: 'Free Shipping', desc: 'Order over 150 $' },
  { icon: Headphones, title: '24 / 7 Support', desc: 'Dedicated support' },
];

export default function FeatureStrip() {
  return (
    <section className="border-y border-fasco-border bg-white py-12 md:py-14">
      <div className="container-fasco grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 shrink-0 text-fasco-black" size={28} strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-fasco-black md:text-base">{title}</p>
              <p className="mt-1 text-xs text-fasco-muted md:text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
