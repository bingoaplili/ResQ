import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { CallSheet } from '../../components/CallSheet';
import { colors } from '../../theme';
import { RootNav } from '../../navigation/types';
import { zones } from '../../data/sample';
import { HelpZone, ZoneKind } from '../../types';

const FILTERS: { id: 'all' | ZoneKind; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'police', label: 'Police' }, { id: 'hospital', label: 'Hospitals' }, { id: 'safe', label: 'Safe places' },
];
const KIND = {
  police: { edge: colors.navy, tone: 'navy' as const, icon: 'shield' as const },
  hospital: { edge: colors.sos, tone: 'sos' as const, icon: 'plus-square' as const },
  safe: { edge: colors.safe, tone: 'safe' as const, icon: 'home' as const },
};

export default function ZonesScreen() {
  const nav = useNavigation<RootNav>();
  const [filter, setFilter] = useState<'all' | ZoneKind>('all');
  const [q, setQ] = useState('');
  const [call, setCall] = useState<HelpZone | null>(null);

  const list = useMemo(
    () => zones
      .filter((z) => (filter === 'all' || z.kind === filter) && z.name.toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => a.distanceKm - b.distanceKm),
    [filter, q]
  );
  const count = (k: ZoneKind) => zones.filter((z) => z.kind === k).length;

  return (
    <Screen variant="horizon" tabbed header={<TopBar />}>
      <View style={styles.title}>
        <View style={{ flex: 1 }}>
          <AppText variant="h1">Help Zones</AppText>
          <AppText variant="body" tone="muted">Verified safe places and emergency services near you.</AppText>
        </View>
        <Chip label="Within 2.5 km" icon="target" tone="ivory" />
      </View>

      <Input icon="search" placeholder="Search police, hospitals, pharmacies…" value={q} onChangeText={setQ} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map((f) => (
          <Chip key={f.id} label={f.id === 'all' ? `All ${zones.length}` : f.label} selected={filter === f.id} tone="ivory" onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>

      <MapCanvas
        height={230}
        pins={[
          { id: 'you', x: 46, y: 52, kind: 'you', label: 'You are here' },
          ...list.map((z) => ({ id: z.id, x: z.x, y: z.y, kind: z.kind as 'police' | 'hospital' | 'safe' })),
        ]}
        onPinPress={(id) => nav.navigate('ZoneDetail', { id })}
      />

      <View style={styles.stats}>
        {([['Safe places', count('safe'), 'home', 'safe'], ['Police desks', count('police'), 'shield', 'navy'], ['Hospitals', count('hospital'), 'plus-square', 'sos']] as const).map(([k, v, i, t]) => (
          <Card key={k} style={{ flex: 1, gap: 4 }} padding={12}>
            <IconBadge name={i} tone={t} size={32} />
            <AppText variant="metric" style={{ fontSize: 24, lineHeight: 28 }}>{v}</AppText>
            <AppText variant="caption" tone="muted">{k}</AppText>
          </Card>
        ))}
      </View>

      <View style={styles.between}>
        <AppText variant="h2">Nearby help points</AppText>
        <AppText variant="caption" tone="muted">{list.length} found</AppText>
      </View>

      {list.length === 0 ? (
        <Card tone="ivory" style={{ alignItems: 'center', gap: 6 }}>
          <IconBadge name="search" tone="horizon" size={52} round />
          <AppText variant="h3" center>Nothing matches yet</AppText>
          <AppText variant="small" tone="muted" center>Try a different name or choose “All”.</AppText>
        </Card>
      ) : list.map((z) => {
        const k = KIND[z.kind];
        return (
          <Card key={z.id} edge={k.edge} onPress={() => nav.navigate('ZoneDetail', { id: z.id })} accessibilityLabel={z.name} style={{ gap: 10 }}>
            <View style={[styles.between, { paddingLeft: 6 }]}>
              <Chip label={z.label} tone={k.tone === 'sos' ? 'pink' : k.tone === 'safe' ? 'safe' : 'horizon'} />
              <AppText variant="caption" tone="muted">{z.distanceKm.toFixed(1)} km away</AppText>
            </View>
            <View style={[styles.row, { paddingLeft: 6 }]}>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="h3">{z.name}</AppText>
                <View style={styles.row}><Icon name="map-pin" size={13} color={colors.inkMuted} /><AppText variant="small" tone="muted" numberOfLines={1} style={{ flex: 1 }}>{z.address}</AppText></View>
              </View>
              <IconBadge name={k.icon} tone={k.tone === 'sos' ? 'pink' : k.tone === 'safe' ? 'safe' : 'horizon'} />
            </View>
            <View style={[styles.chips, { paddingLeft: 6 }]}>
              <Chip label={z.open} tone="safe" dot />
              {z.highlights.map((h) => <Chip key={h} label={h} tone="ivory" />)}
            </View>
            <View style={[styles.row, { paddingLeft: 6 }]}>
              <View style={{ flex: 1 }}><Button label="Details" icon="navigation" onPress={() => nav.navigate('ZoneDetail', { id: z.id })} /></View>
              <View style={{ flex: 0.7 }}><Button label="Call" variant="secondary" icon="phone" onPress={() => setCall(z)} /></View>
            </View>
          </Card>
        );
      })}

      <Card tone="navy" style={{ gap: 6 }}>
        <View style={styles.row}><IconBadge name="shield" tone="bordeaux" size={40} /><AppText variant="h3" style={{ flex: 1 }}>Need company on the way?</AppText></View>
        <AppText variant="small" tone="muted">Start a journey and your circle can follow you until you reach a safe place.</AppText>
        <Button label="Start a journey" variant="pink" icon="navigation" onPress={() => nav.navigate('Main', { screen: 'Travel' })} />
      </Card>

      {call ? <CallSheet visible onClose={() => setCall(null)} name={call.name} number={call.phone} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stats: { flexDirection: 'row', gap: 10 },
});
