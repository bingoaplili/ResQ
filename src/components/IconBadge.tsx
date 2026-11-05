import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme';
import { Icon, IconName } from './Icon';

export type BadgeTone = 'horizon' | 'pink' | 'navy' | 'bordeaux' | 'sos' | 'safe' | 'ivory';
const T: Record<BadgeTone, { bg: string; fg: string }> = {
  horizon: { bg: colors.horizonSoft, fg: colors.navy },
  pink: { bg: colors.pinkSoft, fg: colors.bordeaux },
  navy: { bg: colors.navy, fg: colors.horizon },
  bordeaux: { bg: colors.bordeaux, fg: colors.pink },
  sos: { bg: colors.sos, fg: '#FFFFFF' },
  safe: { bg: colors.safeSoft, fg: colors.safeDeep },
  ivory: { bg: colors.ivoryDeep, fg: colors.navy },
};

type Props = { name: IconName; tone?: BadgeTone; size?: number; round?: boolean };

export function IconBadge({ name, tone = 'horizon', size = 46, round }: Props) {
  const t = T[tone];
  return (
    <View
      style={{
        width: size, height: size, alignItems: 'center', justifyContent: 'center',
        borderRadius: round ? size / 2 : size * 0.32, backgroundColor: t.bg,
      }}
    >
      <Icon name={name} size={size * 0.46} color={t.fg} />
    </View>
  );
}
