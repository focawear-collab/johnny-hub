
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Difficulty = 'Básica' | 'Intermedia' | 'Avanzada';

interface Technique {
  id: string;
  name: string;
  desc: string;
  difficulty: Difficulty;
  duration: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: '1',
    name: 'Estirado a mano',
    desc: 'Empuja el aire al cornicione sin rodillo',
    difficulty: 'Básica',
    duration: '5 min',
  },
  {
    id: '2',
    name: 'Slap & fold',
    desc: 'Técnica francesa para desarrollar gluten rápido',
    difficulty: 'Intermedia',
    duration: '10 min',
  },
  {
    id: '3',
    name: 'Fermentación fría',
    desc: 'Retardar a 4°C para potenciar sabor y extensibilidad',
    difficulty: 'Básica',
    duration: '24–72 h',
  },
  {
    id: '4',
    name: 'Boleado',
    desc: 'Forma bolas con máxima tensión superficial',
    difficulty: 'Intermedia',
    duration: '2 min',
  },
  {
    id: '5',
    name: 'Horneado en piedra',
    desc: 'Precalentamiento largo para transferencia de calor óptima',
    difficulty: 'Avanzada',
    duration: '60 min precal.',
  },
  {
    id: '6',
    name: 'Salsa napolitana',
    desc: 'Triturado en frío con sal, sin cocción',
    difficulty: 'Básica',
    duration: '5 min',
  },
];

// ---------------------------------------------------------------------------
// Difficulty colors
// ---------------------------------------------------------------------------

const DIFF_COLOR: Record<Difficulty, string> = {
  Básica: '#27AE60',
  Intermedia: Colors.gold,
  Avanzada: Colors.accent,
};

// ---------------------------------------------------------------------------
// Illustration SVG per technique (simple symbolic)
// ---------------------------------------------------------------------------

function TechIllustration({ id }: { id: string }) {
  const c = Colors.fg3;
  switch (id) {
    case '1':
      // Hands stretching dough
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Ellipse cx={40} cy={30} rx={28} ry={14} fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Path d="M12 30 Q6 22 8 18" stroke={c} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M68 30 Q74 22 72 18" stroke={c} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M20 20 L60 20" stroke={Colors.accentSoft} strokeWidth={4} strokeLinecap="round" />
        </Svg>
      );
    case '2':
      // Slap motion arrows
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Ellipse cx={40} cy={38} rx={20} ry={10} fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Path d="M40 28 L40 8" stroke={c} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M34 14 L40 8 L46 14" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M26 38 L14 38" stroke={Colors.gold} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M54 38 L66 38" stroke={Colors.gold} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    case '3':
      // Snowflake / cold
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Rect x={20} y={16} width={40} height={28} rx={6} fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Path d="M40 20 L40 40" stroke={Colors.gold} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M30 30 L50 30" stroke={Colors.gold} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M33 23 L47 37" stroke={Colors.gold} strokeWidth={1} strokeLinecap="round" />
          <Path d="M47 23 L33 37" stroke={Colors.gold} strokeWidth={1} strokeLinecap="round" />
        </Svg>
      );
    case '4':
      // Ball with tension arrows
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Circle cx={40} cy={30} r={16} fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Path d="M40 14 L40 10" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M40 46 L40 50" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M24 30 L20 30" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M56 30 L60 30" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
    case '5':
      // Stone / heat waves
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Rect x={10} y={36} width={60} height={10} rx={4} fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Path d="M25 32 Q27 26 25 20" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M40 32 Q42 26 40 20" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M55 32 Q57 26 55 20" stroke={Colors.accent} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    case '6':
      // Bowl with tomato
      return (
        <Svg width={80} height={60} viewBox="0 0 80 60">
          <Path d="M20 32 Q20 48 40 48 Q60 48 60 32 Z" fill={Colors.bg3} stroke={c} strokeWidth={1.5} />
          <Circle cx={40} cy={24} r={10} fill="#C0392B" opacity={0.7} />
          <Path d="M40 14 L40 10 Q44 8 48 12" stroke="#27AE60" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Techniques() {
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>DOJO</Text>
        <Text style={styles.headerTitle}>Técnicas</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2-col grid */}
        <View style={styles.grid}>
          {TECHNIQUES.map((tech) => (
            <Pressable
              key={tech.id}
              style={styles.card}
              onPress={() => router.push(`/technique/${tech.id}`)}
            >
              {/* Difficulty badge */}
              <View style={[styles.diffBadge, { backgroundColor: DIFF_COLOR[tech.difficulty] + '22' }]}>
                <View style={[styles.diffDot, { backgroundColor: DIFF_COLOR[tech.difficulty] }]} />
                <Text style={[styles.diffText, { color: DIFF_COLOR[tech.difficulty] }]}>
                  {tech.difficulty}
                </Text>
              </View>

              {/* Illustration */}
              <View style={styles.illustration}>
                <TechIllustration id={tech.id} />
              </View>

              {/* Info */}
              <Text style={styles.techName}>{tech.name}</Text>
              <Text style={styles.techDesc}>{tech.desc}</Text>

              {/* Duration */}
              <View style={styles.durationRow}>
                <Svg width={12} height={12} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                  <Circle cx={12} cy={12} r={10} stroke={Colors.fg3} strokeWidth={2} fill="none" />
                  <Path d="M12 6v6l4 2" stroke={Colors.fg3} strokeWidth={2} strokeLinecap="round" fill="none" />
                </Svg>
                <Text style={styles.durationText}>{tech.duration}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 40 }} />
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
    paddingTop: 60,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 20,
    backgroundColor: Colors.bg1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  headerSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.accent,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['3xl'],
    color: Colors.fg0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 14,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    gap: 4,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diffText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 10,
  },
  techName: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.sm,
    color: Colors.fg0,
    marginBottom: 4,
    lineHeight: 18,
  },
  techDesc: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.xs,
    color: Colors.fg2,
    lineHeight: 16,
    marginBottom: 10,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    color: Colors.fg3,
  },
});
