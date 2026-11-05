import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { MapCanvas } from '../../components/MapCanvas';
import { Sheet } from '../../components/Sheet';
import { CallSheet } from '../../components/CallSheet';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { clock, timeOfDay } from '../../utils/format';

export default function EmergencyResolvedScreen({ navigation }: RootProps<'EmergencyResolved'>) {
  const { state, dispatch } = useApp();
  const [feeling, setFeeling] = useState<'safe' | 'help' | null>(null);
  const [log, setLog] = useState(false);
  const [call, setCall] = useState(false);
  const { startedAt = Date.now(), endedAt = Date.now(), ref = 'RQ-SOS-8821' } = state.sos;
  const dur = (endedAt - startedAt) / 1000;

  const done = () => { dispatch({ type: 'resetSos' }); navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); };

  const opts: { id: 'safe' | 'help'; icon: IconName; title: string; text: string }[] = [
    { id: 'safe', icon: 'smile', title: 'I’m safe and accompanied', text: 'I have company or have reached my destination.' },
    { id: 'help', icon: 'life-buoy', title: 'I need more help', text: 'Ask a trusted contact to meet me or arrange a ride.' },
  ];

  return (
    <Screen variant="navy" gap={14}>
      <View style={styles.hero}>
        <View style={styles.seal}><Icon name="shield" size={42} color={colors.navy} /><View style={styles.tick}><Icon name="check" size={16} color="#FFFFFF" /></View></View>
        <Chip label="Alert ended" tone="pink" dot />
        <AppText variant="h1" center>You’re marked safe</AppText>
        <AppText variant="body" tone="muted" center>Your SOS has ended and your circle knows you’re okay.</AppText>
      </View>

      <Card tone="ivory" style={{ gap: 12 }}>
        <View style={styles.between}>
          <View><AppText variant="label" tone="muted">Incident ref</AppText><AppText variant="h3">#{ref}</AppText></View>
          <View style={{ alignItems: 'flex-end' }}><AppText variant="label" tone="muted">Duration</AppText><AppText variant="h3">{clock(dur)} · {timeOfDay(endedAt)}</AppText></View>
        </View>
        <MapCanvas height={110} halo={{ x: 50, y: 50, radius: 40, color: colors.safe }} pins={[{ id: 'p', x: 50, y: 50, kind: 'you' }]} />
        <View style={styles.row}>
          <IconBadge name="users" tone="horizon" size={40} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong">Circle updated</AppText>
            <AppText variant="small" tone="muted" numberOfLines={2}>{state.contacts.length ? state.contacts.map((c) => c.name.split(' ')[0]).join(', ') + ' know you’re safe.' : 'No contacts to notify.'}</AppText>
          </View>
          <Chip label="Delivered" tone="safe" />
        </View>
      </Card>

      <Card tone="ivory" style={{ gap: 10 }}>
        <View style={styles.row}><Icon name="heart" size={20} color={colors.bordeaux} /><AppText variant="h2">How are you feeling?</AppText></View>
        <AppText variant="small" tone="muted">Take a steady breath. Pick what feels right.</AppText>
        {opts.map((o) => (
          <Pressable key={o.id} onPress={() => setFeeling(o.id)} accessibilityRole="radio" accessibilityState={{ selected: feeling === o.id }}
            style={[styles.opt, feeling === o.id && styles.optOn]}>
            <IconBadge name={o.icon} tone={feeling === o.id ? 'navy' : 'horizon'} size={42} round />
            <View style={{ flex: 1 }}><AppText variant="bodyStrong">{o.title}</AppText><AppText variant="small" tone="muted">{o.text}</AppText></View>
          </Pressable>
        ))}
        {feeling === 'help' ? <Button label="Call a trusted contact" icon="phone" variant="secondary" onPress={() => (state.contacts.length ? setCall(true) : navigation.navigate('TrustedCircle'))} /> : null}
      </Card>

      <Card tone="pink" style={{ gap: 10 }}>
        <View style={styles.row}>
          <IconBadge name="headphones" tone="bordeaux" size={46} round />
          <View style={{ flex: 1 }}><AppText variant="h3">Talk to someone</AppText><AppText variant="small" tone="muted">Reach a person you trust after a stressful moment.</AppText></View>
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}><Button label="Chat" variant="outline" icon="message-circle" onPress={() => setFeeling('help')} /></View>
          <View style={{ flex: 1 }}><Button label="Speak now" variant="bordeaux" icon="phone" onPress={() => (state.contacts.length ? setCall(true) : navigation.navigate('TrustedCircle'))} /></View>
        </View>
      </Card>

      <Button label="Return home" size="lg" variant="primary" onPress={done} />
      <Button label="View alert log" variant="outline" icon="file-text" onPress={() => setLog(true)} />

      <Sheet visible={log} onClose={() => setLog(false)} title="Alert log">
        {[
          [timeOfDay(startedAt), 'SOS started'],
          [timeOfDay(startedAt + 2000), 'Circle alerted with your location'],
          [timeOfDay(startedAt + 30000), 'Nearby responders notified'],
          [timeOfDay(endedAt), 'Alert ended — marked safe'],
        ].map(([t, e]) => (
          <View key={e} style={styles.logRow}><AppText variant="bodyStrong" style={{ width: 82, fontVariant: ['tabular-nums'] }}>{t}</AppText><AppText variant="body" style={{ flex: 1 }}>{e}</AppText></View>
        ))}
      </Sheet>
      {state.contacts[0] ? <CallSheet visible={call} onClose={() => setCall(false)} name={state.contacts[0].name} number={state.contacts[0].phone} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 10, paddingTop: 8 },
  seal: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.horizon, alignItems: 'center', justifyContent: 'center' },
  tick: { position: 'absolute', right: 0, bottom: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.safe, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.navy },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.horizonMist, borderWidth: 2, borderColor: 'transparent', minHeight: 64 },
  optOn: { borderColor: colors.horizonDeep, backgroundColor: colors.horizonSoft },
  logRow: { flexDirection: 'row', gap: 10, paddingVertical: 8 },
});
