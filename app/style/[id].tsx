// FILE: app/app/style/[id].tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Circle, Ellipse, Path, Rect, G, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES, RECIPES } from '@/constants/data';

// ---------------------------------------------------------------------------
// Top-down pizza SVG with leopardatura
// ---------------------------------------------------------------------------

function PizzaTopSVG({ color }: { color: string }) {
  return (
    <Svg width={390} height={260} viewBox="0 0 390 260">
      <Rect width={390} height={260} fill="#1C1816" />
      {/* Shadow */}
      <Ellipse cx={196} cy={138} rx={110} ry={106} fill="rgba(0,0,0,0.4)" />
      {/* Outer crust */}
      <Circle cx={195} cy={132} r={108} fill="#6B3D1E" />
      {/* Crust char */}
      <Circle cx={195} cy={132} r={108} fill="none" stroke="#3D1A0A" strokeWidth={8} strokeDasharray="12,8" />
      {/* Sauce */}
      <Circle cx={195} cy={132} r={90} fill="#B83232" opacity={0.9} />
      {/* Cheese */}
      <Circle cx={195} cy={132} r={78} fill="#EBC84A" opacity={0.85} />
      {/* Mozzarella blobs */}
      <Ellipse cx={195} cy={132} rx={22} ry={20} fill="#FDFEFE" opacity={0.95} />
      <Ellipse cx={165} cy={112} rx={16} ry={14} fill="#FDFEFE" opacity={0.9} />
      <Ellipse cx={228} cy={112} rx={15} ry={13} fill="#FDFEFE" opacity={0.9} />
      <Ellipse cx={215} cy={154} rx={17} ry={15} fill="#FDFEFE" opacity={0.88} />
      <Ellipse cx={175} cy={150} rx={13} ry={11} fill="#FDFEFE" opacity={0.85} />
      <Ellipse cx={200} cy={106} rx={11} ry={10} fill="#FDFEFE" opacity={0.8} />
      {/* Basil */}
      <Ellipse cx={185} cy={120} rx={9} ry={6} fill="#1E8449" opacity={0.92} transform="rotate(-25 185 120)" />
      <Ellipse cx={218} cy={138} rx={9} ry={6} fill="#1E8449" opacity={0.9} transform="rotate(20 218 138)" />
      <Ellipse cx={197} cy={155} rx={8} ry={5} fill="#1E8449" opacity={0.88} transform="rotate(-10 197 155)" />
      {/* Leopardatura spots on crust */}
      {[
        [148, 58, 7], [228, 48, 6], [285, 96, 8], [300, 162, 6],
        [268, 218, 7], [195, 238, 5], [128, 216, 7], [97, 158, 6],
        [88, 96, 8], [160, 44, 5],
      ].map(([cx, cy, r], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} fill="#2C0F03" opacity={0.65} />
      ))}
      {/* Style color accent ring */}
      <Circle cx={195} cy={132} r={92} fill="none" stroke={color} strokeWidth={2} opacity={0.3} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Cross-section anatomy SVG
// ---------------------------------------------------------------------------

function AnatomySVG() {
  return (
    <Svg width={350} height={120} viewBox="0 0 350 120">
      {/* Cornicione */}
      <Ellipse cx={40} cy={55} rx={30} ry={40} fill="#7B4A1E" />
      <SvgText x={40} y={110} textAnchor="middle" fill={Colors.fg3} fontSize={9} fontFamily={Typography.fontFamily.mono}>
        Cornicione
      </SvgText>

      {/* Base layer */}
      <Rect x={68} y={72} width={220} height={18} rx={4} fill="#8B5E3C" />
      <SvgText x={178} y={108} textAnchor="middle" fill={Colors.fg3} fontSize={9} fontFamily={Typography.fontFamily.mono}>
        Base
      </SvgText>

      {/* Sauce layer */}
      <Rect x={68} y={58} width={220} height={14} rx={2} fill="#C0392B" opacity={0.85} />
      <SvgText x={316} y={68} fill={Colors.fg3} fontSize={9} fontFamily={Typography.fontFamily.mono}>
        Salsa
      </SvgText>

      {/* Cheese */}
      <Ellipse cx={155} cy={50} rx={35} ry={9} fill="#FDFEFE" opacity={0.85} />
      <Ellipse cx={210} cy={48} rx={28} ry={8} fill="#FDFEFE" opacity={0.8} />
      <SvgText x={316} y={52} fill={Colors.fg3} fontSize={9} fontFamily={Typography.fontFamily.mono}>
        Fior di latte
      </SvgText>

      {/* Connector lines */}
      <Line x1={68} y1={63} x2={310} y2={63} stroke={Colors.line} strokeWidth={0.5} />
      <Line x1={68} y1={72} x2={310} y2={72} stroke={Colors.line} strokeWidth={0.5} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Flour spec bar
// ---------------------------------------------------------------------------

interface BarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

function SpecBar({ label, value, max, unit, color }: BarProps) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.trackWrap}>
        <View style={barStyles.track}>
          <View style={[barStyles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
        </View>
        <Text style={[barStyles.value, { color }]}>{value}{unit}</Text>
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: {
    marginBottom: 14,
  },
  label: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  trackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bg3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  value: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    minWidth: 40,
    textAlign: 'right',
  },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StyleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const style = PIZZA_STYLES.find((s) => s.id === id) ?? PIZZA_STYLES[0];
  const signatureRecipes = RECIPES.filter((r) => r.style === style.id).slice(0, 2);

  const params = [
    { label: 'Hidratación', value: `${style.hyd}%`, sub: style.sub },
    { label: 'Temperatura', value: style.keyTemp, sub: 'horno' },
    { label: 'Tiempo', value: style.keyTime, sub: 'cocción' },
    { label: 'Bola', value: `${style.balls}g`, sub: 'por pizza' },
  ];

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Full-bleed pizza illustration */}
        <View style={styles.heroWrap}>
          <PizzaTopSVG color={style.color} />
          {/* Back button overlay */}
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
          {/* Name overlay */}
          <View style={styles.heroOverlay}>
            <Text style={styles.regionText}>{style.region.toUpperCase()}</Text>
            <Text style={styles.styleNameText}>{style.name}</Text>
            <Text style={styles.subText}>{style.sub}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Characteristics */}
          <Text style={styles.charText}>{style.char}</Text>

          {/* Parameters grid */}
          <Text style={styles.sectionTitle}>PARÁMETROS</Text>
          <View style={styles.paramsGrid}>
            {params.map((p) => (
              <View key={p.label} style={styles.paramCard}>
                <Text style={styles.paramValue}>{p.value}</Text>
                <Text style={styles.paramLabel}>{p.label}</Text>
                <Text style={styles.paramSub}>{p.sub}</Text>
              </View>
            ))}
          </View>

          {/* Anatomy cross-section */}
          <Text style={styles.sectionTitle}>ANATOMÍA</Text>
          <View style={styles.anatomyWrap}>
            <AnatomySVG />
          </View>

          {/* Flour specs */}
          <Text style={styles.sectionTitle}>HARINA RECOMENDADA</Text>
          <View style={styles.specsCard}>
            <SpecBar label="Fuerza W" value={300} max={400} unit="" color={style.color} />
            <SpecBar label="Proteína" value={12.5} max={16} unit="%" color={Colors.gold} />
            <SpecBar label="Absorción" value={style.hyd} max={100} unit="%" color={Colors.fg1} />
          </View>

          {/* Signature recipes */}
          {signatureRecipes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>RECETAS FIRMA</Text>
              {signatureRecipes.map((r) => (
                <Pressable
                  key={r.id}
                  style={styles.recipeCard}
                  onPress={() => router.push(`/recipe/${r.id}`)}
                >
                  <View style={[styles.recipeAccent, { backgroundColor: style.color }]} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>{r.name}</Text>
                    <Text style={styles.recipeMeta}>{r.time} min · {r.level} · {'★'.repeat(r.stars)}</Text>
                  </View>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke={Colors.fg2}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                </Pressable>
              ))}
            </>
          )}

          {/* Pull quote */}
          <View style={styles.pullQuote}>
            <View style={styles.pullQuoteBar} />
            <Text style={styles.pullQuoteText}>
              {style.id === 'napoletana'
                ? '« La vera pizza napoletana si riconosce dal cornicione. »'
                : style.id === 'newyork'
                ? '« A perfect New York slice folds, drips, and satisfies. »'
                : style.id === 'detroit'
                ? '« The cheese edge caramelized in the pan is the soul of Detroit. »'
                : style.id === 'romana'
                ? '« La base romana è il contrasto: sottile come carta, croccante come la vita. »'
                : '« Alta idratazione, lunga fermentazione: il segreto della pala. »'}
            </Text>
          </View>

          <View style={{ height: 60 }} />
        </View>
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
  heroWrap: {
    position: 'relative',
    width: 390,
    height: 260,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10,9,8,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  regionText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg1,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 4,
  },
  styleNameText: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 48,
    color: Colors.fg0,
    lineHeight: 52,
  },
  subText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
    marginTop: 4,
  },
  content: {
    padding: Spacing.screenPadding,
  },
  charText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg1,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 12,
    marginTop: 4,
  },
  paramsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  paramCard: {
    width: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 14,
  },
  paramValue: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['2xl'],
    color: Colors.fg0,
    marginBottom: 4,
  },
  paramLabel: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
    marginBottom: 2,
  },
  paramSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  anatomyWrap: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 14,
    marginBottom: 28,
    alignItems: 'center',
  },
  specsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 18,
    marginBottom: 28,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: 10,
    overflow: 'hidden',
  },
  recipeAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  recipeInfo: {
    flex: 1,
    padding: 14,
  },
  recipeName: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    marginBottom: 4,
  },
  recipeMeta: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  pullQuote: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: Colors.goldSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pullQuoteBar: {
    width: 3,
    backgroundColor: Colors.gold,
  },
  pullQuoteText: {
    flex: 1,
    fontFamily: Typography.fontFamily.serifItalic,
    fontSize: Typography.size.lg,
    color: Colors.fg0,
    padding: 18,
    lineHeight: 28,
  },
});
