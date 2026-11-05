import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { Sheet } from './Sheet';
import { Chip } from './Chip';
import { IconBadge } from './IconBadge';
import { useApp } from '../state/store';
import { communityAlerts } from '../data/sample';

export function BackButton({ onPress }: { onPress?: () => void }) {
  const nav = useNavigation();
  return (
    <Pressable
      onPress={onPress ?? (() => nav.canGoBack() && nav.goBack())}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      style={({ pressed }) => [styles.back, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Icon name="arrow-left" size={20} color={colors.navy} />
    </Pressable>
  );
}

/** Top bar used on the main tab screens: brand, protection status, alerts, profile. */
export function TopBar() {
  const { state } = useApp();
  const nav = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const ready = state.contacts.length > 0;
  return (
    <View style={styles.top}>
      <View style={styles.brand}>
        <Logo size={42} />
        <View>
          <AppText variant="h3" style={{ fontFamily: 'Fraunces_700Bold', fontSize: 20 }}>ResQ</AppText>
          <View style={styles.status}>
            <View style={[styles.dot, { backgroundColor: ready ? colors.safe : colors.warn }]} />
            <AppText variant="label" tone={ready ? 'safe' : 'muted'} style={{ fontSize: 10.5 }}>
              {ready ? 'Circle ready' : 'Add your circle'}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Community alerts" hitSlop={8} style={styles.iconBtn}>
          <Icon name="bell" size={20} color={colors.navy} />
          <View style={styles.bellDot} />
        </Pressable>
        <Pressable onPress={() => nav.navigate('Main', { screen: 'Profile' })} accessibilityRole="button" accessibilityLabel="Open profile" hitSlop={6}>
          <Avatar name={state.user.name || 'You'} size={42} index={1} />
        </Pressable>
      </View>
      <Sheet visible={open} onClose={() => setOpen(false)} title="Alerts near you">
        {communityAlerts.map((a) => (
          <View key={a.id} style={styles.alertRow}>
            <IconBadge name={a.icon} tone={a.tone} size={42} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="bodyStrong">{a.title}</AppText>
              <AppText variant="small" tone="muted">{a.place} · {a.when}</AppText>
            </View>
            <Chip label={a.distance} tone="ivory" />
          </View>
        ))}
      </Sheet>
    </View>
  );
}

type StepProps = { title: string; step?: string; onBack?: () => void; right?: React.ReactNode; hideBack?: boolean };

/** Header for flows (onboarding, reporting). */
export function FlowHeader({ title, step, onBack, right, hideBack }: StepProps) {
  return (
    <View style={styles.flow}>
      {hideBack ? <View style={{ width: 44 }} /> : <BackButton onPress={onBack} />}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {step ? <AppText variant="label" tone="accent" style={{ fontSize: 10.5 }}>{step}</AppText> : null}
        <AppText variant="h3" numberOfLines={1}>{title}</AppText>
      </View>
      <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.section}>
      <AppText variant="h2">{title}</AppText>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10} style={{ minHeight: 44, justifyContent: 'center' }}>
          <AppText variant="bodyStrong" tone="link">{action}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(252,250,240,0.8)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.sos, borderWidth: 1.5, borderColor: colors.ivoryLight },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(252,250,240,0.85)', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  flow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
});
