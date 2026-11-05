import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Avatar } from '../../components/Avatar';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge, BadgeTone } from '../../components/IconBadge';
import { Toggle } from '../../components/Toggle';
import { colors } from '../../theme';
import { RootNav } from '../../navigation/types';
import { useApp } from '../../state/store';
import { incidentLabel, zones } from '../../data/sample';
import { Settings } from '../../types';
import { timeOfDay } from '../../utils/format';

const SETTINGS: { key: keyof Settings; icon: IconName; tone: BadgeTone; title: string; text: string }[] = [
  { key: 'shakeToSos', icon: 'smartphone', tone: 'bordeaux', title: 'Shake to SOS', text: 'Shake firmly to start an alert' },
  { key: 'discreetMode', icon: 'eye-off', tone: 'navy', title: 'Quiet mode', text: 'Mute the siren and dim the screen' },
  { key: 'shareLocationOnJourney', icon: 'navigation', tone: 'horizon', title: 'Share journeys', text: 'Let your circle follow your trips' },
  { key: 'priorityAlerts', icon: 'bell', tone: 'pink', title: 'Priority alerts', text: 'Hear circle alerts straight away' },
  { key: 'locationAccess', icon: 'map-pin', tone: 'safe', title: 'Location access', text: 'Used for journeys and SOS' },
];

export default function ProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { state, dispatch } = useApp();
  const { user, contacts, settings, reports, savedZones } = state;
  const mine = reports.filter((r) => r.own);
  const saved = zones.filter((z) => savedZones.includes(z.id));

  const logOut = () => {
    dispatch({ type: 'signOut' });
    nav.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <Screen variant="ivory" tabbed header={<TopBar />}>
      <Card tone="navy" style={{ gap: 14 }}>
        <View style={styles.row}>
          <Avatar name={user.name || 'You'} size={68} index={1} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="h2" numberOfLines={1}>{user.name || 'Your profile'}</AppText>
            {user.phone ? <AppText variant="small" tone="muted">{user.phone}</AppText> : null}
            {user.email ? <AppText variant="small" tone="muted" numberOfLines={1}>{user.email}</AppText> : null}
          </View>
        </View>
        <View>
          <AppText variant="label" tone="muted" style={{ marginBottom: 8 }}>How you appear in emergencies</AppText>
          <View style={styles.seg}>
            {([['firstName', 'First name'], ['anonymous', 'Anonymous']] as const).map(([id, label]) => {
              const on = user.identityMode === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => dispatch({ type: 'updateUser', patch: { identityMode: id } })}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  style={[styles.pill, on && styles.pillOn]}
                >
                  <AppText variant="bodyStrong" style={{ color: on ? colors.navy : colors.ivory, fontSize: 14 }}>{label}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Card>

      <Card onPress={() => nav.navigate('TrustedCircle')} accessibilityLabel="Trusted circle">
        <View style={styles.row}>
          <IconBadge name="users" tone="navy" size={50} />
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Trusted circle</AppText>
            <AppText variant="small" tone="muted">{contacts.length ? contacts.map((c) => c.name.split(' ')[0]).join(', ') : 'No one added yet'}</AppText>
          </View>
          <Chip label={`${contacts.length}`} tone="pink" />
          <Icon name="chevron-right" size={20} color={colors.navy} />
        </View>
      </Card>

      <AppText variant="h2">Safety settings</AppText>
      <Card padding={6}>
        {SETTINGS.map((s, i) => (
          <View key={s.key} style={[styles.setting, i > 0 && styles.divider]}>
            <IconBadge name={s.icon} tone={s.tone} size={40} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{s.title}</AppText>
              <AppText variant="small" tone="muted">{s.text}</AppText>
            </View>
            <Toggle value={settings[s.key]} onValueChange={(v) => dispatch({ type: 'setSettings', patch: { [s.key]: v } })} label={s.title} />
          </View>
        ))}
      </Card>

      <View style={styles.between}>
        <AppText variant="h2">My reports</AppText>
        <Button label="New" icon="plus" variant="secondary" onPress={() => nav.navigate('ReportType')} />
      </View>
      {mine.length === 0 ? (
        <Card tone="horizon" style={{ alignItems: 'center', gap: 6 }}>
          <IconBadge name="flag" tone="navy" size={50} round />
          <AppText variant="h3" center>No reports yet</AppText>
          <AppText variant="small" tone="muted" center>When you flag a hazard, you can follow its status here.</AppText>
        </Card>
      ) : mine.map((r) => (
        <Card key={r.id}>
          <View style={styles.row}>
            <IconBadge name="file-text" tone="horizon" />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{incidentLabel(r.type)}</AppText>
              <AppText variant="small" tone="muted" numberOfLines={1}>{r.landmark} · {timeOfDay(r.createdAt)}</AppText>
            </View>
            <Chip label={r.status} tone={r.status === 'Live' ? 'safe' : 'warn'} dot />
          </View>
        </Card>
      ))}

      {saved.length > 0 ? (
        <>
          <AppText variant="h2">Saved help zones</AppText>
          {saved.map((z) => (
            <Card key={z.id} onPress={() => nav.navigate('ZoneDetail', { id: z.id })} accessibilityLabel={z.name}>
              <View style={styles.row}>
                <IconBadge name="bookmark" tone="pink" />
                <View style={{ flex: 1 }}><AppText variant="bodyStrong">{z.name}</AppText><AppText variant="small" tone="muted">{z.distanceKm.toFixed(1)} km · {z.open}</AppText></View>
                <Icon name="chevron-right" size={20} color={colors.navy} />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <Button label="Log out" variant="outline" icon="log-out" onPress={logOut} />
      <AppText variant="caption" tone="muted" center>ResQ · Version 1.0</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seg: { flexDirection: 'row', gap: 8 },
  pill: { minHeight: 44, paddingHorizontal: 18, borderRadius: 22, justifyContent: 'center', borderWidth: 1.5, borderColor: colors.lineLight },
  pillOn: { backgroundColor: colors.horizon, borderColor: colors.horizon },
  setting: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, minHeight: 64 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
});
