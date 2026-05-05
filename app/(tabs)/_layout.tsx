import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/tokens';
import * as Icons from '@/components/icons';

// ---------------------------------------------------------------------------
// Tab bar background — semi-transparent dark pill
// ---------------------------------------------------------------------------
function TabBarBackground() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: Platform.OS === 'ios'
            ? 'rgba(20,17,15,0.88)'
            : 'rgba(20,17,15,0.96)',
          borderRadius: 32,
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.fg3,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomInset + 16,
          left: 24,
          right: 24,
          height: 64,
          borderRadius: 32,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          overflow: 'hidden',
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.45,
          shadowRadius: 24,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarLabelStyle: {
          fontFamily: 'JetBrainsMono-Regular',
          fontSize: 9,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Forno',
          tabBarIcon: ({ color, size }) => (
            <Icons.Flame size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calc"
        options={{
          title: 'Cálculo',
          tabBarIcon: ({ color, size }) => (
            <Icons.Calc size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, size }) => (
            <Icons.Book size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => (
            <Icons.Timer size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Diario',
          tabBarIcon: ({ color, size }) => (
            <Icons.Journal size={size ?? 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
