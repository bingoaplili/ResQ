import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/** Illustrated facade used in Help Zone details. */
export function FacilityArt({ variant, width = '100%', height = '100%' }: { variant: 'gate' | 'lobby'; width?: number | string; height?: number | string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
      <Rect width="160" height="110" fill={variant === 'gate' ? colors.horizonSoft : colors.pinkSoft} />
      {variant === 'gate' ? (
        <>
          <Circle cx="132" cy="24" r="14" fill={colors.ivory} opacity="0.9" />
          <Rect x="20" y="40" width="120" height="60" fill={colors.navy} />
          <Rect x="20" y="34" width="120" height="10" fill={colors.bordeaux} />
          <Rect x="70" y="62" width="20" height="38" fill={colors.horizon} />
          {[32, 48, 104, 120].map((x) => (
            <Rect key={x} x={x} y="56" width="10" height="14" fill={colors.ivory} opacity="0.85" />
          ))}
          <Rect x="0" y="100" width="160" height="10" fill={colors.navySoft} />
        </>
      ) : (
        <>
          <Rect x="0" y="78" width="160" height="32" fill={colors.ivoryDeep} />
          <Rect x="18" y="52" width="46" height="26" rx="6" fill={colors.navy} />
          <Rect x="96" y="52" width="46" height="26" rx="6" fill={colors.bordeaux} />
          <Rect x="70" y="30" width="20" height="48" rx="4" fill={colors.horizon} />
          <Circle cx="80" cy="22" r="8" fill={colors.ivory} />
        </>
      )}
      <Path d="M0 0 L160 0" stroke={colors.navy} strokeOpacity="0.1" />
    </Svg>
  );
}
