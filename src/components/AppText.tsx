import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { colors, fonts } from '../theme';
import { useSurface } from './Surface';

export type TextVariant =
  | 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'small' | 'label' | 'caption' | 'metric';
export type TextTone = 'primary' | 'muted' | 'accent' | 'link' | 'onColor' | 'sos' | 'safe';

const V: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44, letterSpacing: -0.6 },
  h1: { fontFamily: fonts.display, fontSize: 29, lineHeight: 35, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.displaySemi, fontSize: 23, lineHeight: 29, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.semi, fontSize: 17, lineHeight: 23, letterSpacing: -0.1 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semi, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: fonts.semi, fontSize: 11.5, lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase' },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  metric: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, fontVariant: ['tabular-nums'] },
};

const LIGHT: Record<TextTone, string> = {
  primary: colors.ink, muted: colors.inkMuted, accent: colors.bordeaux, link: colors.link,
  onColor: '#FFFFFF', sos: colors.sosDeep, safe: colors.safeDeep,
};
const DARK: Record<TextTone, string> = {
  primary: colors.ivory, muted: 'rgba(247,242,224,0.78)', accent: colors.pink, link: colors.horizon,
  onColor: '#FFFFFF', sos: colors.pink, safe: '#8FD6B8',
};

type Props = TextProps & { variant?: TextVariant; tone?: TextTone; center?: boolean };

export function AppText({ variant = 'body', tone = 'primary', center, style, ...rest }: Props) {
  const mode = useSurface();
  const color = (mode === 'dark' ? DARK : LIGHT)[tone];
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[V[variant], { color }, center && styles.center, style]}
    />
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
