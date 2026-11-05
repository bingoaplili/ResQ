import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

export type ChipTone = 'horizon' | 'pink' | 'navy' | 'safe' | 'warn' | 'sos' | 'ivory';

const TONES: Record<ChipTone, { bg: string; fg: string }> = {
  horizon: { bg: colors.horizonSoft, fg: colors.navy },
  pink: { bg: colors.pinkSoft, fg: colors.bordeaux },
  navy: { bg: colors.navy, fg: colors.ivory },
  safe: { bg: colors.safeSoft, fg: colors.safeDeep },
  warn: { bg: colors.warnSoft, fg: '#7A4A00' },
  sos: { bg: colors.sos, fg: '#FFFFFF' },
  ivory: { bg: colors.ivoryDeep, fg: colors.navy },
};

type Props = {
  label: string;
  icon?: IconName;
  tone?: ChipTone;
  selected?: boolean;
  onPress?: () => void;
  dot?: boolean;
};

export function Chip({ label, icon, tone = 'horizon', selected, onPress, dot }: Props) {
  const t = selected ? TONES.navy : TONES[tone];
  const body = (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: t.fg }]} /> : null}
      {icon ? <Icon name={icon} size={14} color={t.fg} /> : null}
      <AppText variant="caption" style={{ color: t.fg, fontFamily: 'Inter_600SemiBold' }}>{label}</AppText>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }} accessibilityLabel={label} hitSlop={6} style={styles.press}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { minHeight: 44, justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
