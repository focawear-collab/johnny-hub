// FILE: app/components/Stepper.tsx

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  AccessibilityInfo,
} from 'react-native';

import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  /** Minimum allowed value (inclusive). Defaults to 1. */
  min?: number;
  /** Maximum allowed value (inclusive). Defaults to 999. */
  max?: number;
  /** Step size per tap. Defaults to 1. */
  step?: number;
  /** Optional unit suffix appended after the value (e.g. "g", "h", "%") */
  suffix?: string;
  /** Extra styles applied to the outer container */
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  suffix,
  style,
  accessibilityLabel,
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const decrement = useCallback(() => {
    if (canDecrement) {
      onChange(Math.max(min, value - step));
    }
  }, [canDecrement, min, onChange, step, value]);

  const increment = useCallback(() => {
    if (canIncrement) {
      onChange(Math.min(max, value + step));
    }
  }, [canIncrement, max, onChange, step, value]);

  // Build display string — always pad to consistent width for mono alignment
  const display = suffix ? `${value}${suffix}` : `${value}`;

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? `${display} stepper`}
      accessibilityValue={{ min, max, now: value, text: display }}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'increment') increment();
        if (nativeEvent.actionName === 'decrement') decrement();
      }}
      accessibilityActions={[
        { name: 'increment', label: 'Increment' },
        { name: 'decrement', label: 'Decrement' },
      ]}
    >
      {/* ── Decrement button ─────────────────────────────── */}
      <Pressable
        onPress={decrement}
        disabled={!canDecrement}
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        accessibilityState={{ disabled: !canDecrement }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          styles.btnLeft,
          pressed && canDecrement && styles.btnPressed,
          !canDecrement && styles.btnDisabled,
        ]}
      >
        <Text style={[styles.btnLabel, !canDecrement && styles.btnLabelDisabled]}>
          −
        </Text>
      </Pressable>

      {/* ── Value display ────────────────────────────────── */}
      <View style={styles.valueWrap}>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* ── Increment button ─────────────────────────────── */}
      <Pressable
        onPress={increment}
        disabled={!canIncrement}
        accessibilityRole="button"
        accessibilityLabel="Increase"
        accessibilityState={{ disabled: !canIncrement }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          styles.btnRight,
          pressed && canIncrement && styles.btnPressed,
          !canIncrement && styles.btnDisabled,
        ]}
      >
        <Text style={[styles.btnLabel, !canIncrement && styles.btnLabelDisabled]}>
          +
        </Text>
      </Pressable>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BTN_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg2,
    borderRadius: Spacing.buttonRadius,
    borderWidth: 0.5,
    borderColor: Colors.line2,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },

  // ── +/- tap areas ────────────────────────────────────────

  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg3,
  },

  btnLeft: {
    borderRightWidth: 0.5,
    borderRightColor: Colors.line,
  },

  btnRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: Colors.line,
  },

  btnPressed: {
    backgroundColor: Colors.bg2,
    opacity: 0.7,
  },

  btnDisabled: {
    opacity: 0.3,
  },

  btnLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.lg,
    color: Colors.fg1,
    // Visual vertical centering correction
    lineHeight: BTN_SIZE,
    includeFontPadding: false,
    textAlign: 'center',
  },

  btnLabelDisabled: {
    color: Colors.fg3,
  },

  // ── Value readout ─────────────────────────────────────────

  valueWrap: {
    minWidth: 56,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  value: {
    fontFamily: Typography.fontFamily.monoMedium,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default Stepper;
