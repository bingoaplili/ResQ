import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Pressable } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';
import { useSurface } from './Surface';

type Props = TextInputProps & {
  label?: string;
  icon?: IconName;
  hint?: string;
  error?: string;
  secure?: boolean;
  right?: React.ReactNode;
  multiline?: boolean;
};

export function Input({ label, icon, hint, error, secure, right, multiline, style, ...rest }: Props) {
  const dark = useSurface() === 'dark';
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const border = error ? colors.sos : focused ? colors.horizonDeep : dark ? colors.lineLight : 'rgba(19,39,63,0.18)';
  return (
    <View style={styles.wrap}>
      {label ? <AppText variant="bodyStrong" style={styles.label}>{label}</AppText> : null}
      <View
        style={[
          styles.box,
          { borderColor: border, borderWidth: focused || error ? 2 : 1, backgroundColor: dark ? 'rgba(247,242,224,0.1)' : colors.ivoryLight },
          multiline && { minHeight: 120, alignItems: 'flex-start', paddingVertical: 12 },
        ]}
      >
        {icon ? <Icon name={icon} size={19} color={dark ? colors.horizon : colors.inkMuted} /> : null}
        <TextInput
          {...rest}
          multiline={multiline}
          secureTextEntry={hidden}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          placeholderTextColor={dark ? 'rgba(247,242,224,0.5)' : colors.inkFaint}
          accessibilityLabel={label ?? rest.placeholder}
          style={[styles.input, { color: dark ? colors.ivory : colors.navy }, multiline && { textAlignVertical: 'top' }, style]}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={12} accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Icon name={hidden ? 'eye' : 'eye-off'} size={19} color={dark ? colors.horizon : colors.inkMuted} />
          </Pressable>
        ) : null}
        {right}
      </View>
      {error ? (
        <View style={styles.msg}>
          <Icon name="alert-circle" size={14} color={dark ? colors.pink : colors.sosDeep} />
          <AppText variant="small" tone="sos">{error}</AppText>
        </View>
      ) : hint ? (
        <AppText variant="small" tone="muted" style={styles.hint}>{hint}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { marginLeft: 2 },
  box: { minHeight: 54, borderRadius: radius.md + 2, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, paddingVertical: 10 },
  msg: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 2 },
  hint: { marginLeft: 2 },
});
