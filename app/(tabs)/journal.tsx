import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path, Ellipse } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES } from '@/constants/data';
import * as Icons from '@/components/icons';

const C = Colors;
const F = Typography.fontFamily;

// ---------------------------------------------------------------------------
// Mock journal entries
// ---------------------------------------------------------------------------
interface JournalEntry {
  date: string;
  day: string;
  name: string;
  style: string;    // style name (display)
  styleId: string;  // style id
  hyd: number;
  ferment: number;
  score: number;
  note: string;
}

const ENTRIES: JournalEntry[] = [
  {
    date: '4 mayo',
    day: 'Hoy',
    name: 'Margherita doble fermento',
    style: 'Napoletana',
    styleId: 'napoletana',
    hyd: 67,
    ferment: 48,
    score: 9,
    note: 'Mejor leopardatura hasta ahora. Horno a 470°C.',
  },
  {
    date: '28 abr',
    day: 'Vie',
    name: 'Pepperoni NY',
    style: 'New York',
    styleId: 'newyork',
    hyd: 62,
    ferment: 72,
    score: 8,
    note: 'Faltó un poco de char en el borde.',
  },
  {
    date: '21 abr',
    day: 'Vie',
    name: 'Marinara antica',
    style: 'Napoletana',
    styleId: 'napoletana',
    hyd: 65,
    ferment: 24,
    score: 7,
    note: 'Masa joven. Probar 48h próxima.',
  },
  {
    date: '14 abr',
    day: 'Vie',
    name: 'Detroit Red Top',
    style: 'Detroit',
    styleId: 'detroit',
    hyd: 70,
    ferment: 18,
    score: 9,
    note: 'Cheese frico perfecto en bordes.',
  },
];

const STYLE_BREAKDOWN = [
  { name: 'Napoletana', count: 18, id: 'napoletana' },
  { name: 'New York', count: 8, id: 'newyork' },
  { name: 'Romana', count: 5, id: 'romana' },
  { name: 'Detroit', count: 3, id: 'detroit' },
];

