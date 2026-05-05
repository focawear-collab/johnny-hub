import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, {
  Circle,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES, RECIPES, TIPS } from '@/constants/data';
import * as Icons from '@/components/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Design token shorthands
// ---------------------------------------------------------------------------
const C = Colors;
const F = Typography.fontFamily;

// ---------------------------------------------------------------------------
// DoughOrb — SVG dough ball with radial gradient + surface bubbles
// ---------------------------------------------------------------------------
function DoughOrb({ pct }: { pct: number }) {
  const radius = 28 + pct * 8;
  return (
    <Svg width={86} height={86} viewBox="0 0 86 86">
      <Defs>
        <RadialGradient id="orb" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0%" stopColor="#F0E8D8" />
          <Stop offset="60%" stopColor="#C89759" />
          <Stop offset="100%" stopColor="#7A5535" />
        </RadialGradient>
      </Defs>
      <Circle cx={43} cy={43} r={radius} fill="url(#orb)" opacity={0.95} />
      {/* surface bubbles */}
      <Circle cx={35} cy={38} r={2} fill="#F5EEE0" opacity={0.7} />
      <Circle cx={48} cy={42} r={1.4} fill="#F5EEE0" opacity={0.6} />
      <Circle cx={42} cy={50} r={1.8} fill="#F5EEE0" opacity={0.7} />
      <Circle cx={52} cy={48} r={1} fill="#F5EEE0" opacity={0.5} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// PizzaSVG — top-down pizza illustration
// ---------------------------------------------------------------------------
function PizzaSVG({ color = '#C45A2A', width = 168, height = 88 }: { color?: string; width?: number; height?: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const mozzPositions: [number, number][] = [
    [cx - 14, cy - 6],
    [cx + 8, cy - 8],
    [cx - 6, cy + 6],
    [cx + 10, cy + 8],
    [cx - 2, cy],
  ];
  return (
    <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <Defs>
        <RadialGradient id={`crust_${color.replace('#', '')}`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0%" stopColor="#C8A070" />
          <Stop offset="80%" stopColor="#8A6040" />
          <Stop offset="100%" stopColor="#5A3820" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={Math.min(cx, cy) - 2} fill={`url(#crust_${color.replace('#', '')})`} />
      <Circle cx={cx} cy={cy} r={Math.min(cx, cy) - 10} fill={color} opacity={0.85} />
      {/* charred spots on crust */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        const r = Math.min(cx, cy) - 5 + (i % 2) * 2;
        return (
          <Circle
            key={i}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r * 0.92}
            r={1.4 + (i % 3) * 0.5}
            fill="#2A1A0A"
            opacity={0.65}
          />
        );
      })}
      {/* mozzarella spots */}
      {mozzPositions.map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={3.5} fill="#F5F0E8" opacity={0.88} />
      ))}
      {/* basil leaf */}
      <Ellipse
        cx={cx + 2}
        cy={cy + 2}
        rx={3}
        ry={1.5}
        fill="#4A7A30"
        transform={`rotate(20 ${cx + 2} ${cy + 2})`}
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// ActiveDoughCard
// ---------------------------------------------------------------------------
function ActiveDoughCard() {
  const total = 24 * 60;
  const elapsed = 18 * 60;
  const pct = elapsed / total;

  return (
    <View style={styles.activeDoughCard}>
      <View style={styles.activeDoughLeft}>
        <Text style={styles.activeDotLabel}>
          <Text style={{ color: C.accent }}>● </Text>
          <Text>ACTIVO</Text>
        </Text>
        <Text style={styles.activeDoughTitle}>
          Napoletana
        </Text>
        <Text style={styles.activeDoughSub}>— 4 bolas</Text>
        <Text style={styles.activeDoughMono}>En cold ferment · 18h / 24h</Text>
        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${pct * 100}%` as `${number}%` }]} />
        </View>
        <View style={styles.progressTimesRow}>
          <Text style={styles.progressTimeLeft}>INICIO 14:30</Text>
          <Text style={styles.progressTimeRight}>LISTO 14:30 mañana</Text>
        </View>
      </View>
      <View style={styles.activeDoughRight}>
        <DoughOrb pct={pct} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TipCard
// ---------------------------------------------------------------------------
function TipCard({ tip }: { tip: { t: string; d: string } }) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipIconBox}>
        <Text style={styles.tipIconText}>i</Text>
      </View>
      <View style={styles.tipTextCol}>
        <Text style={styles.tipEyebrow}>TIP DEL DÍA</Text>
        <Text style={styles.tipTitle}>{tip.t}</Text>
        <Text style={styles.tipDesc}>{tip.d}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------
function SectionHeader({
  title,
  emphasis,
  linkLabel,
  onLink,
}: {
  title: string;
  emphasis?: string;
  linkLabel?: string;
  onLink?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
        {emphasis ? <Text style={styles.sectionEmphasis}>{emphasis}</Text> : null}
      </Text>
      {linkLabel ? (
        <TouchableOpacity onPress={onLink}>
          <Text style={styles.sectionLink}>{linkLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// StyleCard — horizontal scroll card
// ---------------------------------------------------------------------------
function StyleCard({ s, onPress }: { s: (typeof PIZZA_STYLES)[0]; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.styleCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.styleCardImage}>
        <PizzaSVG color={s.color} width={168} height={88} />
      </View>
      <Text style={styles.styleCardName}>{s.name}</Text>
      <Text style={styles.styleCardMono}>
        {s.hyd}% HYD · {s.keyTime}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// RecipeRow — list item
// ---------------------------------------------------------------------------
function RecipeRow({ r }: { r: (typeof RECIPES)[0] }) {
  const style = PIZZA_STYLES.find((s) => s.id === r.style);
  const styleColor = style?.color ?? C.accent;
  return (
    <View style={styles.recipeRow}>
      <View style={styles.recipeThumb}>
        <PizzaSVG color={styleColor} width={60} height={60} />
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {r.name}
        </Text>
        <Text style={styles.recipeTag} numberOfLines={1}>
          {r.tag}
        </Text>
        <View style={styles.recipeChipsRow}>
          <Text style={styles.recipeChipText}>{r.style.toUpperCase()}</Text>
          <View style={styles.recipeDot} />
          <Text style={styles.recipeChipText}>{r.time}MIN</Text>
          <View style={styles.recipeStars}>
            {Array.from({ length: r.stars }).map((_, i) => (
              <Icons.Star key={i} size={10} color={C.gold} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ToolTile
// ---------------------------------------------------------------------------
function ToolTile({
  label,
  sub,
  icon,
  onPress,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.toolTile} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.toolTileIconBox}>{icon}</View>
      <Text style={styles.toolTileLabel}>{label}</Text>
      <Text style={styles.toolTileSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// HomeScreen
// ---------------------------------------------------------------------------
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero: Active Dough Card */}
      <View style={styles.px}>
        <ActiveDoughCard />
      </View>

      {/* Tip of the day */}
      <View style={[styles.px, { marginTop: 14 }]}>
        <TipCard tip={TIPS[2]} />
      </View>

      {/* Pizza Styles section */}
      <SectionHeader
        title="Estilos"
        emphasis=" · 5"
        linkLabel="Ver todos"
        onLink={() => router.push('/(tabs)/recipes')}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stylesScrollContent}
      >
        {PIZZA_STYLES.map((s) => (
          <StyleCard
            key={s.id}
            s={s}
            onPress={() => router.push('/(tabs)/calc')}
          />
        ))}
      </ScrollView>

      {/* Recipes section */}
      <SectionHeader
        title="Recetas"
        emphasis=" · esta semana"
        linkLabel="Ver más"
        onLink={() => router.push('/(tabs)/recipes')}
      />
      <View style={[styles.px, styles.recipesCol]}>
        {RECIPES.slice(0, 3).map((r) => (
          <RecipeRow key={r.id} r={r} />
        ))}
      </View>

      {/* Tools section */}
      <SectionHeader title="Herramientas" />
      <View style={[styles.px, styles.toolsGrid]}>
        <ToolTile
          label="Calculadora"
          sub="Baker's % · 5 estilos"
          icon={<Icons.Calc size={20} color={C.accent} />}
          onPress={() => router.push('/(tabs)/calc')}
        />
        <ToolTile
          label="Timer Frío"
          sub="Cold ferment 24–96h"
          icon={<Icons.Timer size={20} color={C.gold} />}
          onPress={() => router.push('/(tabs)/timer')}
        />
        <ToolTile
          label="Maridajes"
          sub="Vino · cerveza · cocktail"
          icon={<Icons.Wine size={20} color="#C878A0" />}
          onPress={() => {}}
        />
        <ToolTile
          label="Lista compras"
          sub="Auto-generada"
          icon={<Icons.Cart size={20} color="#C8A850" />}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  px: {
    paddingHorizontal: Spacing.screenPadding,
  },

  // Active dough card
  activeDoughCard: {
    flexDirection: 'row',
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    overflow: 'hidden',
  },
  activeDoughLeft: {
    flex: 1,
    padding: 18,
  },
  activeDoughRight: {
    width: 110,
    backgroundColor: C.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotLabel: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.accent,
    textTransform: 'uppercase',
  },
  activeDoughTitle: {
    fontFamily: F.serif,
    fontSize: 28,
    letterSpacing: -0.5,
    color: C.fg0,
    marginTop: 8,
    lineHeight: 30,
  },
  activeDoughSub: {
    fontFamily: F.serifItalic,
    fontSize: 22,
    color: C.accent,
    lineHeight: 26,
    marginTop: 2,
  },
  activeDoughMono: {
    fontFamily: F.mono,
    fontSize: 11,
    letterSpacing: 0.6,
    color: C.fg2,
    marginTop: 10,
  },
  progressBarTrack: {
    marginTop: 14,
    height: 4,
    backgroundColor: C.bg3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: C.gold,
    borderRadius: 2,
  },
  progressTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressTimeLeft: {
    fontFamily: F.mono,
    fontSize: 10,
    color: C.fg3,
  },
  progressTimeRight: {
    fontFamily: F.mono,
    fontSize: 10,
    color: C.accent,
  },

  // Tip card
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line2,
    padding: Spacing.cardPadding,
  },
  tipIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipIconText: {
    fontFamily: F.serifItalic,
    fontSize: 18,
    color: C.gold,
    lineHeight: 22,
  },
  tipTextCol: {
    flex: 1,
  },
  tipEyebrow: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 2,
    color: C.gold,
    textTransform: 'uppercase',
  },
  tipTitle: {
    fontFamily: F.sansMedium,
    fontSize: 15,
    color: C.fg0,
    marginTop: 4,
  },
  tipDesc: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.fg2,
    marginTop: 4,
    lineHeight: 19,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
    fontSize: 22,
    color: C.accent,
    fontStyle: 'italic',
  },
  sectionLink: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 0.8,
    color: C.fg3,
    textTransform: 'uppercase',
  },

  // Styles horizontal scroll
  stylesScrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
  },
  styleCard: {
    width: 168,
    padding: 14,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.line,
  },
  styleCardImage: {
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: C.bg2,
  },
  styleCardName: {
    fontFamily: F.serif,
    fontSize: 18,
    color: C.fg0,
    letterSpacing: -0.2,
  },
  styleCardMono: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: C.fg3,
    marginTop: 4,
    textTransform: 'uppercase',
  },

  // Recipes
  recipesCol: {
    gap: 10,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    padding: 12,
  },
  recipeThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: C.bg2,
    overflow: 'hidden',
    flexShrink: 0,
  },
  recipeInfo: {
    flex: 1,
    minWidth: 0,
  },
  recipeTitle: {
    fontFamily: F.serif,
    fontSize: 17,
    color: C.fg0,
    letterSpacing: -0.2,
  },
  recipeTag: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.fg2,
    marginTop: 2,
  },
  recipeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  recipeChipText: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: C.fg3,
    textTransform: 'uppercase',
  },
  recipeDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: C.fg3,
  },
  recipeStars: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 'auto',
  },

  // Tools grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolTile: {
    width: (SCREEN_WIDTH - Spacing.screenPadding * 2 - 10) / 2,
    padding: 14,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
  },
  toolTileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTileLabel: {
    fontFamily: F.sansMedium,
    fontSize: 14,
    color: C.fg0,
    marginTop: 12,
  },
  toolTileSub: {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.fg3,
    marginTop: 2,
    letterSpacing: 0.4,
  },
});
