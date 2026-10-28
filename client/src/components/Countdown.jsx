import { useEffect, useState } from 'react';
import { getCountdownParts, getNextMonthStart } from '../utils/countdown';

export default function Countdown({ endDate }) {
  const [defaultTarget, setDefaultTarget] = useState(getNextMonthStart);
  const usesDefaultTarget = endDate == null;
  const target = usesDefaultTarget ? defaultTarget : new Date(endDate).getTime();
  const [parts, setParts] = useState(null);

  useEffect(() => {
    const update = () => {
      if (usesDefaultTarget && target <= Date.now()) {
        setDefaultTarget(getNextMonthStart());
        return;
      }
      setParts(getCountdownParts(target));
    };
    update();
    if (!Number.isFinite(target)) return undefined;

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target, usesDefaultTarget]);

  if (!parts) {
    return (
      <p role="status" className="text-sm text-fasco-muted">
        Countdown unavailable
      </p>
    );
  }

  if (parts.expired) {
    return (
      <p role="status" className="text-sm text-fasco-muted">
        Offer has ended
      </p>
    );
  }

  const cells = [
    { label: 'Days', value: parts.days },
    { label: 'Hr', value: parts.hours },
    { label: 'Mins', value: parts.minutes },
    { label: 'Secs', value: parts.seconds },
  ];

  return (
    <div className="flex gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[70px] flex-col items-center rounded-md bg-white px-3 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <span className="text-xl font-semibold text-fasco-black md:text-2xl">
            {String(c.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[11px] text-fasco-muted">{c.label}</span>
        </div>
      ))}
    </div>
  );
}
