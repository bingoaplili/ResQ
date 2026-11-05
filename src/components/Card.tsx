import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme';
import { SurfaceContext } from './Surface';

export type CardTone = 'ivory' | 'navy' | 'horizon' | 'pink' | 'bordeaux' | 'sos' | 'glass';

const TONES: Record<CardTone, { bg: string; border: string; dark: boolean }> = {
  ivory: { bg: colors.ivoryLight, border: 'rgba(19,39,63,0.10)', dark: false },
  navy: { bg: colors.navy, border: 'rgba(128,174,232,0.28)', dark: true },
  horizon: { bg: colors.horizonSoft, border: 'rgba(19,39,63,0.10)', dark: false },
  pink: { bg: colors.pinkSoft, border: 'rgba(91,0,21,0.14)', dark: false },
  bordeaux: { bg: colors.bordeaux, border: 'rgba(242,174,188,0.32)', dark: true },
  sos: { bg: colors.sos, border: 'rgba(255,255,255,0.25)', dark: true },
  glass: { bg: 'rgba(247,242,224,0.10)', border: 'rgba(247,242,224,0.24)', dark: true },
};

type Props = {
  tone?: CardTone;
  edge?: string;
  padding?: number;
  elevated?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function Card({ tone = 'ivory', edge, padding = 16, elevated = true, onPress, accessibilityLabel, style, children }: Props) {
  const t = TONES[tone];
  const body = (
    <View
      style={[
        styles.card,
        { backgroundColor: t.bg, borderColor: t.border, padding },
        elevated && shadow(1),
        style,
      ]}
    >
      {edge ? <View style={[styles.edge, { backgroundColor: edge }]} /> : null}
      <SurfaceContext.Provider value={t.dark ? 'dark' : 'light'}>{children}</SurfaceContext.Provider>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] })}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  edge: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
});
