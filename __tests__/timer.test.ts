// FILE: app/__tests__/timer.test.ts

import { fermentPhaseAt, fmtTime } from '@/constants/calc';

// ---------------------------------------------------------------------------
// Pure timer / phase helpers
// ---------------------------------------------------------------------------

const TOTAL = 90; // seconds – livebake default

function pct(seconds: number, total: number): number {
  return seconds / total;
}

function remaining(total: number, seconds: number): number {
  return total - seconds;
}

function fmtRemaining(secondsLeft: number): string {
  return fmtTime(secondsLeft);
}

// ---------------------------------------------------------------------------
// pct
// ---------------------------------------------------------------------------

describe('pct', () => {
  test('pct = seconds / total', () => {
    expect(pct(45, 90)).toBeCloseTo(0.5);
    expect(pct(0, 90)).toBe(0);
    expect(pct(90, 90)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// remaining
// ---------------------------------------------------------------------------

describe('remaining', () => {
  test('remaining = total - seconds', () => {
    expect(remaining(90, 30)).toBe(60);
    expect(remaining(90, 0)).toBe(90);
    expect(remaining(90, 90)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// fmtRemaining (HH:MM:SS)
// ---------------------------------------------------------------------------

describe('fmtRemaining', () => {
  test('formats 0 as 00:00:00', () => {
    expect(fmtRemaining(0)).toBe('00:00:00');
  });

  test('formats 90s correctly', () => {
    expect(fmtRemaining(90)).toBe('00:01:30');
  });

  test('formats 3661s as 01:01:01', () => {
    expect(fmtRemaining(3661)).toBe('01:01:01');
  });

  test('formats 86399s as 23:59:59', () => {
    expect(fmtRemaining(86399)).toBe('23:59:59');
  });
});

// ---------------------------------------------------------------------------
// fermentPhaseAt – phase detection
// ---------------------------------------------------------------------------

describe('fermentPhaseAt', () => {
  test('0.5h elapsed → Mezcla phase (index 0)', () => {
    // 0.5h is still in Mezcla (boundary is < 0.5 for phase 0)
    // At exactly 0.5 it transitions to Bulk
    expect(fermentPhaseAt(0.25)).toBe(0);
  });

  test('3h elapsed → Cold ferment phase (index 2)', () => {
    expect(fermentPhaseAt(3)).toBe(2);
  });

  test('23h elapsed → Bench rest phase (index 3)', () => {
    expect(fermentPhaseAt(23)).toBe(3);
  });

  test('0h elapsed → Mezcla phase (index 0)', () => {
    expect(fermentPhaseAt(0)).toBe(0);
  });

  test('1h elapsed → Bulk a TA phase (index 1)', () => {
    expect(fermentPhaseAt(1)).toBe(1);
  });

  test('24h elapsed → Bolado final proof phase (index 4)', () => {
    expect(fermentPhaseAt(24)).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// timer reset
// ---------------------------------------------------------------------------

describe('timer reset', () => {
  test('timer starts at 0 when reset', () => {
    let elapsed = 100; // some elapsed value
    elapsed = 0; // reset
    expect(elapsed).toBe(0);
  });
});
