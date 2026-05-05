
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';
import { RECIPES, PIZZA_STYLES } from '@/constants/data';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TECHNIQUES_LIST = [
  { id: '1', name: 'Estirado a mano' },
  { id: '2', name: 'Slap & fold' },
  { id: '3', name: 'Fermentación fría' },
  { id: '4', name: 'Boleado' },
  { id: '5', name: 'Horneado en piedra' },
  { id: '6', name: 'Salsa napolitana' },
];

const RECENT_SEARCHES = ['Napoletana', 'Detroit Red Top', 'Boleado', 'Fermentación fría'];

const SUGGESTIONS = [
  'Napoletana', 'Detroit', 'Fermentación fría', 'Margherita', 'Slap & fold',
  'Quattro Formaggi', 'Marinara', 'Boleado',
];

const CATEGORIES = [
  { id: 'recipes', label: 'Recetas', icon: 'book', count: RECIPES.length },
  { id: 'styles', label: 'Estilos', icon: 'layers', count: PIZZA_STYLES.length },
  { id: 'techniques', label: 'Técnicas', icon: 'zap', count: TECHNIQUES_LIST.length },
];

type ResultKind = 'recipe' | 'style' | 'technique';

interface SearchResult {
  id: string;
  name: string;
  kind: ResultKind;
  sub: string;
}

const KIND_COLORS: Record<ResultKind, string> = {
  recipe: Colors.accent,
  style: Colors.gold,
  technique: '#27AE60',
};

const KIND_LABELS: Record<ResultKind, string> = {
  recipe: 'Receta',
  style: 'Estilo',
  technique: 'Técnica',
};

