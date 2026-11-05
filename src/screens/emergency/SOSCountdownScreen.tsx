import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { SOSButton } from '../../components/SOSButton';
import { MapCanvas } from '../../components/MapCanvas';
import { Toggle } from '../../components/Toggle';
import { colors } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';

const STEPS = [
  { t: 'Your circle is alerted', d: 'Trusted contacts get a priority message with your location.' },
  { t: 'Your live location is shared', d: 'They can follow you until you end the alert.' },
  { t: 'Nearby responders are notified', d: 'Verified community responders close by can offer help.' },
  { t: 'You stay in control', d: 'End the alert at any time by holding the end button.' },
];

export default function SOSCountdownScreen({ navigation }: RootProps<'SOSCountdown'>) {
  const { state, dispatch } = useApp();
  const [busy, setBusy] = useState(false);

  const trigger = async () => {
    if (busy) return;
    setBusy(true);
    const r = await api.startSos();
    dispatch({ type: 'startSos', ...r });
    navigation.replace('ActiveSOS');
  };

  return (
    <Screen
      variant="sos"
      header={<FlowHeader title="SOS" step="Priority alert" />}
      footer={
        <>
          <Button label="Cancel SOS" variant="outline" icon="x" onPress={() => navigation.goBack()} />
          <AppText variant="caption" tone="muted" center>Nothing is sent unless you hold for the full three seconds.</AppText>
        </>
      }
    >
      <View style={{ gap: 6 }}>
        <Chip label="Priority protocol" icon="alert-circle" tone="pink" dot />
        <AppText variant="h1">Hold to send SOS</AppText>
        <AppText variant="body" tone="muted">Keep your finger on the button for three seconds. Let go to stop.</AppText>
      </View>

      <Card tone="glass" style={{ alignItems: 'center', gap: 10, paddingVertical: 18 }}>
        <SOSButton size={190} onTrigger={trigger} />
        <Chip label="Haptic feedback on" icon="activity" tone="horizon" />
      </Card>

      <Card tone="glass" style={styles.row}>
        <IconBadge name="eye-off" tone="horizon" />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Quiet mode</AppText>
          <AppText variant="small" tone="muted">Mute the siren and dim the screen when the alert starts.</AppText>
        </View>
        <Toggle value={state.settings.discreetMode} onValueChange={(v) => dispatch({ type: 'setSettings', patch: { discreetMode: v } })} label="Quiet mode" />
      </Card>

      <Card tone="ivory" style={{ gap: 14 }}>
        <View style={styles.row}>
          <AppText variant="h2" style={{ flex: 1 }}>What happens next</AppText>
          <Chip label="Private" icon="lock" tone="pink" />
        </View>
        {STEPS.map((s, i) => (
          <View key={s.t} style={styles.step}>
            <View style={styles.num}><AppText variant="bodyStrong" tone="onColor">{i + 1}</AppText></View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{s.t}</AppText>
              <AppText variant="small" tone="muted">{s.d}</AppText>
            </View>
          </View>
        ))}
      </Card>

      <Card tone="ivory" padding={10}>
        <View style={styles.row}>
          <View style={{ width: 96, height: 72 }}><MapCanvas height={72} pins={[{ id: 'you', x: 50, y: 50, kind: 'you' }]} /></View>
          <View style={{ flex: 1 }}>
            <View style={styles.loc}><Icon name="crosshair" size={15} color={colors.bordeaux} /><AppText variant="bodyStrong">Location ready</AppText></View>
            <AppText variant="small" tone="muted">Dhanmondi Lake Walkway, Dhaka</AppText>
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  num: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
