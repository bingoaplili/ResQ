import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

const META: Record<string, { label: string; icon: IconName }> = {
  Home: { label: 'Home', icon: 'home' },
  Travel: { label: 'Travel', icon: 'navigation' },
  Zones: { label: 'Map', icon: 'map' },
  Respond: { label: 'Respond', icon: 'shield' },
  Profile: { label: 'Profile', icon: 'user' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={[styles.bar, shadow(3)]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const m = META[route.name];
          const sos = route.name === 'Respond';
          const fg = sos ? '#FFFFFF' : focused ? colors.navy : 'rgba(247,242,224,0.82)';
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={m.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(route.name as never);
              }}
              style={styles.item}
            >
              <View
                style={[
                  styles.pill,
                  sos && { backgroundColor: colors.sos },
                  !sos && focused && { backgroundColor: colors.horizon },
                ]}
              >
                <Icon name={m.icon} size={sos ? 22 : 20} color={fg} />
                <AppText variant="caption" style={{ color: fg, fontSize: 11, fontFamily: focused || sos ? 'Inter_700Bold' : 'Inter_500Medium' }}>
                  {m.label}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14 },
  bar: {
    flexDirection: 'row', backgroundColor: colors.navy, borderRadius: radius.xl, padding: 6,
    borderWidth: 1, borderColor: 'rgba(128,174,232,0.35)',
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pill: { minHeight: 56, minWidth: 56, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, gap: 3, paddingVertical: 6 },
});
