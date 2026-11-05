import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background, BackgroundVariant, isDark } from './Background';
import { SurfaceContext } from './Surface';

type Props = {
  variant?: BackgroundVariant;
  scroll?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  tabbed?: boolean;
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function Screen({ variant = 'ivory', scroll = true, header, footer, tabbed, gap = 16, contentStyle, children }: Props) {
  const insets = useSafeAreaInsets();
  const dark = isDark(variant);
  const bottomPad = footer ? 16 : insets.bottom + (tabbed ? 104 : 28);
  const inner = [{ padding: 20, paddingBottom: bottomPad, gap }, contentStyle];

  return (
    <SurfaceContext.Provider value={dark ? 'dark' : 'light'}>
      <View style={styles.root}>
        <Background variant={variant} />
        <StatusBar style={dark ? 'light' : 'dark'} />
        <View style={{ flex: 1, paddingTop: insets.top }}>
          {header}
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {scroll ? (
              <ScrollView
                style={styles.flex}
                contentContainerStyle={inner}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={[styles.flex, ...inner]}>{children}</View>
            )}
          </KeyboardAvoidingView>
          {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
        </View>
      </View>
    </SurfaceContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 10, gap: 10 },
});
