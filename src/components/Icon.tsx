import React from 'react';
import { Feather } from '@expo/vector-icons';

export type IconName = React.ComponentProps<typeof Feather>['name'];

type Props = { name: IconName; size?: number; color: string };

export function Icon({ name, size = 20, color }: Props) {
  return <Feather name={name} size={size} color={color} />;
}