// ---------------------------------------------------------------------------
// Photo placeholder — jh-img-placeholder pattern
// ---------------------------------------------------------------------------
function PhotoPlaceholder({ style: s }: { style: JournalEntry['style'] }) {
  const pizzaStyle = PIZZA_STYLES.find((ps) => ps.name === s);
  const col = pizzaStyle?.color ?? C.accent;
  return (
    <View style={styles.photoPlaceholder}>
      <Svg width={64} height={64} viewBox="0 0 64 64">
        {/* Crust */}
        <Circle cx={32} cy={32} r={28} fill={col} opacity={0.25} />
        <Circle cx={32} cy={32} r={28} fill="none" stroke={col} strokeWidth={1.5} opacity={0.4} />
        {/* Inner sauce */}
        <Circle cx={32} cy={32} r={20} fill={col} opacity={0.35} />
        {/* Mozz dots */}
        <Circle cx={26} cy={28} r={3} fill="#F5F0E8" opacity={0.7} />
        <Circle cx={36} cy={26} r={2.5} fill="#F5F0E8" opacity={0.7} />
        <Circle cx={30} cy={36} r={3} fill="#F5F0E8" opacity={0.7} />
        {/* Basil */}
        <Ellipse cx={33} cy={32} rx={2.5} ry={1.2} fill="#4A7A30" opacity={0.7} transform="rotate(20 33 32)" />
      </Svg>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Empty state notebook SVG
// ---------------------------------------------------------------------------
function NotebookSVG() {
  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      {/* Notebook body */}
      <Rect x={20} y={15} width={80} height={90} rx={8} fill={C.bg3} stroke={C.line2} strokeWidth={1} />
      {/* Spine */}
      <Rect x={20} y={15} width={14} height={90} rx={4} fill={C.bg2} />
      {/* Binding holes */}
      {[30, 50, 70, 90].map((y) => (
        <Circle key={y} cx={27} cy={y} r={3} fill={C.bg0} />
      ))}
      {/* Lines */}
      {[40, 54, 68, 82].map((y) => (
        <Rect key={y} x={42} y={y} width={46} height={2} rx={1} fill={C.line2} />
      ))}
      {/* Pizza doodle */}
      <Circle cx={62} cy={58} r={14} fill={C.accentSoft} stroke={C.accent} strokeWidth={1} opacity={0.6} />
      <Circle cx={62} cy={58} r={10} fill="none" stroke={C.accent} strokeWidth={0.8} opacity={0.4} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ScoreBadge
// ---------------------------------------------------------------------------
function ScoreBadge({ score }: { score: number }) {
  const col = score >= 9 ? C.accent : score >= 7 ? C.gold : C.fg2;
  return (
    <View style={[styles.scoreBadge, { borderColor: col }]}>
      <Text style={[styles.scoreText, { color: col }]}>{score}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// EntryCard
// ---------------------------------------------------------------------------
function EntryCard({ e }: { e: JournalEntry }) {
  const pizzaStyle = PIZZA_STYLES.find((s) => s.id === e.styleId);
  const styleColor = pizzaStyle?.color ?? C.accent;

  const dateNum = e.date.split(' ')[0];
  const dateMon = e.date.split(' ')[1] ?? '';

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryTop}>
        {/* Date stamp */}
        <View style={styles.datestamp}>
          <Text style={styles.datestampDay}>{e.day}</Text>
          <Text style={styles.datestampNum}>{dateNum}</Text>
          <Text style={styles.datestampMon}>{dateMon}</Text>
        </View>
        {/* Vertical divider */}
        <View style={styles.entryDivider} />
        {/* Main content */}
        <View style={styles.entryMain}>
          <View style={styles.entryTitleRow}>
            <Text style={styles.entryTitle} numberOfLines={2}>
              {e.name}
            </Text>
            <ScoreBadge score={e.score} />
          </View>
          <View style={styles.entryMetaRow}>
            <View style={[styles.entryStyleChip, { borderColor: styleColor }]}>
              <View style={[styles.entryDot, { backgroundColor: styleColor }]} />
              <Text style={[styles.entryStyleText, { color: styleColor }]}>{e.style}</Text>
            </View>
            <Text style={styles.entryHydFerment}>
              {e.hyd}% · {e.ferment}h
            </Text>
          </View>
          <Text style={styles.entryNote}>"{e.note}"</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// JournalScreen
// ---------------------------------------------------------------------------
export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [hasEntries] = useState(true); // set to false to see empty state

  if (!hasEntries) {
    return <EmptyState insetTop={insets.top} />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.px}>
        <Text style={styles.eyebrow}>DIARIO · ABRIL–MAYO 2026</Text>
        <Text style={styles.headline}>
          <Text style={styles.headlineItalic}>34</Text>
          {' '}pizzas en{'\n'}30 días.
        </Text>
      </View>

      {/* Stats bar */}
      <View style={[styles.px, styles.statsRow]}>
        <StatCard value="8.4" label="rating prom" />
        <StatCard value="67%" label="hyd. media" />
        <StatCard value="42h" label="ferment med" />
      </View>

      {/* Style breakdown */}
      <View style={[styles.px, { marginTop: 14 }]}>
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownEyebrow}>POR ESTILO</Text>
          {STYLE_BREAKDOWN.map((s, i) => {
            const ps = PIZZA_STYLES.find((ps) => ps.id === s.id);
            const col = ps?.color ?? C.accent;
            return (
              <View key={s.id} style={[styles.breakdownRow, i > 0 && { marginTop: 10 }]}>
                <View style={styles.breakdownLabelRow}>
                  <Text style={styles.breakdownName}>{s.name}</Text>
                  <Text style={styles.breakdownCount}>{s.count}</Text>
                </View>
                <View style={styles.breakdownTrack}>
                  <View
                    style={[
                      styles.breakdownFill,
                      { width: `${(s.count / 18) * 100}%` as `${number}%`, backgroundColor: col },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Entries */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bitácora</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>+ NUEVA</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.px, styles.entriesCol]}>
        {ENTRIES.map((e, i) => (
          <EntryCard key={i} e={e} />
        ))}
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
function EmptyState({ insetTop }: { insetTop: number }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.emptyContent,
        { paddingTop: insetTop + 40, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <NotebookSVG />
      <Text style={styles.emptyTitle}>Tu diario está vacío</Text>
      <Text style={styles.emptyQuote}>
        "Cada pizza es una lección. Cada masa, una historia."
      </Text>
      <View style={styles.emptySuggestions}>
        <TouchableOpacity style={styles.suggestionBtn} activeOpacity={0.8}>
          <Icons.Plus size={16} color={C.accent} />
          <Text style={styles.suggestionText}>Añadir primera entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionBtn} activeOpacity={0.8}>
          <Icons.Calc size={16} color={C.gold} />
          <Text style={styles.suggestionText}>Calcular masa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionBtn} activeOpacity={0.8}>
          <Icons.Book size={16} color={C.fg2} />
          <Text style={styles.suggestionText}>Explorar recetas</Text>
        </TouchableOpacity>
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

  eyebrow: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: C.fg3,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: F.serif,
    fontSize: 32,
    color: C.fg0,
    letterSpacing: -0.8,
    marginTop: 6,
    lineHeight: 38,
  },
  headlineItalic: {
    fontFamily: F.serifItalic,
    fontStyle: 'italic',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: F.serif,
    fontSize: 26,
    color: C.fg0,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: C.fg3,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },

  breakdownCard: {
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    padding: 16,
  },
  breakdownEyebrow: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 2,
    color: C.fg3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  breakdownRow: {},
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownName: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.fg1,
  },
  breakdownCount: {
    fontFamily: F.mono,
    fontSize: 13,
    color: C.fg2,
  },
  breakdownTrack: {
    height: 4,
    backgroundColor: C.bg3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  sectionLink: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: C.accent,
    textTransform: 'uppercase',
  },

  entriesCol: {
    gap: 10,
  },

  entryCard: {
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    padding: 14,
  },
  entryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  datestamp: {
    width: 48,
    alignItems: 'center',
    flexShrink: 0,
  },
  datestampDay: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: C.fg3,
    textTransform: 'uppercase',
  },
  datestampNum: {
    fontFamily: F.serif,
    fontSize: 22,
    color: C.fg0,
    marginTop: 2,
    lineHeight: 26,
  },
  datestampMon: {
    fontFamily: F.mono,
    fontSize: 9,
    color: C.fg3,
    marginTop: 2,
  },
  entryDivider: {
    width: 0.5,
    alignSelf: 'stretch',
    backgroundColor: C.line,
  },
  entryMain: {
    flex: 1,
  },
  entryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  entryTitle: {
    fontFamily: F.serif,
    fontSize: 16,
    color: C.fg0,
    letterSpacing: -0.2,
    flex: 1,
  },
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreText: {
    fontFamily: F.serif,
    fontSize: 16,
  },
  entryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  entryStyleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
    backgroundColor: C.bg2,
  },
  entryDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  entryStyleText: {
    fontFamily: F.sansMedium,
    fontSize: 10,
  },
  entryHydFerment: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    color: C.fg3,
  },
  entryNote: {
    fontFamily: F.serifItalic,
    fontSize: 13,
    color: C.fg1,
    marginTop: 8,
    lineHeight: 19,
    fontStyle: 'italic',
  },

  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: C.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },

  // Empty state
  emptyContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  emptyTitle: {
    fontFamily: F.serif,
    fontSize: 26,
    color: C.fg0,
    letterSpacing: -0.5,
    marginTop: 24,
    textAlign: 'center',
  },
  emptyQuote: {
    fontFamily: F.serifItalic,
    fontSize: 15,
    color: C.fg2,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  emptySuggestions: {
    width: '100%',
    gap: 10,
    marginTop: 32,
  },
  suggestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line2,
    padding: 16,
  },
  suggestionText: {
    fontFamily: F.sansMedium,
    fontSize: 14,
    color: C.fg0,
  },
});
