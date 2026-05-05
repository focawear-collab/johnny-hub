
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Ellipse, G, Rect } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type PairingKind = 'wine' | 'beer' | 'cocktail';

interface Pairing {
  id: string;
  kind: PairingKind;
  name: string;
  region: string;
  note: string;
}

interface StylePairings {
  styleId: string;
  styleName: string;
  color: string;
  pairings: Pairing[];
}

const PAIRINGS_DATA: StylePairings[] = [
  {
    styleId: 'napoletana',
    styleName: 'Napoletana',
    color: Colors.accent,
    pairings: [
      {
        id: 'n1',
        kind: 'wine',
        name: 'Aglianico del Vulture',
        region: 'Basilicata, Italia',
        note: 'Taninos firmes y acidez vibrante que equilibran la riqueza del fior di latte y cortan la acidez del San Marzano.',
      },
      {
        id: 'n2',
        kind: 'wine',
        name: 'Lacryma Christi del Vesuvio',
        region: 'Campania, Italia',
        note: 'Del mismo territorio que la pizza. Notas volcánicas y minerales que amplifican el carácter de la salsa cruda.',
      },
      {
        id: 'n3',
        kind: 'beer',
        name: 'Peroni Nastro Azzurro',
        region: 'Italia',
        note: 'Lager ligera y crujiente que limpia el paladar entre mordiscos sin competir con los sabores delicados.',
      },
    ],
  },
  {
    styleId: 'newyork',
    styleName: 'New York',
    color: '#D4884A',
    pairings: [
      {
        id: 'ny1',
        kind: 'wine',
        name: "Barbera d'Asti",
        region: 'Piemonte, Italia',
        note: 'Alta acidez y cuerpo medio complementan la grasa del pepperoni y la mozzarella de baja humedad.',
      },
      {
        id: 'ny2',
        kind: 'beer',
        name: 'Brooklyn Lager',
        region: 'Nueva York, USA',
        note: 'La cerveza del barrio. Malta caramelizada y lúpulo floral que enmarcan perfectamente el slice neoyorquino.',
      },
      {
        id: 'ny3',
        kind: 'cocktail',
        name: 'Negroni Sbagliato',
        region: 'Milán / NYC fusion',
        note: 'La amargura del Campari y la burbuja del prosecco resetean el paladar entre cada porción.',
      },
    ],
  },
  {
    styleId: 'romana',
    styleName: 'Romana',
    color: '#C8A060',
    pairings: [
      {
        id: 'r1',
        kind: 'wine',
        name: 'Vermentino di Sardegna',
        region: 'Cerdeña, Italia',
        note: 'Blanco salino y herbáceo que contrasta con la base crujiente tipo cracker y los cuatro quesos.',
      },
      {
        id: 'r2',
        kind: 'beer',
        name: 'Birra Moretti',
        region: 'Udine, Italia',
        note: 'Suave y refrescante, honra la tradición italiana sin sobrecargar el paladar ante la fineza crujiente.',
      },
      {
        id: 'r3',
        kind: 'cocktail',
        name: 'Aperol Spritz',
        region: 'Véneto, Italia',
        note: 'Clásico aperitivo romano. La naranja amarga y el prosecco limpio elevan la ligereza de la base cracker.',
      },
    ],
  },
  {
    styleId: 'detroit',
    styleName: 'Detroit',
    color: '#B84A28',
    pairings: [
      {
        id: 'd1',
        kind: 'beer',
        name: 'Bell\'s Two Hearted Ale',
        region: 'Kalamazoo, Michigan',
        note: 'IPA floral y tropical de Michigan. El lúpulo americano corta la riqueza del queso brick caramelizado en los bordes.',
      },
      {
        id: 'd2',
        kind: 'wine',
        name: 'Zinfandel',
        region: 'California, USA',
        note: 'Cuerpo pleno y fruta oscura que resiste la potencia de la salsa encima y el carácter umami del brick cheese.',
      },
    ],
  },
  {
    styleId: 'pala',
    styleName: 'al Taglio',
    color: '#B8A060',
    pairings: [
      {
        id: 'p1',
        kind: 'wine',
        name: 'Frascati Superiore',
        region: 'Lacio, Italia',
        note: 'Vino blanco histórico de los Castillos Romanos. Su frescura y mineralidad son el contrapunto ideal a la masa alveolada.',
      },
      {
        id: 'p2',
        kind: 'beer',
        name: 'Baladin Isaac',
        region: 'Piemonte, Italia',
        note: 'Blanche italiana aromatizada con jengibre y naranja. Complementa la suavidad esponjosa de la pala al taglio.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function WineIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M8 22h8M12 11v11M6 3h12l-2 8a4 4 0 01-8 0L6 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function BeerIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M17 11h1a3 3 0 010 6h-1M5 11h12v10H5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M5 7h12v4H5z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function CocktailIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M8 22h8M12 15v7M3 3l9 12 9-12H3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const KIND_COLORS: Record<PairingKind, string> = {
  wine: '#9B59B6',
  beer: Colors.gold,
  cocktail: Colors.accent,
};

const KIND_LABELS: Record<PairingKind, string> = {
  wine: 'Vino',
  beer: 'Cerveza',
  cocktail: 'Cóctel',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Pairings() {
  const [activeStyleId, setActiveStyleId] = useState('napoletana');
  const activeData = PAIRINGS_DATA.find((d) => d.styleId === activeStyleId) ?? PAIRINGS_DATA[0];

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
        <View style={styles.headerText}>
          <Text style={styles.headerSub}>MARIDAJES</Text>
          <Text style={styles.headerTitle}>Para cada estilo</Text>
        </View>
      </View>

      {/* Style chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {PAIRINGS_DATA.map((d) => (
          <Pressable
            key={d.styleId}
            style={[
              styles.chip,
              activeStyleId === d.styleId && { backgroundColor: d.color + '22', borderColor: d.color },
            ]}
            onPress={() => setActiveStyleId(d.styleId)}
          >
            <Text
              style={[
                styles.chipText,
                activeStyleId === d.styleId && { color: d.color },
              ]}
            >
              {d.styleName}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pairings list */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.styleHeader}>
          <View style={[styles.styleColorDot, { backgroundColor: activeData.color }]} />
          <Text style={styles.styleTitle}>{activeData.styleName}</Text>
          <Text style={styles.pairingCount}>{activeData.pairings.length} maridajes</Text>
        </View>

        {activeData.pairings.map((pairing) => {
          const kindColor = KIND_COLORS[pairing.kind];
          return (
            <View key={pairing.id} style={styles.pairingCard}>
              {/* Left accent rail */}
              <View style={[styles.kindRail, { backgroundColor: kindColor }]} />
              <View style={styles.pairingBody}>
                {/* Icon + kind badge */}
                <View style={styles.pairingTop}>
                  <View style={[styles.kindIcon, { backgroundColor: kindColor + '22' }]}>
                    {pairing.kind === 'wine' && <WineIcon color={kindColor} />}
                    {pairing.kind === 'beer' && <BeerIcon color={kindColor} />}
                    {pairing.kind === 'cocktail' && <CocktailIcon color={kindColor} />}
                  </View>
                  <View style={styles.pairingNameWrap}>
                    <View style={[styles.kindBadge, { backgroundColor: kindColor + '22' }]}>
                      <Text style={[styles.kindBadgeText, { color: kindColor }]}>
                        {KIND_LABELS[pairing.kind].toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.pairingName}>{pairing.name}</Text>
                    <Text style={styles.pairingRegion}>{pairing.region}</Text>
                  </View>
                </View>
                <Text style={styles.pairingNote}>{pairing.note}</Text>
              </View>
            </View>
          );
        })}

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
  headerText: {
    flex: 1,
  },
  headerSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.accent,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg0,
  },
  chipsScroll: {
    maxHeight: 58,
    backgroundColor: Colors.bg1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  chipsContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.line2,
    backgroundColor: Colors.bg2,
  },
  chipText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  styleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  styleColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  styleTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.lg,
    color: Colors.fg0,
    flex: 1,
  },
  pairingCount: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  pairingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: 12,
    overflow: 'hidden',
  },
  kindRail: {
    width: 3,
  },
  pairingBody: {
    flex: 1,
    padding: 14,
  },
  pairingTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  kindIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pairingNameWrap: {
    flex: 1,
  },
  kindBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  kindBadgeText: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 9,
    letterSpacing: 1,
  },
  pairingName: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    marginBottom: 2,
  },
  pairingRegion: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  pairingNote: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
    lineHeight: 20,
  },
});
