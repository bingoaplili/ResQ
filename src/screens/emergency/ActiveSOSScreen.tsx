import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { SurfaceContext } from '../../components/Surface';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/Avatar';
import { IconBadge } from '../../components/IconBadge';
import { MapCanvas } from '../../components/MapCanvas';
import { HoldButton } from '../../components/HoldButton';
import { CallSheet } from '../../components/CallSheet';
import { useToast } from '../../components/Toast';
import { colors, config, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { responders } from '../../data/sample';
import { clock } from '../../utils/format';

export default function ActiveSOSScreen({ navigation }: RootProps<'ActiveSOS'>) {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [now, setNow] = useState(Date.now());
  const [call, setCall] = useState<{ name: string; number: string; emergency?: boolean } | null>(null);
  const started = state.sos.startedAt ?? now;
  const elapsed = (now - started) / 1000;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const end = async () => {
    await api.resolveSos(state.sos.ref ?? '');
    dispatch({ type: 'endSos' });
    navigation.replace('EmergencyResolved');
  };

  const eta = (base: number) => Math.max(1, base - Math.floor(elapsed / 45));

  return (
    <Screen variant="sos" gap={14}>
      <View style={styles.top}>
        <Button label="Minimise" variant="outline" icon="chevron-down" onPress={() => navigation.navigate('Main')} />
      </View>

      <Card tone="sos" style={{ gap: 10 }}>
        <View style={styles.between}>
          <Chip label="SOS active" icon="radio" tone="navy" />
          <View style={styles.timer}>
            <Icon name="clock" size={15} color={colors.sosDeep} />
            <AppText variant="bodyStrong" style={{ color: colors.sosDeep, fontVariant: ['tabular-nums'] }}>{clock(elapsed)}</AppText>
          </View>
        </View>
        <AppText variant="h1" tone="onColor">Help has been requested</AppText>
        <AppText variant="small" tone="onColor">Your circle has your alert. Stay where it feels safe if you can.</AppText>
        <View style={styles.stats}>
          {[['GPS', '±8 m'], ['Battery', '78%'], ['Responders', `${responders.length} en route`]].map(([k, v]) => (
            <SurfaceContext.Provider key={k} value="light">
              <View style={styles.stat}>
                <AppText variant="caption" tone="muted">{k}</AppText>
                <AppText variant="bodyStrong" style={{ fontSize: 14 }}>{v}</AppText>
              </View>
            </SurfaceContext.Provider>
          ))}
        </View>
      </Card>

      <MapCanvas
        height={200}
        halo={{ x: 50, y: 48, radius: 60 }}
        pins={[
          { id: 'me', x: 50, y: 48, kind: 'you', label: 'You' },
          { id: 'r1', x: 66, y: 34, kind: 'safe', label: `Arif · ${eta(4)} min` },
          { id: 'r2', x: 30, y: 70, kind: 'safe' },
        ]}
      />

      <Card style={{ gap: 12 }}>
        <View style={styles.between}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <IconBadge name="shield" tone="safe" size={40} />
            <View>
              <AppText variant="h3">Nearby responders</AppText>
              <AppText variant="small" tone="safe">{responders.length} people responding</AppText>
            </View>
          </View>
        </View>
        {responders.map((r, i) => (
          <View key={r.id} style={styles.person}>
            <Avatar name={r.name} size={46} index={i} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <AppText variant="bodyStrong">{r.name}</AppText>
                <Chip label={r.tag} tone={i === 0 ? 'navy' : 'safe'} />
              </View>
              <AppText variant="small" tone="muted">{eta(r.eta)} min away · {r.distance}</AppText>
            </View>
            <Icon name={r.icon} size={20} color={colors.navy} />
          </View>
        ))}
        <View style={styles.note}>
          <Icon name="lock" size={15} color={colors.inkMuted} />
          <AppText variant="small" tone="muted" style={{ flex: 1 }}>Responders see only an approximate area until they arrive.</AppText>
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <View style={styles.between}>
          <AppText variant="h2">Your circle</AppText>
          <AppText variant="caption" tone="muted">{state.contacts.length} notified</AppText>
        </View>
        {state.contacts.length === 0 ? <AppText variant="small" tone="muted">No trusted contacts yet.</AppText> : null}
        {state.contacts.map((c, i) => (
          <View key={c.id} style={styles.person}>
            <Avatar name={c.name} size={42} index={i + 1} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{c.name}</AppText>
              <AppText variant="small" tone="safe">{i === 0 ? 'Received alert · following live' : 'Received alert'}</AppText>
            </View>
            <Button label="Call" variant="secondary" icon="phone" onPress={() => setCall({ name: c.name, number: c.phone })} />
          </View>
        ))}
      </Card>

      <View style={{ gap: 10 }}>
        <Button label={`Call emergency services (${config.emergencyNumber})`} variant="sos" icon="phone" size="lg" onPress={() => setCall({ name: 'Emergency services', number: config.emergencyNumber, emergency: true })} />
        <Button label="Share live tracking link" variant="secondary" icon="share-2" onPress={() => toast.show('Tracking link copied')} />
      </View>

      <Card tone="glass" style={{ gap: 10 }}>
        <AppText variant="h3" center>Reached safety?</AppText>
        <AppText variant="small" tone="muted" center>Press and hold for 3 seconds to end the alert and let your circle know you’re okay.</AppText>
        <HoldButton label="Hold to end SOS" onComplete={end} />
      </Card>

      {call ? <CallSheet visible onClose={() => setCall(null)} name={call.name} number={call.number} emergency={call.emergency} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'flex-start' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.ivoryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: colors.ivoryLight, borderRadius: radius.md, padding: 10, gap: 2 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  note: { flexDirection: 'row', gap: 8, backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 10, alignItems: 'center' },
});
