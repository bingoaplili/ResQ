import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { Icon, IconName } from './Icon';

type Props = { label: string; holdLabel?: string; icon?: IconName; duration?: number; onComplete: () => void };

/** A button that must be held to confirm, used for ending an active SOS. */
export function HoldButton({ label, holdLabel = 'Keep holding…', icon = 'lock', duration = 3000, onComplete }: Props) {
  const p = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);
  const done = useRef(false);

  const start = () => {
    done.current = false;
    setHolding(true);
    Animated.timing(p, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
      if (finished) { done.current = true; setHolding(false); onComplete(); p.setValue(0); }
    });
  };
  const stop = () => {
    if (done.current) return;
    setHolding(false);
    p.stopAnimation();
    Animated.timing(p, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const width = p.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <Pressable
      onPressIn={start}
      onPressOut={stop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`Press and hold for ${duration / 1000} seconds`}
      style={styles.btn}
    >
      <Animated.View style={[styles.fill, { width }]} />
      <View style={styles.row}>
        <Icon name={icon} size={18} color={colors.navy} />
        <Text style={styles.text}>{holding ? holdLabel : label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 56, borderRadius: radius.md + 2, backgroundColor: colors.horizonSoft, overflow: 'hidden', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.horizon },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.horizon },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  text: { fontFamily: fonts.semi, fontSize: 16, color: colors.navy },
});
