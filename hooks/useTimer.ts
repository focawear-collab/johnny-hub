// FILE: app/hooks/useTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateBakeStatus } from '../lib/db';
import {
  notifyFermentComplete,
  cancelFermentNotification,
} from '../lib/notifications';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'timer-state';
const TICK_MS = 1000;

// ---------------------------------------------------------------------------
// Fermentation phases
// ---------------------------------------------------------------------------
export interface Phase {
  label: string;
  startPct: number; // 0–100
  endPct:   number;
}

const PHASES: Phase[] = [
  { label: 'Mezcla',       startPct:  0,  endPct: 10 },
  { label: 'Reposo',       startPct: 10,  endPct: 25 },
  { label: 'Frío',         startPct: 25,  endPct: 90 },
  { label: 'Atemperar',    startPct: 90,  endPct: 97 },
  { label: 'Listo',        startPct: 97,  endPct: 100 },
];

function getCurrentPhaseIdx(pct: number): number {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (pct >= PHASES[i].startPct) return i;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Timer status type
// ---------------------------------------------------------------------------
export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

// ---------------------------------------------------------------------------
// Persisted state
// ---------------------------------------------------------------------------
interface TimerStorage {
  bakeSessionId: string | null;
  startedAt:     string | null;   // ISO
  pausedAt:      string | null;   // ISO (set when paused)
  pausedElapsed: number;          // seconds elapsed at time of pause
  totalSeconds:  number;
  status:        TimerStatus;
}

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------
export interface UseTimerReturn {
  seconds:           number;          // elapsed seconds
  totalSeconds:      number;
  running:           boolean;
  status:            TimerStatus;
  pct:               number;          // 0–100 completion percentage
  remaining:         number;          // remaining seconds
  fmtRemaining:      string;          // "HH:MM:SS"
  phases:            Phase[];
  currentPhaseIdx:   number;
  bakeSessionId:     string | null;
  start: (totalSeconds: number, bakeSessionId?: string) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  scheduleNotification: () => void;
}

// ---------------------------------------------------------------------------
// Utility: format seconds as HH:MM:SS
// ---------------------------------------------------------------------------
function fmtSeconds(s: number): string {
  const abs  = Math.max(0, Math.floor(s));
  const h    = Math.floor(abs / 3600);
  const m    = Math.floor((abs % 3600) / 60);
  const sec  = abs % 60;
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(sec).padStart(2, '0'),
  ].join(':');
}

