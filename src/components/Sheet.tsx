import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';
import { AppText } from './AppText';
import { SurfaceContext } from './Surface';

type Props = { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode };

export function Sheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      <SurfaceContext.Provider value="light">
        <View style={[styles.sheet, shadow(3), { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.grab} />
          {title ? <AppText variant="h2" style={styles.title}>{title}</AppText> : null}
          {children}
        </View>
      </SurfaceContext.Provider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(11,26,44,0.6)' },
  sheet: {
    backgroundColor: colors.ivory, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: 20, gap: 12, maxHeight: '88%',
  },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,39,63,0.25)', marginBottom: 4 },
  title: { marginBottom: 4 },
});
