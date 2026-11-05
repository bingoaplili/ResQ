import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { TopBar, SectionHeader } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Icon, IconName } from '../../components/Icon';
import { IconBadge, BadgeTone } from '../../components/IconBadge';
import { SOSButton } from '../../components/SOSButton';
import { colors, radius } from '../../theme';
import { RootNav } from '../../navigation/types';
import { useApp } from '../../state/store';
import { api } from '../../services/api';
import { communityAlerts, zones } from '../../data/sample';
import { clock, firstName } from '../../utils/format';
import { useNow } from '../../utils/useNow';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function HomeScreen() {
  const nav = useNavigation<RootNav>();
  const { state, dispatch } = useApp();
  const now = useNow();
  const { journey, contacts, settings, sos, user } = state;
  const left = journey.checkInDueAt ? (journey.checkInDueAt - now) / 1000 : 0;
  const name = user.identityMode === 'firstName' || user.name ? firstName(user.name) : '';

  const trigger = async () => {
    const r = await api.startSos();
    dispatch({ type: 'startSos', ...r });
    nav.navigate('ActiveSOS');
  };

  const actions: { icon: IconName; tone: BadgeTone; title: string; text: string; go: () => void }[] = [
    { icon: 'flag', tone: 'bordeaux', title: 'Report', text: 'Flag a hazard', go: () => nav.navigate('ReportType') },
    { icon: 'map', tone: 'navy', title: 'Help Zones', text: 'Find safe places', go: () => nav.navigate('Main', { screen: 'Zones' }) },
    { icon: 'users', tone: 'horizon', title: 'My circle', text: `${contacts.length} guardian${contacts.length === 1 ? '' : 's'}`, go: () => nav.navigate('TrustedCircle') },
    { icon: 'navigation', tone: 'pink', title: 'Journey', text: 'Walk with me', go: () => nav.navigate('Main', { screen: 'Travel' }) },
  ];

  return (
    <Screen variant="ivory" tabbed header={<TopBar />}>
      <View style={{ gap: 2 }}>
        <AppText variant="body" tone="muted">{greeting()}{name ? `, ${name}` : ''}</AppText>
        <AppText variant="h1">Stay safe out there</AppText>
      </View>

      {sos.status === 'active' ? (
        <Card tone="sos" style={styles.row}>
          <IconBadge name="radio" tone="navy" />
          <View style={{ flex: 1 }}>
            <AppText variant="h3" tone="onColor">SOS is active</AppText>
            <AppText variant="small" tone="onColor">Your circle is following your alert.</AppText>
          </View>
          <Button label="Open" variant="primary" onPress={() => nav.navigate('ActiveSOS')} />
        </Card>
      ) : null}

      <Card tone="navy" style={{ gap: 12 }}>
        <View style={styles.row}>
          <View style={{ flex: 1, gap: 6 }}>
            <Chip label={contacts.length ? 'Circle ready' : 'Add your circle'} tone={contacts.length ? 'safe' : 'warn'} dot />
            <AppText variant="h2">Need help right now?</AppText>
            <AppText variant="small" tone="muted">Hold the SOS button for 3 seconds to alert your circle.</AppText>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Chip label={settings.locationAccess ? 'Location on' : 'Location off'} icon="map-pin" tone="horizon" />
              <Chip label={settings.shakeToSos ? 'Shake on' : 'Shake off'} icon="smartphone" tone="pink" />
            </View>
          </View>
          <SOSButton size={116} onTrigger={trigger} onTap={() => nav.navigate('SOSCountdown')} />
        </View>
      </Card>

      {journey.status === 'active' ? (
        <Card edge={colors.safe} style={{ gap: 10 }}>
          <View style={styles.between}>
            <View style={{ flex: 1 }}>
              <AppText variant="label" tone="safe">Journey in progress</AppText>
              <AppText variant="h3" numberOfLines={1}>To {journey.destination}</AppText>
            </View>
            <View style={styles.timer}>
              <Icon name="clock" size={15} color={left < 60 ? colors.sosDeep : colors.navy} />
              <AppText variant="bodyStrong" style={{ fontVariant: ['tabular-nums'], color: left < 60 ? colors.sosDeep : colors.navy }}>{clock(left)}</AppText>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}><Button label="I’m safe" icon="check" variant="secondary" onPress={() => dispatch({ type: 'endJourney' })} /></View>
            <View style={{ flex: 1 }}><Button label="+5 min" icon="plus" variant="outline" onPress={() => dispatch({ type: 'extendCheckIn', minutes: 5 })} /></View>
          </View>
        </Card>
      ) : (
        <Card tone="horizon" onPress={() => nav.navigate('Main', { screen: 'Travel' })} accessibilityLabel="Start a journey">
          <View style={styles.row}>
            <IconBadge name="navigation" tone="navy" size={52} />
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Heading somewhere?</AppText>
              <AppText variant="small" tone="muted">Pick a safer route and let your circle follow along.</AppText>
            </View>
            <Icon name="chevron-right" size={22} color={colors.navy} />
          </View>
        </Card>
      )}

      <View style={styles.grid}>
        {actions.map((a) => (
          <View key={a.title} style={styles.cell}>
            <Card onPress={a.go} accessibilityLabel={a.title} style={{ gap: 8 }}>
              <IconBadge name={a.icon} tone={a.tone} size={42} />
              <View><AppText variant="h3">{a.title}</AppText><AppText variant="small" tone="muted">{a.text}</AppText></View>
            </Card>
          </View>
        ))}
      </View>

      <SectionHeader title="Nearby help" action="See all" onAction={() => nav.navigate('Main', { screen: 'Zones' })} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {zones.slice(0, 4).map((z) => (
          <Card key={z.id} onPress={() => nav.navigate('ZoneDetail', { id: z.id })} accessibilityLabel={z.name} style={{ width: 230, gap: 8 }}>
            <View style={styles.between}>
              <Chip label={z.label} tone={z.kind === 'hospital' ? 'pink' : z.kind === 'safe' ? 'safe' : 'horizon'} />
              <AppText variant="caption" tone="muted">{z.distanceKm.toFixed(1)} km</AppText>
            </View>
            <AppText variant="h3" numberOfLines={2}>{z.name}</AppText>
            <View style={styles.row}><Icon name="clock" size={14} color={colors.safeDeep} /><AppText variant="small" tone="safe">{z.open}</AppText></View>
          </Card>
        ))}
      </ScrollView>

      <SectionHeader title="Around you" />
      {communityAlerts.map((a) => (
        <Card key={a.id}>
          <View style={styles.row}>
            <IconBadge name={a.icon} tone={a.tone} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{a.title}</AppText>
              <AppText variant="small" tone="muted">{a.place} · {a.when}</AppText>
            </View>
            <Chip label={a.distance} tone="ivory" />
          </View>
        </Card>
      ))}

      <Card tone="pink" style={styles.row}>
        <IconBadge name="sun" tone="bordeaux" round />
        <View style={{ flex: 1 }}>
          <AppText variant="h3">Tip for tonight</AppText>
          <AppText variant="small" tone="muted">Prefer lit, busy streets and tell someone when you set off.</AppText>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.horizonSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '47.5%', flexGrow: 1 },
});
