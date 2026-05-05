// FILE: app/app/livebake.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_SECONDS = 90;
const PHASE_INTERVAL = 30; // seconds per instruction

const INSTRUCTIONS = [
  'Precalienta la piedra',
  'Desliza la pizza',
  'Revisa el cornicione',
];

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ---------------------------------------------------------------------------
// Progress ring component
// ---------------------------------------------------------------------------

interface ProgressRingProps {
  seconds: number;
  total: number;
}

function ProgressRing({ seconds, total }: ProgressRingProps) {
  const progress = total > 0 ? seconds / total : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <View style={ringStyles.wrap}>
      <Svg width={220} height={220} viewBox="0 0 220 220">
        {/* Track */}
        <Circle
          cx={110}
          cy={110}
          r={RADIUS}
          stroke={Colors.bg3}
          strokeWidth={10}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={110}
          cy={110}
          r={RADIUS}
          stroke={Colors.accent}
          strokeWidth={10}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin="110,110"
        />
        {/* Inner glow ring */}
        <Circle
          cx={110}
          cy={110}
          r={RADIUS - 16}
          stroke={Colors.accentSoft}
          strokeWidth={1}
          fill="none"
        />
      </Svg>
      {/* Time display */}
      <View style={ringStyles.timeWrap}>
        <Text style={ringStyles.timeText}>{display}</Text>
        <Text style={ringStyles.timeSub}>restante</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 42,
    color: Colors.fg0,
    letterSpacing: -1,
  },
  timeSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
});

// ---------------------------------------------------------------------------
// Pulsing LIVE badge
// ---------------------------------------------------------------------------

function LiveBadge() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  return (
    <View style={liveStyles.badge}>
      <Animated.View style={[liveStyles.dot, { opacity: pulse }]} />
      <Text style={liveStyles.text}>LIVE</Text>
    </View>
  );
}

const liveStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220,38,38,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.4)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  text: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: Typography.size.sm,
    color: '#EF4444',
    letterSpacing: Typography.letterSpacing.wider,
  },
});

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function LiveBake() {
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const phaseIndex = Math.min(
    Math.floor(elapsed / PHASE_INTERVAL),
    INSTRUCTIONS.length - 1,
  );
  const currentInstruction = INSTRUCTIONS[phaseIndex];

  const start = useCallback(() => {
    if (done) {
      setElapsed(0);
      setDone(false);
    }
    setRunning(true);
  }, [done]);

  const pause = useCallback(() => setRunning(false), []);

  const addThirty = useCallback(() => {
    setTotalSeconds((t) => t + 30);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setTotalSeconds(INITIAL_SECONDS);
    setDone(false);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= totalSeconds) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, totalSeconds]);

  return (
    <View style={styles.root}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M19 12H5M12 5l-7 7 7 7"
            stroke={Colors.fg0}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>

      {/* LIVE badge */}
      <View style={styles.liveWrap}>
        <LiveBadge />
      </View>

      {/* Title */}
      <Text style={styles.title}>Horneado en vivo</Text>
      <Text style={styles.subtitle}>Margherita Verace</Text>

      {/* Progress ring */}
      <View style={styles.ringWrap}>
        <ProgressRing seconds={remaining} total={totalSeconds} />
      </View>

      {/* Instruction */}
      <View style={styles.instructionBox}>
        <Text style={styles.phaseLabel}>FASE {phaseIndex + 1} / {INSTRUCTIONS.length}</Text>
        <Text style={styles.instructionText}>{done ? '¡Lista!' : currentInstruction}</Text>
      </View>

      {/* +30s button */}
      {!done && (
        <Pressable style={styles.addBtn} onPress={addThirty}>
          <Text style={styles.addBtnText}>+ 30 s</Text>
        </Pressable>
      )}

      {/* Play/Pause/Reset */}
      <View style={styles.controlsRow}>
        <Pressable style={styles.resetBtn} onPress={reset}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M3 12a9 9 0 109-9 9 9 0 00-6.18 2.44L3 8"
              stroke={Colors.fg2}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path d="M3 3v5h5" stroke={Colors.fg2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </Pressable>

        <Pressable
          style={[styles.playBtn, done && styles.playBtnDone]}
          onPress={running ? pause : start}
        >
          {running ? (
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path d="M10 4H6v16h4zM18 4h-4v16h4z" fill={Colors.fg0} />
            </Svg>
          ) : (
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path d="M5 3l14 9-14 9V3z" fill={Colors.fg0} />
            </Svg>
          )}
        </Pressable>

        <View style={{ width: 44 }} />
      </View>

      {/* CTA */}
      {done && (
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaText}>Lista · al diario</Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg0,
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveWrap: {
    marginTop: 60,
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['2xl'],
    color: Colors.fg0,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: 20,
  },
  ringWrap: {
    marginBottom: 24,
  },
  instructionBox: {
    alignItems: 'center',
    backgroundColor: Colors.bg2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line2,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginBottom: 20,
    minWidth: 260,
  },
  phaseLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.accent,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 6,
  },
  instructionText: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg0,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: Colors.goldSoft,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.gold + '44',
    marginBottom: 28,
  },
  addBtnText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.gold,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnDone: {
    backgroundColor: Colors.bg3,
  },
  ctaButton: {
    marginTop: 32,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  ctaText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    letterSpacing: 0.3,
  },
});
