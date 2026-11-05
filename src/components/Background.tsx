import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, Line } from 'react-native-svg';
import { colors } from '../theme';

export type BackgroundVariant = 'ivory' | 'navy' | 'horizon' | 'bordeaux' | 'sos';
export const isDark = (v: BackgroundVariant) => v === 'navy' || v === 'bordeaux' || v === 'sos';

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const GRAIN = (() => {
  const r = seeded(11);
  return Array.from({ length: 300 }, () => ({
    x: r() * 400,
    y: r() * 800,
    r: 0.5 + r() * 0.9,
    o: 0.06 + r() * 0.12,
  }));
})();

const BASE: Record<BackgroundVariant, string> = {
  ivory: colors.ivory,
  navy: colors.navy,
  horizon: colors.horizon,
  bordeaux: colors.bordeaux,
  sos: '#6E0C22',
};

function Shapes({ variant }: { variant: BackgroundVariant }) {
  switch (variant) {
    case 'ivory':
      return (
        <>
          <Defs>
            <LinearGradient id="iv" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.horizon} stopOpacity="0.5" />
              <Stop offset="0.45" stopColor={colors.ivory} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.pink} stopOpacity="0.28" />
            </LinearGradient>
          </Defs>
          <Rect width="400" height="800" fill="url(#iv)" />
          <Circle cx="360" cy="60" r="130" fill={colors.horizon} opacity="0.5" />
          <Circle cx="360" cy="60" r="78" fill="none" stroke={colors.navy} strokeWidth="1.5" opacity="0.14" />
          <Circle cx="-20" cy="470" r="115" fill={colors.pink} opacity="0.5" />
          <Circle cx="-20" cy="470" r="150" fill="none" stroke={colors.bordeaux} strokeWidth="1.2" opacity="0.14" />
          <Path d="M0 690 C 110 640 220 760 400 680 L400 800 L0 800 Z" fill={colors.bordeaux} opacity="0.07" />
          <Circle cx="44" cy="150" r="9" fill={colors.bordeaux} opacity="0.3" />
          <Circle cx="310" cy="330" r="6" fill={colors.horizonDeep} opacity="0.4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Line key={i} x1={250 + i * 24} y1="800" x2={330 + i * 24} y2="700" stroke={colors.navy} strokeWidth="1" opacity="0.07" />
          ))}
        </>
      );
    case 'navy':
      return (
        <>
          <Defs>
            <LinearGradient id="nv" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.navySoft} stopOpacity="0.9" />
              <Stop offset="1" stopColor={colors.navyDeep} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="400" height="800" fill="url(#nv)" />
          <Circle cx="360" cy="90" r="200" fill={colors.horizon} opacity="0.2" />
          <Circle cx="360" cy="90" r="120" fill="none" stroke={colors.horizon} strokeWidth="1.5" opacity="0.35" />
          <Circle cx="-30" cy="700" r="240" fill={colors.bordeaux} opacity="0.65" />
          <Circle cx="-30" cy="700" r="150" fill="none" stroke={colors.pink} strokeWidth="1.5" opacity="0.28" />
          <Circle cx="70" cy="190" r="7" fill={colors.pink} opacity="0.7" />
          <Circle cx="330" cy="520" r="5" fill={colors.horizon} opacity="0.7" />
          <Circle cx="290" cy="640" r="11" fill={colors.pink} opacity="0.25" />
        </>
      );
    case 'bordeaux':
      return (
        <>
          <Circle cx="80" cy="90" r="210" fill={colors.navy} opacity="0.5" />
          <Circle cx="380" cy="720" r="230" fill={colors.pink} opacity="0.16" />
          <Circle cx="380" cy="720" r="140" fill="none" stroke={colors.pink} strokeWidth="1.5" opacity="0.3" />
          <Circle cx="80" cy="90" r="130" fill="none" stroke={colors.horizon} strokeWidth="1.2" opacity="0.3" />
          <Circle cx="320" cy="200" r="7" fill={colors.pink} opacity="0.6" />
        </>
      );
    case 'horizon':
      return (
        <>
          <Defs>
            <LinearGradient id="hz" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.horizon} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.horizonSoft} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="400" height="800" fill="url(#hz)" />
          <Circle cx="40" cy="80" r="170" fill={colors.ivory} opacity="0.4" />
          <Circle cx="390" cy="520" r="200" fill={colors.navy} opacity="0.14" />
          <Circle cx="390" cy="520" r="120" fill="none" stroke={colors.pink} strokeWidth="2" opacity="0.6" />
          <Circle cx="300" cy="150" r="8" fill={colors.bordeaux} opacity="0.4" />
        </>
      );
    case 'sos':
      return (
        <>
          <Defs>
            <LinearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.bordeaux} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.navyDeep} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="400" height="800" fill="url(#sg)" />
          <Circle cx="200" cy="260" r="260" fill={colors.sos} opacity="0.22" />
          <Circle cx="200" cy="260" r="190" fill="none" stroke={colors.pink} strokeWidth="1.2" opacity="0.25" />
          <Circle cx="200" cy="260" r="120" fill="none" stroke={colors.pink} strokeWidth="1.2" opacity="0.2" />
        </>
      );
  }
}

function BackgroundBase({ variant = 'ivory' }: { variant?: BackgroundVariant }) {
  const dark = isDark(variant);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BASE[variant] }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Shapes variant={variant} />
        {GRAIN.map((g, i) => (
          <Circle key={i} cx={g.x} cy={g.y} r={g.r} fill={dark ? colors.ivory : colors.navy} opacity={g.o} />
        ))}
      </Svg>
    </View>
  );
}

export const Background = memo(BackgroundBase);
