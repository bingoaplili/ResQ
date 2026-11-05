import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export function ProgressBar({ value, height = 8 }: { value: number; height?: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { height, borderRadius: height / 2 }]}
    >
      <View style={{ width: `${Math.min(1, Math.max(0, value)) * 100}%`, height, borderRadius: height / 2, backgroundColor: colors.safe }} />
    </View>
  );
}

export function StepBar({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.steps}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.seg, { backgroundColor: i < current ? colors.bordeaux : 'rgba(19,39,63,0.16)' }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: 'rgba(19,39,63,0.14)', overflow: 'hidden' },
  steps: { flexDirection: 'row', gap: 6 },
  seg: { flex: 1, height: 6, borderRadius: 3 },
});
