
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path, Ellipse, Rect, G } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES, RECIPES } from '@/constants/data';

const { width: SCREEN_W } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Logo SVG
// ---------------------------------------------------------------------------

function LogoSVG() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Circle cx={40} cy={40} r={38} fill={Colors.bg2} stroke={Colors.accent} strokeWidth={2} />
      <Circle cx={40} cy={40} r={28} fill="#C0392B" opacity={0.85} />
      <Circle cx={40} cy={40} r={22} fill="#EBC84A" opacity={0.9} />
      <Ellipse cx={40} cy={40} rx={8} ry={7} fill="#FDFEFE" opacity={0.95} />
      <Ellipse cx={30} cy={35} rx={5} ry={4} fill="#FDFEFE" opacity={0.9} />
      <Ellipse cx={50} cy={35} rx={5} ry={4} fill="#FDFEFE" opacity={0.9} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Oven toggle + level chips (reusable piece for step 3)
// ---------------------------------------------------------------------------

interface KitchenSetupProps {
  ovenType: string;
  setOvenType: (v: string) => void;
  kaEnabled: boolean;
  setKaEnabled: (v: boolean) => void;
  level: string;
  setLevel: (v: string) => void;
}

function KitchenSetup({ ovenType, setOvenType, kaEnabled, setKaEnabled, level, setLevel }: KitchenSetupProps) {
  return (
    <View style={kitStyles.root}>
      <Text style={kitStyles.label}>Tipo de horno</Text>
      <View style={kitStyles.chipRow}>
        {['Eléctrico', 'Gas', 'Leña'].map((o) => (
          <Pressable
            key={o}
            style={[kitStyles.chip, ovenType === o && kitStyles.chipActive]}
            onPress={() => setOvenType(o)}
          >
            <Text style={[kitStyles.chipText, ovenType === o && kitStyles.chipTextActive]}>{o}</Text>
          </Pressable>
        ))}
      </View>

      <View style={kitStyles.toggleRow}>
        <Text style={kitStyles.toggleLabel}>KitchenAid / Amasadora</Text>
        <Pressable
          style={[kitStyles.switch, kaEnabled && kitStyles.switchActive]}
          onPress={() => setKaEnabled(!kaEnabled)}
        >
          <View style={[kitStyles.switchThumb, kaEnabled && kitStyles.switchThumbActive]} />
        </Pressable>
      </View>

      <Text style={[kitStyles.label, { marginTop: 16 }]}>Tu nivel</Text>
      <View style={kitStyles.chipRow}>
        {['Principiante', 'Intermedio', 'Avanzado'].map((l) => (
          <Pressable
            key={l}
            style={[kitStyles.chip, level === l && kitStyles.chipGold]}
            onPress={() => setLevel(l)}
          >
            <Text style={[kitStyles.chipText, level === l && kitStyles.chipTextGold]}>{l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const kitStyles = StyleSheet.create({
  root: { gap: 4 },
  label: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.line2,
    backgroundColor: Colors.bg3,
  },
  chipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  chipGold: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.gold,
  },
  chipText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
  chipTextActive: {
    color: Colors.accent,
  },
  chipTextGold: {
    color: Colors.gold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    marginVertical: 4,
  },
  toggleLabel: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line2,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.fg2,
  },
  switchThumbActive: {
    backgroundColor: Colors.accent,
    transform: [{ translateX: 20 }],
  },
});

// ---------------------------------------------------------------------------
// Suggested recipe card
// ---------------------------------------------------------------------------

function FirstRecipeCard({ recipeId }: { recipeId: string }) {
  const recipe = RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0];
  const pizzaStyle = PIZZA_STYLES.find((s) => s.id === recipe.style) ?? PIZZA_STYLES[0];
  return (
    <View style={recipeCardStyles.card}>
      <View style={[recipeCardStyles.accent, { backgroundColor: pizzaStyle.color }]} />
      <View style={recipeCardStyles.body}>
        <View style={[recipeCardStyles.styleBadge, { backgroundColor: pizzaStyle.color + '22' }]}>
          <Text style={[recipeCardStyles.styleText, { color: pizzaStyle.color }]}>
            {pizzaStyle.name.toUpperCase()}
          </Text>
        </View>
        <Text style={recipeCardStyles.name}>{recipe.name}</Text>
        <Text style={recipeCardStyles.meta}>{recipe.time} min · {recipe.level} · {'★'.repeat(recipe.stars)}</Text>
        <Text style={recipeCardStyles.tag}>{recipe.tag}</Text>
      </View>
    </View>
  );
}

const recipeCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  styleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  styleText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.lg,
    color: Colors.fg0,
  },
  meta: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  tag: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('napoletana');
  const [ovenType, setOvenType] = useState('Eléctrico');
  const [kaEnabled, setKaEnabled] = useState(false);
  const [level, setLevel] = useState('Principiante');

  const totalSteps = 4;

  const suggestedRecipeId = (() => {
    const match = RECIPES.find((r) => r.style === selectedStyle);
    return match ? match.id : '1';
  })();

  const goNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.logoWrap}>
              <LogoSVG />
            </View>
            <Text style={styles.stepTitle}>Bienvenido a{'\n'}Johnny Hub</Text>
            <Text style={styles.stepSubtitle}>
              Tu laboratorio de pizza artesanal. Recetas, técnicas, fermentación y maridajes en un solo lugar.
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tu estilo{'\n'}favorito</Text>
            <Text style={styles.stepSubtitle}>Elige el punto de partida. Podrás cambiar cuando quieras.</Text>
            <View style={styles.styleGrid}>
              {PIZZA_STYLES.map((ps) => (
                <Pressable
                  key={ps.id}
                  style={[
                    styles.styleCard,
                    selectedStyle === ps.id && { borderColor: ps.color, backgroundColor: ps.color + '15' },
                  ]}
                  onPress={() => setSelectedStyle(ps.id)}
                >
                  <View style={[styles.styleColorBar, { backgroundColor: ps.color }]} />
                  <View style={styles.styleCardBody}>
                    <Text style={styles.styleName}>{ps.name}</Text>
                    <Text style={styles.styleSub}>{ps.region}</Text>
                    <Text style={styles.styleHyd}>{ps.hyd}% hid.</Text>
                  </View>
                  {selectedStyle === ps.id && (
                    <View style={[styles.styleCheckmark, { backgroundColor: ps.color }]}>
                      <Svg width={12} height={12} viewBox="0 0 12 12">
                        <Path
                          d="M2 6l3 3 5-5"
                          stroke={Colors.fg0}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </Svg>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Configura{'\n'}tu cocina</Text>
            <Text style={styles.stepSubtitle}>Personalizamos las recetas y técnicas según tu equipo.</Text>
            <KitchenSetup
              ovenType={ovenType}
              setOvenType={setOvenType}
              kaEnabled={kaEnabled}
              setKaEnabled={setKaEnabled}
              level={level}
              setLevel={setLevel}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tu primera{'\n'}receta</Text>
            <Text style={styles.stepSubtitle}>
              Basándonos en tu estilo preferido, te sugerimos empezar con:
            </Text>
            <FirstRecipeCard recipeId={suggestedRecipeId} />
            <View style={styles.encourageBox}>
              <Text style={styles.encourageText}>
                Todo está listo. Sigue el proceso paso a paso y en pocas horas tendrás tu primera pizza perfecta.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      {/* Dots progress */}
      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === step && styles.dotActive,
              i < step && styles.dotPast,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomBar}>
        {step > 0 && (
          <Pressable style={styles.backStepBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.backStepText}>Atrás</Text>
          </Pressable>
        )}
        <Pressable style={[styles.nextBtn, step === 0 && styles.nextBtnFull]} onPress={goNext}>
          <Text style={styles.nextBtnText}>
            {step === totalSteps - 1 ? '¡Empezar!' : 'Siguiente'}
          </Text>
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
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 56,
    paddingBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line2,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  dotPast: {
    backgroundColor: Colors.fg3,
    borderColor: Colors.fg3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  stepContent: {
    gap: 16,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size['3xl'],
    color: Colors.fg0,
    lineHeight: 38,
  },
  stepSubtitle: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg1,
    lineHeight: 22,
  },
  styleGrid: {
    gap: 10,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  styleColorBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  styleCardBody: {
    flex: 1,
    padding: 14,
    gap: 2,
  },
  styleName: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  styleSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  styleHyd: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg2,
  },
  styleCheckmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    margin: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  encourageBox: {
    backgroundColor: Colors.accentSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '33',
    padding: 16,
  },
  encourageText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg1,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: Spacing.screenPadding,
    paddingBottom: 34,
    backgroundColor: Colors.bg0,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    gap: 10,
  },
  backStepBtn: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line2,
    backgroundColor: Colors.bg2,
  },
  backStepText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.base,
    color: Colors.fg1,
  },
  nextBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: Colors.accent,
    borderRadius: 14,
  },
  nextBtnFull: {
    flex: 1,
  },
  nextBtnText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    letterSpacing: 0.3,
  },
});
