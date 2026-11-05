import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/Headers';
import { AppText } from '../../components/AppText';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { IconBadge } from '../../components/IconBadge';
import { MapCanvas } from '../../components/MapCanvas';
import { Toggle } from '../../components/Toggle';
import { useToast } from '../../components/Toast';
import { colors, radius } from '../../theme';
import { RootNav } from '../../navigation/types';
import { useApp } from '../../state/store';
import { journeyRoutes } from '../../data/sample';
import { clock } from '../../utils/format';
import { useNow } from '../../utils/useNow';

export default function TravelScreen() {
  const nav = useNavigation<RootNav>();
  const { state, dispatch } = useApp();
  const toast = useToast();
  const now = useNow();
  const { journey, contacts, settings } = state;
  const [dest, setDest] = useState('');
  const [routeId, setRouteId] = useState<'lit' | 'fast'>('lit');
  const [error, setError] = useState('');
  const active = journey.status === 'active';
  const shown = journeyRoutes.find((r) => r.id === (active ? journey.routeId : routeId)) ?? journeyRoutes[0];
  const left = journey.checkInDueAt ? (journey.checkInDueAt - now) / 1000 : 0;

  const start = () => {
    if (dest.trim().length < 3) { setError('Where are you heading?'); return; }
    setError('');
    dispatch({ type: 'startJourney', journey: { status: 'active', destination: dest.trim(), routeId, startedAt: Date.now(), checkInDueAt: Date.now() + shown.mins * 60000 + 5 * 60000 } });
  };

  return (
    <Screen variant="ivory" tabbed header={<TopBar />}>
      <View style={{ gap: 4 }}>
        <AppText variant="h1">{active ? 'Journey in progress' : 'Plan a safer journey'}</AppText>
        <AppText variant="body" tone="muted">{active ? 'Your circle can follow your route until you arrive.' : 'Choose a route and check in when you get there.'}</AppText>
      </View>

      <MapCanvas height={220} route={shown.path} routeColor={shown.id === 'lit' ? colors.bordeaux : colors.warn}
        pins={[
          { id: 'you', x: shown.path[0].x, y: shown.path[0].y, kind: 'you', label: 'You' },
          { id: 'end', x: shown.path[shown.path.length - 1].x, y: shown.path[shown.path.length - 1].y, kind: 'destination', label: dest.trim() || 'Destination' },
          { id: 'h1', x: 40, y: 40, kind: 'safe' },
          { id: 'h2', x: 62, y: 62, kind: 'police' },
        ]} />

      {active ? (
        <>
          <Card edge={colors.safe} style={{ gap: 12 }}>
            <View style={styles.between}>
              <View style={{ flex: 1 }}>
                <AppText variant="label" tone="safe">Heading to</AppText>
                <AppText variant="h2" numberOfLines={1}>{journey.destination}</AppText>
                <AppText variant="small" tone="muted">{shown.title} · {shown.mins} min · {shown.km} km</AppText>
              </View>
              <View style={styles.timer}>
                <AppText variant="caption" tone="muted">Check-in due</AppText>
                <AppText variant="metric" style={{ fontSize: 26, lineHeight: 30, color: left < 60 ? colors.sosDeep : colors.navy }}>{clock(left)}</AppText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}><Button label="I’ve arrived" icon="check" variant="secondary" onPress={() => { dispatch({ type: 'endJourney' }); toast.show('Glad you’re safe'); }} /></View>
              <View style={{ flex: 1 }}><Button label="+5 min" icon="plus" variant="outline" onPress={() => dispatch({ type: 'extendCheckIn', minutes: 5 })} /></View>
            </View>
            <Button label="End journey" variant="ghost" onPress={() => dispatch({ type: 'endJourney' })} />
          </Card>
          <Card style={{ gap: 10 }}>
            <AppText variant="h3">Following you</AppText>
            {contacts.length === 0 ? <AppText variant="small" tone="muted">Add a guardian to share your journey.</AppText> : contacts.map((c) => (
              <View key={c.id} style={styles.row}><IconBadge name="user" tone="safe" size={34} round /><AppText variant="bodyStrong" style={{ flex: 1 }}>{c.name}</AppText><Chip label="Watching" tone="safe" dot /></View>
            ))}
          </Card>
        </>
      ) : (
        <>
          <Card style={{ gap: 12 }}>
            <Input icon="flag" label="Destination" placeholder="Where are you going?" value={dest} onChangeText={(t) => { setDest(t); setError(''); }} error={error} />
            <View style={styles.row}><Icon name="crosshair" size={16} color={colors.horizonDeep} /><AppText variant="small" tone="muted">Starting from your current location</AppText></View>
          </Card>

          <AppText variant="h2">Route options</AppText>
          {journeyRoutes.map((r) => {
            const on = routeId === r.id;
            return (
              <Pressable key={r.id} onPress={() => setRouteId(r.id)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${r.title}, ${r.mins} minutes`}>
                <Card tone={on ? 'horizon' : 'ivory'} edge={r.tone === 'safe' ? colors.safe : colors.warn} style={on && { borderColor: colors.horizonDeep, borderWidth: 2 }}>
                  <View style={[styles.row, { paddingLeft: 6 }]}>
                    <IconBadge name={r.icon} tone={r.tone === 'safe' ? 'safe' : 'ivory'} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="h3">{r.title}</AppText>
                      <AppText variant="small" tone="muted">{r.text}</AppText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <AppText variant="metric" style={{ fontSize: 22, lineHeight: 26 }}>{r.mins}</AppText>
                      <AppText variant="caption" tone="muted">min · {r.km} km</AppText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}

          <Card style={styles.row}>
            <IconBadge name="users" tone="horizon" />
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Share with my circle</AppText>
              <AppText variant="small" tone="muted">{contacts.length ? `${contacts.length} guardian${contacts.length === 1 ? '' : 's'} can follow your trip` : 'Add a guardian to share trips'}</AppText>
            </View>
            <Toggle value={settings.shareLocationOnJourney} onValueChange={(v) => dispatch({ type: 'setSettings', patch: { shareLocationOnJourney: v } })} label="Share journey with my circle" />
          </Card>

          <Button label="Start journey" icon="navigation" size="lg" onPress={start} />
          {contacts.length === 0 ? <Button label="Add a guardian first" variant="outline" icon="user-plus" onPress={() => nav.navigate('ContactForm')} /> : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  timer: { alignItems: 'center', backgroundColor: colors.horizonSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.md },
});
