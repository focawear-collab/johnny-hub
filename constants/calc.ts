// FILE: app/constants/calc.ts

import { PIZZA_STYLES } from './data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalcParams {
  pizzas: number;
  ballSize: number;
  hyd: number;
  salt: number;
  oil: number;
  ferment: number;
}

export interface CalcResult {
  totalDough: number;
  flour: number;
  water: number;
  saltG: number;
  oilG: number;
  yeast: number;
}

// ---------------------------------------------------------------------------
// Core baker's % formula
// ---------------------------------------------------------------------------

export function calcFormula(params: CalcParams): CalcResult {
  const { pizzas, ballSize, hyd, salt, oil, ferment } = params;
  const totalDough = pizzas * ballSize;
  const factor = 100 + hyd + salt + oil + 0.1;
  const flour = Math.round(totalDough / (factor / 100));
  const water = Math.round(flour * (hyd / 100));
  const saltG = Math.round(flour * (salt / 100) * 10) / 10;
  const oilG = Math.round(flour * (oil / 100) * 10) / 10;
  const yeast = Math.max(
    0.05,
    Math.round(flour * (0.4 / Math.sqrt(ferment)) * 100) / 100,
  );
  return { totalDough, flour, water, saltG, oilG, yeast };
}

// ---------------------------------------------------------------------------
// Hydration label
// ---------------------------------------------------------------------------

export function hydLabel(hyd: number): string {
  if (hyd <= 55) return 'Cracker';
  if (hyd <= 62) return 'Firme';
  if (hyd <= 68) return 'Equilibrada';
  if (hyd <= 76) return 'Alta';
  return 'Pala / Teglia';
}

// ---------------------------------------------------------------------------
// Fermentation phase detection
// Returns index 0–4 matching FERMENT_PHASES
// ---------------------------------------------------------------------------

export function fermentPhaseAt(elapsedH: number): number {
  // Phase boundaries based on FERMENT_PHASES cumulative start times
  // 0: Mezcla        0   – 0.5h
  // 1: Bulk a TA     0.5 – 2.5h
  // 2: Cold ferment  2.5 – 22.5h
  // 3: Bench rest    22.5– 23.5h
  // 4: Bolado        23.5+
  if (elapsedH < 0.5) return 0;
  if (elapsedH < 2.5) return 1;
  if (elapsedH < 22.5) return 2;
  if (elapsedH < 23.5) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Time formatter  HH:MM:SS
// ---------------------------------------------------------------------------

export function fmtTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

// ---------------------------------------------------------------------------
// Style preset helper – returns hydration for a given style id
// ---------------------------------------------------------------------------

export function styleHyd(styleId: string): number {
  const style = PIZZA_STYLES.find((s) => s.id === styleId);
  return style ? style.hyd : 65;
}

// ---------------------------------------------------------------------------
// Style preset – returns default ball size
// ---------------------------------------------------------------------------

export function styleBallSize(styleId: string): number {
  const style = PIZZA_STYLES.find((s) => s.id === styleId);
  return style ? style.balls : 250;
}
