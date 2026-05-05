// FILE: app/app/shopping.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface ShoppingItem {
  id: string;
  name: string;
  qty: string;
  unit: string;
  checked: boolean;
}

interface ShoppingCategory {
  id: string;
  label: string;
  items: ShoppingItem[];
}

const INITIAL_CATEGORIES: ShoppingCategory[] = [
  {
    id: 'harinas',
    label: 'HARINAS',
    items: [
      { id: 'h1', name: 'Harina 00 (W300)', qty: '1', unit: 'kg', checked: false },
      { id: 'h2', name: 'Sémola fina de trigo', qty: '200', unit: 'g', checked: false },
    ],
  },
  {
    id: 'frescos',
    label: 'FRESCOS',
    items: [
      { id: 'f1', name: 'Mozzarella fior di latte', qty: '500', unit: 'g', checked: false },
      { id: 'f2', name: 'Tomate San Marzano', qty: '800', unit: 'g', checked: false },
    ],
  },
  {
    id: 'despensa',
    label: 'DESPENSA',
    items: [
      { id: 'd1', name: 'Sal marina fina', qty: '500', unit: 'g', checked: false },
      { id: 'd2', name: 'Levadura seca activa', qty: '7', unit: 'g', checked: false },
      { id: 'd3', name: 'Aceite extra virgen', qty: '500', unit: 'ml', checked: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Shopping() {
  const [categories, setCategories] = useState<ShoppingCategory[]>(INITIAL_CATEGORIES);

  const toggleItem = (catId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            }
          : cat,
      ),
    );
  };

  const clearCompleted = () => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, checked: false })),
      })),
    );
  };

  const handleShare = async () => {
    const lines: string[] = ['Lista de compras · Johnny Hub\n'];
    for (const cat of categories) {
      lines.push(`${cat.label}`);
      for (const item of cat.items) {
        lines.push(`${item.checked ? '✓' : '○'} ${item.name} — ${item.qty} ${item.unit}`);
      }
      lines.push('');
    }
    await Share.share({ message: lines.join('\n') });
  };

  const checkedCount = categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.checked).length,
    0,
  );
  const totalCount = categories.reduce((sum, cat) => sum + cat.items.length, 0);

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
          <Text style={styles.headerTitle}>Lista de compras</Text>
          <Text style={styles.headerSub}>
            {checkedCount}/{totalCount} artículos
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {categories.map((cat) => {
          const checkedInCat = cat.items.filter((i) => i.checked).length;
          return (
            <View key={cat.id} style={styles.section}>
              {/* Section header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>{cat.label}</Text>
                <Text style={styles.sectionCount}>{checkedInCat}/{cat.items.length}</Text>
              </View>

              {/* Items */}
              <View style={styles.sectionCard}>
                {cat.items.map((item, idx) => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.itemRow,
                      idx < cat.items.length - 1 && styles.itemRowBorder,
                    ]}
                    onPress={() => toggleItem(cat.id, item.id)}
                  >
                    {/* Checkbox */}
                    <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                      {item.checked && (
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
                      )}
                    </View>
                    {/* Name */}
                    <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                      {item.name}
                    </Text>
                    {/* Qty */}
                    <Text style={[styles.itemQty, item.checked && styles.itemQtyChecked]}>
                      {item.qty} {item.unit}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.shareButton} onPress={handleShare}>
          <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <Path
              d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
              stroke={Colors.fg0}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
          <Text style={styles.shareButtonText}>Compartir lista</Text>
        </Pressable>
        <Pressable style={styles.clearButton} onPress={clearCompleted}>
          <Text style={styles.clearButtonText}>Limpiar completados</Text>
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
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg0,
  },
  headerSub: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
    letterSpacing: Typography.letterSpacing.caps,
  },
  sectionCount: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.fg3,
  },
  sectionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.line2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  itemName: {
    flex: 1,
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  itemNameChecked: {
    color: Colors.fg3,
    textDecorationLine: 'line-through',
  },
  itemQty: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.gold,
  },
  itemQtyChecked: {
    color: Colors.fg3,
  },
  bottomBar: {
    padding: Spacing.screenPadding,
    paddingBottom: 34,
    backgroundColor: Colors.bg0,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    gap: 10,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.line2,
  },
  shareButtonText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.fg0,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  clearButtonText: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.base,
    color: Colors.fg2,
  },
});
