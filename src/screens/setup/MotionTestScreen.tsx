import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';

export default function MotionTestScreen({ navigation }: RootProps<'MotionTest'>) {
  const { state, dispatch } = useApp();
  const [hits, setHits] = useState(0);
  const [running, setRunning] = useState(false);
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setHits((h) => Math.min(3, h + 1)), 850);
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(wobble, { toValue: 1, duration: 110, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: -1, duration: 110, easing: Easing.linear, useNativeDriver: true }),
    ]));
    loop.start();
    return () => { clearInterval(id); loop.stop(); wobble.setValue(0); };
  }, [running, wobble]);

  useEffect(() => {
    if (hits >= 3) setRunning(false);
  }, [hits]);

  const done = hits >= 3;
  const rotate = wobble.interpolate({ inputRange: [-1, 1], outputRange: ['-7deg', '7deg'] });
  const { settings, user, contacts } = state;

  const checks = [
    { label: 'Account verified', value: user.phone || 'Done' , ok: true },
    { label: `${contacts.length} trusted guardian${contacts.length === 1 ? '' : 's'}`, value: contacts.length ? 'Linked' : 'Add later', ok: contacts.length > 0 },
    { label: 'Location access', value: settings.locationAccess ? 'On' : 'Off', ok: settings.locationAccess },
    { label: 'Priority alerts', value: settings.priorityAlerts ? 'On' : 'Off', ok: settings.priorityAlerts },
    { label: 'Shake to SOS', value: settings.shakeToSos && done ? 'Ready' : 'Test it', ok: settings.shakeToSos && done },
  ];
  const active = checks.filter((c) => c.ok).length;

  return (
    <Screen
      variant="horizon"
      header={<FlowHeader title="Safety hub" hideBack />}
      footer={<Button label="Enter ResQ" iconRight="arrow-right" size="lg" onPress={() => { dispatch({ type: 'signIn' }); navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); }} />}
    >
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Chip label="Shake calibration" icon="smartphone" tone="pink" />
        <AppText variant="h1" center>Test Shake to SOS</AppText>
        <AppText variant="body" tone="muted" center>Shake your phone firmly three times to check that hands-free alerts will work for you.</AppText>
      </View>

      <Card style={{ gap: 14 }}>
        <View style={styles.stage}>
          <Animated.View style={[styles.phone, { transform: [{ rotate }] }]}>
            <View style={styles.screen}>
              <Icon name={done ? 'check' : 'radio'} size={26} color={done ? colors.safeDeep : colors.bordeaux} />
              <AppText variant="label" tone="accent" style={{ fontSize: 10 }}>{done ? 'SOS ready' : running ? 'Shaking…' : 'Standing by'}</AppText>
            </View>
          </Animated.View>
        </View>
        <View style={styles.head}>
          <AppText variant="bodyStrong">Shakes detected: {hits} of 3</AppText>
          {done ? <Chip label="Complete" tone="safe" dot /> : null}
        </View>
        <View style={styles.segs}>
          {[0, 1, 2].map((i) => <View key={i} style={[styles.seg, { backgroundColor: i < hits ? colors.safe : 'rgba(19,39,63,0.18)' }]} />)}
        </View>
        {done ? (
          <View style={styles.ok}>
            <Icon name="check-circle" size={20} color={colors.safeDeep} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">Shake to SOS is ready</AppText>
              <AppText variant="small" tone="muted">Your phone picked up all three shakes.</AppText>
            </View>
          </View>
        ) : (
          <Button label={running ? 'Testing…' : hits > 0 ? 'Test again' : 'Start test'} icon="play" variant="secondary" disabled={running}
            onPress={() => { setHits(0); setRunning(true); }} />
        )}
        <View style={styles.note}>
          <Icon name="info" size={16} color={colors.inkMuted} />
          <AppText variant="small" tone="muted" style={{ flex: 1 }}>This is a practice run. No one in your circle is alerted.</AppText>
        </View>
      </Card>

      <Card>
        <View style={styles.head}>
          <AppText variant="h2" style={{ flex: 1 }}>You’re set up</AppText>
          <Chip label={`${active} / ${checks.length}`} tone="safe" />
        </View>
        <View style={{ gap: 8, marginTop: 10 }}>
          {checks.map((c) => (
            <View key={c.label} style={styles.check}>
              <IconBadge name={c.ok ? 'check' : 'minus'} tone={c.ok ? 'safe' : 'ivory'} size={30} round />
              <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>{c.label}</AppText>
              <AppText variant="caption" tone={c.ok ? 'safe' : 'muted'}>{c.value}</AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: 'center', paddingVertical: 8 },
  phone: { width: 96, height: 160, borderRadius: 20, backgroundColor: colors.navy, padding: 6 },
  screen: { flex: 1, borderRadius: 15, backgroundColor: colors.pinkSoft, alignItems: 'center', justifyContent: 'center', gap: 6 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  segs: { flexDirection: 'row', gap: 8 },
  seg: { flex: 1, height: 8, borderRadius: 4 },
  ok: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: colors.safeSoft, borderRadius: radius.md, padding: 12 },
  note: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 8, paddingRight: 12, minHeight: 48 },
});
