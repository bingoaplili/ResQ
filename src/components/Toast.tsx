import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type ToastApi = { show: (message: string) => void };
const ToastContext = createContext<ToastApi>({ show: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 260, useNativeDriver: true }).start();
    }, 2400);
  }, [opacity]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Animated.View pointerEvents="none" style={[styles.wrap, { top: insets.top + 10, opacity }]}>
        <View style={[styles.toast, shadow(2)]} accessibilityLiveRegion="polite">
          <Icon name="check-circle" size={18} color={colors.horizon} />
          <AppText variant="bodyStrong" tone="onColor" style={styles.text}>{message}</AppText>
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 99 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.navy, paddingVertical: 12, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: 'rgba(128,174,232,0.4)' },
  text: { fontSize: 14 },
});
