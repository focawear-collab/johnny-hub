
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing } from '@/constants/tokens';
import { Bell, Search } from '@/components/icons';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TopBarProps {
  /** Sub-label shown in mono caps below the brand name.
   *  Defaults to today-style string callers can inject via date logic. */
  subtitle?: string;
  onBellPress?: () => void;
  onSearchPress?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TopBar: React.FC<TopBarProps> = ({
  subtitle = 'Johnny Hub',
  onBellPress,
  onSearchPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        // Respect the device status bar height
        { paddingTop: Math.max(insets.top, 12) },
      ]}
    >
      {/* ── Brand block ─────────────────────────────────── */}
      <View style={styles.brandBlock}>
        <Text style={styles.brand} numberOfLines={1}>
          Johnny Hub
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* ── Action buttons ──────────────────────────────── */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          onPress={onBellPress}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Bell size={18} color={Colors.fg2} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          onPress={onSearchPress}
          accessibilityLabel="Search"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Search size={18} color={Colors.fg2} />
        </Pressable>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg1,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 12,
    // Subtle bottom separator
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.line,
  },

  brandBlock: {
    flex: 1,
    marginRight: 12,
  },

  brand: {
    fontFamily: Typography.fontFamily.serifItalic,
    fontSize: Typography.size['2xl'],
    color: Colors.fg0,
    // Tight leading so subtitle sits close beneath
    lineHeight: Typography.size['2xl'] * 1.1,
    includeFontPadding: false,
  },

  subtitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    letterSpacing: Typography.letterSpacing.caps,
    textTransform: 'uppercase',
    color: Colors.fg2,
    marginTop: 2,
    includeFontPadding: false,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg2,
    borderWidth: 0.5,
    borderColor: Colors.line,
    // Android ripple replacement via opacity handled by pressed state
    ...Platform.select({
      android: { elevation: 0 },
    }),
  },

  iconBtnPressed: {
    opacity: 0.6,
    backgroundColor: Colors.bg3,
  },
});

export default TopBar;
