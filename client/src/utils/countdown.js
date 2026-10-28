export function getNextMonthStart(fromDate = new Date()) {
  return new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1).getTime();
}

export function getCountdownParts(targetTime, now = Date.now()) {
  if (!Number.isFinite(targetTime)) return null;

  const remaining = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: remaining === 0,
  };
}
