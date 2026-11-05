import React from 'react';
import { Switch } from 'react-native';
import { colors } from '../theme';

type Props = { value: boolean; onValueChange: (v: boolean) => void; label: string };

export function Toggle({ value, onValueChange, label }: Props) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={label}
      trackColor={{ false: 'rgba(19,39,63,0.28)', true: colors.safe }}
      thumbColor={colors.ivoryLight}
      ios_backgroundColor="rgba(19,39,63,0.28)"
    />
  );
}
