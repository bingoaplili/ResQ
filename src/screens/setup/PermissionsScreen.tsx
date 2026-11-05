import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { FlowHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { StepBar } from '../../components/Progress';
import { colors, radius } from '../../theme';
import { RootProps } from '../../navigation/types';
import { useApp } from '../../state/store';

const LOCATION_USES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'git-branch', title: 'Safer routes', text: 'Find well-lit paths and avoid reported hazards.' },
  { icon: 'map-pin', title: 'SOS location', text: 'Share where you are with your circle when you ask for help.' },
  { icon: 'flag', title: 'Journey check-ins', text: 'Let your circle know when you arrive safely.' },
  { icon: 'plus-square', title: 'Help Zones', text: 'Directions to open police, hospitals and safe places.' },
];

export default function PermissionsScreen({ navigation }: RootProps<'Permissions'>) {
  const { state, dispatch } = useApp();
  const { locationAccess, priorityAlerts } = state.settings;

  return (
    <Screen
      variant="ivory"
      header={<FlowHeader title="Permissions" />}
      footer={
        <>
          <Button label="Allow & continue" iconRight="arrow-right" onPress={() => { dispatch({ type: 'setSettings', patch: { locationAccess: true, priorityAlerts: true } }); navigation.navigate('MotionTest'); }} />
          <Button label="Customize permissions later" variant="ghost" onPress={() => navigation.navigate('MotionTest')} />
        </>
      }
    >
      <StepBar total={3} current={2} />
      <Chip label="System permissions" icon="shield" tone="pink" />
      <View style={{ gap: 6 }}>
        <AppText variant="h1">Enable critical safety access</AppText>
        <AppText variant="body" tone="muted">ResQ needs two permissions to protect you while you travel and to reach you quickly.</AppText>
      </View>

      <Card edge={colors.horizonDeep} style={{ gap: 14 }}>
        <View style={styles.row}>
          <IconBadge name="navigation" tone="navy" size={52} round />
          <View style={{ flex: 1 }}>
            <AppText variant="label" tone="accent">Needed for SOS</AppText>
            <AppText variant="h2">Location access</AppText>
          </View>
          <Chip label={locationAccess ? 'On' : 'Off'} tone={locationAccess ? 'safe' : 'ivory'} dot />
        </View>
        <View style={styles.list}>
          {LOCATION_USES.map((u) => (
            <View key={u.title} style={styles.item}>
              <IconBadge name={u.icon} tone="horizon" size={36} />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{u.title}</AppText>
                <AppText variant="small" tone="muted">{u.text}</AppText>
              </View>
            </View>
          ))}
        </View>
        <Button label={locationAccess ? 'Location allowed' : 'Allow location'} variant={locationAccess ? 'outline' : 'secondary'} icon={locationAccess ? 'check' : 'map-pin'}
          onPress={() => dispatch({ type: 'setSettings', patch: { locationAccess: !locationAccess } })} />
      </Card>

      <Card tone="horizon" style={{ gap: 14 }}>
        <View style={styles.row}>
          <IconBadge name="bell" tone="bordeaux" size={52} round />
          <View style={{ flex: 1 }}>
            <AppText variant="label" tone="accent">Priority alerts</AppText>
            <AppText variant="h2">Notifications</AppText>
          </View>
          <Chip label={priorityAlerts ? 'On' : 'Off'} tone={priorityAlerts ? 'safe' : 'ivory'} dot />
        </View>
        <View style={styles.note}>
          <Icon name="volume-2" size={18} color={colors.bordeaux} />
          <AppText variant="small" style={{ flex: 1 }}>Hear an alert straight away when someone in your circle sends an SOS, and get updates when help is on the way.</AppText>
        </View>
        <Button label={priorityAlerts ? 'Alerts enabled' : 'Enable alerts'} variant={priorityAlerts ? 'outline' : 'primary'} icon={priorityAlerts ? 'check' : 'bell'}
          onPress={() => dispatch({ type: 'setSettings', patch: { priorityAlerts: !priorityAlerts } })} />
      </Card>

      <Card tone="navy" style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <IconBadge name="lock" tone="bordeaux" />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Shared only when you choose</AppText>
          <AppText variant="small" tone="muted">Your location is used when you start a journey or send an SOS, not in the background.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  list: { backgroundColor: colors.horizonMist, borderRadius: radius.md, padding: 12, gap: 12 },
  item: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  note: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(252,250,240,0.7)', borderRadius: radius.md, padding: 12, alignItems: 'flex-start' },
});
