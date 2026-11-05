import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, shadow } from '../theme';
import { Icon } from './Icon';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const HOLD_MS = 3000;

type Props = {
  size?: number;
  /** Fires after the full 3-second hold. */
  onTrigger: () => void;
  /** Fires on a short tap. */
  onTap?: () => void;
};

export function SOSButton({ size = 190, onTrigger, onTap }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const pressedAt = useRef(0);
  const fired = useRef(false);
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true })
    );
    loop.start();
    const id = progress.addListener(({ value }) => {
      const s = value > 0 ? Math.ceil(3 * (1 - value)) : null;
      setSecs((prev) => (prev === s ? prev : s));
    });
    return () => { loop.stop(); progress.removeListener(id); };
  }, [progress, pulse]);

  const ring = size + 34;
  const stroke = 8;
  const r = (ring - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = progress.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.38] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });

  const begin = () => {
    pressedAt.current = Date.now();
    fired.current = false;
    Animated.timing(progress, { toValue: 1, duration: HOLD_MS, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        fired.current = true;
        Vibration.vibrate(250);
        onTrigger();
        progress.setValue(0);
      }
    });
  };

  const end = () => {
    if (fired.current) return;
    progress.stopAnimation();
    Animated.timing(progress, { toValue: 0, duration: 220, useNativeDriver: false }).start();
    if (Date.now() - pressedAt.current < 350) onTap?.();
  };

  return (
    <View style={{ width: ring + 40, height: ring + 40, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={[styles.halo, { width: size, height: size, borderRadius: size / 2, opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
      />
      <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
        <Svg width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`}>
          <Circle cx={ring / 2} cy={ring / 2} r={r} stroke="rgba(247,242,224,0.35)" strokeWidth={stroke} fill="none" />
          <AnimatedCircle
            cx={ring / 2} cy={ring / 2} r={r} stroke={colors.ivory} strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={`${circ}`} strokeDashoffset={dash as any}
            rotation="-90" origin={`${ring / 2}, ${ring / 2}`}
          />
        </Svg>
      </View>
      <Pressable
        onPressIn={begin}
        onPressOut={end}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS"
        accessibilityHint="Press and hold for three seconds to send an alert. Double tap to open the confirmation screen."
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={() => onTap?.()}
        style={[styles.btn, shadow(3), { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Icon name="alert-triangle" size={size * 0.2} color="#FFFFFF" />
        <Text style={[styles.label, { fontSize: size * 0.23 }]}>SOS</Text>
        <Text style={styles.sub}>{secs ? `Keep holding · ${secs}` : 'Hold 3 seconds'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', backgroundColor: colors.sos },
  btn: { backgroundColor: colors.sos, alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 4, borderColor: 'rgba(255,255,255,0.35)' },
  label: { color: '#FFFFFF', fontFamily: fonts.display, letterSpacing: 2 },
  sub: { color: 'rgba(255,255,255,0.92)', fontFamily: fonts.semi, fontSize: 12, letterSpacing: 0.4 },
});
