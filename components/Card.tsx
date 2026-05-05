// FILE: app/components/Card.tsx

import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';

import { Colors, Spacing, shadow } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CardProps {
  children?: React.ReactNode;
  /** Extra padding around the card content; defaults to Spacing.cardPadding */
  padding?: number;
  /** Override the border-radius; defaults to Spacing.cardRadius */
  radius?: number;
  /** When true, adds a medium drop-shadow (lifted appearance) */
  lift?: boolean;
  /** Additional styles applied to the outer container */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Base Card
// ---------------------------------------------------------------------------

export const Card: React.FC<CardProps> = ({
  children,
  padding = Spacing.cardPadding,
  radius = Spacing.cardRadius,
  lift = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding, borderRadius: radius },
        lift && shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// CardLift — convenience variant that always renders with the card shadow
// ---------------------------------------------------------------------------

export const CardLift: React.FC<Omit<CardProps, 'lift'>> = (props) => (
  <Card {...props} lift />
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
});

export default Card;
