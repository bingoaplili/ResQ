import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function Logo({ size = 44, radiusRatio = 0.28 }: { size?: number; radiusRatio?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel="ResQ logo">
      <Rect width="100" height="100" rx={100 * radiusRatio} fill={colors.navy} />
      <Circle cx="82" cy="18" r="22" fill={colors.bordeaux} opacity="0.85" />
      <Path
        d="M50 16 L77 27 V50 C77 68 65 80 50 86 C35 80 23 68 23 50 V27 Z"
        fill="none"
        stroke={colors.horizon}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <Circle cx="50" cy="44" r="9" fill={colors.pink} />
      <Path d="M50 66 L41 50 H59 Z" fill={colors.pink} />
      <Circle cx="50" cy="44" r="3.4" fill={colors.navy} />
    </Svg>
  );
}
