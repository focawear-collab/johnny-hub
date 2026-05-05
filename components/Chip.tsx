
import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChipProps {
  label: string;
  /** Whether this chip is in the selected / active state */
  active?: boolean;
  onPress?: () => void;
  /** Optional dot color rendered to the left of the label */
  dotColor?: string;
  /** Additional styles for the container */
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onPress,
  dotColor,
  style,
  accessibilityLabel,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        pressed && styles.chipPressed,
        style,
      ]}
    >
      {/* Optional color dot */}
      {dotColor !== undefined && (
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      )}

      <Text
        style={[
          styles.label,
          active ? styles.labelActive : styles.labelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 0.5,
  },

  chipInactive: {
    backgroundColor: Colors.bg2,
    borderColor: Colors.line2,
  },

  chipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },

  chipPressed: {
    opacity: 0.75,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 7,
  },

  label: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    letterSpacing: Typography.letterSpacing.wide,
  },

  labelInactive: {
    color: Colors.fg1,
  },

  labelActive: {
    color: Colors.accent,
  },
});

export default Chip;
