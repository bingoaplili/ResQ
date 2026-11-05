import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge, BadgeTone } from '../../components/IconBadge';
import { SOSButton } from '../../components/SOSButton';
import { CallSheet } from '../../components/CallSheet';
import { Sheet } from '../../components/Sheet';
import { Toggle } from '../../components/Toggle';
import { colors, config } from '../../theme';
import { RootNav } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';

type RowProps = {
  icon: IconName; tone: BadgeTone; title: string; tag?: string; text: string;
  onPress?: () => void; trailing?: React.ReactNode; tagTone?: 'sos' | 'safe' | 'horizon';
};

function WayRow({ icon, tone, title, tag, tagTone = 'horizon', text, onPress, trailing }: RowProps) {
  return (
    <Card onPress={onPress} accessibilityLabel={title}>
      <View style={styles.way}>
        <IconBadge name={icon} tone={tone} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={styles.titleRow}>
            <AppText variant="h3" numberOfLines={1} style={{ flexShrink: 1 }}>{title}</AppText>
            {tag ? <Chip label={tag} tone={tagTone} /> : null}
          </View>
          <AppText variant="small" tone="muted" numberOfLines={2}>{text}</AppText>
        </View>
        {trailing ?? <Icon name="chevron-right" size={20} color={colors.navy} />}
      </View>
    </Card>
  );
}

export default function RespondScreen() {
  const nav = useNavigation<RootNav>();
  const { state, dispatch } = useApp();
  const [call, setCall] = useState(false);
  const [alertSheet, setAlertSheet] = useState(false);
  const [alerted, setAlerted] = useState(false);
  const [sharing, setSharing] = useState(false);
  const n = state.contacts.length;

  const trigger = async () => {
    const r = await api.startSos();
    dispatch({ type: 'startSos', ...r });
    nav.navigate('ActiveSOS');
  };

  return (
    <Screen variant="ivory" tabbed header={<TopBar />}>
      <View style={{ gap: 4 }}>
        <AppText variant="h1">Emergency help</AppText>
        <AppText variant="body" tone="muted">Get help quickly when you need it.</AppText>
      </View>

      <Card tone="bordeaux" elevated style={{ alignItems: 'center', gap: 8, paddingVertical: 20 }}>
        <Chip label="Hold to prevent accidents" icon="shield" tone="pink" />
        <SOSButton size={176} onTrigger={trigger} onTap={() => nav.navigate('SOSCountdown')} />
        <AppText variant="h2" center>Press & hold for 3 seconds</AppText>
        <AppText variant="small" tone="muted" center>
          {n > 0 ? `Your ${n} trusted contact${n === 1 ? '' : 's'} will be alerted and your live location shared.` : 'Add trusted contacts so they can be alerted when you send an SOS.'}
        </AppText>
        {state.sos.status === 'active' ? <Button label="Return to active SOS" variant="pink" icon="radio" onPress={() => nav.navigate('ActiveSOS')} /> : null}
      </Card>

      <View style={styles.head}>
        <AppText variant="h2">Other ways to get help</AppText>
        <AppText variant="label" tone="accent">Fast response</AppText>
      </View>

      <WayRow icon="phone" tone="sos" title="Call emergency services" tag={`${config.emergencyNumber}`} tagTone="sos" text="Direct line to police, fire and ambulance dispatch." onPress={() => setCall(true)} />
      <WayRow icon="users" tone="navy" title="Alert trusted contacts" tag={alerted ? 'Sent' : `${n} ready`} tagTone={alerted ? 'safe' : 'horizon'} text={alerted ? 'Your circle has your latest check-in.' : 'Send a quick “I need you” message to your circle.'}
        onPress={() => (n > 0 ? setAlertSheet(true) : nav.navigate('TrustedCircle'))} />
      <WayRow icon="map-pin" tone="pink" title="Share my location" tag={sharing ? 'Live' : 'Off'} tagTone={sharing ? 'safe' : 'horizon'} text="Let your circle follow where you are for 15 minutes."
        trailing={<Toggle value={sharing} onValueChange={setSharing} label="Share my location" />} />
      <WayRow icon="smartphone" tone="bordeaux" title="Shake to SOS" tag="Discreet" text="Shake your phone firmly to start an SOS."
        trailing={<Toggle value={state.settings.shakeToSos} onValueChange={(v) => dispatch({ type: 'setSettings', patch: { shakeToSos: v } })} label="Shake to SOS" />} />

      <Card tone="horizon" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <IconBadge name="lock" tone="navy" round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Private by default</AppText>
          <AppText variant="small" tone="muted">Only your trusted circle and verified responders can see your alert.</AppText>
        </View>
      </Card>

      <CallSheet visible={call} onClose={() => setCall(false)} name="Emergency services" number={config.emergencyNumber} emergency />
      <Sheet visible={alertSheet} onClose={() => setAlertSheet(false)} title="Alert your circle?">
        <AppText variant="body" tone="muted">{state.contacts.map((c) => c.name.split(' ')[0]).join(', ')} will get a message asking them to check in on you right now.</AppText>
        <Button label="Send alert" variant="sos" icon="send" onPress={() => { setAlerted(true); setAlertSheet(false); }} />
        <Button label="Not now" variant="ghost" onPress={() => setAlertSheet(false)} />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  way: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
