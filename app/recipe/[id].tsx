// FILE: app/app/recipe/[id].tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { RECIPES, PIZZA_STYLES } from '@/constants/data';

// ---------------------------------------------------------------------------
// Pizza illustration SVG
// ---------------------------------------------------------------------------

function PizzaSVG() {
  return (
    <Svg width={390} height={220} viewBox="0 0 390 220">
      {/* Background gradient simulation */}
      <Rect width={390} height={220} fill="#1C1816" />
      {/* Crust outer */}
      <Circle cx={195} cy={110} r={95} fill="#8B5E3C" />
      {/* Sauce */}
      <Circle cx={195} cy={110} r={80} fill="#C0392B" opacity={0.9} />
      {/* Cheese */}
      <Circle cx={195} cy={110} r={70} fill="#F4D03F" opacity={0.85} />
      {/* Mozzarella blobs */}
      <Ellipse cx={195} cy={110} rx={20} ry={18} fill="#FDFEFE" opacity={0.9} />
      <Ellipse cx={165} cy={92} rx={14} ry={12} fill="#FDFEFE" opacity={0.85} />
      <Ellipse cx={225} cy={92} rx={13} ry={11} fill="#FDFEFE" opacity={0.85} />
      <Ellipse cx={210} cy={132} rx={15} ry={13} fill="#FDFEFE" opacity={0.8} />
      <Ellipse cx={178} cy={128} rx={12} ry={10} fill="#FDFEFE" opacity={0.8} />
      {/* Basil leaves */}
      <Ellipse cx={180} cy={98} rx={8} ry={5} fill="#27AE60" opacity={0.9} transform="rotate(-20 180 98)" />
      <Ellipse cx={210} cy={118} rx={8} ry={5} fill="#27AE60" opacity={0.9} transform="rotate(15 210 118)" />
      {/* Leopardatura char spots on crust */}
      <Circle cx={140} cy={60} r={5} fill="#3D1A0A" opacity={0.7} />
      <Circle cx={250} cy={65} r={4} fill="#3D1A0A" opacity={0.7} />
      <Circle cx={270} cy={140} r={5} fill="#3D1A0A" opacity={0.6} />
      <Circle cx={130} cy={155} r={4} fill="#3D1A0A" opacity={0.6} />
      <Circle cx={200} cy={50} r={3} fill="#3D1A0A" opacity={0.5} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Dough ball SVG toggle icon
// ---------------------------------------------------------------------------

function KAIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.kaIcon, active && styles.kaIconActive]}>
      <Svg width={20} height={20} viewBox="0 0 20 20">
        <Circle cx={10} cy={10} r={8} fill="none" stroke={active ? Colors.accent : Colors.fg2} strokeWidth={1.5} />
        <Circle cx={10} cy={10} r={3} fill={active ? Colors.accent : Colors.fg2} />
        <Path d="M10 2 L10 6" stroke={active ? Colors.accent : Colors.fg2} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M10 14 L10 18" stroke={active ? Colors.accent : Colors.fg2} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M2 10 L6 10" stroke={active ? Colors.accent : Colors.fg2} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M14 10 L18 10" stroke={active ? Colors.accent : Colors.fg2} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    id: 1,
    title: 'Autólisis',
    desc: 'Mezcla harina con el 90% del agua. Reposa 30 minutos para que el gluten comience a formarse sin sal ni levadura.',
    time: '30 min',
    isAmasado: false,
  },
  {
    id: 2,
    title: 'Amasado',
    descManual: 'Amasa a mano durante 15 minutos con movimientos de pliegue y estirado hasta obtener una masa lisa y elástica.',
    descKA: 'Vel 2 · 8 min para incorporar, luego Vel 6 · 4 min hasta ventana de gluten.',
    time: '15 min',
    timeKA: '12 min',
    isAmasado: true,
  },
  {
    id: 3,
    title: 'Bulk fermentation',
    desc: 'Fermenta a temperatura ambiente 22°C durante 2 horas. Realiza 3 series de stretch & fold cada 30 minutos.',
    time: '2 h',
    isAmasado: false,
  },
  {
    id: 4,
    title: 'Bolado y frío',
    desc: 'Forma bolas de 250g con tensión superficial. Coloca en tapers, tapa y refrigera a 4°C por 20–24 horas.',
    time: '24 h',
    isAmasado: false,
  },
  {
    id: 5,
    title: 'Estirado',
    desc: 'Saca del frío 1 hora antes. Estira del centro hacia afuera presionando el aire al cornicione. Diámetro 30cm.',
    time: '10 min',
    isAmasado: false,
  },
  {
    id: 6,
    title: 'Horneado',
    desc: 'Precalienta piedra a máximo 1 hora. Lanza en 60–90 segundos. Busca leopardatura en el cornicione.',
    time: '90 s',
    isAmasado: false,
  },
];

