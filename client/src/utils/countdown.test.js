import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getCountdownParts, getNextMonthStart } from './countdown.js';

describe('getNextMonthStart', () => {
  it('moves to the first day of the next month across year boundaries', () => {
    const fromDate = new Date(2025, 11, 31, 23, 59, 59);
    const expected = new Date(2026, 0, 1).getTime();

    assert.equal(getNextMonthStart(fromDate), expected);
  });
});

describe('getCountdownParts', () => {
  it('calculates days, hours, minutes, and seconds from the remaining duration', () => {
    const duration = (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000;

    assert.deepEqual(getCountdownParts(100000 + duration, 100000), {
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      expired: false,
    });
  });

  it('marks a deadline as expired without returning negative time', () => {
    assert.deepEqual(getCountdownParts(999, 1000), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    });
  });

  it('returns no countdown for an invalid deadline', () => {
    assert.equal(getCountdownParts(Number.NaN, 1000), null);
  });
});