// ---------------------------------------------------------------------------
// Highlight search match in text
// ---------------------------------------------------------------------------

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <Text style={hlStyles.base}>{text}</Text>;
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx < 0) return <Text style={hlStyles.base}>{text}</Text>;
  return (
    <Text style={hlStyles.base}>
      {text.slice(0, idx)}
      <Text style={hlStyles.highlight}>{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

const hlStyles = StyleSheet.create({
  base: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    flex: 1,
  },
  highlight: {
    color: Colors.accent,
    fontFamily: Typography.fontFamily.sansSemi,
  },
});

// ---------------------------------------------------------------------------
// Category icon
// ---------------------------------------------------------------------------

function CategoryIcon({ id }: { id: string }) {
  const c = Colors.fg2;
  switch (id) {
    case 'recipes':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={c} strokeWidth={2} strokeLinecap="round" fill="none" />
          <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={c} strokeWidth={2} fill="none" />
        </Svg>
      );
    case 'styles':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'techniques':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Build all searchable items
// ---------------------------------------------------------------------------

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  RECIPES.forEach((r) => {
    const ps = PIZZA_STYLES.find((s) => s.id === r.style);
    results.push({ id: r.id, name: r.name, kind: 'recipe', sub: ps?.name ?? r.style });
  });
  PIZZA_STYLES.forEach((s) => {
    results.push({ id: s.id, name: s.name, kind: 'style', sub: s.region });
  });
  TECHNIQUES_LIST.forEach((t) => {
    results.push({ id: t.id, name: t.name, kind: 'technique', sub: 'Técnica' });
  });
  return results;
}

const ALL_ITEMS = buildSearchIndex();

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Search() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const results = query.length >= 1
    ? ALL_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const groupedResults = query.length >= 1
    ? {
        recipe: results.filter((r) => r.kind === 'recipe'),
        style: results.filter((r) => r.kind === 'style'),
        technique: results.filter((r) => r.kind === 'technique'),
      }
    : null;

  const handleResultPress = useCallback((result: SearchResult) => {
    if (result.kind === 'recipe') router.push(`/recipe/${result.id}`);
    else if (result.kind === 'style') router.push(`/style/${result.id}`);
    else if (result.kind === 'technique') router.push(`/technique/${result.id}`);
  }, []);

  return (
    <View style={styles.root}>
      {/* Search bar */}
      <View style={styles.searchBar}>
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

        <View style={styles.inputWrap}>
          <Svg width={16} height={16} viewBox="0 0 24 24" style={styles.searchIcon}>
            <Circle cx={11} cy={11} r={8} stroke={Colors.fg3} strokeWidth={2} fill="none" />
            <Path d="M21 21l-4.35-4.35" stroke={Colors.fg3} strokeWidth={2} strokeLinecap="round" fill="none" />
          </Svg>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar recetas, estilos, técnicas…"
            placeholderTextColor={Colors.fg3}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable style={styles.clearBtn} onPress={() => setQuery('')}>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke={Colors.fg2}
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Empty state */}
        {query.length === 0 && (
          <>
            {/* Recent searches */}
            <Text style={styles.sectionLabel}>RECIENTES</Text>
            <View style={styles.chipsRow}>
              {RECENT_SEARCHES.map((s) => (
                <Pressable key={s} style={styles.recentChip} onPress={() => setQuery(s)}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                    <Circle cx={12} cy={12} r={10} stroke={Colors.fg3} strokeWidth={2} fill="none" />
                    <Path d="M12 6v6l4 2" stroke={Colors.fg3} strokeWidth={2} strokeLinecap="round" fill="none" />
                  </Svg>
                  <Text style={styles.recentChipText}>{s}</Text>
                </Pressable>
              ))}
            </View>

            {/* Suggestions grid */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SUGERENCIAS</Text>
            <View style={styles.suggestionsGrid}>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} style={styles.suggestionChip} onPress={() => setQuery(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>

            {/* Categories */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>EXPLORAR</Text>
            <View style={styles.categoriesCard}>
              {CATEGORIES.map((cat, idx) => (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryRow, idx < CATEGORIES.length - 1 && styles.categoryRowBorder]}
                  onPress={() => setQuery(cat.label)}
                >
                  <View style={styles.categoryIcon}>
                    <CategoryIcon id={cat.id} />
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke={Colors.fg3}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Results state */}
        {query.length > 0 && groupedResults && (
          <>
            {results.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>
                  Sin resultados para «{query}»
                </Text>
              </View>
            ) : (
              (['recipe', 'style', 'technique'] as ResultKind[]).map((kind) => {
                const group = groupedResults[kind];
                if (group.length === 0) return null;
                return (
                  <View key={kind} style={styles.resultGroup}>
                    <Text style={styles.sectionLabel}>{KIND_LABELS[kind].toUpperCase() + 'S'}</Text>
                    <View style={styles.resultCard}>
                      {group.map((item, idx) => (
                        <Pressable
                          key={item.id}
                          style={[
                            styles.resultRow,
                            idx < group.length - 1 && styles.resultRowBorder,
                          ]}
                          onPress={() => handleResultPress(item)}
                        >
                          {/* Kind rail */}
                          <View style={[styles.kindRail, { backgroundColor: KIND_COLORS[item.kind] }]} />
                          <View style={styles.resultContent}>
                            <HighlightedText text={item.name} query={query} />
                            <Text style={styles.resultSub}>{item.sub}</Text>
                          </View>
                          <Svg width={16} height={16} viewBox="0 0 24 24">
                            <Path
                              d="M5 12h14M12 5l7 7-7 7"
                              stroke={Colors.fg3}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              fill="none"
                            />
                          </Svg>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        <View style={{ height: 80 }} />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 12,
    backgroundColor: Colors.bg1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.line2,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.line2,
    backgroundColor: Colors.bg2,
  },
  recentChipText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  suggestionText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg1,
  },
  categoriesCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  categoryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  categoryCount: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.fg3,
    marginRight: 4,
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg3,
  },
  resultGroup: {
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  resultRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  kindRail: {
    width: 3,
    height: 36,
    borderRadius: 1.5,
    flexShrink: 0,
  },
  resultContent: {
    flex: 1,
  },
  resultSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    marginTop: 2,
  },
});
