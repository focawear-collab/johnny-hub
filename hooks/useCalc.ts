import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import type { PizzaStyle } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'calc-state';

// Yeast factor table: grams of dry yeast per 100g flour for given hours/temp.
// Used for a simplified lookup — real values interpolated linearly.
// Format: [ferment_hours, temp_c, yeast_g_per_100g_flour]
const YEAST_FACTOR = 0.003; // simplified constant: 0.3% of flour weight

// ---------------------------------------------------------------------------
// Style defaults (fallback when Supabase is unavailable)
// ---------------------------------------------------------------------------
const STYLE_DEFAULTS: Record<
  string,
  { hyd: number; ball: number; salt: number; oil: number; ferment: number; tempC: number }
> = {
  napoletana: { hyd: 62, ball: 280, salt: 2.8,  oil: 0,   ferment: 48, tempC: 4 },
  newyork:    { hyd: 65, ball: 300, salt: 2.0,  oil: 2.0, ferment: 24, tempC: 4 },
  romana:     { hyd: 80, ball: 800, salt: 2.5,  oil: 3.0, ferment: 72, tempC: 4 },
  detroit:    { hyd: 70, ball: 900, salt: 2.0,  oil: 3.0, ferment: 48, tempC: 4 },
  pala:       { hyd: 78, ball: 700, salt: 2.5,  oil: 4.0, ferment: 96, tempC: 4 },
};

// ---------------------------------------------------------------------------
// Baker's % formula
// ---------------------------------------------------------------------------
export interface Formula {
  totalDough: number;  // g
  flour:      number;  // g
  water:      number;  // g
  saltG:      number;  // g
  oilG:       number;  // g
  yeast:      number;  // g dry yeast
}

function calcFormula(
  pizzas: number,
  ballSize: number,
  hyd: number,
  salt: number,
  oil: number
): Formula {
  const totalDough = pizzas * ballSize;

  // Baker's percentage: flour is the base (100%).
  // totalDough = flour * (1 + hyd/100 + salt/100 + oil/100)
  const divisor = 1 + hyd / 100 + salt / 100 + oil / 100;
  const flour = totalDough / divisor;

  const water  = flour * (hyd  / 100);
  const saltG  = flour * (salt / 100);
  const oilG   = flour * (oil  / 100);
  const yeast  = flour * YEAST_FACTOR;

  return {
    totalDough: Math.round(totalDough),
    flour:      Math.round(flour),
    water:      Math.round(water),
    saltG:      Math.round(saltG * 10) / 10,
    oilG:       Math.round(oilG  * 10) / 10,
    yeast:      Math.round(yeast * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Persisted state shape
// ---------------------------------------------------------------------------
interface CalcStateStorage {
  styleId: string;
  pizzas:  number;
  ballSize: number;
  hyd:     number;
  salt:    number;
  oil:     number;
  ferment: number;
  tempC:   number;
}

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------
export interface UseCalcReturn {
  // inputs
  styleId:    string;
  setStyleId: (id: string) => void;
  pizzas:     number;
  setPizzas:  (n: number) => void;
  ballSize:   number;
  setBallSize:(g: number) => void;
  hyd:        number;
  setHyd:     (h: number) => void;
  salt:       number;
  setSalt:    (s: number) => void;
  oil:        number;
  setOil:     (o: number) => void;
  ferment:    number;
  setFerment: (h: number) => void;
  tempC:      number;
  setTempC:   (t: number) => void;
  // derived
  formula:    Formula;
  // style meta
  styles:     PizzaStyle[];
  loadingStyles: boolean;
}

// ---------------------------------------------------------------------------
// useCalc hook
// ---------------------------------------------------------------------------
export function useCalc(): UseCalcReturn {
  const [styleId,    setStyleIdState]  = useState('napoletana');
  const [pizzas,     setPizzasState]   = useState(4);
  const [ballSize,   setBallSizeState] = useState(280);
  const [hyd,        setHydState]      = useState(62);
  const [salt,       setSaltState]     = useState(2.8);
  const [oil,        setOilState]      = useState(0);
  const [ferment,    setFermentState]  = useState(48);
  const [tempC,      setTempCState]    = useState(4);
  const [styles,     setStyles]        = useState<PizzaStyle[]>([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [hydrated,   setHydrated]      = useState(false);

  // ── Restore from AsyncStorage on mount ───────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved: CalcStateStorage = JSON.parse(raw);
          setStyleIdState(saved.styleId  ?? 'napoletana');
          setPizzasState( saved.pizzas   ?? 4);
          setBallSizeState(saved.ballSize ?? 280);
          setHydState(    saved.hyd      ?? 62);
          setSaltState(   saved.salt     ?? 2.8);
          setOilState(    saved.oil      ?? 0);
          setFermentState(saved.ferment  ?? 48);
          setTempCState(  saved.tempC    ?? 4);
        } catch {
          // corrupted storage — ignore
        }
      }
      setHydrated(true);
    });
  }, []);

  // ── Fetch pizza styles from Supabase ──────────────────────────────────────
  useEffect(() => {
    supabase
      .from('pizza_styles')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data) setStyles(data);
        setLoadingStyles(false);
      });
  }, []);

  // ── Persist to AsyncStorage whenever params change ────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const snapshot: CalcStateStorage = {
      styleId, pizzas, ballSize, hyd, salt, oil, ferment, tempC,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)).catch(() => {});
  }, [styleId, pizzas, ballSize, hyd, salt, oil, ferment, tempC, hydrated]);

  // ── setStyleId — resets params to style defaults ──────────────────────────
  const setStyleId = useCallback(
    (id: string) => {
      setStyleIdState(id);

      // Prefer remote style data, fall back to local defaults
      const remote = styles.find((s) => s.id === id);
      const def    = STYLE_DEFAULTS[id];

      setBallSizeState(remote?.ball_default ?? def?.ball    ?? 280);
      setHydState(     remote?.hyd_default  ?? def?.hyd     ?? 65);
      setSaltState(    remote?.salt_default !== null && remote?.salt_default !== undefined
        ? Number(remote.salt_default)
        : (def?.salt ?? 2.5));
      setOilState(     remote?.oil_default !== null && remote?.oil_default !== undefined
        ? Number(remote.oil_default)
        : (def?.oil ?? 0));
      setFermentState( remote?.ferment_default ?? def?.ferment ?? 48);
      // keep tempC at user's value — it's an environmental param, not style-specific
    },
    [styles]
  );

  // ── Derived formula ───────────────────────────────────────────────────────
  const formula = useMemo(
    () => calcFormula(pizzas, ballSize, hyd, salt, oil),
    [pizzas, ballSize, hyd, salt, oil]
  );

  return {
    styleId,
    setStyleId,
    pizzas,
    setPizzas:   setPizzasState,
    ballSize,
    setBallSize: setBallSizeState,
    hyd,
    setHyd:      setHydState,
    salt,
    setSalt:     setSaltState,
    oil,
    setOil:      setOilState,
    ferment,
    setFerment:  setFermentState,
    tempC,
    setTempC:    setTempCState,
    formula,
    styles,
    loadingStyles,
  };
}