const INGREDIENTS_MASA = [
  { name: 'Harina 00 (W300)', amount: '596', unit: 'g' },
  { name: 'Agua fría', amount: '387', unit: 'ml' },
  { name: 'Sal marina fina', amount: '16.7', unit: 'g' },
  { name: 'Levadura seca', amount: '0.18', unit: 'g' },
];

const INGREDIENTS_TOPPING = [
  { name: 'Tomate San Marzano (pelados)', amount: '400', unit: 'g' },
  { name: 'Mozzarella fior di latte', amount: '250', unit: 'g' },
  { name: 'Albahaca fresca', amount: '10', unit: 'hojas' },
  { name: 'Aceite extra virgen', amount: '30', unit: 'ml' },
  { name: 'Sal en escamas', amount: 'al gusto', unit: '' },
];

const TIPS_DATA = [
  {
    id: '1',
    title: 'Temperatura del agua',
    body: '«&nbsp;El agua debe estar a 18–20°C. Si tu cocina supera 24°C, usa agua fría de nevera para no superar los 23°C de temperatura final de masa.&nbsp;»',
  },
  {
    id: '2',
    title: 'La sal va al final',
    body: '«&nbsp;Añade la sal siempre después de la levadura, nunca en contacto directo. La sal inhibe la actividad de la levadura.&nbsp;»',
  },
  {
    id: '3',
    title: 'Señal de punto de gluten',
    body: '«&nbsp;Estira un trozo de masa entre los dedos: si ves una membrana traslúcida sin romperse (windowpane test), el gluten está desarrollado.&nbsp;»',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Tab = 'proceso' | 'ingredientes' | 'tips';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = RECIPES.find((r) => r.id === id) ?? RECIPES[0];
  const style = PIZZA_STYLES.find((s) => s.id === recipe.style) ?? PIZZA_STYLES[0];

  const [activeTab, setActiveTab] = useState<Tab>('proceso');
  const [kaActive, setKaActive] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <View style={styles.root}>
      {/* Header illustration */}
      <View style={styles.headerImg}>
        <PizzaSVG />
        {/* Gradient overlay */}
        <View style={styles.headerGradient} />
        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M19 12H5M12 5l-7 7 7 7" stroke={Colors.fg0} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </Pressable>
        {/* Bookmark */}
        <Pressable style={styles.bookmarkBtn} onPress={() => setBookmarked(!bookmarked)}>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path
              d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
              stroke={bookmarked ? Colors.gold : Colors.fg0}
              fill={bookmarked ? Colors.gold : 'none'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        {/* Recipe name overlay */}
        <View style={styles.headerTitle}>
          <View style={[styles.styleChip, { backgroundColor: style.color + '33' }]}>
            <Text style={[styles.styleChipText, { color: style.color }]}>{style.name.toUpperCase()}</Text>
          </View>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <Text style={styles.recipeMeta}>{recipe.time} min · {recipe.level} · {'★'.repeat(recipe.stars)}</Text>
        </View>
      </View>

      {/* Segmented control */}
      <View style={styles.tabs}>
        {(['proceso', 'ingredientes', 'tips'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
              {t === 'proceso' ? 'Proceso' : t === 'ingredientes' ? 'Ingredientes' : 'Tips'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'proceso' && (
          <View>
            {/* KitchenAid toggle */}
            <Pressable style={styles.kaToggle} onPress={() => setKaActive(!kaActive)}>
              <KAIcon active={kaActive} />
              <View style={styles.kaToggleText}>
                <Text style={styles.kaToggleTitle}>
                  {kaActive ? 'KitchenAid' : 'Amasado manual'}
                </Text>
                <Text style={styles.kaToggleSub}>
                  {kaActive ? 'Vel 2 · 8min + Vel 6 · 4min' : '15 minutos a mano'}
                </Text>
              </View>
              <View style={[styles.kaSwitch, kaActive && styles.kaSwitchActive]}>
                <View style={[styles.kaSwitchThumb, kaActive && styles.kaSwitchThumbActive]} />
              </View>
            </Pressable>

            {/* Steps */}
            {PROCESS_STEPS.map((step) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepNumWrap}>
                  <Text style={styles.stepNum}>{step.id}</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <View style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>
                        {step.isAmasado && kaActive ? step.timeKA : step.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.stepDesc}>
                    {step.isAmasado
                      ? (kaActive ? step.descKA : step.descManual)
                      : step.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'ingredientes' && (
          <View>
            {/* Masa section */}
            <Text style={styles.ingSection}>MASA · Baker's %</Text>
            {INGREDIENTS_MASA.map((ing) => (
              <View key={ing.name} style={styles.ingRow}>
                <Text style={styles.ingName}>{ing.name}</Text>
                <Text style={styles.ingAmt}>{ing.amount} {ing.unit}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            {/* Topping section */}
            <Text style={styles.ingSection}>TOPPING</Text>
            {INGREDIENTS_TOPPING.map((ing) => (
              <View key={ing.name} style={styles.ingRow}>
                <Text style={styles.ingName}>{ing.name}</Text>
                <Text style={styles.ingAmt}>{ing.amount} {ing.unit}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'tips' && (
          <View>
            {TIPS_DATA.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipBody}>{tip.body.replace(/&nbsp;/g, ' ')}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.ctaButton} onPress={() => router.push('/livebake')}>
          <Text style={styles.ctaButtonText}>Iniciar proceso</Text>
        </Pressable>
      </View>
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
  headerImg: {
    width: 390,
    height: 220,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'transparent',
    // Simulated gradient with overlay
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10,9,8,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10,9,8,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  styleChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  styleChipText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    letterSpacing: Typography.letterSpacing.caps,
  },
  recipeTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['2xl'],
    color: Colors.fg0,
    marginBottom: 4,
  },
  recipeMeta: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
  },
  tabText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: Colors.fg0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  // KA Toggle
  kaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line2,
    padding: 14,
    marginBottom: 20,
    gap: 12,
  },
  kaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaIconActive: {
    backgroundColor: Colors.accentSoft,
  },
  kaToggleText: {
    flex: 1,
  },
  kaToggleTitle: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    marginBottom: 2,
  },
  kaToggleSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg2,
  },
  kaSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line2,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  kaSwitchActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  kaSwitchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.fg2,
  },
  kaSwitchThumbActive: {
    backgroundColor: Colors.accent,
    transform: [{ translateX: 20 }],
  },
  // Steps
  stepCard: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 14,
  },
  stepNumWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNum: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.sm,
    color: Colors.accent,
  },
  stepContent: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    flex: 1,
  },
  timeBadge: {
    backgroundColor: Colors.goldSoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  timeBadgeText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.gold,
  },
  stepDesc: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
    lineHeight: 20,
  },
  // Ingredients
  ingSection: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 10,
    marginTop: 4,
  },
  ingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  ingName: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    flex: 1,
  },
  ingAmt: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.gold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.line2,
    marginVertical: 20,
  },
  // Tips
  tipCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 18,
    marginBottom: 12,
  },
  tipTitle: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    marginBottom: 8,
  },
  tipBody: {
    fontFamily: Typography.fontFamily.serifItalic,
    fontSize: Typography.size.md,
    color: Colors.fg1,
    lineHeight: 24,
  },
  // Bottom
  bottomBar: {
    padding: Spacing.screenPadding,
    paddingBottom: 34,
    backgroundColor: Colors.bg0,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    letterSpacing: 0.3,
  },
});
