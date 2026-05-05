// FILE: app/app/(tabs)/timer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { FERMENT_PHASES } from '@/constants/data';
import { notifyFermentComplete } from '@/lib/notifications';
import * as Icons from '@/components/icons';

const C = Colors;
const F = Typography.fontFamily;

const TOTAL_SECONDS = 24 * 3600;
const STORAGE_KEY = '@jh_timer_state';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmt(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(sec).padStart(2, '0'),
  ].join(':');
}

// ---------------------------------------------------------------------------
// useTimer hook
// ---------------------------------------------------------------------------
interface TimerState {
  seconds: number;
  running: boolean;
  startedAt: number | null; // timestamp ms
}

function useTimer() {
  const [seconds, setSeconds] = useState(18 * 3600 + 23 * 60);
  const [running, setRunning] = useState(true);
  const [startedAt, setStartedAt] = useState<number | null>(Date.now() - (18 * 3600 + 23 * 60) * 1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>('active');

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: TimerState = JSON.parse(raw);
          if (saved.running && saved.startedAt != null) {
            // Compute elapsed time since app was backgrounded
            const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
            const restored = Math.min(TOTAL_SECONDS, saved.seconds + elapsed);
            setSeconds(restored);
            setStartedAt(saved.startedAt);
            setRunning(saved.running);
          } else {
            setSeconds(saved.seconds);
            setRunning(saved.running);
          }
        }
      } catch {
        // use initial state
      }
    })();
  }, []);

  // Persist on change
  const persist = useCallback(async (s: number, r: boolean, sa: number | null) => {
    try {
      const state: TimerState = { seconds: s, running: r, startedAt: sa };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, []);

  // Tick
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (running && seconds < TOTAL_SECONDS) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = Math.min(TOTAL_SECONDS, prev + 1);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds >= TOTAL_SECONDS]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist whenever state changes
  useEffect(() => {
    persist(seconds, running, startedAt);
  }, [seconds, running, startedAt, persist]);

  // Handle app background/foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appStateRef.current === 'active' && next !== 'active') {
        // App going to background — save current time reference
        persist(seconds, running, startedAt);
      } else if (appStateRef.current !== 'active' && next === 'active') {
        // App returning from background — reconcile elapsed time
        if (running && startedAt != null) {
          const elapsed = Math.floor((Date.now() - startedAt) / 1000);
          setSeconds((prev) => Math.min(TOTAL_SECONDS, prev + elapsed));
        }
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [running, seconds, startedAt, persist]);

  const toggle = useCallback(() => {
    setRunning((prev) => {
      const next = !prev;
      if (next) {
        setStartedAt(Date.now());
      }
      return next;
    });
  }, []);

  // Schedule notification when timer starts
  useEffect(() => {
    if (running && seconds < TOTAL_SECONDS) {
      const remaining = TOTAL_SECONDS - seconds;
      const readyAt = new Date(Date.now() + remaining * 1000);
      notifyFermentComplete(readyAt).catch(() => {});
    }
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  return { seconds, running, toggle };
}

// ---------------------------------------------------------------------------
// ProgressRing — SVG circle with gradient stroke
// ---------------------------------------------------------------------------
function ProgressRing({ pct, size }: { pct: number; size: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#C89759" />
          <Stop offset="100%" stopColor="#C45A2A" />
        </LinearGradient>
      </Defs>
      {/* Track */}
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="rgba(244,237,228,0.08)"
        strokeWidth={6}
        fill="none"
      />
      {/* Progress arc */}
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="url(#ringGrad)"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - pct)}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// PhaseRow — fermentation phase item in timeline
// ---------------------------------------------------------------------------
function PhaseRow({
  p,
  idx,
  active,
  done,
  last,
}: {
  p: (typeof FERMENT_PHASES)[0];
  idx: number;
  active: boolean;
  done: boolean;
  last: boolean;
}) {
  return (
    <View style={styles.phaseRow}>
      {/* Left: indicator + line */}
      <View style={styles.phaseIndicatorCol}>
        <View
          style={[
            styles.phaseCircle,
            done && styles.phaseCircleDone,
            active && styles.phaseCircleActive,
          ]}
        >
          {done ? (
            <Icons.Check size={12} color="#fff" />
          ) : (
            <Text
              style={[
                styles.phaseNum,
                active && { color: C.accent },
                !active && !done && { color: C.fg3 },
              ]}
            >
              {idx + 1}
            </Text>
          )}
        </View>
        {!last && (
          <View style={[styles.phaseLine, done && styles.phaseLineDone]} />
        )}
      </View>
      {/* Right: content */}
      <View style={styles.phaseContent}>
        <Text
          style={[
            styles.phaseName,
            active && { color: C.accent },
            done && styles.phaseNameDone,
          ]}
        >
          {p.name}
        </Text>
        <Text style={styles.phaseSub}>{p.sub}</Text>
        {active && (
          <Text style={styles.phaseQuote}>
            "Mantén la masa entre 2–4°C. Estable, sin abrir nevera."
          </Text>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TimerScreen
// ---------------------------------------------------------------------------
export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { seconds, running, toggle } = useTimer();

  const remaining = TOTAL_SECONDS - seconds;
  const pct = seconds / TOTAL_SECONDS;

  const elapsedH = seconds / 3600;
  const currentPhase = FERMENT_PHASES.findIndex(
    (p) => elapsedH >= p.t && elapsedH < p.t + p.dur,
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero readout */}
      <View style={styles.heroSection}>
        <Text style={styles.heroEyebrow}>● COLD FERMENT · NAPOLETANA</Text>
        <Text style={styles.heroBigTime}>{fmt(remaining)}</Text>
        <Text style={styles.heroSub}>
          RESTANTES · {Math.round(pct * 100)}% COMPLETO
        </Text>
      </View>

      {/* Progress ring */}
      <View style={styles.ringWrapper}>
        <ProgressRing pct={pct} size={180} />
        {/* Center overlay text */}
        <View style={styles.ringCenter} pointerEvents="none">
          <Text style={styles.ringPctBig}>
            {Math.round(pct * 100)}
            <Text style={styles.ringPctUnit}>%</Text>
          </Text>
          <Text style={styles.ringLabel}>FERMENT</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
          <Icons.Settings size={20} color={C.fg1} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={toggle}
          activeOpacity={0.85}
        >
          {running ? (
            <>
              <Icons.Pause size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Pausar</Text>
            </>
          ) : (
            <>
              <Icons.Play size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Reanudar</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
          <Icons.Bell size={20} color={C.fg1} />
        </TouchableOpacity>
      </View>

      {/* Phases timeline */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Fases<Text style={styles.sectionEmphasis}> · 5</Text>
        </Text>
      </View>

      <View style={styles.px}>
        {FERMENT_PHASES.map((p, i) => (
          <PhaseRow
            key={i}
            p={p}
            idx={i}
            active={i === currentPhase}
            done={i < currentPhase}
            last={i === FERMENT_PHASES.length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg0 },
  scrollContent: { flexGrow: 1 },
  px: { paddingHorizontal: Spacing.screenPadding },

  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  heroEyebrow: {
    fontFamily: F.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    color: C.accent,
    textTransform: 'uppercase',
  },
  heroBigTime: {
    fontFamily: F.serif,
    fontSize: 72,
    color: C.fg0,
    letterSpacing: -3,
    lineHeight: 84,
    marginTop: 14,
    includeFontPadding: false,
  },
  heroSub: {
    fontFamily: F.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    color: C.fg3,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPctBig: {
    fontFamily: F.serif,
    fontSize: 36,
    color: C.fg0,
    lineHeight: 42,
  },
  ringPctUnit: {
    fontFamily: F.serif,
    fontSize: 18,
    color: C.fg2,
  },
  ringLabel: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 1.4,
    color: C.fg3,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: Spacing.screenPadding,
    marginTop: 24,
  },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.bg2,
    borderWidth: 0.5,
    borderColor: C.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: Spacing.buttonRadius,
    paddingVertical: 16,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    fontFamily: F.sansSemiBold,
    fontSize: 15,
    color: '#fff',
  },

  sectionHeader: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: F.serif,
    fontSize: 22,
    color: C.fg0,
    letterSpacing: -0.5,
  },
  sectionEmphasis: {
    fontFamily: F.serifItalic,
    color: C.accent,
    fontStyle: 'italic',
  },

  phaseRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
  },
  phaseIndicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  phaseCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.bg2,
    borderWidth: 0.5,
    borderColor: C.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseCircleDone: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  phaseCircleActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  phaseNum: {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.fg3,
  },
  phaseLine: {
    width: 1,
    flex: 1,
    backgroundColor: C.line,
    marginTop: 4,
    marginBottom: 4,
    minHeight: 32,
  },
  phaseLineDone: {
    backgroundColor: C.accent,
  },
  phaseContent: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 4,
  },
  phaseName: {
    fontFamily: F.sansMedium,
    fontSize: 15,
    color: C.fg0,
  },
  phaseNameDone: {
    color: C.fg2,
    textDecorationLine: 'line-through',
  },
  phaseSub: {
    fontFamily: F.mono,
    fontSize: 11,
    letterSpacing: 0.6,
    color: C.fg3,
    marginTop: 2,
  },
  phaseQuote: {
    fontFamily: F.serifItalic,
    fontSize: 13,
    color: C.fg1,
    marginTop: 8,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
