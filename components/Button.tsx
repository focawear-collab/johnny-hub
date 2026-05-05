
import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import { Colors, Typography, Spacing, shadow } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  /** Button variant: "primary" (accent fill + glow) or "secondary" (bg-2 + border) */
  variant?: ButtonVariant;
  /** Content — typically a string or an icon+string combination */
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Disabled state — reduces opacity and blocks interaction */
  disabled?: boolean;
  /** Show a loading spinner in place of children */
  loading?: boolean;
  /** By default the button fills its container's width. Set to false to shrink-wrap. */
  fullWidth?: boolean;
  /** Extra styles applied to the Pressable wrapper */
  style?: StyleProp<ViewStyle>;
  /** Extra styles applied to the inner content row */
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra styles applied to string children (when children is a plain string) */
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// ---------------------------------------------------------------------------
// Shared inner row — renders children with gap for icon + text layouts
// ---------------------------------------------------------------------------

const ContentRow: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.contentRow, style]}>{children}</View>
);

// ---------------------------------------------------------------------------
// Primary button
// ---------------------------------------------------------------------------

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  contentStyle,
  labelStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={Colors.fg0} />;
    }
    if (typeof children === 'string') {
      return (
        <Text style={[styles.primaryLabel, labelStyle]} numberOfLines={1}>
          {children}
        </Text>
      );
    }
    return <ContentRow style={contentStyle}>{children}</ContentRow>;
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        styles.primary,
        shadow.accent,
        fullWidth && styles.fullWidth,
        pressed && styles.primaryPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {renderContent()}
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Secondary button
// ---------------------------------------------------------------------------

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  contentStyle,
  labelStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={Colors.fg0} />;
    }
    if (typeof children === 'string') {
      return (
        <Text style={[styles.secondaryLabel, labelStyle]} numberOfLines={1}>
          {children}
        </Text>
      );
    }
    return <ContentRow style={contentStyle}>{children}</ContentRow>;
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        fullWidth && styles.fullWidth,
        pressed && styles.secondaryPressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {renderContent()}
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Convenience default export — renders primary by default
// ---------------------------------------------------------------------------

const Button: React.FC<ButtonProps & { variant?: ButtonVariant }> = ({
  variant = 'primary',
  ...props
}) => {
  if (variant === 'secondary') {
    return <SecondaryButton {...props} />;
  }
  return <PrimaryButton {...props} />;
};

export default Button;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: Spacing.buttonRadius,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },

  fullWidth: {
    alignSelf: 'stretch',
  },

  // ── Primary ──────────────────────────────────────────────

  primary: {
    backgroundColor: Colors.accent,
  },

  primaryPressed: {
    opacity: 0.82,
  },

  primaryLabel: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.md,
    color: Colors.fg0,
    letterSpacing: Typography.letterSpacing.wide,
    includeFontPadding: false,
  },

  // ── Secondary ────────────────────────────────────────────

  secondary: {
    backgroundColor: Colors.bg2,
    borderWidth: 0.5,
    borderColor: Colors.line2,
  },

  secondaryPressed: {
    opacity: 0.75,
    backgroundColor: Colors.bg3,
  },

  secondaryLabel: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.md,
    color: Colors.fg0,
    letterSpacing: Typography.letterSpacing.normal,
    includeFontPadding: false,
  },

  // ── Shared disabled ──────────────────────────────────────

  disabled: {
    opacity: 0.38,
  },

  // ── Content row (icon + text gap) ────────────────────────

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
