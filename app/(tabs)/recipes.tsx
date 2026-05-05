// FILE: app/app/(tabs)/recipes.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Svg, {
  Circle,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES, RECIPES, TIPS } from '@/constants/data';
import type { Recipe } from '@/constants/data';
import * as Icons from '@/components/icons';

const C = Colors;
const F = Typography.fontFamily;

// ---------------------------------------------------------------------------
// PizzaSVG — shared illustration component
// ---------------------------------------------------------------------------
function PizzaSVG({
  color = '#C45A2A',
  width = 60,
  height = 60,
}: {
  color?: string;
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const outerR = Math.min(cx, cy) - 2;
  const innerR = outerR - 8;
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <Defs>
        <RadialGradient id={`rc_${safeId}`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0%" stopColor="#C8A070" />
          <Stop offset="80%" stopColor="#8A6040" />
          <Stop offset="100%" stopColor="#5A3820" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={outerR} fill={`url(#rc_${safeId})`} />
      <Circle cx={cx} cy={cy} r={innerR} fill={color} opacity={0.85} />
      {/* charred spots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const r = outerR - 3 + (i % 2) * 1.5;
        return (
          <Circle
            key={i}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r * 0.9}
            r={1.2 + (i % 3) * 0.4}
            fill="#2A1A0A"
            opacity={0.6}
          />
        );
      })}
      {/* mozz */}
      {[[cx - 5, cy - 4], [cx + 4, cy - 5], [cx - 2, cy + 5]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={Math.max(2.5, outerR * 0.12)} fill="#F5F0E8" opacity={0.85} />
      ))}
      {/* basil */}
      <Ellipse
        cx={cx + 1}
        cy={cy + 1}
        rx={Math.max(2, outerR * 0.1)}
        ry={Math.max(1, outerR * 0.06)}
        fill="#4A7A30"
        transform={`rotate(25 ${cx + 1} ${cy + 1})`}
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// FeaturedLargePizzaSVG — 320x180 for the featured card
// ---------------------------------------------------------------------------
function FeaturedLargePizzaSVG({ color = '#C45A2A' }: { color?: string }) {
  const cx = 160;
  const cy = 90;
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg viewBox="0 0 320 180" width="100%" height="100%">
      <Defs>
        <RadialGradient id={`fcrust_${safeId}`} cx="0.5" cy="0.5" r="0.6">
          <Stop offset="0%" stopColor="#C8A070" />
          <Stop offset="80%" stopColor="#7A5535" />
          <Stop offset="100%" stopColor="#4A2E18" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={86} fill={`url(#fcrust_${safeId})`} />
      <Circle cx={cx} cy={cy} r={68} fill={color} opacity={0.92} />
      {/* charred spots */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 76 + (i % 3) * 3;
        return (
          <Circle
            key={i}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={2 + (i % 3) * 0.7}
            fill="#1A0E06"
            opacity={0.72}
          />
        );
      })}
      {/* mozz */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3;
        const r = 28 + (i % 2) * 12;
        return (
          <Circle
            key={i}
            cx={cx + Math.cos(a) * r}
            cy={cy + Math.sin(a) * r}
            r={6}
            fill="#F5F0E8"
            opacity={0.92}
          />
        );
      })}
      {/* basil */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 + 0.7;
        const r = 20;
        const bx = cx + Math.cos(a) * r;
        const by = cy + Math.sin(a) * r;
        return (
          <Ellipse
            key={i}
            cx={bx}
            cy={by}
            rx={4}
            ry={2}
            fill="#4A7A30"
            transform={`rotate(${i * 45} ${bx} ${by})`}
          />
        );
      })}
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// FeaturedCard
// ---------------------------------------------------------------------------
function FeaturedCard({ r, onPress }: { r: Recipe; onPress: () => void }) {
  const style = PIZZA_STYLES.find((s) => s.id === r.style);
  const styleColor = style?.color ?? C.accent;

  return (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageArea}>
        <FeaturedLargePizzaSVG color={styleColor} />
        <View style={styles.featuredSaveChip}>
          <Icons.Heart size={12} color={C.fg1} />
          <Text style={styles.featuredSaveChipText}>Guardar</Text>
        </View>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={[styles.featuredStyleEyebrow, { color: styleColor }]}>
          ● {r.style.toUpperCase()}
        </Text>
        <Text style={styles.featuredTitle}>{r.name}</Text>
        <Text style={styles.featuredTag}>{r.tag}</Text>
        <View style={styles.featuredStatsRow}>
          <View style={styles.featuredStat}>
            <Text style={styles.featuredStatLabel}>TIEMPO</Text>
            <Text style={styles.featuredStatVal}>{r.time}·min</Text>
          </View>
          <View style={styles.featuredStat}>
            <Text style={styles.featuredStatLabel}>NIVEL</Text>
            <Text style={styles.featuredStatVal}>{r.level}</Text>
          </View>
          <View style={styles.featuredStat}>
            <Text style={styles.featuredStatLabel}>RATING</Text>
            <View style={styles.featuredStars}>
              {Array.from({ length: r.stars }).map((_, i) => (
                <Icons.Star key={i} size={11} color={C.gold} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// RecipeListRow — FlashList item
// ---------------------------------------------------------------------------
function RecipeListRow({ r, onPress }: { r: Recipe; onPress: () => void }) {
  const style = PIZZA_STYLES.find((s) => s.id === r.style);
  const styleColor = style?.color ?? C.accent;

  return (
    <TouchableOpacity
      style={styles.recipeListRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.recipeThumb}>
        <PizzaSVG color={styleColor} width={60} height={60} />
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {r.name}
        </Text>
        <Text style={styles.recipeTag} numberOfLines={1}>
          {r.style} · {r.time}min · {r.level}
        </Text>
        <View style={styles.recipeStarsRow}>
          {Array.from({ length: r.stars }).map((_, i) => (
            <Icons.Star key={i} size={10} color={C.gold} />
          ))}
        </View>
      </View>
      <Icons.Chevron size={14} color={C.fg3} />
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// RecipesScreen
// ---------------------------------------------------------------------------
export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<string>('Todas');

  const allFilters = ['Todas', ...PIZZA_STYLES.map((s) => s.name)];
  const filtered =
    filter === 'Todas'
      ? RECIPES
      : RECIPES.filter((r) => {
          const style = PIZZA_STYLES.find((s) => s.id === r.style);
          return style?.name === filter;
        });

  const featured = RECIPES[0];
  const listItems = filtered.slice(1);

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
        <Text style={styles.eyebrow}>{filtered.length} RECETAS · BIBLIOTECA</Text>
        <Text style={styles.headline}>
          La masa es{' '}
          <Text style={styles.headlineAccent}>el alma.</Text>
          {'\n'}El topping es{' '}
          <Text style={styles.headlineGold}>la firma.</Text>
        </Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={{ marginTop: 20 }}
      >
        {allFilters.map((f) => {
          const isActive = filter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Destacada</Text>
      </View>
      <View style={styles.px}>
        <FeaturedCard
          r={featured}
          onPress={() => router.push(`/recipe/${featured.id}` as never)}
        />
      </View>

      {/* All recipes section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Todas
          <Text style={styles.sectionEmphasis}> · {listItems.length}</Text>
        </Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* FlashList for recipe rows */}
      <View style={[styles.px, { gap: 10 }]}>
        {listItems.map((r) => (
          <RecipeListRow
            key={r.id}
            r={r}
            onPress={() => router.push(`/recipe/${r.id}` as never)}
          />
        ))}
      </View>

      {/* Tips section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tips Pro</Text>
      </View>
      <View style={[styles.px, { gap: 10 }]}>
        {TIPS.slice(0, 3).map((t) => (
          <View key={t.id} style={styles.tipRow}>
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>{t.id}</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{t.t}</Text>
              <Text style={styles.tipDesc}>{t.d}</Text>
            </View>
          </View>
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
  headlineAccent: {
    fontFamily: F.serifItalic,
    color: C.accent,
    fontStyle: 'italic',
  },
  headlineGold: {
    fontFamily: F.serifItalic,
    color: C.gold,
    fontStyle: 'italic',
  },

  filtersContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.line2,
    backgroundColor: C.bgCard,
  },
  filterChipActive: {
    borderColor: C.accent,
    backgroundColor: C.accentSoft,
  },
  filterChipText: {
    fontFamily: F.sansMedium,
    fontSize: 13,
    color: C.fg2,
  },
  filterChipTextActive: {
    color: C.fg0,
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
  sectionEmphasis: {
    fontFamily: F.serifItalic,
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

  // Featured card
  featuredCard: {
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    overflow: 'hidden',
  },
  featuredImageArea: {
    height: 180,
    backgroundColor: C.bg2,
    position: 'relative',
  },
  featuredSaveChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  featuredSaveChipText: {
    fontFamily: F.sansMedium,
    fontSize: 12,
    color: C.fg1,
  },
  featuredInfo: {
    padding: 18,
  },
  featuredStyleEyebrow: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontFamily: F.serif,
    fontSize: 26,
    color: C.fg0,
    letterSpacing: -0.5,
    marginTop: 6,
  },
  featuredTag: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.fg2,
    marginTop: 4,
  },
  featuredStatsRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 14,
    alignItems: 'center',
  },
  featuredStat: {},
  featuredStatLabel: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 1.4,
    color: C.fg3,
    textTransform: 'uppercase',
  },
  featuredStatVal: {
    fontFamily: F.serif,
    fontSize: 16,
    color: C.fg0,
    marginTop: 2,
  },
  featuredStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },

  // Recipe list row
  recipeListRow: {
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
    fontSize: 16,
    color: C.fg0,
    letterSpacing: -0.2,
  },
  recipeTag: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.fg2,
    marginTop: 2,
  },
  recipeStarsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 6,
  },

  // Tips
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    padding: 14,
  },
  tipBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipBadgeText: {
    fontFamily: F.serifItalic,
    fontSize: 16,
    color: C.accent,
    lineHeight: 20,
  },
  tipContent: { flex: 1 },
  tipTitle: {
    fontFamily: F.sansMedium,
    fontSize: 14,
    color: C.fg0,
  },
  tipDesc: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.fg2,
    marginTop: 3,
    lineHeight: 17,
  },
});
