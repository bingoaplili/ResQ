import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, radius } from '../theme';
import { Icon, IconName } from './Icon';
import { AppText } from './AppText';

export type MapPin = {
  id: string;
  x: number; // 0-100
  y: number; // 0-100
  kind: 'police' | 'hospital' | 'safe' | 'incident' | 'you' | 'destination';
  label?: string;
};

const PIN: Record<MapPin['kind'], { bg: string; icon: IconName }> = {
  police: { bg: colors.navy, icon: 'shield' },
  hospital: { bg: colors.sos, icon: 'plus' },
  safe: { bg: colors.safe, icon: 'home' },
  incident: { bg: colors.bordeaux, icon: 'alert-triangle' },
  you: { bg: colors.horizonDeep, icon: 'navigation-2' },
  destination: { bg: colors.bordeaux, icon: 'flag' },
};

type Props = {
  height?: number;
  pins?: MapPin[];
  route?: { x: number; y: number }[];
  routeColor?: string;
  halo?: { x: number; y: number; radius: number; color?: string };
  onPinPress?: (id: string) => void;
  children?: React.ReactNode;
};

const ROADS = [
  'M-10 120 C 80 100 140 150 230 120 S 360 70 420 90',
  'M60 -10 C 80 60 50 130 90 190 S 130 250 120 280',
  'M180 -10 C 190 50 170 100 210 150 S 260 220 250 280',
  'M310 -10 C 300 60 330 110 320 170 S 350 240 340 280',
  'M-10 200 C 90 210 170 190 260 215 S 380 230 420 210',
  'M-10 40 C 70 55 160 30 250 50 S 360 40 420 55',
];

export function MapCanvas({ height = 220, pins = [], route, routeColor = colors.bordeaux, halo, onPinPress, children }: Props) {
  const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x * 4} ${p.y * 2.6}`).join(' ');
  return (
    <View style={[styles.wrap, { height }]} accessibilityLabel="Neighbourhood map">
      <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="260" fill="#DCE8F6" />
        <Path d="M-10 170 C 60 150 110 200 190 175 S 330 130 420 160 L420 190 C 330 165 250 215 190 205 S 60 185 -10 200 Z" fill={colors.horizon} opacity="0.7" />
        <Rect x="228" y="52" width="70" height="44" rx="12" fill="#BFD9C4" opacity="0.8" />
        <Rect x="20" y="70" width="52" height="38" rx="10" fill="#BFD9C4" opacity="0.65" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Rect key={i} x={30 + i * 52} y={8 + (i % 3) * 6} width="34" height="22" rx="5" fill={colors.ivory} opacity="0.55" />
        ))}
        {ROADS.map((d, i) => (
          <Path key={i} d={d} stroke={colors.ivoryLight} strokeWidth={i < 2 ? 9 : 6} fill="none" strokeLinecap="round" />
        ))}
        {halo ? (
          <>
            <Circle cx={halo.x * 4} cy={halo.y * 2.6} r={halo.radius} fill={halo.color ?? colors.sos} opacity="0.18" />
            <Circle cx={halo.x * 4} cy={halo.y * 2.6} r={halo.radius} fill="none" stroke={halo.color ?? colors.sos} strokeWidth="1.5" opacity="0.5" />
          </>
        ) : null}
        {route ? (
          <>
            <Path d={toPath(route)} stroke={colors.ivoryLight} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={toPath(route)} stroke={routeColor} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0" />
          </>
        ) : null}
      </Svg>
      {pins.map((p) => {
        const s = PIN[p.kind];
        const size = p.kind === 'you' ? 34 : 38;
        return (
          <Pressable
            key={p.id}
            disabled={!onPinPress || p.kind === 'you'}
            onPress={() => onPinPress?.(p.id)}
            accessibilityRole="button"
            accessibilityLabel={p.label ?? p.kind}
            hitSlop={8}
            style={[styles.pin, { left: `${p.x}%`, top: `${p.y}%`, marginLeft: -size / 2, marginTop: -size / 2 }]}
          >
            <View style={[styles.pinDot, { width: size, height: size, borderRadius: size / 2, backgroundColor: s.bg }]}>
              <Icon name={s.icon} size={size * 0.48} color="#FFFFFF" />
            </View>
            {p.label ? (
              <View style={styles.pinLabel}>
                <AppText variant="caption" tone="onColor" numberOfLines={1} style={{ fontSize: 11 }}>{p.label}</AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, backgroundColor: '#DCE8F6' },
  pin: { position: 'absolute', alignItems: 'center' },
  pinDot: { alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: colors.ivoryLight },
  pinLabel: { marginTop: 3, backgroundColor: colors.navy, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, maxWidth: 120 },
});
