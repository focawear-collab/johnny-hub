
import { ViewStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------
export const Colors = {
  // Backgrounds
  bg0: '#0A0908',
  bg1: '#14110F',
  bg2: '#1C1816',
  bg3: '#251F1B',
  bgCard: '#1A1614',

  // Foregrounds
  fg0: '#F4EDE4',
  fg1: '#C4B8AB',
  fg2: '#9C9087',
  fg3: '#6E6560',

  // Accent
  accent: '#C45A2A',
  accentSoft: 'rgba(196,90,42,0.18)',

  // Gold
  gold: '#C89759',
  goldSoft: 'rgba(200,151,89,0.16)',

  // Lines / borders
  line: 'rgba(244,237,228,0.08)',
  line2: 'rgba(244,237,228,0.14)',

  // Pizza style hues (used for accent dots / tags)
  napoletana: '#C45A2A',
  newyork: '#D4884A',
  romana: '#C8A060',
  detroit: '#B84A28',
  pala: '#B8A060',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------
export const Typography = {
  fontFamily: {
    serif: 'Fraunces-Regular',
    serifItalic: 'Fraunces-Italic',
    serifSemi: 'Fraunces-SemiBold',
    sans: 'Inter-Regular',
    sansMedium: 'Inter-Medium',
    sansSemi: 'Inter-SemiBold',
    mono: 'JetBrainsMono-Regular',
    monoMedium: 'JetBrainsMono-Medium',
  },
  size: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    hero: 48,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
    caps: 2.5,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------
export const Spacing = {
  // Base scale (4-pt grid)
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,

  // Named semantic values
  screenPadding: 20,
  padding: 24,
  cardPadding: 18,
  cardRadius: 22,
  chipRadius: 20,
  buttonRadius: 14,
  iconSize: 22,
  topBarHeight: 56,
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
type ShadowStyle = Pick<
  ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

export const shadow = {
  none: {} as ShadowStyle,

  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  } as ShadowStyle,

  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  } as ShadowStyle,

  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  } as ShadowStyle,

  accent: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  } as ShadowStyle,

  gold: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  } as ShadowStyle,

  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  } as ShadowStyle,
} as const;

// ---------------------------------------------------------------------------
// Consolidated design token object
// ---------------------------------------------------------------------------
export const T = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  shadow,
} as const;

export default T;
