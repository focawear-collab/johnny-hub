// FILE: app/__tests__/calc.test.ts

import {
  calcFormula,
  hydLabel,
  fermentPhaseAt,
  fmtTime,
  styleHyd,
  styleBallSize,
} from '@/constants/calc';

// ---------------------------------------------------------------------------
// calcFormula – baker's percentage
// ---------------------------------------------------------------------------

describe('calcFormula', () => {
  const base = {
    pizzas: 4,
    ballSize: 250,
    hyd: 65,
    salt: 2.8,
    oil: 0,
    ferment: 24,
  };

  test('flour calculation is correct', () => {
    const { flour } = calcFormula(base);
    // totalDough = 4 * 250 = 1000
    // factor = 100 + 65 + 2.8 + 0 + 0.1 = 167.9
    // flour = round(1000 / 1.679) ≈ 596
    expect(flour).toBeCloseTo(596, 0);
  });

  test('water calculation equals flour * hyd/100', () => {
    const { flour, water } = calcFormula(base);
    expect(water).toBe(Math.round(flour * (base.hyd / 100)));
  });

  test('salt calculation equals flour * salt/100 (1 dp)', () => {
    const { flour, saltG } = calcFormula(base);
    const expected = Math.round(flour * (base.salt / 100) * 10) / 10;
    expect(saltG).toBe(expected);
  });

  test('yeast formula decreases with more fermentation time', () => {
    const short = calcFormula({ ...base, ferment: 6 });
    const long = calcFormula({ ...base, ferment: 48 });
    expect(short.yeast).toBeGreaterThan(long.yeast);
  });

  test('yeast minimum is never below 0.05', () => {
    const extreme = calcFormula({ ...base, ferment: 9999 });
    expect(extreme.yeast).toBeGreaterThanOrEqual(0.05);
  });

  test('style preset napoletana gives hyd=65', () => {
    const hyd = styleHyd('napoletana');
    expect(hyd).toBe(65);
  });

  test('totalDough equals pizzas * ballSize', () => {
    const result = calcFormula({ ...base, pizzas: 6, ballSize: 300 });
    expect(result.totalDough).toBe(6 * 300);
  });

  test('style change resets ball size – detroit has 350g balls', () => {
    const detroitBall = styleBallSize('detroit');
    expect(detroitBall).toBe(350);
    const napBall = styleBallSize('napoletana');
    expect(napBall).toBe(250);
    // Simulating a style change: new ballSize comes from styleBallSize
    expect(detroitBall).not.toBe(napBall);
  });
});

// ---------------------------------------------------------------------------
// hydLabel
// ---------------------------------------------------------------------------

describe('hydLabel', () => {
  test('≤55 → Cracker', () => expect(hydLabel(50)).toBe('Cracker'));
  test('≤62 → Firme', () => expect(hydLabel(60)).toBe('Firme'));
  test('≤68 → Equilibrada', () => expect(hydLabel(65)).toBe('Equilibrada'));
  test('≤76 → Alta', () => expect(hydLabel(70)).toBe('Alta'));
  test('>76 → Pala / Teglia', () => expect(hydLabel(80)).toBe('Pala / Teglia'));
});