// ---------------------------------------------------------------------------
// useTimer hook
// ---------------------------------------------------------------------------
export function useTimer(): UseTimerReturn {
  const [status,        setStatus]        = useState<TimerStatus>('idle');
  const [totalSeconds,  setTotalSeconds]  = useState(0);
  const [elapsed,       setElapsed]       = useState(0);    // seconds elapsed
  const [bakeSessionId, setBakeSessionId] = useState<string | null>(null);

  // Refs for interval management
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef    = useRef<Date | null>(null);
  const pausedElapsedRef = useRef(0);        // seconds elapsed when paused
  const hydrated        = useRef(false);

  // ── Persist state ─────────────────────────────────────────────────────────
  const persist = useCallback(
    (patch: Partial<TimerStorage>) => {
      AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
        const current: TimerStorage = raw
          ? JSON.parse(raw)
          : {
              bakeSessionId: null,
              startedAt: null,
              pausedAt: null,
              pausedElapsed: 0,
              totalSeconds: 0,
              status: 'idle',
            };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch })).catch(() => {});
      });
    },
    []
  );

  // ── Restore from AsyncStorage on mount ───────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved: TimerStorage = JSON.parse(raw);

          if (saved.status === 'running' && saved.startedAt) {
            // Recompute elapsed from wall clock
            const now  = Date.now();
            const base = new Date(saved.startedAt).getTime();
            const el   = Math.floor((now - base) / 1000) + (saved.pausedElapsed ?? 0);

            setTotalSeconds(saved.totalSeconds);
            setBakeSessionId(saved.bakeSessionId);
            startedAtRef.current    = new Date(saved.startedAt);
            pausedElapsedRef.current = 0; // already folded in above

            if (el >= saved.totalSeconds) {
              // Timer already finished while app was closed
              setElapsed(saved.totalSeconds);
              setStatus('done');
            } else {
              setElapsed(el);
              setStatus('running');
            }
          } else if (saved.status === 'paused') {
            setTotalSeconds(saved.totalSeconds);
            setBakeSessionId(saved.bakeSessionId);
            pausedElapsedRef.current = saved.pausedElapsed ?? 0;
            setElapsed(saved.pausedElapsed ?? 0);
            setStatus('paused');
          } else if (saved.status === 'done') {
            setTotalSeconds(saved.totalSeconds);
            setBakeSessionId(saved.bakeSessionId);
            setElapsed(saved.totalSeconds);
            setStatus('done');
          }
        } catch {
          // corrupted — ignore
        }
      }
      hydrated.current = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tick interval ─────────────────────────────────────────────────────────
  const startTick = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        return next;
      });
    }, TICK_MS);
  }, []);

  const stopTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Watch elapsed to detect completion ───────────────────────────────────
  useEffect(() => {
    if (status === 'running' && elapsed >= totalSeconds && totalSeconds > 0) {
      stopTick();
      setStatus('done');
      cancelFermentNotification();

      if (bakeSessionId) {
        try { updateBakeStatus(bakeSessionId, 'done', new Date().toISOString()); }
        catch (e) { console.warn('[useTimer] Failed to update bake session:', e); }
      }

      persist({ status: 'done' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, totalSeconds, status]);

  // ── start ─────────────────────────────────────────────────────────────────
  const start = useCallback(
    (total: number, sessionId?: string) => {
      stopTick();
      const now = new Date();
      startedAtRef.current     = now;
      pausedElapsedRef.current = 0;

      setTotalSeconds(total);
      setElapsed(0);
      setStatus('running');
      setBakeSessionId(sessionId ?? null);

      persist({
        bakeSessionId:  sessionId ?? null,
        startedAt:      now.toISOString(),
        pausedAt:       null,
        pausedElapsed:  0,
        totalSeconds:   total,
        status:         'running',
      });

      startTick();

      // Schedule push notification
      const readyAt = new Date(now.getTime() + total * 1000);
      notifyFermentComplete(readyAt).catch(() => {});
    },
    [persist, startTick, stopTick]
  );

  // ── pause ─────────────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (status !== 'running') return;
    stopTick();
    pausedElapsedRef.current = elapsed;
    setStatus('paused');
    persist({
      pausedAt:      new Date().toISOString(),
      pausedElapsed: elapsed,
      status:        'paused',
    });
    cancelFermentNotification();
  }, [elapsed, pause, persist, status, stopTick]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── resume ────────────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    if (status !== 'paused') return;

    // Re-anchor startedAt so tick can't drift
    const now = new Date();
    startedAtRef.current = now;
    setStatus('running');

    persist({
      startedAt:     now.toISOString(),
      pausedAt:      null,
      status:        'running',
    });

    startTick();

    // Re-schedule notification for remaining time
    const remainingSeconds = totalSeconds - pausedElapsedRef.current;
    if (remainingSeconds > 0) {
      const readyAt = new Date(now.getTime() + remainingSeconds * 1000);
      notifyFermentComplete(readyAt).catch(() => {});
    }
  }, [persist, startTick, status, totalSeconds]);

  // ── reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    stopTick();
    setElapsed(0);
    setTotalSeconds(0);
    setStatus('idle');
    setBakeSessionId(null);
    startedAtRef.current     = null;
    pausedElapsedRef.current = 0;
    cancelFermentNotification();
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, [stopTick]);

  // ── scheduleNotification ──────────────────────────────────────────────────
  const scheduleNotification = useCallback(() => {
    if (status !== 'running') return;
    const remaining = totalSeconds - elapsed;
    if (remaining > 0) {
      const readyAt = new Date(Date.now() + remaining * 1000);
      notifyFermentComplete(readyAt).catch(() => {});
    }
  }, [elapsed, status, totalSeconds]);

  // ── Clean up on unmount ───────────────────────────────────────────────────
  useEffect(() => () => stopTick(), [stopTick]);

  // ── Derived values ────────────────────────────────────────────────────────
  const remaining      = Math.max(0, totalSeconds - elapsed);
  const pct            = totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;
  const fmtRemaining   = fmtSeconds(remaining);
  const currentPhaseIdx = getCurrentPhaseIdx(pct);

  return {
    seconds:       elapsed,
    totalSeconds,
    running:       status === 'running',
    status,
    pct,
    remaining,
    fmtRemaining,
    phases:        PHASES,
    currentPhaseIdx,
    bakeSessionId,
    start,
    pause,
    resume,
    reset,
    scheduleNotification,
  };
}
