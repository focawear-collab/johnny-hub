
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Avatar SVG
// ---------------------------------------------------------------------------

function AvatarSVG() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Circle cx={40} cy={40} r={40} fill={Colors.accentSoft} />
      <Circle cx={40} cy={40} r={38} fill="none" stroke={Colors.accent} strokeWidth={1.5} />
      <SvgText
        x={40}
        y={47}
        textAnchor="middle"
        fill={Colors.accent}
        fontSize={28}
        fontFamily={Typography.fontFamily.serif}
      >
        JH
      </SvgText>
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <Pressable
      style={[toggleStyles.track, value && toggleStyles.trackActive]}
      onPress={() => onChange(!value)}
    >
      <View style={[toggleStyles.thumb, value && toggleStyles.thumbActive]} />
    </Pressable>
  );
}

const toggleStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line2,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.fg2,
  },
  thumbActive: {
    backgroundColor: Colors.accent,
    transform: [{ translateX: 20 }],
  },
});

// ---------------------------------------------------------------------------
// Section row
// ---------------------------------------------------------------------------

interface RowProps {
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

function Row({ label, right, onPress, destructive = false }: RowProps) {
  return (
    <Pressable
      style={rowStyles.row}
      onPress={onPress}
      disabled={!onPress && !right}
    >
      <Text style={[rowStyles.label, destructive && rowStyles.labelDestructive]}>
        {label}
      </Text>
      {right}
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  label: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    flex: 1,
  },
  labelDestructive: {
    color: '#EF4444',
  },
});

// ---------------------------------------------------------------------------
// Chip selector
// ---------------------------------------------------------------------------

interface ChipSelectorProps {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  color?: string;
}

function ChipSelector({ options, selected, onSelect, color = Colors.accent }: ChipSelectorProps) {
  return (
    <View style={chipStyles.row}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[chipStyles.chip, selected === opt && { backgroundColor: color + '22', borderColor: color }]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[chipStyles.text, selected === opt && { color }]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const chipStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.line2,
    backgroundColor: Colors.bg3,
  },
  text: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Profile() {
  const [ovenType, setOvenType] = useState('Eléctrico');
  const [kaEnabled, setKaEnabled] = useState(true);
  const [level, setLevel] = useState('Avanzado');
  const [language, setLanguage] = useState('ES');
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState('g');

  const stats = [
    { value: '42', label: 'Masas' },
    { value: '8.7', label: 'Promedio ★' },
    { value: '3', label: 'Estilos' },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
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
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar banner */}
        <View style={styles.banner}>
          <AvatarSVG />
          <View style={styles.bannerInfo}>
            <Text style={styles.username}>Johnny Hub</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Pizza level: {level}</Text>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Kitchen setup */}
        <Text style={styles.sectionTitle}>COCINA</Text>
        <View style={styles.card}>
          {/* Oven type */}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Tipo de horno</Text>
            <ChipSelector
              options={['Eléctrico', 'Gas', 'Leña']}
              selected={ovenType}
              onSelect={setOvenType}
            />
          </View>
          <View style={styles.divider} />
          {/* Mixer toggle */}
          <View style={styles.cardRowInline}>
            <Text style={styles.cardRowLabel}>KitchenAid</Text>
            <Toggle value={kaEnabled} onChange={setKaEnabled} />
          </View>
          <View style={styles.divider} />
          {/* Level */}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Nivel</Text>
            <ChipSelector
              options={['Principiante', 'Intermedio', 'Avanzado']}
              selected={level}
              onSelect={setLevel}
              color={Colors.gold}
            />
          </View>
          <View style={styles.divider} />
          {/* Scale */}
          <View style={styles.cardRowInline}>
            <Text style={styles.cardRowLabel}>Báscula</Text>
            <Text style={styles.cardRowValue}>Etekcity 0.1g</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
        <View style={styles.card}>
          {/* Language */}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Idioma</Text>
            <ChipSelector
              options={['ES', 'IT', 'EN']}
              selected={language}
              onSelect={setLanguage}
              color={Colors.fg0}
            />
          </View>
          <View style={styles.divider} />
          {/* Notifications */}
          <View style={styles.cardRowInline}>
            <Text style={styles.cardRowLabel}>Notificaciones</Text>
            <Toggle value={notifications} onChange={setNotifications} />
          </View>
          <View style={styles.divider} />
          {/* Units */}
          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Unidades</Text>
            <ChipSelector
              options={['g', 'oz']}
              selected={units}
              onSelect={setUnits}
            />
          </View>
        </View>

        {/* Sign out */}
        <Pressable style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>

        <View style={{ height: 60 }} />
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 16,
    backgroundColor: Colors.bg1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1,
  },
  username: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['2xl'],
    color: Colors.fg0,
    marginBottom: 6,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.goldSoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.gold + '44',
  },
  levelText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.gold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg0,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: Colors.fg3,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardRow: {
    padding: 14,
    gap: 10,
  },
  cardRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardRowLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  cardRowValue: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.line,
  },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  signOutText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: '#EF4444',
  },
});
