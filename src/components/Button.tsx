import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius, shadow } from '../theme';
import { Icon, IconName } from './Icon';
import { useSurface } from './Surface';
import { Text } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'sos' | 'pink' | 'bordeaux';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg';
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = 'primary', icon, iconRight, loading, disabled, size = 'md', accessibilityHint }: Props) {
  const dark = useSurface() === 'dark';
  let bg = 'transparent';
  let fg = colors.navy;
  let border = 'transparent';
  switch (variant) {
    case 'primary': bg = dark ? colors.ivory : colors.navy; fg = dark ? colors.navy : colors.ivory; break;
    case 'secondary': bg = colors.horizon; fg = colors.navy; break;
    case 'outline': border = dark ? colors.lineLight : 'rgba(19,39,63,0.38)'; fg = dark ? colors.ivory : colors.navy; break;
    case 'ghost': fg = dark ? colors.ivory : colors.navy; break;
    case 'sos': bg = colors.sos; fg = '#FFFFFF'; break;
    case 'pink': bg = colors.pink; fg = colors.bordeaux; break;
    case 'bordeaux': bg = colors.bordeaux; fg = colors.ivory; break;
  }
  const solid = variant === 'primary' || variant === 'sos' || variant === 'secondary' || variant === 'bordeaux';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, borderColor: border, minHeight: size === 'lg' ? 58 : 52 },
        solid && shadow(2),
        { opacity: disabled ? 0.45 : pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={19} color={fg} /> : null}
          <Text maxFontSizeMultiplier={1.25} style={[styles.label, { color: fg }]}>{label}</Text>
          {iconRight ? <Icon name={iconRight} size={19} color={fg} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md + 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: 0.1 },
});
