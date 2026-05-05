import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { PIZZA_STYLES, calcDough } from '@/constants/data';
import * as Icons from '@/components/icons';

const C = Colors;
const F = Typography.fontFamily;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hydLabel(v: number): string {
  if (v < 60) return 'Cracker';
  if (v < 65) return 'Firme';
  if (v < 72) return 'Equilibrada';
  if (v < 80) return 'Alta';
  return 'Pala / Teglia';
}

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(startDeg: number, endDeg: number, r: number, cx: number, cy: number): string {
  const s = polarToXY(startDeg, r, cx, cy);
  const e = polarToXY(endDeg, r, cx, cy);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

// ---------------------------------------------------------------------------
// HydrationDial — PanResponder-based 270° SVG arc dial
// ---------------------------------------------------------------------------
const DIAL_SIZE = 250;
const DIAL_CX = DIAL_SIZE / 2;
const DIAL_CY = DIAL_SIZE / 2;
const DIAL_R = 110;
const DIAL_MIN = 50;
const DIAL_MAX = 90;
const DIAL_START = -135;
const DIAL_END = 135;

interface HydrationDialProps {
  value: number;
  onChange: (v: number) => void;
}

function HydrationDial({ value, onChange }: HydrationDialProps) {
  const containerRef = useRef<View>(null);
  const layoutRef = useRef<{ pageX: number; pageY: number; width: number; height: number } | null>(null);

  const valueToAngle = useCallback((v: number) => {
    return DIAL_START + ((v - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 270;
  }, []);

  const computeValue = useCallback((px: number, py: number): number | null => {
    const layout = layoutRef.current;
    if (!layout) return null;
    const cx = layout.pageX + layout.width / 2;
    const cy = layout.pageY + layout.height / 2;
    let deg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90;
    if (deg > 180) deg -= 360;
    deg = Math.max(DIAL_START, Math.min(DIAL_END, deg));
    const v = Math.round(DIAL_MIN + ((deg - DIAL_START) / 270) * (DIAL_MAX - DIAL_MIN));
    return Math.max(DIAL_MIN, Math.min(DIAL_MAX, v));
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const v = computeValue(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        if (v !== null) onChange(v);
      },
      onPanResponderMove: (evt) => {
        const v = computeValue(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        if (v !== null) onChange(v);
      },
    }),
  ).current;

  const angle = valueToAngle(value);
  const knob = polarToXY(angle, DIAL_R, DIAL_CX, DIAL_CY);
  const ticks = Array.from({ length: 9 }, (_, i) => DIAL_START + (i * 270) / 8);

  return (
    <View
      ref={containerRef}
      onLayout={() => {
        containerRef.current?.measure((_fx, _fy, width, height, pageX, pageY) => {
          layoutRef.current = { pageX, pageY, width, height };
        });
      }}
      style={styles.dialContainer}
      {...panResponder.panHandlers}
    >
      <Svg width={DIAL_SIZE} height={DIAL_SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="hydGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#C89759" />
            <Stop offset="100%" stopColor="#C45A2A" />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Path
          d={arcPath(DIAL_START, DIAL_END, DIAL_R, DIAL_CX, DIAL_CY)}
          stroke="rgba(244,237,228,0.08)"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        {/* Active arc */}
        <Path
          d={arcPath(DIAL_START, angle, DIAL_R, DIAL_CX, DIAL_CY)}
          stroke="url(#hydGrad)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        {/* Tick marks */}
        {ticks.map((a, i) => {
          const inner = polarToXY(a, DIAL_R - 16, DIAL_CX, DIAL_CY);
          const outer = polarToXY(a, DIAL_R - 8, DIAL_CX, DIAL_CY);
          const isMajor = i % 2 === 0;
          return (
            <Line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(244,237,228,0.22)"
              strokeWidth={isMajor ? 1.5 : 1}
            />
          );
        })}
      </Svg>
      {/* Knob */}
      <View
        pointerEvents="none"
        style={[styles.dialKnob, { left: knob.x - 12, top: knob.y - 12 }]}
      />
      {/* Center readout */}
      <View style={styles.dialCenter} pointerEvents="none">
        <Text style={styles.dialEyebrow}>HIDRATACIÓN</Text>
        <Text style={styles.dialBigNum}>
          {value}
          <Text style={styles.dialUnit}>%</Text>
        </Text>
        <Text style={styles.dialLabel}>{hydLabel(value)}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------
function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => onChange(Math.max(min, value - step))}
        activeOpacity={0.7}
      >
        <Text style={styles.stepperBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperVal}>{value}</Text>
      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => onChange(Math.min(max, value + step))}
        activeOpacity={0.7}
      >
        <Text style={styles.stepperBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// AdjustRow — touch-based slider with +/- buttons as fallback
// ---------------------------------------------------------------------------
function AdjustRow({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
}) {
  const pct = (value - min) / (max - min);
  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        trackRef.current?.measure((_x, _y, width, _h, pageX) => {
          const relX = evt.nativeEvent.pageX - pageX;
          const fraction = Math.max(0, Math.min(1, relX / width));
          const raw = min + fraction * (max - min);
          const snapped = Math.round(raw / step) * step;
          onChange(Math.max(min, Math.min(max, parseFloat(snapped.toFixed(2)))));
        });
      },
      onPanResponderMove: (evt) => {
        trackRef.current?.measure((_x, _y, width, _h, pageX) => {
          const relX = evt.nativeEvent.pageX - pageX;
          const fraction = Math.max(0, Math.min(1, relX / width));
          const raw = min + fraction * (max - min);
          const snapped = Math.round(raw / step) * step;
          onChange(Math.max(min, Math.min(max, parseFloat(snapped.toFixed(2)))));
        });
      },
    }),
  ).current;

  return (
    <View style={styles.adjustRow}>
      <Text style={styles.adjustLabel}>{label}</Text>
      <View style={styles.adjustSliderRow}>
        {/* Custom track */}
        <View
          ref={trackRef}
          style={styles.adjustTrack}
          onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
          {...panResponder.panHandlers}
        >
          <View style={[styles.adjustTrackFill, { width: `${pct * 100}%` as `${number}%` }]} />
          <View style={[styles.adjustThumb, { left: `${pct * 100}%` as `${number}%` }]} />
        </View>
        <Text style={styles.adjustValue}>{value}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// IngredientRow
// ---------------------------------------------------------------------------
function IngredientRow({
  icon,
  label,
  amount,
  unit,
  pct,
  hi = false,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  amount: number | string;
  unit: string;
  pct: string;
  hi?: boolean;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.ingredientRow,
        !last && styles.ingredientRowBorder,
        hi && styles.ingredientRowHi,
      ]}
    >
      <View style={styles.ingredientIconBox}>{icon}</View>
      <View style={styles.ingredientLabelCol}>
        <Text style={styles.ingredientLabel}>{label}</Text>
        <Text style={styles.ingredientPct}>{pct}</Text>
      </View>
      <View style={styles.ingredientAmountCol}>
        <Text style={styles.ingredientAmount}>{amount}</Text>
        <Text style={styles.ingredientUnit}> {unit}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// CalcScreen
// ---------------------------------------------------------------------------
export default function CalcScreen() {
  const insets = useSafeAreaInsets();
  const [styleId, setStyleId] = useState('napoletana');
  const style = PIZZA_STYLES.find((s) => s.id === styleId) ?? PIZZA_STYLES[0];

  const [pizzas, setPizzas] = useState(4);
  const [ballSize, setBallSize] = useState(style.balls);
  const [hyd, setHyd] = useState(style.hyd);
  const [salt, setSalt] = useState(style.salt);
  const [oil, setOil] = useState(style.oil);
  const [ferment, setFerment] = useState(style.ferment);

  useEffect(() => {
    setBallSize(style.balls);
    setHyd(style.hyd);
    setSalt(style.salt);
    setOil(style.oil);
    setFerment(style.ferment);
  }, [styleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = calcDough({ pizzas, ballSize, hyd, salt, oil, ferment });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Style selector */}
      <View style={styles.px}>
        <Text style={styles.styleEyebrow}>ESTILO · {style.region.toUpperCase()}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContent}
        style={{ marginTop: 10 }}
      >
        {PIZZA_STYLES.map((s) => {
          const isActive = s.id === styleId;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setStyleId(s.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.chipDot, { backgroundColor: s.color }]} />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={[styles.px, { marginTop: 12 }]}>
        <Text style={styles.styleChar}>{style.char}</Text>
      </View>

      {/* Hydration Dial */}
      <View style={styles.dialWrapper}>
        <HydrationDial value={hyd} onChange={setHyd} />
      </View>

      {/* Pizzas + Ball size */}
      <View style={[styles.px, styles.inputGrid]}>
        <View style={styles.inputCard}>
          <Text style={styles.inputCardEyebrow}>PIZZAS</Text>
          <View style={styles.inputCardRow}>
            <Text style={styles.inputCardBigNum}>{pizzas}</Text>
            <Stepper value={pizzas} onChange={setPizzas} min={1} max={30} />
          </View>
        </View>
        <View style={styles.inputCard}>
          <Text style={styles.inputCardEyebrow}>BOLA · G</Text>
          <View style={styles.inputCardRow}>
            <Text style={styles.inputCardBigNum}>{ballSize}</Text>
            <Stepper value={ballSize} onChange={setBallSize} min={120} max={700} step={10} />
          </View>
        </View>
      </View>

      {/* Formula readout */}
      <View style={[styles.px, { marginTop: 24 }]}>
        <View style={styles.formulaCard}>
          <View style={styles.formulaCardHeader}>
            <Text style={styles.formulaEyebrow}>
              Fórmula · {result.totalDough}g total
            </Text>
            <Text style={styles.formulaBakersLabel}>BAKER'S %</Text>
          </View>
          <IngredientRow
            icon={<Icons.Wheat size={18} color="#C89759" />}
            label="Harina"
            amount={result.flour}
            unit="g"
            pct="100%"
            hi
          />
          <IngredientRow
            icon={<Icons.Drop size={18} color="#6090C0" />}
            label="Agua"
            amount={result.water}
            unit="g"
            pct={hyd + '%'}
          />
          <IngredientRow
            icon={<Icons.Salt size={18} color="#D0C8B0" />}
            label="Sal"
            amount={result.saltG}
            unit="g"
            pct={salt + '%'}
          />
          <IngredientRow
            icon={<Icons.Yeast size={18} color="#C87848" />}
            label="Levadura seca"
            amount={result.yeast}
            unit="g"
            pct={((result.yeast / result.flour) * 100).toFixed(2) + '%'}
          />
          {oil > 0 && (
            <IngredientRow
              icon={<Icons.Drop size={18} color="#C8B060" />}
              label="Aceite oliva"
              amount={result.oilG}
              unit="g"
              pct={oil + '%'}
            />
          )}
          <IngredientRow
            icon={<Icons.Thermometer size={18} color={C.fg2} />}
            label="Fermentación"
            amount={ferment}
            unit={`h @ ${style.temp}°C`}
            pct="cold"
            last
          />
        </View>
      </View>

      {/* Adjust sliders */}
      <View style={[styles.px, styles.adjustsCol]}>
        <AdjustRow
          label="Sal %"
          value={salt}
          onChange={(v) => setSalt(Math.round(v * 10) / 10)}
          step={0.1}
          min={1.5}
          max={3.5}
        />
        <AdjustRow
          label="Aceite %"
          value={oil}
          onChange={(v) => setOil(Math.round(v * 10) / 10)}
          step={0.5}
          min={0}
          max={6}
        />
        <AdjustRow
          label="Fermentación · h"
          value={ferment}
          onChange={(v) => setFerment(Math.round(v))}
          step={6}
          min={6}
          max={96}
        />
      </View>

      {/* CTA buttons */}
      <View style={[styles.px, styles.ctaStack]}>
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
          <Icons.Flame size={18} color="#fff" />
          <Text style={styles.btnPrimaryText}>Iniciar proceso · {ferment}h</Text>
        </TouchableOpacity>
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
            <Icons.Cart size={16} color={C.fg1} />
            <Text style={styles.btnSecondaryText}>Lista de compras</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.8}>
            <Icons.Share size={16} color={C.fg1} />
            <Text style={styles.btnSecondaryText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg0 },
  scrollContent: { flexGrow: 1 },
  px: { paddingHorizontal: Spacing.screenPadding },

  styleEyebrow: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: C.fg2,
    textTransform: 'uppercase',
  },

  chipsScrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.line2,
    backgroundColor: C.bgCard,
  },
  chipActive: {
    borderColor: C.accent,
    backgroundColor: C.accentSoft,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontFamily: F.sansMedium,
    fontSize: 13,
    color: C.fg2,
  },
  chipTextActive: {
    color: C.fg0,
  },

  styleChar: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.fg2,
    lineHeight: 19,
  },

  dialWrapper: {
    alignItems: 'center',
    marginTop: 28,
  },
  dialContainer: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialKnob: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 8,
  },
  dialCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialEyebrow: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 2,
    color: C.fg2,
    textTransform: 'uppercase',
  },
  dialBigNum: {
    fontFamily: F.serif,
    fontSize: 64,
    color: C.fg0,
    lineHeight: 72,
    letterSpacing: -2,
    marginTop: 4,
  },
  dialUnit: {
    fontFamily: F.serif,
    fontSize: 22,
    color: C.fg1,
  },
  dialLabel: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    color: C.fg3,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  inputGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  inputCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    padding: 16,
  },
  inputCardEyebrow: {
    fontFamily: F.mono,
    fontSize: 9,
    letterSpacing: 2,
    color: C.fg3,
    textTransform: 'uppercase',
  },
  inputCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputCardBigNum: {
    fontFamily: F.serif,
    fontSize: 38,
    color: C.fg0,
    lineHeight: 44,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bg3,
    borderWidth: 0.5,
    borderColor: C.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontFamily: F.sansMedium,
    fontSize: 18,
    color: C.fg0,
    lineHeight: 22,
  },
  stepperVal: {
    fontFamily: F.mono,
    fontSize: 13,
    color: C.fg0,
    minWidth: 32,
    textAlign: 'center',
  },

  formulaCard: {
    backgroundColor: C.bgCard,
    borderRadius: Spacing.cardRadius,
    borderWidth: 0.5,
    borderColor: C.line,
    overflow: 'hidden',
  },
  formulaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  formulaEyebrow: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.fg2,
    textTransform: 'uppercase',
  },
  formulaBakersLabel: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.accent,
    textTransform: 'uppercase',
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  ingredientRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.line,
  },
  ingredientRowHi: {
    backgroundColor: C.goldSoft,
  },
  ingredientIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ingredientLabelCol: {
    flex: 1,
  },
  ingredientLabel: {
    fontFamily: F.sansMedium,
    fontSize: 14,
    color: C.fg0,
  },
  ingredientPct: {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.fg3,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  ingredientAmountCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ingredientAmount: {
    fontFamily: F.serif,
    fontSize: 24,
    color: C.fg0,
  },
  ingredientUnit: {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.fg2,
    marginLeft: 4,
  },

  adjustsCol: {
    gap: 16,
    marginTop: 20,
  },
  adjustRow: {
    gap: 8,
  },
  adjustLabel: {
    fontFamily: F.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: C.fg2,
    textTransform: 'uppercase',
  },
  adjustSliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustTrack: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    position: 'relative',
  },
  adjustTrackFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    backgroundColor: C.accent,
    borderRadius: 2,
    top: '50%' as never,
    marginTop: -2,
  },
  adjustThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.accent,
    marginLeft: -10,
    top: '50%' as never,
    marginTop: -10,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  adjustValue: {
    fontFamily: F.mono,
    fontSize: 13,
    color: C.fg0,
    width: 44,
    textAlign: 'right',
  },

  ctaStack: {
    gap: 10,
    marginTop: 24,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: Spacing.buttonRadius,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  btnPrimaryText: {
    fontFamily: F.sansSemiBold,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.3,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.bg2,
    borderRadius: Spacing.buttonRadius,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: C.line2,
  },
  btnSecondaryText: {
    fontFamily: F.sansMedium,
    fontSize: 14,
    color: C.fg1,
  },
});
