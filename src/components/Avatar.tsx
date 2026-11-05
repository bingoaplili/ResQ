import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Text } from 'react-native';
import { initials } from '../utils/format';

const PALETTE = [
  { bg: colors.horizon, fg: colors.navy },
  { bg: colors.pink, fg: colors.bordeaux },
  { bg: colors.navySoft, fg: colors.ivory },
  { bg: colors.bordeauxSoft, fg: colors.ivory },
];

export function Avatar({ name, size = 48, index }: { name: string; size?: number; index?: number }) {
  const i = index ?? (name.length % PALETTE.length);
  const p = PALETTE[i % PALETTE.length];
  return (
    <View
      accessibilityLabel={`${name} avatar`}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: p.bg }]}
    >
      <Text style={{ color: p.fg, fontFamily: fonts.bold, fontSize: size * 0.36 }}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(252,250,240,0.7)' },
});
