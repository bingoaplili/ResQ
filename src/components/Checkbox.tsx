import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Icon } from './Icon';

type Props = { checked: boolean; onChange: (v: boolean) => void; label: string; children?: React.ReactNode };

export function Checkbox({ checked, onChange, label, children }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.on]}>{checked ? <Icon name="check" size={16} color={colors.ivory} /> : null}</View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  box: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.bordeaux, borderColor: colors.bordeaux },
});
